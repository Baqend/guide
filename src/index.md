# Baqend JavaScript SDK

Welcome to the Baqend JavaScript guide.
If you have not yet done it [quickstart](http://www.baqend.com/#download) a private local Baqend server. 


## Setup

The SDK is packaged as an UMD module, so it can be used with RequireJS, browserify or without any module loader.
To get started please install the Baqend SDK from [npm](https://www.npmjs.com/package/baqend) or [GitHub](https://github.com/Baqend/js-sdk/releases).
For additional setup information visit our [GitHub page](https://github.com/Baqend/js-sdk/blob/master/README.md).

## Environment

The Baqend SDK is written and tested for Chrome 24+, Firefox 18+, Internet Explorer 9+, Safari 7+, Node 0.10+, IOS 7+, Android 4+ and PhantomJS 1.9+

## Dependencies

The Baqend SDK does not require any additional dependencies, however it is shipped with four bundled dependencies:

- Jahcode, for easier class declaration and usage
- lie, A lightweight and fast ECMA5 Promise shim
- node-uuid, A uuid generator
- validator, A validation library

## License

The Baqend JavaScript SDK and all its bundled dependencies are shipped under the
[MIT License](https://github.com/Baqend/js-sdk/blob/master/LICENSE.md).

# Objects

## Getting started

After including the Baqend SDK in your app, connect it with your Baqend. Simply call the connect
method on the DB variable:
```js
//connect to  Baqend
DB.connect('http://example.baqend.com');
//Or use a TLS-encrypted connection to Baqend
DB.connect('https://example.baqend.com');
```

You can pass a callback as a second argument, which will be called when the connection is successfully established.
```js
DB.connect('http://example.baqend.com', function() {
  //work with the DB
  DB.Todo.load(...)
});
```

Behind the scenes Baqend is requested, the metadata of your app is loaded and the [Data Models](#schema-and-types) are created and initialized.
If you want to register the handler afterwards, you can use the ready method to wait on the SDK initialization.
```js
DB.ready(function() { DB... //work with the DB });
```

If you are familiar with [Promises](#promise) you can alternatively use the returned promise instead of passing 
a callback. This works for all places in the Baqend SDK that exhibit asynchronous behaviour.
```js
DB.ready().then(function() {
  DB... //work with the DB
});
```

## Promise

`Promise`s are a programming paradigm to work with asynchronous code. Primarily used for communication and 
event-scheduled tasks it makes code much more readable then the callback-based approach. A Promise represents the 
public interface for
an asynchronous operation and can be used to chain tasks that depend on each other.

The Baqend SDK supports both paradigms, therefore each asynchronous method accepts an optional success and an error
callback and returns a Promise for further tasks.

Basically there are two common ways to initialize a Promise. You can create a new instance of a Promise with an executor
function. With the given resolve and reject function it can decide if the promise should be fulfilled with a given
value or should be rejected with an error.
```js
var promise = new Promise(function(resolve, reject) {
  var delay = Math.random() * 2000 + 1000;
  window.setTimeout(function() {
  //We fulfill the promise after the randomized delay
  resolve(delay);
  }, Math.random() * 2000 + 1000);
});
```

The second way is to create an already resolved Promise with a given value.
```js
var promise = Promise.resolve(200);
```

If you want to listen for the outcome of such a promise you can register a onFulfilled and a onRejection listener with
 the `then(onFulfilled, onRejected)` method of the promise. When the promise gets resolved, the onFulfilled listener is
called with the fulfilled value. In case of rejection the onRejected listener is called with the error.
```js
promise.then(function(value) {
  console.log('We have waited ' + value + 'ms');
}, function(e) {
  console.log('An unexpected error with message: ' + e.message + ' occurred.');
});
```

The `Promise.then` method returns a new promise which will be resolved with the result of the passed listener.
The listener itself can also perform asynchronous operations and return another promise which will then be used to 
resolve the outer Promise.
```js
promise.then(function(value) {
  return anotherAsyncTask(value);
}).then(function(anotherValue) {
  //will only be called if the first promise 
  //and the anotherAsyncTask's Promise is fulfilled
  //the anotherValue holds the fulfilled value of the anotherAsyncTask
});
```

For additional examples and a more detailed explanation consult the [MDN Promise Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

The Baqend SDK uses the promise-based approach for the entire documentation since the code is more readable and is
 generally considered the best way to work with asynchronous code in JavaScript.

## Working with objects

After the Baqend SDK has been successfully initialized, all defined classes can be accessed using the DB instance. 
Just use the name of the class to access the *object factory*.
```js
DB.ready(function() {
  DB.Todo //The Todo class factory
});
```

The object factory can be called or can be used like a normal JavaScript constructor to create instances.
```js
var todo = new DB.Todo({name: 'My first Todo'});
```
The constructor accepts one optional argument, which is a (JSON-)object containing the initial values of the object.

The object attributes can be accessed and changed by their names.
```js
var todo = new DB.Todo({name: 'My first Todo'});
console.log(todo.name); //'My first Todo'
todo.active = true;
```

# CRUD

Each entity has some basic methods for persisting and retrieving its data. This pattern is known as *data access 
objects* (DAO) or *active records* and is common practice in persistence frameworks.

## Create

After creating a new object, the object can be persisted to Baqend with an `insert()` call. The insert call ensures
that the object always get its own unique id by generating a new one if none was provided.

```js
var todo = new DB.Todo({id: 'Todo1', name: 'My first Todo'});
//we can use the object id right now
console.log(todo.id) //'Todo1' 

todo.insert().then(function() {
  console.log(todo.version); //1
});
```

## Read

If an object is persisted it can be loaded by its id (aka primary key). This method is very handy with custom (i.e. 
non-generated) ids.
```js
DB.Todo.load('Todo1').then(function(todo) {
  console.log(todo.name); //'My first Todo'  
});
```

If an object ist loaded from Baqend all its attributes, collections and embedded objects will be loaded, too.
References to other entities will not be loaded by default. For more details see the [Persistence](#persistence) chapter.

When you load the same object a second time, the object will be loaded from the local cache. This ensures that you
always get the same object instance for a given object id.

```js
DB.Todo.load('Todo1').then(function(todo1) {
  DB.Todo.load('Todo1').then(function(todo2) {
    console.log(todo1 === todo2); //true
  });
});
```

## Update

After having loaded an instance and having done some modifications, you usually want to write the modifications back to
Baqend.
```js
todo.name = 'My first Todo of this day';
return todo.update();
```

The `update()` method writes your changes back to Baqend, if no one else has already modified the object. To detect
concurrent object modifications, each entity has a version. Every time changes are written back to Baqend the 
versions will be matched. If the version in the Baqend differs form the provided version, the object was modified by 
someone else and the changes will be rejected, since the object is outdated, i.e. a concurrent modification occurred.
 This is called *optimistic concurrency control*: changes are performed locally and then sent to the server and only 
 in the rare event of a consistency violation the change operation is rejected.
```js
todo.name = 'My first Todo of this day';
return todo.update().then(function() {
  //the todo was successfully persisted
}, function(e) {
  //the update was rejected. Do we want to reapply our changes?
});
```

**Note**: When you try to update an already deleted object, it will also be treated as a concurrent modification and the
update will be rejected.

There are also some situations where we would like to omit this behaviour and force a write of our changes. To do so the force option can be passed to the `update` method. Be aware that this *last-writer-wins*-scheme may result in lost updates.
```js
todo.name = 'My first Todo of this day';
  //force the update and potentially overwrite all concurrent changes
return todo.update({force: true}).then(function() {
  //the todo was successfully persisted
});
```

## Delete

You can delete an object by calling its `delete()` method. It will delete the entity from Baqend and drop the entity
from the local cache.

```js
todo.delete().then(function() {
  //the object was deleted
}, function() {
  //a concurrent modifications prevents removal
});
```

Just like the `update()` method, `delete()` matches the local version with the version in the Baqend and 
deletes the object only if the version is still up-to-date.

Again, you can pass the force option to bypass the version check.
```js
todo.delete({force: true});
```

## Save

As you have seen in the previous examples you can `insert()` new objects and `update()` existing objects. If it is
irrelevant if the object is already persisted to the Baqend just use the `save()` method. This either performs  an 
update or an insert, depending on the current state of the object.

```js
var todo = new DB.Todo({id: 'Todo1', name: 'My first Todo'});
todo.save().then(function() { //inserts the object
  todo.name = 'My first Todo of this day';
  todo.save(); //updates the object
});
```

## Load / Reload
Sometimes you have an entity which was previously loaded from Baqend but you want to ensure that you have the latest 
version of before performing an update. In that case you can use the `load()` method of the entity to reload
the latest version from Baqend. 
```js
//updates the local object with the most up-to-date version
todo.load().then(function() { 
  todo.name = 'My first Todo of this day';   
  todo.save(); //updates the object
});
```

While performing an insert or update, you can also reload the object after performing the operation. To reload the 
entity, you can pass the `reload` flag to the `insert()`, `update()` or `save()` method.
```js
todo.save({reload: true}).then(...); //reload the object after saving it
```    

This option is very useful if you have a [Baqend Code](#baqend-code) update handler which performs additional 
server-side modifications on the entity being saved. By passing the `reload` flag you enforce that the modification will
 be loaded from the Baqend after the entity has been saved. 

# Schema and Types

Behind each object persisted to and loaded from Baqend there is a *schema* which describes the structure of its 
instances. It specifies which attributes of an object will be tracked and saved (e.g. `Todo.name`, their types (e.g. 
`String` and optionally constraints (e.g. `not null`).

The types that Baqend supports can be classified in five categories.

- [Entities](#entity-objects) are the objects themselves, i.e. instances conforming to the schema
- [References](#references) are references (i.e. links, foreign keys) to other entities.
- [Embeddables](#embedded-objects) are objects that are embedded within other objects (i.e. value objects).
- [Primitives](#primitives) are native types like String, Numbers, Dates and JSON.
- [Collections](#collections) are lists, sets and maps containing any of the previous data types.

## Entity Objects

In general there are two types of objects. The first type - *Entities* - are those objects which have their own 
identity, version and access rights. They can be directly saved, loaded and updated. Each entity has its own unique 
id. The id is immutable and set at object creation time.

```js
var todo = new DB.Todo({name: 'My first Todo'});
console.log(todo.id); //'84b9...'
```

Instead of relying on automatic generation, objects can also have a *custom id*. This allows to assign ids that are 
memorable and meaningful.

```js
var todo = new DB.Todo({id: 'Todo1', name: 'My first Todo'});
console.log(todo.id); //'Todo1'
todo.save();
```

Note: The save call will be rejected, if the id already exists!

## References

Entity objects can reference other entities by reference, i.e. their id. Referenced objects will not be persisted 
inside another entity, instead only a reference to the other entity is be persisted.
```js
var firstTodo = new DB.Todo({name: 'My first Todo'});
var secondTodo = new DB.Todo({name: 'My second Todo'});

firstTodo.doNext = secondTodo;
```

To save a reference, you just call the `save()` method on the referencing entity.
```js
//the todo instance will automatically be serialized to a object reference
firstTodo.save();
```

Internally, the reference is converted to a string like `/db/Todo/84b9...` and persisted inside the referencing entity. The referenced entity will not be saved by default. You can pass the `depth` options flag to the save the complete object graph by 
reachability.
```js
//will also save secondTodo, since it is referenced by firstTodo
firstTodo.save({depth: true});
```

When an entity is loaded from Baqend, referenced entities will not be loaded by default. Instead an unresolved entity
(hollow object) is set for the referenced entity. If you try to access attributes of an unresolved entity, an *object is
 not available* error will be thrown.
```js
//while loading the todo, the reference will be resolved to the referenced entity
DB.Todo.load('7b2c...').then(function(firstTodo) {
  console.log(firstTodo.name); //'My first Todo'
  console.log(firstTodo.doNext.name); //will throw an object not available error
});
```

The `isReady` field indicates if an entity is already resolved.
```js
DB.Todo.load('7b2c...').then(function(firstTodo) {
  console.log(firstTodo.doNext.isReady); //false
});
```

Calling `load()` on an unresolved entity resolved it, i.e. the referenced object is loaded.
```js
firstTodo.doNext.load(function() {
  console.log(firstTodo.doNext.isReady); //true
  console.log(firstTodo.doNext.name); //'My second Todo'
});
``` 

If the object graph is not very deep, references can easily be resolved by reachability.
```js
//loading the todo will also load the referenced todo
DB.Todo.load('7b2c...', {depth: true}).then(function(firstTodo) {
  console.log(firstTodo.name); //'My first Todo'
  console.log(firstTodo.doNext.name); //'My second Todo'
});
```

For further information on persisting and loading strategies see the [Persistence](#persistence) chapter.

## Embedded Objects
The second type of objects are *embedded objects*. They can be used within an entity or a
collection like a list or map. They do not have an id and can only exist within an entity. Embedded objects are
saved, loaded and updated with their owning entity and will be persisted together with it. Embedded objects thus have
 the structure of a object but the behaviour of a primitive type (e.g. a String). This concept is also known as *value
  types*, *user-defined types* or *second class objects*.

Embedded objects can be created and used like entity objects.
```js
var activity = new DB.Activity({start: new Date()});
console.log(activity.start); //something like 'Tue Mar 24 2015 10:46:13 GMT'
activity.end = new Date();
```

Since embeddables do not have an identity, they hold neither an id, version nor acl attribute.
```js
var activity = new DB.Activity({start: new Date()});
console.log(activity.id); //undefined
```

To actually persist an embedded object you have to assign the embedded object to an entity and save that outer entity.
```js
var activity = new DB.Activity({start: new Date()});
var todo = new DB.Todo({name: 'My first Todo', activities: new DB.List()});
todo.activities.add(activity);
todo.save();
```

## Primitives

Primitives types are the basic attribute types and known from programming languages. Whenever an entity is saved, all
attribute values will be checked against the types described by the schema. This is one of the biggest advantages of 
having a schema: data cannot easily be corrupted as its correct structure is automatically enforced by the schema. 
Please note that the JSON data type gives you full freedom on deciding which parts of a object should be structured 
and which parts are schemafree. The following table shows all supported attribute types of Baqend 
and their corresponding JavaScript types.

<table class="table">
  <tr>
    <th>Baqend Primitive</th>
    <th>JavaScript type</th>
    <th>Example</th>
    <th width="30%">Notes</th>
  </tr>
  <tr>
    <td>String</td>
    <td>String</td>
    <td>"My Sample String"</td>
    <td></td>
  </tr>
  <tr>
    <td>Integer</td>
    <td>Number</td>
    <td>456</td>
    <td>64bit integer. Fractions are deleted</td>
  </tr>
  <tr>
    <td>Double</td>
    <td>Number</td>
    <td>456.456</td>
    <td>64bit floating point numbers</td>
  </tr>
  <tr>
    <td>Boolean</td>
    <td>Boolean</td>
    <td>true</td>
    <td></td>
  </tr>
  <tr>
    <td>DateTime</td>
    <td>Date(&lt;datetime&gt;)</td>
    <td>new Date()</td>
    <td>The date will be normalized to GMT.</td>
  </tr>
  <tr>
    <td>Date</td>
    <td>Date(&lt;date&gt;)</td>
    <td>new Date('2015-03-15')</td>
    <td>The time part of the date will be stripped out.</td>
  </tr>
  <tr>
    <td>Time</td>
    <td>Date(&lt;datetime&gt;)</td>
    <td>new Date('2015-01-15T13:30:00Z')</td>
    <td>The date part of the date will be stripped out and the time will be saved in GMT.</td>
  </tr>
  <tr>
    <td>GeoPoint</td>
    <td>DB.GeoPoint(&lt;lat&gt;, &lt;lng&gt;)</td>
    <td>new DB.GeoPoint(53.5753, 10.0153)</td>
    <td></td>
  </tr>
  <tr>
    <td>JsonObject</td>
    <td>Object</td>
    <td>{"name": "Test"}</td>
    <td rowspan=2">Semistructured JSON is embedded within the entity. Any valid JSON is allowed.</td>
  </tr>
  <tr>
    <td>JsonArray</td>
    <td>Array</td>
    <td>[1,2,3]</td>
  </tr>
</table>

## Collections

Collections are typed by a reference, embedded object class or a primitive type. The Baqend SDK 
does not support native JavaScript arrays since changes (e.g. an index access) on native arrays cannot be tracked. 
Instead ES6-compatible lists are used. They behave similar to JS arrays and offer a bunch of convenience methods.

Baqend supports three collection types:

<table class="table">
  <tr>
    <th>Baqend Collection</th>
    <th>Example</th>
    <th width="50%">Supported element Types</th>
  </tr>
  <tr>
    <td>collection.List</td>
    <td>new DB.List([1,2,3])</td>
    <td>All non-collection types are supported as values</td>
  </tr>
  <tr>
    <td>collection.Set</td>
    <td>new DB.Set([1,2,3])</td>
    <td>Only String, Boolean, Integer, Double, Date, Time, DateTime and References are allowed as values. Only this
    types can be compared by identity.</td>
  </tr>
  <tr>
    <td>collection.Map</td>
    <td>new DB.Map([["x", 3], ["y", 5]])</td>
    <td>Only String, Boolean, Integer, Double, Date, Time, DateTime and References are allowed as keys.<br>
    All non collection types are supported as values.</td>
  </tr>
</table>

For all collection methods see the [JavaScript API Docs](http://www.baqend.com/js-sdk/latest/baqend.collection.html).

# Querys

To retrieve objects by more complex criteria than their id, queries can be used. They are executed on Baqend and 
return the matching objects.
The Baqend SDK features a [query builder](http://www.baqend.com/js-sdk/latest/baqend.Query.Builder.html) that creates 
[MongoDB]([MongoDB queries](http://docs.mongodb.org/manual/tutorial/query-documents/)) under the hood. It is possible
 to formulate native MongoDB queries, but using the query builder is the recommend way: it is far more readable and 
 does all the plumbing and abstraction from MongoDB obscurities.

## resultList, singleResult and count
The simplest query is one that has no filter criterion and thus returns all objects. 
The actual result is retrieved via the `resultList` method.
```js
DB.Todo.find().resultList(function(result) {
  result.forEach(function(todo) {
    console.log(todo.name); //'My first Todo', 'My second Todo', ...
  });
});
```

To find just the first matching object use the `singleResult` method.
```js
DB.Todo.find().singleResult(function(todo) {
  console.log(todo.name); //'My first Todo'
});
```

If you just need the number of matching objects, use the `count` method.
```js
DB.Todo.find().count(function(count) {
  console.log(count); //'17'
});
```

## Filters
Usually queries are employed to exert some kind of filter. The query builder supports lots of different 
[filters](http://www.baqend.com/js-sdk/latest/baqend.Query.Filter.html), 
that can be applied on entity attributes. By default chained filters are *and*-combined.
```js
DB.Todo.find()
  .matches('name', /^My Todo/)
  .equal('active', true)
  .lessThanOrEqualTo('activities.start', new Date())
  .resultList(...)
```

The above query searches for all todos, whose name starts with `'My Todo'`, are currently active and contain an 
activity in its activities list that has been started before the current date.

Note that all valid MongoDB attribute expressions can be used as a field name in a filter, in particular 
path-expressions such as 'activities.start'.

If you are familiar with [MongoDB queries](http://docs.mongodb.org/manual/tutorial/query-documents/), you can
use the `where` method to describe a query in MongoDB's JSON format. An equivalent query to the above one would look 
like this:
```js
DB.Todo.find()
  .where({
    "name": { "$regex": "^My Todo" },
    "active": true,
    "activities.start": { "$lte": { "$date": new Date().toISOString() }}
  })
  .resultList(...)
```

The following table list all available query filters and the types on which they can be applied:

<table class="table">
  <tr>
    <th width="40%">Filter method</th>
    <th>MongoDB equivalent</th>
    <th>Supported types</th>
    <th width="40%">Notes</th>
  </tr>
  <tr>
    <td>equal('name', 'My Todo')</td>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/eq/">$eq</a></td>
    <td>All types</td>
    <td>Complex types like embedded objects only match if their complete structure matches.</td>
  </tr>
  <tr>
    <td>notEqual('name', 'My Todo')</td>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/neq/">$neq</a></td>
    <td>All types</td>
    <td>Complex types like embedded objects only match if their complete structure matches.</td>
  </tr>
  <tr>
    <td>greaterThan('total', 3)</td>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/gt/">$gt</a></td>
    <td>Numbers, Dates, Strings</td>
    <td><code>gt()</code> is an alias</td>
  </tr>
  <tr>
    <td>greaterThanOrEqualTo('total', 3)</td>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/gte/">$gte</a></td>
    <td>Numbers, Dates, Strings</td>
    <td><code>gte()</code> is an alias</td>
  </tr>
  <tr>
    <td>lessThan('total', 3)</td>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/lt/">$lt</a></td>
    <td>Numbers, Dates, Strings</td>
    <td><code>lt()</code> is an alias</td>
  </tr>
  <tr>
    <td>lessThanOrEqualTo('total', 3)</td>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/lte/">$lte</a></td>
    <td>Numbers, Dates, Strings</td>
    <td><code>lte()</code> is an alias</td>
  </tr>
  <tr>
    <td>between('total', 3, 5)</td>
    <td>-</td>
    <td>Numbers, Dates, Strings</td>
    <td>It is equivalent to <code>gt('total', 3).lt('total', 5)</code></td>
  </tr>
  <tr>
    <td>in('total', 3, 5[,...])</td>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/in/">$in</a></td>
    <td>All types</td>
    <td>On set and list fields *all* given values have to be contained in order for the filter to match. For primitive 
    fields *any* of the given values have to match the field value. <code>containsAny()</code> is an alias</td>
  </tr>
  <tr>
    <td>notIn('total', 3, 5[,...])</td>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/nin/">$nin</a></td>
    <td>All types</td>
    <td>On set and list fields *none* of the given values have to be contained in order for the filter to match. For 
    primitive fields *none* of the given values must match the field value. </td>
  </tr>
  <tr>
    <td>isNull('name')</td>
    <td>-</td>
    <td>All types</td>
    <td>Checks if the field has no value; equivalent to <code>equal('name', null)</code></td>
  </tr>
  <tr>
    <td>isNotNull('name')</td>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/exists/">$exists</a></td>
    <td>All types</td>
    <td>Checks if the field has a value; equivalent to <code>where({'name': {"$exists" true, "$ne", null})
    </code></td>
  </tr>
  <tr>
    <td>containsAll('activities', activity1, activity2 [,...])</td>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/all/">$all</a></td>
    <td>List, Set, JsonArray</td>
    <td>Checks if the collection contains all the given elements</td>
  </tr>
  <tr>
    <td>mod('total', 5, 3)</td>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/mod/">$mod</a></td>
    <td>Number</td>
    <td>The field value divided by divisor must be equal to the remainder</td>
  </tr>
  <tr>
    <td>matches('name', /^My [eman]{4}/)</td>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/regex/">$regex</a></td>
    <td>String</td>
    <td>The regular expression must be anchored (starting with <code>^</code>); ignore case and global flags are not
    supported.</td>
  </tr>
  <tr>
    <td>size('activities', 3)</td>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/size/">$size</a></td>
    <td>List, Set, JsonArray</td>
    <td>Matches if the collection has the specified size.</td>
  </tr>
  <tr>
    <td>near('location', &lt;geo point&gt;, 1000)</td>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/nearSphere/">$nearSphere</a></td>
    <td>GeoPoint</td>
    <td>The geo point field has to be within the maximum distance in meters to the given GeoPoint.
    Returns from nearest to furthest.</td>
  </tr>
  <tr>
    <td>withinPolygon('location', &lt;geo point list&gt;)</td>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/nearSphere/">$geoWithin</a></td>
    <td>GeoPoint</td>
    <td>The geo point of the object has to be contained within the given polygon.</td>
  </tr>
</table>

References can and should be used in filters. Internally references are converted to ids
 and used for filtering. To get all Todos owned by the currently logged-in user, we can simply use the User instance 
 in the query builder:

```js
DB.Todo.find()
  .equal('owner', DB.User.me) //any other User reference is also valid here
  .resultList(...)
```

Note: `DB.user.me` refers to the currently logged-in User instance. To learn more about users and the
login process see the [User, Roles and Permission](#user-roles-and-permissions) chapter.

## Sorting

It is possible to sort the query result for one or more attributes. The query builder can be used to set after which
attributes the result shall be sorted. Let's sort our query results by name:
```js
DB.Todo.find()
  .matches('name', /^My Todo/)
  .ascending('name')
  .resultList(...)
```

If you use more than one sort criterion, the order of the result depends on the order you called the sort options.
The following query will list all active tasks before the inactive ones and sort the tasks by their name in ascending order.
```js
DB.Todo.find()
  .matches('name', /^My Todo/)
  .ascending('name')
  .descending('active')
  .resultList(...)
```

If you would call the `descending('active')` before `ascending('name')`.The result would be first sorted by name and 
afterwards by the active flag, which would only be relevant with multiple todos with the same name. 

You can also set the sort criteria with the MongoDB [orderby](http://docs.mongodb.org/manual/reference/operator/meta/orderby/) 
syntax when using the `sort()` method. An equivalent expression to the above would look like:
```js
DB.Todo.find()
  .matches('name', /^My Todo/)
  .sort({"name": 1, "active": -1})
  .resultList(...)
```

## Offset and Limit
On larger data sets you usually don't want to load all the data at once. Its reasonable to page through the query
results. For such a case it is possible to skip objects and limit the result.
```js
var page = 3;
var resultsPerPage = 30;

DB.Todo.find()
  .matches('name', /^My Todo/)
  .ascending('name')
  .offset((page - 1) * resultsPerPage)
  .limit(resultsPerPage)
  .resultList(...)
```

Note: Skipping a large set of data with offset can result in very poor query performance. 
Consider to use a filter and sort criteria to navigate through your data.
 
For instance if you implement a simple pagination you can sort your data by id and can get the data of the next
page by a simple greaterThen filter.
```js
var pageId = '00000-...';
var resultsPerPage = 30;

DB.Todo.find()
  .matches('name', /^My Todo/)
  .greaterThan('id', pageId)
  .ascending('id', pageId)
  .limit(resultsPerPage)
  .resultList(function(result) {
    pageId = result[result.length - 1];  
  })
```


## Join filters with `and`, `or` and `nor`

Filters joined with and by default. In more complex cases you may want to formulate a query with one or more 
[and](http://docs.mongodb.org/manual/reference/operator/query/and/), 
[or](http://docs.mongodb.org/manual/reference/operator/query/or/) or 
[nor](http://docs.mongodb.org/manual/reference/operator/query/nor/)  
expressions. For such cases the initial `find()` call returns a 
[Query.Builder](http://www.baqend.com/js-sdk/latest/baqend.Query.Builder.html) instance. The builder provide additional 
methods to join multiple filter expressions.

The following query finds all my todos which I am currently not working on and all your todos which you haven't done yet:
```js
var queryBuilder = DB.Todo.find();
var condition1 = queryBuilder
  .matches('name', /^My Todo/)
  .equal('active', false);

var condition2 = queryBuilder
  .matches('name', /^Your Todo/)
  .equal('done', false);

queryBuilder.or(condition1, condition2)
  .ascending('name')
  .resultList(...)
```

# Users, Roles and Permissions

Baqend comes with a powerful User, Role and Permission management module. It includes a generic registration and login 
mechanism and allows you to restrict the insert, load, update, delete and query based access per class and the 
read and write access per object level. The restriction can be formulated with allow and deny rules for any user and role.

## Registration

To restrict access to a specific role or user, the user needs an user account. Baqend supports a simple registration 
process to create a new user account. The user class is a predefined class which will be instantiated during the registration 
process. A user object has a predefined `username` which uniquely identifies the user and a `password`. The password 
will be hashed by Baqend before it will be saved.   
```js
DB.User.register('john.doe@example.com', 'MySecretPassword').then(function() {
  //Hey we are logged in
  console.log(DB.User.me.username); //'john.doe@example.com'
});
```    

If you like to set additional user attributes for the registration, you can create a new user instance and register 
the newly created instance with an password.
```js
var user = new DB.User({
  'username': 'john.doe@example.com',
  'firstName': 'John',   
  'lastName': 'Doe',   
  'age': 33
});

DB.User.register(user, 'MySecretPassword').then(function() {
  //Hey we are logged in
  console.log(DB.User.me === user); //true
});
```    

## Login

When a user is registered already, he can login with the `DB.User.login()` method. 
```js
DB.User.login('john.doe@example.com', 'MySecretPassword').then(function() {
  //Hey we are logged in again
  console.log(DB.User.me.username); //'john.doe@example.com'  
});
```  

After the successful login a session will be established and all further requests to the Baqend will be authenticated 
with the currently logged-in user.

## Logout 

Sessions in Baqend are stateless, that means a user is not be required to logout itself to close the session. When a 
session is started a session token with a specified lifetime will be created. If this lifetime is exceeded, the session 
is closed automatically. A logout just deletes the session token and removes the current `DB.User.me` object.
``` 
DB.User.logout().then(function() {
  //We are logged out again
  console.log(DB.User.me); //null
});
```

## Auto login

The Baqend SDK checks during the initialization, if the user is already registered and has been logged in. A
new user is anonymous and no user object will be associated with the DB. Returning users will be automatically logged in 
and the `DB.User.me` object will be set.
```js
if (DB.User.me) {
  //user is logged in
  console.log('Hello ' + DB.User.me.username); //the username of the user
} else {
  //user is anonym
  console.log('Hello Anonymous');
}
```

## OAuth

Another way to login or register can be a 'Singe in with' - 'Google' or 'Facebook' button. 
In general any OAuth provider can be used to authenticate and authorise a user. 
Baqend supports five provider for now. To set them up, you need to register your App on the Website of the provider.
Add `https://APP_NAME.baqend.com/db/User/PROVIDER_ID` as redirect Uri and copy client ID and client secret into the 
[settings page of your Dashboard](). 

With 'DB.loginWithOAuth(provider, Options)' the login or register can be 
initialised. The call opens a new Window with the provider specific login page. To work around the popup blocker the 
call needs to be made on user interaction, on click at the singe in button for example. 

For Google you find your credentials in your
[developer console](https://console.developers.google.com/project/_/apiui/credential), visit 
[Google doc](https://developers.google.com/console/help/new/?hl=de#setting-up-oauth-20) for more information.
<br><br><table class="table">
    <tr>
        <th>Provider</th>
        <th></th>
        <th>Notes</th>
    </tr>
    <tr>
        <td>[Google](https://console.developers.google.com/project/_/apiui/credential)</td>
        <td>[doc](https://developers.google.com/console/help/new/?hl=de#setting-up-oauth-20)</td>
        <td>Add as redirect uri: `https://[YOUR_APP_ID].baqend.com/db/User/OAuth/google`</td>
    </tr>
    <tr>
        <td>[Facebook](https://developers.facebook.com/apps)</td>
        <td>[doc](https://developers.facebook.com/docs/facebook-login/v2.4)</td>
        <td>To set up Facebook-OAuth open the Settings page of your [Facebook app](https://developers.facebook.com/apps),
        change to `Advanced`, activate `Web OAuth Login` and add `https://[YOUR_APP_ID].baqend.com/db/User/OAuth/facebook`
         as `Valid OAuth redirect URI`. 
        </td>
    </tr>
    <tr>
        <td>[Github](https://github.com/settings/applications)</td>
        <td>[doc](https://developer.github.com/v3/oauth/)</td>
        <td>Add as redirect uri: `https://[YOUR_APP_ID].baqend.com/db/User/OAuth/github`</td>
    </tr>
    <tr>
        <td>[Twitter](https://apps.twitter.com/)</td>
        <td>[doc](https://dev.twitter.com/oauth/overview/faq)</td>
        <td>Add as redirect uri: `https://[YOUR_APP_ID].baqend.com/db/User/OAuth/twitter`</td>
    </tr>
    <tr>
        <td>[LinkedIN](https://www.linkedin.com/secure/developer?newapp=)</td>
        <td>[doc](https://developer.linkedin.com/docs/oauth2)</td>
        <td>Add as redirect uri: `https://[YOUR_APP_ID].baqend.com/db/User/OAuth/linkedin`</td>
    </tr>
</table><br><br>
OAuth is a way to delegate rights of third party resources owned by the users to your application. A simple login is 
always getting a token and requesting basic information including the unique user ID. 
You can interact in the way the user is created by changing the Baqend Code OAuth.PROVIDER_ID. The Baqend Code gets 
activated whenever a new user is registered with OAuth. The data object included is a conjunction of the token object
often with a long term and a short term token and the basic user information the provider has returned on a basic api
request.


## Roles

The Role class is also a predefined class which has a predefined `name` and `users` collection. The users collection 
contains all the members of a role. A user has a specified role if he is listed in the roles `users` list. 

``` 
//create a new role
var role = new DB.Role({name: 'My First Group'});
//add our self as a member of the role
role.addUser(DB.User.me);
//protect the role membership 
role.acl.allowWriteAccess(DB.User.me);
role.save().then(...);
```

A role can be read and written by everyone by default. To protect the role that no one else can add himself to the 
role we restricted the write access to the current user. 
For more information about setting permissions see in the [Setting object permissions](#setting-object-permissions) chapter. 

## Permissions

There are two types of permissions, class based and object based permissions. The class based permissions can be set by 
privileged users on the Baqend Dashboard or by manipulating the class metadata. The object based permissions can be set 
by users which have write access to an object. If a normal user requests an operation the access must be granted class 
based and object based to perform the specific operation. 

Each permission persists of one allow and one deny list. In the allow list user and roles can be white listed and in the 
deny list they can be black listed. 
 
The access will be granted following these rules:

- If the user has the admin role, access is always granted and the following rules will be skipped
- Or if the user dose not have the admin role:
  - If the user or one of its roles are listed in the deny list, access is always denied
  - If no rules are defined in the allow list, public access is granted
  - If rules are defined the user or one of its roles has to be listed in the allow list

The following table shows the SDK methods and the related permissions the user has to have, to perform the specific 
operation.

<table class="table">
  <tr>
    <th>Method</th>
    <th width="50%">Class based permission</th>
    <th>Object based permission</th>
  </tr>
  <tr>
    <td><code>load()</code></td>
    <td>type.loadPermission</td>
    <td>object.acl.read</td>
  </tr>
  <tr>
    <td><code>find()</code></td>
    <td>type.queryPermission</td>
    <td>object.acl.read</td>
  </tr>
  <tr>
    <td><code>insert()</code></td>
    <td>type.insertPermission</td>
    <td>-</td>
  </tr>
  <tr>
    <td><code>update()</code></td>
    <td>type.updatePermission</td>
    <td>object.acl.write</td>
  </tr>
  <tr>
    <td><code>delete()</code></td>
    <td>type.deletePermission</td>
    <td>object.acl.write</td>
  </tr>
  <tr>
    <td><code>save()</code></td>
    <td>type.insertPermission when the object is inserted<br>
      type.updatePermission when the object is updated
    </td>
    <td>object.acl.write</td>
  </tr>
  <tr>
    <td><code>save({force: true})</code></td>
    <td>type.insertPermission and type.updatePermission will be checked because the object will be inserted if it 
    does not exist and updated if it exists</td>
    <td>object.acl.write</td>
  </tr>
</table>

Note: It is currently not possible with the Baqend SDK to check if a user has all permissions to perform an operation. 

## Anonymous users and the Public permission
   
Anonymous users only have the permission to serve public resources. An resource is accessible for the public, if no 
class or object permission restricts the access to a specific user or group. To check if the object base 
permissions allow anonymous access you can check the `acl.isPublicReadAllowed()` and the `todo.acl.isPublicWriteAllowed()` 
methods.
```js
todo.acl.isPublicReadAllowed() //will return true by default
todo.acl.isPublicWriteAllowed() //will return true by default
```

Note: The access can still be restricted to specific roles or users by class based permissions even if 
  `acl.isPublicReadAllowed()` or `todo.acl.isPublicWriteAllowed()` returns `true`.

## Setting object permissions

The object permission are split up in read and write permissions. When inserting a new object, read and write access is
always granted to everyone. You can manipulate the object permissions only if you have currently write permissions on 
the object. If you want to restrict the write access to the current user but want to share an object within a group, you 
can add the role to the read permissions and the user to the write permissions.
```js 
DB.Role.find().equal('name', 'My First Group').singleResult(function(group) {
  var todo = new DB.Todo({name: 'My first Todo'});
  todo.acl.allowReadAccess(group)
    .allowWriteAccess(DB.User.me);
  
  return todo.save();
}).then(...);
```



# Baqend Code

Baqend Code Handlers and Modules are JavaScript (Node.js) functions that can be defined in the dashboard and get 
evaluated on the server side. They come in handy when you need to enforce rules and cannot trust clients.

##Handlers

With handlers you are able to intercept and modify CRUD operations sent by clients. To register a handler, open the
handler page of a class on the dashboard. There are four tabs, one for each of the three basic data manipulation 
operations and onValidate for easily validation. Each tab has an empty function template that will be called before 
executing the operation. Here you can perform secure validations or execute additional business logic.

### onValidate

onValidate gets called before an insert or update operation. It is a lightweight method to validate field values.
The function is propagated into the client-side Baqend SDK and can be called on the client to validate inputs without
rewriting the validation logic. The validation library [validatorJs](https://github.com/chriso/validator.js) helps 
keeping validation simple and readable. The onValidate method gets a validator object for each field of the entity, 
which keeps all available validation methods.
```js
function onValidate(username, email) {
 username.isLength(3, 15);
 //An error messages can be passed as first argument
 email.isEmail('The email is not valid') 
}
```
To validate objects on the client device call `object.validate()` in your application. It returns a result object 
containing the validation information.

```js
user.username = "john.doe@example.com";
var result = user.validate();
if (result.isValid) {
  //true if all fields are valid
} 

var emailResult = result.fields.email;
if (!emailResult.isValid) {
  //if the email is not valid, the errors can be retrieved from the error array
  console.log(emailResult.errors[0]) //'The email is not valid'
}
```

It is also possible to write custom validators. You can use the `is` validator the write custom validators:
```js
function onValidate(password, passwordRepeat) {
 password.is('The passwords does not match', function(value) {
   return value != passwordRepeat.value; 
 }); 
}
```

```js
user.password = "mySecretPassword";
user.passwordRepeat = "mySecretPasswort"
var result = user.validate();

var passwordResult = result.fields.password;
if (!passwordResult.isValid) {
  //if the email is not valid, the errors can be retrieved from the error array
  console.log(passwordResult.errors[0]) //'The passwords does not match'
}
```


### onInsert and onUpdate

If you need complex logic or your validation depends on other objects use the onUpdate and/or onInsert handler. The 
handler's this object as well as the second argument are the object which is inserted or updated. All attributes can be 
read and manipulated through normal property access. The requesting user can be retrieved through `db.User.me`. 
Inside Baqend Code the user is an unresolved object just like all other 
referenced objects. If you need to read or manipulate attributes, `.load()` the user first. Consider for example the 
case of maintaining the total time spent on a todo in a dedicated field (e.g. for sorting):

```js
exports.onUpdate = function(db, obj) {
  if (obj.done) {
    //ensure that you always return promises of asynchronous calls, 
    //otherwise errors will not abort the update operation
    return db.User.me.load().then(function(user) {
      obj.activities.forEach(function(activity) {
        user.workingTime += activity.end.getTime() - activity.start.getTime();
      });
      return user.save();
    });
  }
}
```
Since its possible to reactivate finished tasks, we might want to check if we need to decrease the counter. This is only
necessary if the last status of the Todo object was done. To get the state of the object before the current update 
(before image) use `db.load(objectID)`. `obj.load()` on the other hand would refresh the state of object currently 
under update to the previous state.

```js
exports.onUpdate = function(db, obj) {
  return db.Todo.load(obj.id).then(function(oldTodo) {
    if (oldTodo.done != obj.done) {
      return db.User.me.load().then(function(user) {
        var totalTime = obj.activities.reduce(function(totalTime, activity) {
          return totalTime += activity.end.getTime() - activity.start.getTime();
        }, 0);

        if (obj.done) {
          user.workingTime += totalTime;
        } else {
          user.workingTime -= totalTime;
        }

        return user.save();
      }
    }
  }
}
```

Note: Inside Baqend Code data operations (e.g. `user.save()`) have the access rights of the user starting the 
request enhanced by an additional `node` role. Calls to Baqend originating from handlers will not trigger another 
onUpdate(db) call. See [Baqend Code permission](#permissions) for more details.

### onDelete

The onDelete handler is called with an empty object only containing the id of the deleted object. The method can
for instance be used to log information or delete related objects. 

```js
exports.onDelete = function(db, obj) {
  obj.id //the id of the object which will be deleted
  obj.name //null
}
```

All four handlers are `before`-operation handlers. Be aware that they are called after the class level permissions are 
checked, but before object level permissions were validated. Thus, making changes to other objects inside handlers 
should be treated with care: these operations could succeed while the original operation might fail due to missing 
object access rights. An elegant way to simplify such cases is the use of `after`-handlers, one of our [Upcoming Features](#upcoming-features).


## Modules

Baqend Modules are JavaScript modules stored in Baqend. They can be called by 
clients and be imported by other modules and handlers. Only modules that export a `call` method can be called by 
clients directly. The Baqend module will get the DB object as the first, data send by the client as 
the second and the [request](http://expressjs.com/api.html#req) object as the third parameter.

Let's create a simple invite system. To invite a user to an event, the invitation is added to this/her invite list. 
This process needs to be encapsulated in a Baqend modules as it requires write permissions on other users.

```js
//invite
exports.call = function(db, data, req) {
  return db.User.find()
    .equal('username', data.username)
    .singleResult(function(user) {
      user.invites.add(data.invite);
      return user.save();
    });
};
```

On the client side we can now invite a user by its username to our event by invoking the Baqend invite method. Baqend 
modules can be invoked using `get` for reading data and with `post` to modify data. 

- with `get` data is sent with url query parameters of an HTTP GET request (URL size limit: 2KB)
- with `post` data is sent in the body of an HTTP POST request

```js
DB.modules.post('invite', {'peter@example.com', invite: 'My new event'})
  .then(function() {
    //invite was send successfully
  });
```    

Baqend modules are also useful for sending messages like E-mails, Push notifications and SMS.

## Aborting requests
To abort an insert, update, delete or Baqend module invocation, handlers as well as modules may throw an 
`Abort` exception.

```js
exports.onDelete = function(db, obj) {
  throw new Abort('Delete not allowed.', {id: obj.id});
}
```

The Abort exception aborts the request. The optional 
data parameter transfers additional JSON data back to the client. The data can be retrieved from the error 
object passed to the reject handler of the promise.

```js
obj.delete().then(function() {
  //object was deleted successfully  
}, function(e) {
  e.message //The error message
  e.data.id //The data sent backed to the client
});
```

## Module system and libraries
Baqend code constitutes CommonJS modules and can require other modules and external libraries. 

Baqend modules not exposing a call method can't be called by the client but may be required by 
other modules and handlers.
```js
//myModule
exports.updateMe = function(db) {
  return db.User.me.load().then(function(user) {
    user.visits++;
    return user.save();
  });
}; 
```

Baqend modules are imported through relative require calls and external libraries through absolute 
require calls.

```js
//require another Baqend module
var myModule = require('./myModule');
//require the http core module for external http requests
var http = require('http');
exports.call = function(db, data, req) {
  return myModule.updateMe(db);
}; 
```

In Baqend Handlers modules are required from the parent folder. 

```js
//onUpdate              
//Require the module form the parent folder
var myModule = require('../myModule');       
exports.onUpdate = function(db, obj) {
  return myModule.updateMe(db);
}; 
```

**Note**: don't require module functions directly, since modules will be loaded and cached. This may cause issues when 
modules are updated.

The following additional libraries can be required in baqend code:

- [http](https://nodejs.org/api/http.html) - Node.js http core library
- [https](https://nodejs.org/api/https.html) - Node.js https core library 
- [querystring](https://nodejs.org/api/querystring.html) - Node.js core querystring parsing and serialization library
- [crypto](https://nodejs.org/api/crypto.html) - Node.js core crypto api offers a way of encapsulating secure credentials 
- [baqend](http://www.baqend.com/js-sdk/latest/baqend.html) - The baqend SDK
- [express](http://expressjs.com/4x/api.html) - HTTP server
- [twilio](http://twilio.github.io/twilio-node/) - APIs for Text Messaging, VoIP & Voice in the Cloud 

## Permissions

Baqend Code is always executed with the permissions of the requesting client. If the requesting user is not logged in, 
all requests made from Baqend code are anonymous. Both anonymous and authenticated invocations are enhanced by the node role. This predefined role can be used in class and object ACLs to grant Baqend code additional access rights. In addition there are some Baqend API resources which can only be accessed by the admin or the node role. 

# Persistence

The Baqend SDK internally tracks the state of all living entity instances and their attributes. If an attribute of an 
entity is changed, the entity will be marked as dirty. Only dirty entities will be send back to the Baqend while calling
`save()` or `update()`. Also the collections and embedded objects of an entity will be tracked the same way and mark the 
owning entity as dirty on modifications.
```js
DB.Todo.load('Todo1').then(function(todo) {
  todo.save(); //will not perform a Baqend request since the object is not dirty   
});
```

## Deep Loading
As described earlier in the [References](#references) chapter, references between entities will be handled differently 
from embedded objects or collections. The referenced objects will not be loaded with the referencing entity by default.
```js
//while loading the todo, the reference will be resolved to the referenced entity
DB.Todo.load('7b2c...').then(function(firstTodo) {
  console.log(firstTodo.name); //'My first Todo'
  console.log(firstTodo.doNext.name); //will throw an object not available error
});
```

In a more complex scenario you may have references in a collection, this references will also not be loaded by default.
```js
DB.Todo.load('7b2c...').then(function(firstTodo) {  
  //will throw an object not available error
  console.log(firstTodo.upComingTodos.get(0).name); 
});
``` 

As described earlier, you can pass the `depth` option while loading the entity. The depth option allows you to set a depth  
of references which will additionally be loaded. A depth value of `0` (the default) just loads the entity. 
```js
DB.Todo.load('7b2c...', {depth: 0}).then(function(firstTodo) {   
  //will throw an object not available error
  console.log(firstTodo.doNext.name); 
  //will still throw an object not available error
  console.log(firstTodo.upComingTodos.get(0).name); 
});
```

A depth value of `1` loads the entity and one additional level of references. This affects references in collection 
and embedded objects.
```js
DB.Todo.load('7b2c...', {depth: 1}).then(function(firstTodo) {
  console.log(firstTodo.doNext.name); //'My second Todo'
  console.log(firstTodo.upComingTodos.get(0).name); //'My second Todo'  
  //will throw an object not available error
  console.log(firstTodo.doNext.doNext.name); 
  //will still throw an object not available error
  console.log(firstTodo.upComingTodos.get(0).upComingTodos.get(0).name); 
});
```

Setting the depth value to `2` resolves the next level of references and so on. You can set the depth option to `true` to
load all references by reachability. But be aware of that this can become a critical performance issue on large object graphs. 

## Cached Loads

Each EntityManager instance has an instance cache. This instance cache is used while loading objects and resolving 
references. If en entity is loaded it will be stored into this instance cache and will always be returned when the same 
instance is requested. This ensures that you will get the same instance for the same object id. That means object 
equality is always guaranteed for same object ids. 
```js
DB.Todo.load('MyFirstTodo', {depth: 1}).then(function(firstTodo) {
  DB.Todo.load('MySecondTodo').then(function(secondTodo) {
    //true, object equality is guaranteed by the DB instance cache
    console.log(firstTodo.doNext == secondTodo); 
  });  
});
```

## Depth Saving

As the depth loading, you can also save referenced entities with the referencing entity by passing the depth option. If 
you call `save()` without any options, only the entity itself will be saved, but not any referenced entity. This is the 
same behaviour as passing `depth` with the value `0`.
```js
var firstTodo = new DB.Todo({name: 'My first Todo'});
var secondTodo = new DB.Todo({name: 'My second Todo'});

firstTodo.doNext = secondTodo;
firstTodo.save(); //will save firstTodo, but not the secondTodo
```

By passing the depth option with a value of `1` the entity and all its direct referenced entities will be saved.
```js
var thirdTodo = new DB.Todo({name: 'My third Todo'});

firstTodo.doNext = secondTodo;
secondTodo.doNext = thirdTodo;
//will save firstTodo and secondTodo, but not the thirdTodo
firstTodo.save({depth: 1});
```

And again increasing the `depth` value to `2` will save all direct referenced entities and all entities which are 
referenced by those referenced entities. You can also pass `depth` with `true` to save all entities by reachability.



# Upcoming Features
As developer you know, Software is never finished. Last year, we were adding 'just this last future' before we would 
finely publish the beta. In truth we touched every line of code, added hundreds of thousands lines and wrote 10k Tests. 
Here you find some of the futures coming up on the way to our next milestone. Coming winter there will be a way for 
everyone to ship your Application with Baqend load time speed. **Announcing:** The Baqend Cloudservice

## Offline Storage
Don't interrupt the user experience due to connection lose. The automated offline Storage transparently answers request,
and even queries from local cache and synchronizes writes after the connection is reestablished.

## Schedule Baqend Code
There will be a scheduler you can use to periodically run tasks from the dashboard or schedule events from a client with users
permissions.

## Send E-mails, Push notifications and SMS
Use the Baqend to simplify the way you interact with your customers.

## Partial update
Update just specific attributes and increase or decrease an integer on the fly.

## Live updating queries
Query for objects and get updates on any change of your result list. Building live communication futures has never been 
easier.

## File API
Host your files, restrict access, simply upload and download pictures, assets or any other File from the client.

## After-operation handler
You are going to be able to run the operation and do further logic after it is successfully executed. This will allow to
manipulate the return statement and be certain the operation was not rejected because of concurrency or object acl.

# Baqend JavaScript SDK

Welcome to the Baqend JavaScript guide.
If you haven't done it yet, you can easily [quickstart](http://www.baqend.com/#download) a private local Baqend server. 


## Setup

The SDK is packaged as an UMD module, so it can be used with RequireJS, browserify or without any module loader.
To get started please install the Baqend SDK from [npm](https://www.npmjs.com/package/baqend) or [GitHub](https://github.com/Baqend/js-sdk/releases).
For additional setup information visit our [GitHub page](https://github.com/Baqend/js-sdk/blob/master/README.md).

## Environment

The Baqend SDK is written and tested for Chrome 24+, Firefox 18+, Internet Explorer 9+, Safari 7+, Node 0.12+, IOS 7+, Android 4+ and PhantomJS 1.9+

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
//connect to the example app
DB.connect('example');
//Or use a TLS-encrypted connection to Baqend
DB.connect('example', true);
```

**Note**: If you use a custom deployment, i.e. the baqend community edition you must pass a hostname or a complete URL 
to the connect call. `DB.connect('https://mybaqend.example.com/v1')`

You can pass a callback as a second argument, which will be called when the connection is successfully established.
```js
DB.connect('example', function() {
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

If an object is loaded from the Baqend all its attributes, collections and embedded objects will be loaded, too.
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

## Load / Refresh
Sometimes you have an entity which was previously loaded from Baqend but you want to ensure that you have the latest 
version of, before performing an update. In that case you can use the `load()` method of the entity to refresh
the latest version from Baqend. 
```js
//updates the local object with the most up-to-date version
todo.load().then(function() { 
  todo.name = 'My first Todo of this day';   
  todo.save(); //updates the object
});
```

While performing an insert or update, you can also refresh the object after performing the operation. To do so you 
can pass the `refresh` flag to the `insert()`, `update()` or `save()` method.
```js
todo.save({refresh: true}).then(...); //refreshing the object after saving it
```    

This option is very useful if you have a [Baqend Code](#baqend-code) update handler which performs additional 
server-side modifications on the entity being saved. By passing the `refresh` flag you enforce that the modification will
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
  <thead>
  <tr>
    <th colspan="3" style="border: none">Filter method</th>
  </tr>
  <tr>  
    <th width="25%">
      MongoDB equivalent
    </th>
    <th width="20%">Supported types</th>
    <th>Notes</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>equal('name', 'My Todo')</code></td>
  </tr>
  <tr>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/eq/">$eq</a></td>
    <td>All types</td>
    <td>Complex types like embedded objects only match if their complete structure matches.</td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>notEqual('name', 'My Todo')</code></td>
  </tr>
  <tr>  
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/neq/">$neq</a></td>
    <td>All types</td>
    <td>Complex types like embedded objects only match if their complete structure matches.</td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>greaterThan('total', 3)</code></td>
  </tr>
  <tr>  
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/gt/">$gt</a></td>
    <td>Numbers, Dates, Strings</td>
    <td><code>gt()</code> is an alias</td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>greaterThanOrEqualTo('total', 3)</code></td>
  </tr>
  <tr>  
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/gte/">$gte</a></td>
    <td>Numbers, Dates, Strings</td>
    <td><code>gte()</code> is an alias</td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>lessThan('total', 3)</code></td>
  </tr>  
  <tr>  
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/lt/">$lt</a></td>
    <td>Numbers, Dates, Strings</td>
    <td><code>lt()</code> is an alias</td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>lessThanOrEqualTo('total', 3)</code></td>
  </tr>
  <tr>  
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/lte/">$lte</a></td>
    <td>Numbers, Dates, Strings</td>
    <td><code>lte()</code> is an alias</td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>between('total', 3, 5)</code></td>
  </tr>
  <tr>  
    <td>-</td>
    <td>Numbers, Dates, Strings</td>
    <td>It is equivalent to <code>gt('total', 3).lt('total', 5)</code></td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>in('total', 3, 5[,...])</code></td>
  </tr>
  <tr>  
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/in/">$in</a></td>
    <td>All types</td>
    <td>
        For primitive fields <strong>any</strong> of the given values have to match the field value.
        On set and list fields <strong>at least one</strong> value must be contained in the collection in order for the 
        filter to match. 
    </td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>notIn('total', 3, 5[,...])</code></td>
  </tr>
  <tr>  
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/nin/">$nin</a></td>
    <td>All types</td>
    <td>
      On primitive fields <strong>none</strong> of the given values must match the field value. 
      On set and list fields <strong>none</strong> of the given values must to be contained in the collection in order 
      for the filter to match.
    </td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>isNull('name')</code></td>
  </tr>
  <tr>  
    <td>-</td>
    <td>All types</td>
    <td>Checks if the field has no value; equivalent to <code>equal('name', null)</code></td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>isNotNull('name')</code></td>
  </tr>
  <tr>  
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/exists/">$exists</a></td>
    <td>All types</td>
    <td>
      Checks if the field has a value; equivalent to <code>where({'name': {"$exists" true, "$ne", null})</code>
    </td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>containsAny('activities', activity1, activity2 [,...])</code></td>
  </tr>
  <tr>  
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/in/">$in</a></td>
    <td>List, Set, JsonArray</td>
    <td>Checks if the collection contains any of the given elements</td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>containsAll('activities', activity1, activity2 [,...])</code></td>
  </tr>
  <tr>  
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/all/">$all</a></td>
    <td>List, Set, JsonArray</td>
    <td>Checks if the collection contains all of the given elements</td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>mod('total', 5, 3)</code></td>
  </tr>
  <tr>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/mod/">$mod</a></td>
    <td>Number</td>
    <td>The field value divided by divisor must be equal to the remainder</td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>matches('name', /^My [eman]{4}/)</code></td>
  </tr>
  <tr>  
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/regex/">$regex</a></td>
    <td>String</td>
    <td>
      The regular expression must be anchored (starting with <code>^</code>); ignore case and global flags are not
      supported.
    </td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>size('activities', 3)</code></td>
  </tr>
  <tr>  
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/size/">$size</a></td>
    <td>List, Set, JsonArray</td>
    <td>Matches if the collection has the specified size.</td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>near('location', &lt;geo point&gt;, 1000)</code></td>
  </tr>
  <tr>  
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/nearSphere/">$nearSphere</a></td>
    <td>GeoPoint</td>
    <td>
      The geo point field has to be within the maximum distance in meters to the given GeoPoint.
      Returns from nearest to furthest.<br>
      You need a 
    </td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>withinPolygon('location', &lt;geo point list&gt;)</code></td>
  </tr>
  <tr>  
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/nearSphere/">$geoWithin</a></td>
    <td>GeoPoint</td>
    <td>The geo point of the object has to be contained within the given polygon.</td>
  </tr>
  </tbody>
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

It is possible to sort the query result for one or more attributes. The query builder can be used to specify 
which attributes shall be used for sorting. Let's sort our query result by name:
```js
DB.Todo.find()
  .matches('name', /^My Todo/)
  .ascending('name')
  .resultList(...)
```

If you use more than one sort criterion, the order of the result reflects the order in which the sort methods were 
called. The following query will list all active tasks before the inactive ones and sort the tasks by their name in 
ascending order.
```js
DB.Todo.find()
  .matches('name', /^My Todo/)
  .ascending('name')
  .descending('active')
  .resultList(...)
```

When calling `descending('active')` before `ascending('name')` the result is sorted by name and 
then by active flag, which is only relevant for multiple todos having the same name. 

You can also set the sort criteria with the MongoDB [orderby](http://docs.mongodb.org/manual/reference/operator/meta/orderby/) 
syntax by using the `sort()` method. An equivalent expression to the above is this:
```js
DB.Todo.find()
  .matches('name', /^My Todo/)
  .sort({"name": 1, "active": -1})
  .resultList(...)
```

## Offset and Limit
On larger data sets you usually don't want to load everything at once. Its often reasonable to instead page through the 
query results. It is therefore possible to skip objects and limit the result size.
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

**Note**: An offset query on large result sets yields [poor query performance](http://use-the-index-luke
.com/sql/partial-results/fetch-next-page). Instead, consider using a filter and sort criteria to navigate through 
results.
 
For instance if you implement a simple pagination, you can sort by id and can get the data of the next
page by a simple greaterThen filter. As the id always has an index this results in good performance regardless of the
 query result size.
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


## Composing Filters by `and`, `or` and `nor`

Filters are joined with `and` by default. In more complex cases you may want to formulate a query with one or more 
[and](http://docs.mongodb.org/manual/reference/operator/query/and/), 
[or](http://docs.mongodb.org/manual/reference/operator/query/or/) or 
[nor](http://docs.mongodb.org/manual/reference/operator/query/nor/)  
expressions. For such cases the initial `find()` call returns a 
[Query.Builder](http://www.baqend.com/js-sdk/latest/baqend.Query.Builder.html) instance. The builder provides 
additional methods to compose filter expressions.

The following query finds all todos which the logged-in user is not currently working on and all todos which aren't 
done yet:
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

Baqend comes with a powerful user, role and permission management. This includes a generic registration and login 
mechanism and allows restricting access to insert, load, update, delete and query operations through per-class and 
per-objects rules. These access control lists (ACLs) are expressed through allow and deny rules on users and roles.

## Registration

To restrict access to a specific role or user, the user needs a user account. Baqend supports a simple registration 
process to create a new user account. The user class is a predefined class which will be instantiated during the registration 
process. A user object has a predefined `username` which uniquely identifies the user and a `password`. The password 
will be hashed and salted by Baqend before being saved.   
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

When a user is already registered, he can login with the `DB.User.login()` method. 
```js
DB.User.login('john.doe@example.com', 'MySecretPassword').then(function() {
  //Hey we are logged in again
  console.log(DB.User.me.username); //'john.doe@example.com'  
});
```  

After the successful login a session will be established and all further requests to Baqend are authenticated 
with the currently logged-in user.

## Logout 

Sessions in Baqend are stateless, that means a user is not required to logout in order to close the session. When a 
session is started a session token with a specified lifetime is created. If this lifetime is exceeded, the session 
is closed automatically. A logout just locally deletes the session token and removes the current `DB.User.me` object.
``` 
DB.User.logout().then(function() {
  //We are logged out again
  console.log(DB.User.me); //null
});
```

## Auto login

During initialization the Baqend SDK checks, if the user is already registered and has been logged in. A
new user is anonymous by default and no user object is associated with the DB. Returning users are
automatically logged in and the `DB.User.me` object is present.
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

Another way to login or register is via a 'Sign in with' - 'Google' or 'Facebook' button. 
In general any OAuth provider can be used to authenticate and authorise a user. 
As of now, Baqend supports five providers. To set them up, you need to register your applications on the provider's 
website. The provider generates a client ID and a client secret. You can find them on the provider's website after 
registration. There is also a text field where you need to add a redirect URL.
Add `https://APP_NAME.baqend.com/v1/db/User/PROVIDER` (with *APP_NAME* and *PROVIDER* substituted) and copy the client ID 
and client secret into the settings page of the dashboard. 

On the client side, trigger `DB.User.loginWithGoogle(clientID [, options])` to start the OAuth login process. The call 
opens a new window showing the provider-specific login page. To work despite popup blockers the 
call needs to be made on response to a user interaction, e.g. after a click on the sign-in button. Similarly to a 
register or a login call, a promise is returned that completes with the logged-in user. 

 <table class="table">
    <tr>
        <th>Provider</th>
        <th></th>
        <th>Notes</th>
    </tr>
    <tr>
        <td>[Google](https://console.developers.google.com/project/_/apiui/credential)</td>
        <td>[doc](https://developers.google.com/console/help/new/?hl=de#setting-up-oauth-20)</td>
        <td>Add as redirect URL: `https://[YOUR_APP_ID].baqend.com/v1/db/User/OAuth/google`</td>
    </tr>
    <tr>
        <td>[Facebook](https://developers.facebook.com/apps)</td>
        <td>[doc](https://developers.facebook.com/docs/facebook-login/v2.4)</td>
        <td>
            To set up Facebook-OAuth open the settings page of your 
            [Facebook app](https://developers.facebook.com/apps), switch to `Advanced`, activate `Web OAuth Login` and 
            add `https://[YOUR_APP_ID].baqend.com/v1/db/User/OAuth/facebook` as `Valid OAuth redirect URI`. 
        </td>
    </tr>
    <tr>
        <td>[Github](https://github.com/settings/applications)</td>
        <td>[doc](https://developer.github.com/v3/oauth/)</td>
        <td>Add as redirect URL: `https://[YOUR_APP_ID].baqend.com/v1/db/User/OAuth/github`</td>
    </tr>
    <tr>
        <td>[Twitter](https://apps.twitter.com/)</td>
        <td>[doc](https://dev.twitter.com/oauth/overview/faq)</td>
        <td>Add as redirect URL: `https://[YOUR_APP_ID].baqend.com/v1/db/User/OAuth/twitter`
            Twitter dose not support E-Mail scope. In default case a uuid is set as Username.
        </td>
    </tr>
    <tr>
        <td>[LinkedIn](https://www.linkedin.com/secure/developer?newapp=)</td>
        <td>[doc](https://developer.linkedin.com/docs/oauth2)</td>
        <td>Add as redirect URL: `https://[YOUR_APP_ID].baqend.com/v1/db/User/OAuth/linkedin`</td>
    </tr>
</table>

OAuth is a way to delegate rights of third party resources owned by users to your application. A simple login always 
receives a token and requests basic information including the unique user ID. The public profile information 
is the most restricted scope a provider can offer. All supported providers (except Twitter) have a public profile + email scope 
witch is the default in the Baqend SDK. The Baqend server checks if an email is in the allowed scope and sets it as the
username. For Twitter or if you change the scope within the frontend an uuid will be created as username.

To change the registration and login behavior you can fine the `oauth.[PROVIDER]` Baqend module in your dashboard,
after activating the provider. The passed parameters are the current user and object containing the OAuth token and
basic user information. You can use it to do further API calls or save the token or other information provided from the
OAuth provider.

## Roles

The Role class is also a predefined class which has a `name` and  a `users` collection. The users collection 
contains all the members of a role. A user has a specified role if he is included in the roles `users` list. 

``` 
//create a new role
var role = new DB.Role({name: 'My First Group'});
//add current user as a member of the role
role.addUser(DB.User.me);
//allow the user to modify the role memberships
//this overwrites the default where everyone has write access
role.acl.allowWriteAccess(DB.User.me);
role.save().then(...);
```

A role can be read and written by everyone by default. To protect the role so that no one else can add himself to the 
role we restrict write access to the current user. For more information about setting permissions see the [setting 
object permissions](#setting-object-permissions) chapter. 

## Permissions

There are two types of permissions: *class-based* and *object-based*. The class-based permissions can be set
 by privileged users on the Baqend dashboard or by manipulating the class metadata. The object-based permissions can 
 be set by users which have write-access to an object. If a user requests an operation access must be allowed 
 class-based as well as object-based in order to perform the specific operation. 

Each permission consists of one allow and one deny list. In the allow list user and roles can be white listed and in 
the deny list they can be black listed. 
 
The access will be granted based on the following rules:

- If the user has the admin role, access is always granted and the following rules will be skipped
- Otherwise:
  - If the user or one of its roles are listed in the deny list, access is always denied
  - If no rules are defined in the allow list, public access is granted
  - If rules *are* defined the user or one of its roles has to be listed in the allow list in order to get access

The following table shows the SDK methods and the related permissions the user has to have, to perform the specific 
operation.

<table class="table">
  <tr>
    <th>Method</th>
    <th width="50%">Class-based permission</th>
    <th>Object-based permission</th>
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
    <td>type.insertPermission if the object is inserted<br>
      type.updatePermission if the object is updated
    </td>
    <td>object.acl.write</td>
  </tr>
  <tr>
    <td><code>save({force: true})</code></td>
    <td>both type.insertPermission and type.updatePermission will be checked</td>
    <td>object.acl.write</td>
  </tr>
</table>

**Note**: It is currently no way to check if a user has permissions to perform an operation without actually 
performing the operation. 

## Anonymous Users & Public Access
   
Anonymous users only have permissions to serve public resources. A resource is publicly accessible, if
 no class or object permission restricts the access to specific users or roles. To check if the object's
permissions allow public access you can check the `acl.isPublicReadAllowed()` and the `todo.acl.isPublicWriteAllowed()` 
methods.
```js
todo.acl.isPublicReadAllowed() //will return true by default
todo.acl.isPublicWriteAllowed() //will return true by default
```

**Note**: The access can still be restricted to specific roles or users by class-based permissions even if 
  `acl.isPublicReadAllowed()` or `todo.acl.isPublicWriteAllowed()` returns `true`.

## Setting Object Permissions

The object permissions are split up in read and write permissions. When inserting a new object, by default read and 
write access is granted to everyone. You can manipulate object permissions only if you have write permissions on the object. If you want to restrict write access to the current user but want to share an object within a group, you 
can add the role to the read permissions and the current user to the write permissions.
```js 
DB.Role.find().equal('name', 'My First Role').singleResult(function(role) {
  var todo = new DB.Todo({name: 'My first Todo'});
  todo.acl.allowReadAccess(role)
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

It is also possible to change the actual object in the `onInsert` and `onUpdate` handler before it is saved. While 
issuing the insert/update from the SDK you will not get this changes back by default. To get the changed data back, use 
the refresh flag of the `save()`, `insert()` or `update()` method.

```js
//the Baqend handler
exports.onUpdate = function(db, obj) {
  obj.counter++;
}
```

```js
//on client side without refresh
DB.Test.load('546c6-a...').then(function(obj) {
  return obj.save();
}).then(function(obj) {
  //obj.counter == 0
});

//on client side with refresh
DB.Test.load('546c6-a...').then(function(obj) {
  return obj.save({refresh: true});
}).then(function(obj) {
  //obj.counter == 1
});
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
DB.modules.post('invite', {email: 'peter@example.com', invite: 'My new event'})
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

## Advanced request handling

In addition to the simplified `call(db, obj, req)` method we provide a advanced way to handle requests within baqend modules. 
You can implement GET and POST request handling separately by implementing a equivalent `get(db, req, res)` and 
`post(db, req, res)`. 

**Note:** that the second parameter is the request object and the third parameter is a express 
[response](http://expressjs.com/api.html#res) object.

With the request object, you can handle form submissions via get or post
```
//Handle get submissions
exports.get = function(db, req, res) {
  //access url get parameters
  var myParam = req.query.myParam;

  res.json(req.query);
};

//Handle post submissions
exports.post = function(db, req, res) {
  //access form post parameters
  var myParam = req.body.myParam;

  res.json(req.body);
};
```

With the response object, you can send additional response headers and have a better control over the content which will 
be send back. You can use the complete express API to handle the actual request.

```
exports.get = function(db, req, res) {
  var myParam = req.query.myParam;

  if(db.User.me) {
    //we are logged in
    return db.User.me.load().then(function() {
      //use the powerful express helpers
      res.status(200);
      res.json({
        myParam: myParam, 
        token: sig(myParam, db.User.me),
        userId: db.User.me.id
      });
    });
  } else {
    //we are anonymous, lets redirect the user to a login page
    res.redirect('http://myApp.baqend.com/login');
    res.send();
  }
};
```

It is important that you send the content back with one of the express `res.send()` helpers. Otherwise the response will 
not be send back to the client. In addition ensure that you return a [promise](#promise) when you make asynchronous calls within 
your baqend module, otherwise the request will be aborted with an error!


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
all requests made from Baqend code are anonymous. Both anonymous and authenticated invocations are enhanced by the node 
role. This predefined role can be used in class and object ACLs to grant Baqend code additional access rights. 
In addition there are some Baqend API resources which can only be accessed by the admin or the node role. 

# Push Notifications

Baqend provides the ability to send push notifications to end users devices. Before you can send a push notification you 
must first register the Device of the User. Registered devices can then later be used in baqend Code to send push 
notifications to those registered devices. 

**Note:** Currently baqend supports IOS and Android based devices, support for more platforms are planed. 

## Setup Push
//Description how to register an App, and get the push token

## Device registration

A registered device is represented in baqend by the Device class. The Device class contains the `deviceOs` field which 
contains the platform name of the registered device, currently `Android` or `IOS`. To register a new device you must 
first obtain a device token with your used mobile framework. With the token you can register the device on baqend.

It is not required to register a Device every time your App initialize. The SDK provides you a flag, that indicates if 
the Device is already registered. Therefore you must only request a device token if the device is currently not 
registered:

```js
DB.ready().then(function() {
    if (!DB.Device.isRegistered) {
        //helper method which fetch a new device token, using your favor framework 
        var deviceToken = requestDeviceToken();
    
        DB.Device.register('IOS', deviceToken);
    }
});
```

The device class can be extended with custom fields like any other class in baqend. This allows you to save additional 
data with your device, which you can later use to query the devices that should receive a push notification. To persist 
additional data with your device while registering it, you can pass a Device object to the registration method.

A common use case is to save the user with a device, that allows you to send a push notification to the users device 
later on.

```js
var device = new DB.Device({
    "user": DB.User.me
});

DB.Device.register('IOS', deviceToken, device);
```

## PushMessage

To send a push notification the SDK provides a PushMessage class which can be used to send a message to one or more 
devices. In addition to the message itself a PushMessage can transport additional information to the end users device.
 
 <table class="table">
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Notes</th>
  </tr>
  <tr>
    <td>`message`</td>
    <td>String</td>
    <td>The optional message to display</td>
  </tr>
  <tr>
    <td>`subject`</td>
    <td>String</td>
    <td>The headline of the push message</td>
  </tr>
  <tr>
    <td>`sound`</td>
    <td>String</td>
    <td>sound The filename of the sound file. The device uses this file as the notification sound.</td>
  </tr>
  <tr>
    <td>`badge`</td>
    <td>Number</td>
    <td>The badge count, displayed on the apps icon, only supported by IOS</td>
  </tr>
  <tr>
    <td>`data`</td>
    <td>Object</td>
    <td>Additional json data send directly to you app</td>
  </tr>
</table>    

## Sending push

Push notifications can only be send within [baqend code](#baqend-code). To send a push notification to a one or more devices, you must 
first obtain the desired device ids. Therefore you can use the additional data stored in the device object to query those, 
or can save the device reference in another object.

```js
/**
 * The baqend code sends a push notification to the given list of users. 
 * Therefore the extended device class contains a user field.
 * @param {Array<String>} data.users A list of user ids
 * @param {String} data.message The message to push
 */
exports.call = function(db, data) {
  var users = data.users;
  var message = data.message;
  var subject = data.subject;
  
  return db.Device.find()
    .in('user', users)
    .resultList()
    .then(function(devices) {
      var pushMessage = db.Device.PushMessage(devices, message, subject);
      return db.Device.push(pushMessage);
    });
}
```

# Persistence

The Baqend SDK internally tracks the state of all living entity instances and their attributes. If an attribute of an 
entity is changed, the entity will be marked as dirty. Only dirty entities will be send back to the Baqend while calling
`save()` or `update()`. Also the collections and embedded objects of an entity will be tracked the same way and mark the 
owning entity as dirty on modifications. The big advantage of this dirty tracking is that when you apply deep saving 
to persist object graphs, only those objects that were actually changed are transferred. This saves performance and 
bandwidth.
```js
DB.Todo.load('Todo1').then(function(todo) {
  todo.save(); //will not perform a Baqend request since the object is not dirty   
});
```

## Deep Loading
As described in the [References](#references) chapter, references between entities will be handled differently 
from embedded objects or collections. The referenced objects will not be loaded with the referencing entity by default.
```js
//while loading the todo, the reference will be resolved to the referenced entity
DB.Todo.load('7b2c...').then(function(firstTodo) {
  console.log(firstTodo.name); //'My first Todo'
  console.log(firstTodo.doNext.name); //will throw an object not available error
});
```

In a more complex scenario you may have references in a collection. These references won't be be loaded by default 
neither.
```js
DB.Todo.load('7b2c...').then(function(firstTodo) {  
  //will throw an object not available error
  console.log(firstTodo.upComingTodos.get(0).name); 
});
``` 

To load dependant objects, you can pass the `depth` option while loading the entity. The depth option allows to 
set a reference-depth which will automatically be loaded. A depth value of `0` (the default) just loads the entity. 
```js
DB.Todo.load('7b2c...', {depth: 0}).then(function(firstTodo) {   
  //will throw an object not available error
  console.log(firstTodo.doNext.name); 
  //will still throw an object not available error
  console.log(firstTodo.upComingTodos.get(0).name); 
});
```

A depth value of `1` loads the entity and one additional level of references. This also includes references in 
collections and embedded objects.
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
load all references by reachability. But be aware of that is dangerous for large object graphs. 

## Cached Loads

Each EntityManager instance has an instance cache. This instance cache is used while loading objects and resolving 
references. When an entity is loaded it is stored into this instance cache and will always be returned when the same 
instance is requested. This ensures that you will always get the same instance for a given object id. That means 
object equality is always guaranteed for objects having the same ids. 
```js
DB.Todo.load('MyFirstTodo', {depth: 1}).then(function(firstTodo) {
  DB.Todo.load('MySecondTodo').then(function(secondTodo) {
    //true, object equality is guaranteed by the DB instance cache
    console.log(firstTodo.doNext == secondTodo); 
  });  
});
```

## Deep Saving

As with deep loading, you can also save referenced entities with the referencing entity by passing the depth option.
 If you call `save()` without any options, only the entity itself will be saved, but not any referenced entity. This is the 
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
referenced by those referenced entities. You can also pass `depth` with `true` to save all dirty entities by 
reachability.


# Logging

As required by many apps, we provide a easy to use logging API to log data out of your app. In addition we provide a 
access to the access logs which contains all the resources requested by your users.

App and Access logs are accessible through our dashboard and kept for **30 days**. In addition you can view, query and 
manage the permissions of the logs like any other data you persist to baqend. But you can't modify the schema, the 
logged data nor the permissions of update and delete operations.

**NOTE:** While querring logs you must always use a date predicate, otherwise you will only get the last 5 minutes of 
the logs.

## App logging

The Baqend SDK provides a simple logging API which you can use in your app as well as in baqend code.

The SDK provides a simple log method which takes a log level, a message, arguments and a optional data object.
In addition the SDK logs the current date and the logged in user.

### Log Levels
You can use multiple log levels to categorize your logs. You can use one of the predefined logging levels 
`trace`, `debug`, `info`, `warn`, `error`. Log levels can later be used to filter logs.

```js
DB.log('debug', 'A simple debug message');
```

If you do not provide a log level, the log level becomes `info`.

For easier usage the log method also expose additional log methods for each log level:

```js
DB.log.trace('A simple trace message');
DB.log.debug('A simple debug message');
DB.log.info('A simple info message');
DB.log.warn('A simple warn message');
DB.log.error('A simple error message');
```

### Log Arguments
Often you want to include data into the log message. Therefore you can use placeholder in your log message which will be
 replaced by the additional passed values.
The can use the placeholders `%s` for strings, `%d` for numbers and `%j` for a json conversion before the values are 
included into the log message.
 
```js
DB.log('debug', 'The value %d is greater then %d', 10, 5);
//logs the message 'The value 10 is greater then 5'
```

Often you want to log additional data, which should not be converted to a string and included into the log message itself. 
All the log methods allows one additional argument as the last argument. The argument should be a json like object 
and will be logged in addition to the log message. 

```js
DB.log('debug', 'The value %d is greater then %d', 10, 5, {val1: 10, val2: 5});
//logs the message 'The value 10 is greater then 5'
//and the data {val1: 10, val2: 5}
```

You can also use the log level helper methods:
```js
DB.log.debug('The value %d is greater then %d', 10, 5, {val1: 10, val2: 5});
```

**NOTE:** App logs can be inserted by everyone by default, to restrict log insertion you can change the insert permission
of the AppLog class in the dashboard.

## Access logs

Access logs will be automatically collected whenever a resource of your app is accessed through a fastly server. 

The following data will be collected by us:

- date - The UTC date of the access
- ip - The IP address of the user
- method - The HTTP Method, one of (HEAD, GET, POST, PUT, DELETE, OPTIONS)
- server - The server who has generated the log entry, indicates the fastly pop location by default
- url - The URL of the resource that is requested
- status - The returned response status of the baqend server
- download - The amount of data transferred to the client (includes head and body payload)
- upload - The amount of data transferred from the client (includes head and body payload)
- latency - The latency to handle the actual request measured by the fastly server 
- cacheHit - Indicates if the request was directly served by the fastly server without contacting baqend (Cache HIT)


# Upcoming Features
As developers you know that software is never finished. Here you find some of the futures coming up on the way to our
 next milestone.

## Query Caching
The caching infrastructure and the algorithms are all there. The public cloud release include all the caching 
magic that allow imperceptible page load times and lightning-fast requests. The next planned step is that we will also 
cache query results! We'll soon share much more details on how it works.

## Continuous Queries & WebSockets
Query for objects and get updates on any change of your result list. This extremely powerful feature allow you to 
write reactive & real-time applications without thinking about messaging, scalability, connectivity or latency - its 
just another form of executing a query.

## Offline Storage
Don't interrupt the user experience due to intermittent connectivity. Offline storage transparently 
answers request,and even queries from the local cache and synchronizes writes after the connection is reestablished.

## Fulltext Search
Fulltext Search will allow you to perform ranked search queries to build powerful and fast search applications.

## Prepared Queries
Prepared queries can be used to restrict access to certain query patterns and manage query properties such 
as response time requirements.

## Partial Updates
Perform partial updates on objects, like counter increases

## File API
Host your files and assets, manage access right, upload and download pictures and so on.

## Scheduled Baqend Code
There will be a cron-like scheduler you can use to periodically run tasks.

## After-operation Handlers
Similar to before handlers this allows you to intercept the processing routine of data operations after they were 
executed.

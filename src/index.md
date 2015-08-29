# Baqend JavaScript SDK

Welcome to the Baqend JavaScript guide.
If you have not jet done it [quickstart](http://www.baqend.com/#download) your private local Baqend server. 


## Setup

The SDK is packed as an UMD module, it can be used with RequireJS, browserify or without module loader.
To get started please install the Baqend SDK from [npm](https://www.npmjs.com/package/baqend) or [GitHub](https://github.com/Baqend/js-sdk/releases).
For additional setup information visit our [GitHub page](https://github.com/Baqend/js-sdk/blob/master/README.md).

## Environment

The Baqend SDK is written and tested for Chrome 24+, Firefox 18+, Internet Explorer 9+, Safari 7+, Node 0.10+, IOS 7+, Android 4+ and PhantomJS 1.9+

## Dependencies

Our SDK does not require any additional dependencies, however it is shipped with four bundled dependencies:

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
method on the exported DB variable:
```js
//connect to yor baqend
DB.connect('http://example.baqend.com');
//Or use a ssl encrypted connection to your baqend
DB.connect('https://example.baqend.com');
```

You can pass a callback as second argument, which will be called when the connection is successfully established.
```js
DB.connect('http://example.baqend.com', function() {
  //work with the DB
  DB.Todo.load(...)
});
```

Behind the scenes your Baqend is requested, the metadata of your app is loaded and the [Data Models](#schema-and-types) will be created and initialized.
If you want to register a ready handler afterwards, you can use the ready method to wait on the SDK initialization.
```js
DB.ready(function() { DB... //work with the DB });
```

If you are familiar with [Promise](#promise)s you can alternatively use the returned promises instead of passing callbacks.
```js
DB.ready().then(function() {
  DB... //work with the DB
});
```

## Promise

`Promise`s are a programming paradigm to work with asynchronous code. Basically used for communication and event scheduled
tasks it makes code much more readable then the callback based approach. A Promise represents the public interface for
an asynchronous operation and can be used to chain tasks that depend on each other.

The Baqend SDK supports both paradigms, therefore each asynchronous method accepts an optional success and an error
callback and returns a Promise for further tasks.

Basically there are two common ways to initialize a Promise. You can create a new instance of Promise with an executor
function. With the given resolve and reject function it can decide if the promise should be fulfilled with a given
value or should be rejected with an error.
```js
var promise = new Promise(function(resolve, reject) {
  var delay = Math.random() * 2000 + 1000;
  window.setTimeout(function() {
  //We fulfill the promise, with the randomized delay
  resolve(delay);
  }, Math.random() * 2000 + 1000);
});
```

The second way is to create an already resolved Promise with a given value.
```js
var promise = Promise.resolve(200);
```

If you want to listen on the outcome of such a Promise you can register a onFulfilled and a onRejection listener with the
`then(onFulfilled, onRejected)` method on the promise. When the promise gets resolved, the onFulFilled listener is
called with the fulfilled value. In case of rejection the onRejected listener is called with the error.
```js
promise.then(function(value) {
  console.log('We have waited ' + value + 'ms');
}, function(e) {
  console.log('An unexpected error with message: ' + e.message + ' occurred.');
});
```

The `Promise.then` method returns a new promise which will be resolved with the result of the listener.
The listener itself can also do asynchronous operations and can return another promise which will then be used to resolve the
outer Promise.
```js
promise.then(function(value) {
  return anotherAsyncTask(value);
}).then(function(anotherValue) {
  //will only be called if the first promise 
  //and the anotherAsyncTask's Promise fulfilled
  //the anotherValue holds the fulfilled value of the anotherAsyncTask
});
```

For additional examples and a more detailed explanation consult the [MDN Promise Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

We use the Promise based approach for the entire documentation since the code is more readable and it is our
recommended way to work with asynchronous code.

## Working with objects

After the Baqend SDK has successfully been initialized, all defined classes can be accessed by the DB instance. Just use
the name of the class to access the object factory.
```js
DB.ready(function() {
  DB.Todo //The Todo class factory
});
```

The object factory can be called or can be used like a normal javascript constructor to create instances.
```js
var todo = new DB.Todo({name: 'My first Todo'});
```
The constructor accepts one optional argument an object which contains the initial values of the object.

The object attributes can be accessed and changed just by their names.
```js
var todo = new DB.Todo({name: 'My first Todo'});
console.log(todo.name); //'My first Todo'
todo.active = true;
```

# CRUD

Each entity has some basic methods for persisting and retrieving its data.

## Create

After creating a new object, the object can be persisted to the Baqend with an `insert()` call. The insert call ensures
that the object get its own unique id.

```js
var todo = new DB.Todo({id: 'Todo1', name: 'My first Todo'});
//we can use the object id right now
console.log(todo.id) //'8b6c9a-...' 

todo.insert().then(function() {
  console.log(todo.version); //1
});
```

## Read

If an object is persisted it can be loaded by id. This method is very handy with custom ids.
```js
DB.Todo.load('Todo1').then(function(todo) {
  console.log(todo.name); //'My first Todo'  
});
```

If an object ist loaded from the Baqend all its attributes, collections and embedded objects will be loaded.
References to other entities will not be loaded by default. For more details see the [Persistence](#persistence) chapter.

When you load the same object a second time, the object will be loaded from the local cache. This ensures that you
always get the same object instance for the same object id.

```js
DB.Todo.load('Todo1').then(function(todo1) {
  DB.Todo.load('Todo1').then(function(todo2) {
    console.log(todo1 === todo2); //true
  });
});
```

## Update

After you have loaded an instance and have done some modifications, you usually want to write the modifications back to
the Baqend.
```js
todo.name = 'My first Todo of this day';
return todo.update();
```

The `update()` method writes your changes back to the Baqend, if no one else have already modified the object. To detect
concurrent object modifications each entity has a version. Every time you write changes back to your Baqend the version
will be matched. If the version in the Baqend differs form your version, the object was modified by someone else and your
changes will be rejected. Since you made some changes based on an outdated object.
```js
todo.name = 'My first Todo of this day';
return todo.update().then(function() {
  //the todo was successfully persisted
}, function(e) {
  //the update was rejected. Do we want to reapply our changes?
});
```

Note: When you try to update an already deleted object, it will also be treated as a concurrent modification and the
update will be rejected.

There are also some situations where we like to omit this behaviour and want to force to write our changes back to the
Baqend. To do so you can pass the force option to the `update` method but be aware of that the force option can result
in lost updates.
```js
todo.name = 'My first Todo of this day';
  //force the update and overwrite all concurrent changes
return todo.update({force: true}).then(function() {
  //the todo was successfully persisted
});
```

## Delete

You can delete an object by calling its `delete()` method. It will delete the entity from your Baqend and drop the entity
out of your local cache.

```js
todo.delete().then(function() {
  //the object is deleted
}, function() {
  //a concurrent modifications prevents the removal
});
```

As like the `update()` method, the `delete()` method matches the local version with the version in the Baqend and deletes
the object only if the version still matches.

And again you can pass the force option to bypass the version check.
```js
todo.delete({force: true});
```

## Save

As you have seen in the previous examples you can `insert()` new objects and `update()` existing objects. If it is
non-relevant if the object is already persisted to the Baqend just use the `save()` method.

```js
var todo = new DB.Todo({id: 'Todo1', name: 'My first Todo'});
todo.save().then(function() { //inserts the object
  todo.name = 'My first Todo of this day';
  todo.save(); //updates the object
});
```

## Load / Reload
Sometimes you have an entity already loaded from the Baqend but you want to ensure that you have the latest version of 
the entity before performing an update. In such cases you can use the `load()` method on the entity instance to reload
the latest version from the Baqend. 
```js
//updates the local object with any changes made on the Baqend
todo.load().then(function() { 
  todo.name = 'My first Todo of this day';   
  todo.save(); //updates the object
});
```

While performing an insert or update, you can also reload the object after performing the operation. To reload the 
entity, you can pass the `reload` options flag to the `insert()`, `update()` or `save()` method.
```js
todo.save({reload: true}).then(...); //reload the object after saving it
```    

This options is very useful if you have a [Baqend Code](#baqend-code) update handler which performs additional 
modifications on the saving entity. By passing the `reload` flag you enforce that the modification will be loaded from 
the Baqend after the entity has been saved. 

# Schema and Types

Behind each object which will be persisted to and loaded from Baqend is a schema which describes the structure of an object.
It carries which attributes of an object will be tracked and saved, the type of each attribute and additional constraints
if they were set.

The types that Baqend supports can be classified in five categories.

- [Entities](#entity-objects), are the objects you will work with most of the time.
- [References](#references), are references to other entities.
- [Embeddables](#embedded-objects), are objects that are embedded within other objects.
- [Primitives](#primitives), are native types like String, Numbers, Dates and JSON.
- [Collections](#collections), like list and maps that can contains any of the previous data types.

## Entity Objects

In general there are two types of objects. We call the first type Entities, those are objects which have their own identity, 
a version and access rights. They can be directly saved, loaded and updated. Each entity get its own unique id at creation
time. The id will never be changed once the object is created.

```js
var todo = new DB.Todo({name: 'My first Todo'});
console.log(todo.id); //'84b9...'
```

You can also create an object with a custom id. Whenever you use a custom id you must ensure that the id is unique 
within the entity table.

```js
var todo = new DB.Todo({id: 'Todo1', name: 'My first Todo'});
console.log(todo.id); //'Todo1'
todo.save();
```

Note: The save call will be rejected, if the id already exists!

## References

Entity objects can reference other entities by their reference. Referenced objects will not be persisted with another
entity, instead only a reference to the other entity will be persisted.
```js
var firstTodo = new DB.Todo({name: 'My first Todo'});
var secondTodo = new DB.Todo({name: 'My second Todo'});

firstTodo.doNext = secondTodo;
```

To save such a reference, you just call the `save()` method on the entity.
```js
//while persisting the todo the reference will be serialized to a object reference
firstTodo.save();
```

The reference will be resolved by the Baqend SDK to an reference string like `/db/Todo/84b9...`. Only this string will
be persisted with the entity. The referenced entity will not be saved by default. You can pass the `depth` options flag
to the save the complete object graph by reachability.
```js
//will also save the secondTodo, since it is referenced by the firstTodo
firstTodo.save({depth: true});
```

When an entity is loaded from Baqend, referenced entities will not be loaded by default. Instead an unresolved entity
will be set for the referenced entity. If you try to access attributes of an unresolved entity, an *object is not
available* error will be thrown.
```js
//while loading the todo, the reference will be resolved to the referenced entity
DB.Todo.load('7b2c...').then(function(firstTodo) {
  console.log(firstTodo.name); //'My first Todo'
  console.log(firstTodo.doNext.name); //will throw an object not available error
});
```

You can check with the `isReady` field, if an entity is already resolved.
```js
DB.Todo.load('7b2c...').then(function(firstTodo) {
  console.log(firstTodo.doNext.isReady); //false
});
```

To resolve unresolved entities, you can use the `load()` method of the unresolved entity.
```js
firstTodo.doNext.load(function() {
  console.log(firstTodo.doNext.isReady); //true
  console.log(firstTodo.doNext.name); //'My second Todo'
});
``` 

If your object graph is not very depth, you can also load all entities and their references by reachability.
```js
//while loading the todo, the referenced todo will also be loaded
DB.Todo.load('7b2c...', {depth: true}).then(function(firstTodo) {
  console.log(firstTodo.name); //'My first Todo'
  console.log(firstTodo.doNext.name); //'My second Todo'
});
```

For further information on persisting and loading strategies see the [Persistence](#persistence) chapter.

## Embedded Objects
The second type of objects are embeddables. Embedded objects can be used within an entity or a
collection like a list or map. They do not have an id and can only exist within an entity. Embeddables will be
saved, loaded and updated with their owning entity and will be persisted together with it.

Embedded objects can be created and used like entity objects.
```js
var activity = new DB.Activity({start: new Date()});
console.log(activity.start); //something like 'Tue Mar 24 2015 10:46:13 GMT'
activity.end = new Date();
```

Since embeddables do not have their own identity, they do not hold their own id, version and acl attributes.
```js
var activity = new DB.Activity({start: new Date()});
console.log(activity.id); //undefined
```

To actually persist an embeddable you have to assign the embedded object to an entity and save the entire entity.
```js
var activity = new DB.Activity({start: new Date()});
var todo = new DB.Todo({name: 'My first Todo', activities: new DB.List()});
todo.activities.add(activity);
todo.save();
```

## Primitives

The primitives types are the basic types which can be used as an attribute type. Whenever you save an entity, all
attribute values will be checked against the types described by the schema. The following table shows all supported
attribute types of Baqend and their equivalent JavaScript types.

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
    <td>The date will be normalized to the GMT.</td>
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
    <td rowspan=2">Semistructured JSON will be embedded within the entity. Any valid JSON is allowed.</td>
  </tr>
  <tr>
    <td>JsonArray</td>
    <td>Array</td>
    <td>[1,2,3]</td>
  </tr>
</table>

## Collections

The collections are the fifth mentioned category. Each collection is typed with only one specified type. The Baqend SDK 
does not support native JavaScript arrays since changes on native arrays cannot be tracked.

Baqend supports three common collections types:

<table class="table">
  <tr>
    <th>Baqend Collection</th>
    <th>Example</th>
    <th width="50%">Supported element Types</th>
  </tr>
  <tr>
    <td>collection.List</td>
    <td>new DB.List([1,2,3])</td>
    <td>All none collection types are supported as values</td>
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

For all collection methods view the [JavaScript API Docs](http://www.baqend.com/js-sdk/latest/baqend.collection.html).

# Querys

If you like to get more than one object or find objects by one ore more specific criteria you can formulate a query
that gets executed on the Baqend and returns the matched objects.
The Baqend SDK has a [query builder](http://www.baqend.com/js-sdk/latest/baqend.Query.Builder.html) that creates 
[MongoDB]([MongoDB queries](http://docs.mongodb.org/manual/tutorial/query-documents/))
under the hood.

## resultList, singleResult and count
The simplest query you can create has no filter attached, it returns all objects. 
To get the actual result you can use the `resultList` method.
```js
DB.Todo.find().resultList(function(result) {
  result.forEach(function(todo) {
    console.log(todo.name); //'My first Todo', 'My second Todo', ...
  });
});
```

To find just the first matching result use the `singleResult` method.
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
Usually you want to filter the query results. The query builder supports a lot of different 
[filters](http://www.baqend.com/js-sdk/latest/baqend.Query.Filter.html), 
that can be applied on entity attributes. All chained filters get combined with *and*.
```js
DB.Todo.find()
  .matches('name', /^My Todo/)
  .equal('active', true)
  .lessThanOrEqualTo('activities.start', new Date())
  .resultList(...)
```

The query searchs for all todos, whose name starts with `'My Todo'`, is currently active and contains an activity in
its activities list that has been started before the current date.

Note that all valid MongoDB attribute expressions can be used as a field name in a filter.

If you are familiar with writing [MongoDB queries](http://docs.mongodb.org/manual/tutorial/query-documents/), you can
use the `where` method to describe a MongoDB query in JSON format. An equivalent query to the above one would look like
this:
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
    <th>Mongo equivalent</th>
    <th>Supported types</th>
    <th width="40%">Notes</th>
  </tr>
  <tr>
    <td>equal('name', 'My Todo')</td>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/eq/">$eq</a></td>
    <td>All types</td>
    <td>Complex types like objects will only match when the complete structure matches.</td>
  </tr>
  <tr>
    <td>notEqual('name', 'My Todo')</td>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/neq/">$neq</a></td>
    <td>All types</td>
    <td>Complex types like objects will only match when the complete structure matches.</td>
  </tr>
  <tr>
    <td>greaterThan('total', 3)</td>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/gt/">$gt</a></td>
    <td>Numbers, Dates, String</td>
    <td><code>gt()</code> is an alias</td>
  </tr>
  <tr>
    <td>greaterThanOrEqualTo('total', 3)</td>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/gte/">$gte</a></td>
    <td>Numbers, Dates, String</td>
    <td><code>gte()</code> is an alias</td>
  </tr>
  <tr>
    <td>lessThan('total', 3)</td>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/lt/">$lt</a></td>
    <td>Numbers, Dates, String</td>
    <td><code>lt()</code> is an alias</td>
  </tr>
  <tr>
    <td>lessThanOrEqualTo('total', 3)</td>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/lte/">$lte</a></td>
    <td>Numbers, Dates, String</td>
    <td><code>lte()</code> is an alias</td>
  </tr>
  <tr>
    <td>between('total', 3, 5)</td>
    <td>-</td>
    <td>Numbers, Dates, String</td>
    <td>It is equivalent to <code>gt('total', 3).lt('total', 5)</code></td>
  </tr>
  <tr>
    <td>in('total', 3, 5[,...])</td>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/in/">$in</a></td>
    <td>All types</td>
    <td>With sets or lists every element gets matched one match is sufficient<code>containsAny()</code> is an alias</td>
  </tr>
  <tr>
    <td>notIn('total', 3, 5[,...])</td>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/nin/">$nin</a></td>
    <td>All types</td>
    <td>With sets or lists every element gets matched one match is sufficient</td>
  </tr>
  <tr>
    <td>isNull('name')</td>
    <td>-</td>
    <td>All types</td>
    <td>Checks if the field has no value, it is equivalent to <code>equal('name', null)</code></td>
  </tr>
  <tr>
    <td>isNotNull('name')</td>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/exists/">$exists</a></td>
    <td>All types</td>
    <td>Checks if the field has a value, it is equivalent to <code>where({'name': {"$exists" true, "$ne", null})</code></td>
  </tr>
  <tr>
    <td>containsAll('activities', activity1, activity2)</td>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/all/">$all</a></td>
    <td>List, Set, JsonArray</td>
    <td>Checks if the collection contains all the elements</td>
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
    <td>The regular expression must be anchored (starts with an <code>^</code>) and the ignore case and global flags are not
    supported</td>
  </tr>
  <tr>
    <td>size('activities', 3)</td>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/size/">$size</a></td>
    <td>List, Set, JsonArray</td>
    <td>Requires a specific size of the collection.</td>
  </tr>
  <tr>
    <td>near('location', &lt;geo point&gt;, 1000)</td>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/nearSphere/">$nearSphere</a></td>
    <td>GeoPoint</td>
    <td>The geo point of the object has to be within the maximum distance in meters to the given GeoPoint.
    Returns from nearest to furthest.</td>
  </tr>
  <tr>
    <td>withinPolygon('location', &lt;geo point list&gt;)</td>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/nearSphere/">$geoWithin</a></td>
    <td>GeoPoint</td>
    <td>The geo point of the object has to be contained within the given polygon.</td>
  </tr>
</table>

It is also possible to use References in filters. If we like to get all Todos which owned by the 
currently logged in user, we can simply find them by using his User instance:

```js
DB.Todo.find()
  .equal('owner', DB.User.me) //any other User reference is also valid here
  .resultList(...)
```

Note: DB.user.me referres to the currently logged in User instance, read more about Users and the
login process in the [User, Roles and Permission](#user-roles-and-permissions) chapter.

## Sort

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

# User, Roles and Permissions

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
Add "https://'APP_NAME'.baqend.com/db/User/'PROVIDER_ID'" as redirect Uri and copy client ID and client secret into the 
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
        <th>Provider Dashboard</th>
        <th>Provider doc</th>
        <th>Notes</th>
    </tr>
    <tr>
        <td>Google</td>
        <td>[developer console](https://console.developers.google.com/project/_/apiui/credential)</td>
        <td>[Google doc](https://developers.google.com/console/help/new/?hl=de#setting-up-oauth-20)</td>
        <td></td>
    </tr>
    <tr>
        <td>Facebook</td>
        <td>[Facebook developer](https://developers.facebook.com/apps)</td>
        <td>[Facebook doc](https://developers.facebook.com/docs/facebook-login/v2.4)</td>
        <td>To set up Facebook-OAuth open the Settings page of your [Facebook app](https://developers.facebook.com/apps),
        change to `Advanced` activate `Web OAuth Login` and add `https://[YOUR_APP_ID].baqend.com/db/User/OAuth/facebook`
         as `Valid OAuth redirect URI`. 
        </td>
    </tr>
    <tr>
        <td>GitHub</td>
        <td>[Github applications](https://github.com/settings/applications)</td>
        <td>[Github doc](https://developer.github.com/v3/oauth/)</td>
        <td></td>
    </tr>
    <tr>
        <td>Twitter</td>
        <td>[Twitter applications](https://apps.twitter.com/)</td>
        <td>[Twitter doc](https://dev.twitter.com/oauth/overview/faq)</td>
        <td></td>
    </tr>
    <tr>
        <td>LinkedIN</td>
        <td>[LinkedIN developer](https://www.linkedin.com/secure/developer?newapp=)</td>
        <td>[LinkedIn doc](https://developer.linkedin.com/docs/oauth2)</td>
        <td></td>
    </tr>
</table><br><br>
OAuth is a way to delegate rights of third party resources owned by the users to your application. A simple login is 
always getting a token and requesting basic information including the unique user ID. 
You can interact in the way the user is created by changing the Baqend Code visible when an provider is activated.


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

Baqend Code Handlers and Modules are JavaScript functions that can be defined in the dashboard and get 
evaluated on server side.
They come in handy when you need to enforce roles and can't trust client reliability.

##Handlers

With handlers you are able to intercept and modify any object operation sent by a client. To register a handler open the
handler page of a class on the dashboard. There are four tabs, one for each of the three basic data manipulating 
operations and onValidate to easily validate values. Each one has an empty function template that will be called before 
executing the operation. Here you can safely validate values or execute additional business logic.

### onValidate

onValidate gets called before and insert or update operation. It is a lightweight method to validate values 
for any field.
The function is propagated into the Baqend SDK and can be called on the client to validate inputs without
rewriting the validation logic. The validation library [validatorJs](https://github.com/chriso/validator.js) helps 
keeping validation simple and readable. The onValidate method gets for each field of the entity an Validator object, 
which keeps all available validation methods.
```js
function onValidate(username, email) {
 username.isLength(3, 15);
 //An error messages can be passed as first argument
 email.isEmail('The email is not valid') 
}
```
To validate the object on the client device call `object.validate()` in your application. It returns a result object, 
that can be used to validate.

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
handlers scope as well as the second argument is the object which is inserted or updated. All attributes can be 
read and manipulated through normal property access. The requesting user can be attained through `db.User.me`. 
Inside the Baqend Code the user is an unresolved object just like all other 
referenced objects. If you need to read or manipulate attributes, `.load()` the user first. For example we need to 
sort the users according to their total working time on finished tasks. To do that we maintain an attribute on the user 
object.

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
necessary if the last status of the Todo object was done. To get the state of the object before the current update use 
`db.load(objectID)`. It returns a new object with the old data. `this.load()` on the other hand would overwrite the 
current update.

```js
exports.onUpdate = function(db, obj) {
  return db.Todo.load(this.id).then(function(oldTodo) {
    if (oldTodo.done != obj.done) {
      return db.User.me.load().then(function(user) {
        var totalTime = this.activities.reduce(function(totalTime, activity) {
          return totalTime += activity.end.getTime() - activity.start.getTime();
        }, 0);

        if (this.done) {
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

Note: Inside Baqend Code a request like `user.save()` gets send with the same access rights of the user starting the 
request with one exception baqend calls grant one additional `node` role and the update will not trigger another 
onUpdate(db) call. Read more on [Baqend Code permission](#permissions).

### onDelete

The onDelete handler will be called with an empty object which only keeps the id of the deleted object. The method can
be used to archive information if necessary or delete related objects. 

```js
exports.onDelete = function(db, obj) {
  obj.id //the id of the object which will be deleted
  obj.name //will be null since no additional information will be send by delete
}
```

All four handlers are `before`-operation handlers. Be aware that they are called after the class level permissions are 
checked, but before object level permissions get validated. This maid lead to unauthorized changes and inconsistency when
object permissions are set but operations are made without checking them. An elegant way to prevent double checking is 
the use of the `after`-operation, one of our [Upcoming Features](#upcoming-features).


## Modules

The Baqend Modules are JavaScript modules which can be stored on the Baqend server. They can be called from a 
client or can be required by other modules and handlers. Only modules that exports a `call` method can be called by 
clients directly. The baqend method will get the baqend scope as the first, the data send by the client as 
the second and the [request](http://expressjs.com/api.html#req) object as the third parameter.

Lets create a simple invite system. If we want to invite some user to our event, we add our invite to his invites list.

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

On the client side we can now invite a user by its username to our event by invoking our baqend invite method. Baqend 
modules can be invoked with get when we want to read data and with post when we want to modify data. 

- While using get data will send with url query parameters
- While using put data will be send as json in the body

```js
DB.modules.post('invite', {'peter@example.com', invite: 'My new event'})
  .then(function() {
    //invite was send successfully
  });
```    

Baqend modules are also useful for sending messages like E-mails, Push notifications and SMS.

## Abort a request
If the insert / update / delete operation should not be applied. We can abort the operation by throwing an Abort 
exception. Also Baqend modules can throe the Abort exception to reject a request. 

```js
exports.onDelete = function(db, obj) {
  throw new Abort('Abortion not allowed.', {id: obj.id});
}
```

With the Abort exception it is possible to abort the request and reject the operation. The optional 
data parameter can be used to send additional json data back to the client. The data can be retrieved from the error 
object passed to the reject handler of the promise.

```js
obj.delete().then(function() {
  //object was deleted successfully  
}, function(e) {
  e.message //The error message
  e.data.id //The data send backed to the client
});
```

## Module system and libraries
Baqend code are written as CommonJS Modules and can require other created modules and external libraries. 

Baqend Modules must not expose a call method therefore they can't be called by the client but can be required by 
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

Another module can require other baqend modules with relative require calls and external libraries with absolute 
require calls.

```js
//myCode              
//you should not resolve module functions directly here
var myModule = require('./myModule');
//require the http core module for external http requests
var http = require('http');
exports.call = function(db, data, req) {
  return myModule.updateMe(db);
}; 
```

Baqend Handlers can also require other Baqend modules by requiring them from the parent folder. 

```js
//onUpdate              
//Require the module form the parent folder
var myModule = require('../myModule');       
exports.onUpdate = function(db, obj) {
  return myModule.updateMe(db);
}; 
```

Note: It is important that you not require module functions directly, since modules will be loaded and cached. Updating 
module dependencies later may result in unexpected issues!

The following additional libraries can be required in baqend code:
[http](https://nodejs.org/api/http.html) - Node.js http core library
[https](https://nodejs.org/api/https.html) - Node.js https core library 
[querystring](https://nodejs.org/api/querystring.html) - Node.js core querystring parsing and serialization library
[crypto](https://nodejs.org/api/crypto.html) - Node.js core crypto api offers a way of encapsulating secure credentials 
[baqend](http://www.baqend.com/js-sdk/latest/baqend.html) - The baqend SDK
[express](http://expressjs.com/4x/api.html) - A node HTTP server
[twilio](http://twilio.github.io/twilio-node/) - APIs for Text Messaging, VoIP & Voice in the Cloud 

## Permissions

Baqend Code is always executed with the same permission the requesting client has. If the user is not logged in all 
requests made form the baqend code is still anonymous. Requested Code by a logged in user will also grant the 
same permission as he has on client side with one exception. Anonymous users and logged in users get one additional 
`node` role. This predefined role can be used in class and object permissions to grant Baqend code more 
access as the user has on client side. In addition there are some Baqend API resources which can only be accessed by 
the admin or the node role. 

# Persistence

The Baqend SDK internally tracks the state of all living entity instances and their attributes. If an attribute of an 
entity is changed, the entity will be marked as dirty. Only dirty entities will be send back to the Baqend while calling
`save()` or `update()`. Also the collections and embedded objects of an entity will be tracked the same way and mark the 
owning entity as dirty on modifications.
```js
DB.Todo.load('Todo1').then(function(todo) {
  todo.save(); //will not perform any baqend request since the object is not dirty   
});
```

## Depth Loading
As described earlier in the [References](#references) chapter, references between entities will be handled different 
than embedded objects or collections. They will not be loaded with the referencing entity by default.
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

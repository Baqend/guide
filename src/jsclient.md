# Baqend JavaScript SDK

## Introduction

First of all you must install the Baqend SDK via [npm](https://www.npmjs.com/package/baqend). Alternative you can
download the Baqend SDK from [GitHub](https://github.com/Baqend/js-sdk/releases).

## Setup

The Baqend SDK is packed as an UMD module, so it can be used with RequireJS, browserify or no module loader.
For additional setup information visit our [GitHub page](https://github.com/Baqend/js-sdk/blob/master/README.md)

## Environment

The Baqend SDK is written and tested for Chrome 24+, Firefox 18+, Internet Explorer 9+, Safari 7+, Node 0.10+, IOS 7+, Android 4+ and PhantomJS 1.9+

## Dependencies

Our SDK does not require any additional dependencies, however it is shipped with four bundled dependencies:

- Jahcode, for easier class declaration and usage
- lie, A lightweight and fast ECMA5 Promise shim
- node-uuid, A uuid generator
- validator, A validation library

## License

The Baqend JavaScript SDK an all its bundled dependencies are shipped under the
[MIT License](https://github.com/Baqend/js-sdk/blob/master/LICENSE.md)

# Objects

## Getting started

After including the baqend SDK in your app, you must connect the SDK with your baqend. Therefor you call the connect
method on the exported DB variable:
```js
DB.connect('example.baqend.com');
```

You can pass as the second argument a callback, which will be called when the connection to the baqend was successfully
be established.
```js
DB.connect('example.baqend.com', function() {
    //work with the DB
    DB.Todo.get(...)
});
```

Behind the scenes your Baqend is requested, the metadata of your app is fetched and the [Data Models](#schema-and-types) will be created and initialized.
If you want to register a ready handler afterwards, you can use the ready method to wait on the SDK initialization.
```js
DB.ready(function() { DB... // work with the DB });
```

If you are familiar with [Promise](#promise)s you can alternatively use the returned promises instead of passing callbacks.
```js
DB.ready().then(function() {
  DB... // work with the DB
});
```

## Promise

`Promise`s are a programming paradigm to work with asynchronous code. Basically used for communication and event scheduled
tasks it makes code much more readable then the callback based approach. A Promise represents the public interface for
an asynchronous operation and can be used to chain tasks the depends on each other.

The Baqend SDK supports both paradigm, therefore each asynchronous method of the Baqend SDK accepts an optional success and error
callback and returns a Promise for further tasks.

Basically there are to common ways to initialize a Promise. You can create a new instance of Promise with an executor
function which can decide with the given resolve and reject function if the promise should be fulfilled with a given
value or should be rejected with an error.
```js
var promise = new Promise(function(resolve, reject) {
  var delay = Math.random() * 2000 + 1000;
  window.setTimeout(function() {
    // We fulfill the promise, with the randomized delay
    resolve(delay);
  }, Math.random() * 2000 + 1000);
});
```

The second way is to create a already resolved Promise with a given value.
```js
var promise = Promise.resolve(200);
```

If you want to listen on the outcome of such a Promise you can register a fulfilled and a rejection listener with the
`then(onFulfilled, onRejected)` method on the promise. If the promise will be resolved the onFulFilled listener will be
called with the fulfilled value. On rejection the onRejected listener will be called with the error.
```js
promise.then(function(value) {
  console.log('We have waited ' + value + 'ms');
}, function(e) {
  console.log('An unexpected error with the message: ' + e.message + ' occurred.');
});
```

The `Promise.then` method will return another promise which will be resolved with the result of the previous listener.
The listener itself can also do asynchronous operations and can return another promise which will then be used to resolve the
outer Promise.
```js
promise.then(function(value) {
  return anotherAsyncTask(value);
}).then(function(anotherValue) {
  // will only be called if the first promise and the anotherAsyncTask's Promise fulfilled
  // the anotherValue holds the fulfilled value of the anotherAsyncTask
});
```

For additional examples and a more detail explanation consult the [MDN Promise Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

We use the Promise based approach for the entire documentation since the code is more readable and it is our
recommended way to work with asynchronous code.

## Working with objects

After the Baqend SDK is successfully been initialized, all defined classes can be accessed by the DB instance. Just use
the name of the class to access the object factory.
```js
DB.ready(function() {
    DB.Todo // The Todo class factory
});
```

The object factory can be called or can be used like a normal javascript constructor to create instances.
```js
var todo = new DB.Todo({name: 'My first Todo'});
```
The constructor accepts one optional argument an object which contains the initial values of the object.

The object attributes can be accessed and changed just by there names.
```js
var todo = new DB.Todo({name: 'My first Todo'});
console.log(todo.title); // 'My first Todo'
todo.active = true;
```

# CRUD

Each entity have some basic methods for persisting and retrieval its data.

## Create

After creating a new object, the object can be persisted to the baqend with an `insert()` call. The insert call ensures
the the object get its own unique id.

```js
var todo = new DB.Todo({id: 'Todo1', name: 'My first Todo'});
todo.insert().then(function() {
    console.log(todo.version); // 1
});
```

## Read

If an object is persisted, it can be fetched by id. This method is very handy with custom ids.

```js
DB.Todo.get('Todo1').then(function(todo) {
    console.log(todo.name); // 'My first Todo'    
});
```

If an object ist loaded form the baqend all its attributes, collections and embedded objects will be fetched.
References to other entities will not be fetched by default. For more details see the [Persistence](#persistence) chapter.

When you load the same object a second time, the object will be fetched from the local cache. This ensures that you
always get the same object instance for the same object id.

```js
DB.Todo.get('Todo1').then(function(todo1) {
    DB.Todo.get('Todo1').then(function(todo2) {
        console.log(todo1 === todo2); // true
    });
});
```

## Update

After you have fetched an instance and have done some modifications, you usually want to write the modifications back to
the baqend.
```js
todo.name = 'My first Todo of this day';
return todo.update();
```

The `update()` method writes your changes back to the baqend, if no one else have already modified the object. To detect
concurrent object modifications each entity has a version. Every time you write changes back to your baqend the version
will be matched. If the version in the baqend differ form your version, the object was modified by someone else and your
changes will be rejected. Since you made some changes based on an outdated object.
```js
todo.name = 'My first Todo of this day';
return todo.update().then(function() {
   //the todo was successfully persisted
}, function(e) {
   //the update was rejected. Do we want to reapply our changes?
});
```

Note: When you try to update an already removed object, it will be also tread as a concurrent modification and the
update will be rejected.

There are also some situation where we like to omit this behaviour and want to force to write our changes back to the
baqend. To do so you can pass the force option to the `update` method but be aware of that the force option can result
in lost update.
```js
todo.name = 'My first Todo of this day';
// force the update and overwrite all concurrent changes
return todo.update({force: true}).then(function() {
   //the todo was successfully persisted
});
```

## Delete

You can delete an object by calling its `remove()` method. It will remove the entity form you baqend and drops the entity
out of your local cache.

```js
todo.remove().then(function() {
    // the object is removed
}, function() {
    // a concurrent modifications prevents the removal
});
```

As like the `update()` method, the remove method matches the local version with the version in the baqend and removes
the object only if the version still match.

And again you can pass the force option to bypass the version check.
```js
todo.remove({force: true});
```

## Save

As you have seen in the previous examples you can `insert()` new objects and `update()` existing objects. If you does not
matter if an object is persisted to the baqend or not and just want to *save* your local changes, you can use the
`save()` method.

```js
var todo = new DB.Todo({id: 'Todo1', name: 'My first Todo'});
todo.save().then(function() { // inserts the object
    todo.name = 'My first Todo of this day';
    todo.save(); // updates the object
});
```

# Schema and Types

Behind each object which will be persisted to and fetched from baqend is a schema which describes the structure of an object.
Meaning which attributes of an object will be tracked and persisted, what is the type of an attribute and what are the
additional constraints of an attribute.

The types that baqend supports can be classified in five categories.

- [Entities](#entity-objects), are the objects you work the most time with.
- [References](#references), are references to other entities.
- [Embeddables](#embedded-objects), objects that are embedded within other objects.
- [Primitives](#primitives), native types like String, Numbers, Dates and JSON.
- [Collections](#collections), like list and maps that can contains any of the previous data types.

## Entity Objects

Entities are the first type of objects, those are objects which have an own identity, a
version and access rights. They can be directly saved, loaded and updated. Each entity get its own unique id at creation
time. The id will never be changed once the object is created.

```js
var todo = new DB.Todo({name: 'My first Todo'});
console.log(todo.id); // '84b9...'
```

You can also create an object with a custom id. Whenever you use a custom id you must ensure that the id is globally unique.

```js
var todo = new DB.Todo({id: 'Todo1', name: 'My first Todo'});
console.log(todo.id); // 'Todo1'
todo.save();
```

Note: The save call will be rejected, if the id already exists!

## References

Entity objects can reference other entites by there reference. Referenced objects would not be persisted with another
Entity, instead only a reference to the other entity will be persisted.
```js
var firstTodo = new DB.Todo({name: 'My first Todo'});
var secondTodo = new DB.Todo({name: 'My second Todo'});

firstTodo.doNext = secondTodo;
```

To save such a reference, you just call the `save()` method on the entity.
```js
//while persisting the todo, the reference will be resolved to the referenced object id
firstTodo.save();
```

The reference will be resolved by the baqend SDK to an reference string like `/db/Todo/84b9...`. Only this string will
be persisted with the entity. The referenced entity would not be saved by default. You can pass the `depth` options flag
to the save the complete object graph by reachability.
```js
// will also save the secondTodo, since it is referenced by the firstTodo
firstTodo.save({depth: true});
```

When en entity is fetched form baqend, referenced entities would not be fetched by default. Instead an unresolved object
will be set for the referenced object. if you try to access an attribute of an unresolved object, an *object is not
available* error will be thrown.
```js
//while persisting the todo, the reference will be resolved to the referenced object id
DB.Todo.get('7b2c...').then(function(firstTodo) {
    console.log(firstTodo.name); // 'My first Todo'
    console.log(firstTodo.doNext.name); // will throw an object not available error
});
```

If your object graph is not very depth, you can also fetch all entities and their references by reachability.
```js
//while persisting the todo, the reference will be resolved to the referenced object id
DB.Todo.get('7b2c...', {depth: true}).then(function(firstTodo) {
    console.log(firstTodo.name); // 'My first Todo'
    console.log(firstTodo.doNext.name); // 'My second Todo'
});
```

For further reading on persisting and fetching strategies see the [persistence](#persistence) chapter.

## Embedded Objects
The second type of objects are embeddables. Embedded objects can be used within an entity or a
collection. Embeddables do not have an id and can only lived within an entity. Embeddables will be
saved, loaded and updated with there owning entity and will be persisted together with its owning entity.

Embedded objects can be created and used like entity objects.
```js
var activity = new DB.Activity({start: new Date()});
console.log(activity.start); // something like 'Tue Mar 24 2015 10:46:13 GMT'
activity.end = new Date();
```

Since embeddables do not have an own identity they do not have an id, version nor acl attribute.
```js
var activity = new DB.Activity({start: new Date()});
console.log(activity.id); // undefined
```

To actually persist an embeddable you must assign the embedded object to an entity and save the entire entity.
```js
var activity = new DB.Activity({start: new Date()});
var todo = new DB.Todo({name: 'My first Todo', activities: new DB.List()});
todo.activities.add(activity);
todo.save();
```

## Primitives

The primitves types are the basic types which can be used as an attribute type. Whenever you save an entity, all
attribute values will be checked against the types described by the schema. The following Table shows all supported
attribute types of baqend and there equivalent JavaScript types.

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
        <td>64bit integer. Floating point numbers will be stripped to an integer</td>
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
        <td>The Date will be normalized to the GMT.</td>
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
        <td rowspan=2">Semistructured JSON, which will be embedded within the entity. Any valid JSON is allowed.</td>
    </tr>
    <tr>
        <td>JsonArray</td>
        <td>Array</td>
        <td>[1,2,3]</td>
    </tr>
</table>

## Collections

The collection types are the collections of the other four types. Each collections is typed. That means tha a collection
can only persist one specified type. The Baqend SDK does not support native JavaScript arrays, because changes on an array
can't be tracked.

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

For all collection methods view the API JavaScript Docs.

# Querys

If you like to get more then one object and find objects by one ore more specific cretericas you can formulate a query
which will be executed on the baqend and retruens the matched objects.
The Baqend SDK comes with an Query builder, which creates [MongoDB]([MongoDB queries](http://docs.mongodb.org/manual/tutorial/query-documents/))
under the hood.

## resultList, singleResult and count
The simplest query you can execute is to find all objects, to get the actual result you can use the `resultList` method.
```js
DB.Todo.find().resultList(function(result) {
    result.forEach(function(todo) {
        console.log(todo.name); // 'My first Todo', 'My second Todo', ...
    });
});
```

To find just the first matching result you can always use the `singleResult` method.
```js
DB.Todo.find().singleResult(function(todo) {
    console.log(todo.name); // 'My first Todo'
});
```

If you just want the count of the matching result, you can use the `count` result.
```js
DB.Todo.find().count(function(count) {
    console.log(count); // '17'
});
```

## Filters
Usually you want to filter the query results. The query builder supports a lot of different filters, that can be applied
on entity attributes. All filters will be combined with *and*.
```js
DB.Todo.find()
    .matches('name', /^My Todo/)
    .equal('active', true)
    .lessThanOrEqualTo('activities.start', new Date())
    .resultList(...)
```

The query search for all todos, which name is start with `'My Todo'`, is currently active and contains in
its activities list an Activity that has been started before the current date.

Note that all valid MongoDB attribute expressions can be used as a field name in a filter.

If you are familiar with writing [MongoDB queries](http://docs.mongodb.org/manual/tutorial/query-documents/), you can
use the `where` method to describe an MongoDB query in JSON format. An equivalent query to the above one will locks like
the following:
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
        <td>gt() is an alias</td>
    </tr>
    <tr>
        <td>greaterThanOrEqualTo('total', 3)</td>
        <td><a href="http://docs.mongodb.org/manual/reference/operator/query/gte/">$gte</a></td>
        <td>Numbers, Dates, String</td>
        <td>gte() is an alias</td>
    </tr>
    <tr>
        <td>lessThan('total', 3)</td>
        <td><a href="http://docs.mongodb.org/manual/reference/operator/query/lt/">$lt</a></td>
        <td>Numbers, Dates, String</td>
        <td>lt() is an alias</td>
    </tr>
    <tr>
        <td>lessThanOrEqualTo('total', 3)</td>
        <td><a href="http://docs.mongodb.org/manual/reference/operator/query/lte/">$lte</a></td>
        <td>Numbers, Dates, String</td>
        <td>lte() is an alias</td>
    </tr>
    <tr>
        <td>between('total', 3, 5)</td>
        <td>-</td>
        <td>Numbers, Dates, String</td>
        <td>It is equivalent to gt('total', 3).lt('total', 5)</td>
    </tr>
    <tr>
        <td>in('total', 3, 5[,...])</td>
        <td><a href="http://docs.mongodb.org/manual/reference/operator/query/in/">$in</a></td>
        <td>All types</td>
        <td>The elements will be matched on Set and Lists, containsAny() is an alias</td>
    </tr>
    <tr>
        <td>notIn('total', 3, 5[,...])</td>
        <td><a href="http://docs.mongodb.org/manual/reference/operator/query/nin/">$nin</a></td>
        <td>All types</td>
        <td>The elements will be matched on Set and Lists</td>
    </tr>
    <tr>
        <td>isNull('name')</td>
        <td>-</td>
        <td>All types</td>
        <td>Checks whenever the field has not a value, it is equivalent to equals('name', null)</td>
    </tr>
    <tr>
        <td>isNotNull('name')</td>
        <td><a href="http://docs.mongodb.org/manual/reference/operator/query/exists/">$exists</a></td>
        <td>All types</td>
        <td>Checks whenever the field has a value, it is equivalent to where({'name': {"$exists" true, "$ne", null})</td>
    </tr>
    <tr>
        <td>containsAll('activities', activity1, activity2)</td>
        <td><a href="http://docs.mongodb.org/manual/reference/operator/query/all/">$all</a></td>
        <td>List, Set, JsonArray</td>
        <td>Checks whenever the collection contains all the elements</td>
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
        <td>The regular expression must be anchored (starts with an ^) and the ignore case and global flags are not
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
        <td>The geo point of the object must be within the maximum distance in meters to the given GeoPoint.
        Returns from nearest to farthest.</td>
    </tr>
    <tr>
        <td>withinPolygon('location', &lt;geo point list&gt;)</td>
        <td><a href="http://docs.mongodb.org/manual/reference/operator/query/nearSphere/">$geoWithin</a></td>
        <td>GeoPoint</td>
        <td>The geo point of the object must be contained within the given polygon.</td>
    </tr>
</table>

## Sort

It ist possible to sort the query result for one or more attributes. The attributes to sort for can be set with the
query builder too. Lets sort our query results by name:
```js
DB.Todo.find()
    .matches('name', /^My Todo/)
    .ascending('name')
    .resultList(...)
```

If you use more then one sort criterion, the sorted result depends on the order you call the sort options.
The following Query will list all active tasks before the inactive ones and sort the tasks by their name in ascending order.
```js
DB.Todo.find()
    .matches('name', /^My Todo/)
    .ascending('name')
    .descending('active')
    .resultList(...)
```

It makes a big difference if you call the `ascending('name')` before or after the `descending('active')` call.
The reverse order of the calls will first sort by name and afterwards by the active flag, which does not make really
sense in this example.

## Offset and Limit
On larger data sets we usually do not want to fetch all the data at once. Furthermore we like to page through our query
result. For such cases it is possible to skip objects from the query results and limit the results at all.
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


# User, Roles and Permissions

# Handler

# Baqend Code

# Persistence

# Upcoming Features


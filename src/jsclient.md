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

Behind the scenes your Baqend is requested, the metadata of your app is fetched and the [Data Models](#schema-and-data-model) will be created and initialized.
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

## Entity Objects

In general there are to types of objects. We call the first type Entities those are objects which have an own identity a
version and access rights. They can be directly saved, loaded and updated. Each entity get its own unique id at creation
time. The id will never be changed once the object is created.

```js
var todo = new DB.Todo({name: 'My first Todo'});
console.log(todo.id); // '84b9...'
```

You can also create an object with a custom id. Whenever you use a custom id you must ensure that the id is globaly unique.

```js
var todo = new DB.Todo({id: 'Todo1', name: 'My first Todo'});
console.log(todo.id); // 'Todo1'
todo.save();
```

Note: The save call will be rejected, if the id already exists!

## Embedded Objects
The second type of objects are Embeddables. Embedded objects can be used within an entity or a
collection like a list or map. Embeddables do not have an id and can only lived within an entity. Embeddables will be
saved, loaded and updated with there owning entity and will be persisted together with its owning entity.

Embedded objects can be created and used like entity objects.
```js
var activity = new DB.Activity({start: new Date()});
console.log(activity.start); // something like 'Tue Mar 24 2015 10:46:13 GMT'
activity.end = new Date();
```

Since embeddables do not have an own identity, no id, version and acl attribute exists.
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





# Schema and Data Model

# Querys

# User, Roles and Permissions

# Handler

# Baqend Code

# Persistence

# Upcoming Features


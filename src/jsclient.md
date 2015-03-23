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

For more examples and a more detail explanation consult the [MDN Promise Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
We use the Promise based approach for the entire documentation since the code is more readable and it is our
recommendation how to work with asynchronous code.

# CRUD

# Schema and Data Model

# Querys

# User, Roles and Permissions

# Handler

# Baqend Code

# Persistence

# Upcoming Features


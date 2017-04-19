# Setup

## Websites, Apps and Recommended Tooling

The Baqend JavaScript SDK works best for:

- Dynamic and static **Websites** built with any tools of your choice. We recommend [single page applications](https://en.wikipedia.org/wiki/Single-page_application) for the best user experience.
- **Hybrid apps** based on JavaScript. Baqend works very well with [Ionic](http://ionic.io/) and [Cordova/PhoneGap](https://cordova.apache.org/).

Though Baqend does not make any assumptions on the tooling, here a the tools we most frequently see used with Baqend:

- **Frontend MVC Frameworks** for structuring your code: [Angular.js](https://angularjs.org/), [Angular2](https://angular.io/), [React](https://facebook.github.io/react/), [Aurelia](http://aurelia.io/), [Ember](http://emberjs.com/) and [Knockout](http://knockoutjs.com/)
- **Templating Engines** to render data: [Handlebars](http://handlebarsjs.com/), [Lodash](https://lodash.com/), [Underscore](http://underscorejs.org/) and [Mustache](https://github.com/janl/mustache.js/)
- **Boilerplate projects** and **frontend generators** to get started easily: [Bootstrap](http://getbootstrap.com/) and [Intializr](http://www.initializr.com/) give you nice boilerplate projects, [yeoman](http://yeoman.io/) generates many different frontend projects, Google has released a [web starter](https://developers.google.com/web/tools/starter-kit/) that contains a cross-device boilerplate project and useful gulp tasks for live reloading, releasing, etc.
- **Hybrid app frameworks** for mobile applications with JavaScript: [Ionic](http://ionic.io/), [Framework7](http://framework7.io/) and [Onsen UI](https://onsen.io/) are based on web views, [React Native](https://facebook.github.io/react-native/) is based on native UIs with JavaScript logic
- **Build tools** for bundling, deployment and development: [Webpack](https://github.com/webpack/webpack), [Gulp](http://gulpjs.com/) and [Grunt](http://gruntjs.com/) all work well with Baqend
- **IDEs** and **Text Editors** for developing: [WebStorm](https://www.jetbrains.com/webstorm/) and [Netbeans](https://netbeans.org/) are full-fledged IDEs, [Sublime](https://www.sublimetext.com/), [Visual Studio Code](https://code.visualstudio.com) and [Atom](https://atom.io/) are powerful text and code editors
- [Baqend Starter Kits](/starters): Boilerplate projects connected to Baqend


## Javascript SDK

The JavaScript SDK is packaged as an UMD module, it can be used with RequireJS, browserify or without any module loader.
To get started please install the Baqend SDK with [npm](https://www.npmjs.com/package/baqend) or [bower](https://libraries.io/bower/baqend) or 
download the complete package from [GitHub](https://github.com/Baqend/js-sdk/releases/latest).

<div class="note"><strong>Note:</strong> If you are not using JavaScript you can use Baqend via its <b>REST API</b> from the programming language of your choice. Baqend's REST API is documented with <a href="http://swagger.io/">Swagger</a> and can be explored <a href="https://dashboard.baqend.com/swagger-ui/?url=https%3A%2F%2Ftoodle.app.baqend.com%2Fv1%2Fspec&#/crud">here</a>. In the <a href="https://dashboard.baqend.com/">dashboard of you Baqend app</a> you can goto "API Explorer" to explore and use the REST API of your own instance.</div>

To install Baqend, just add our CDN-hosted script in your website (available both over HTTPS and HTTP).
<div class="release">
```html
<script src="//www.baqend.com/js-sdk/latest/baqend.min.js"></script>
```
</div>
For additional setup information visit our [GitHub page](https://github.com/Baqend/js-sdk/blob/master/README.md).

<div class="tip"><strong>Tip:</strong>
If you use our <a href="./starters">Starter Kits</a> the Baqend SDK is already included and you can skip this setup.</div>

<div class="note"><strong>Note:</strong>
It is generally a good idea to use the latest SDK version from <code>//www.baqend.com/js-sdk/latest/baqend.min.js</code> in development to always be up-to-date. In production, however, you should use the last exact version you tested with. Be aware that otherwise minor changes in a newly released version may break parts of your production application. See our <a href="https://github.com/Baqend/js-sdk/blob/master/CHANGELOG.md">latest changes</a> to the SDK.</div>


The Baqend SDK is written and tested for Chrome 24+, Firefox 18+, Internet Explorer 9+, Safari 7+, Node 4+, IOS 7+, Android 4+ and PhantomJS 1.9+


The Baqend SDK does not require any additional dependencies, however it is shipped with a few bundled dependencies:

- core-js, a shim library
- node-uuid, A uuid generator
- validator, A validation library


The Baqend JavaScript SDK and all its bundled dependencies are shipped under the
[MIT License](https://github.com/Baqend/js-sdk/blob/master/LICENSE.md).

To see that Baqend is working, paste the following after the Baqend script tag. It will replace the HTML body with 5 raw todo items from the [tutorial application](https://www.baqend.com/tutorial.html). Delete the snippet afterwards.
```html
<script>
  DB.connect('toodle').then(function() {
    return DB.Todo.find().limit(5).resultList();
  }).then(function(result) {
    document.querySelector('body').innerHTML = "<pre>" + JSON.stringify(result, null, " ") + "</pre>";
  });
</script>
```

### Baqend + Node.js

The Baqend SDK is fully compatible with [Node.js](https://nodejs.org/en/). This means you can use the SDK in a Node.js-based application for saving data, logging in users, etc. Additionally [Baqend modules]() and [handlers]() are based on Node.js and run and scaled automatically by Baqend.

To install the SDK for a Node.js project do an `npm install --save baqend` and use `require('baqend')` in your code.

```js
var DB = require('baqend');
DB.connect('example');
```

The Baqend SDK is compatible with Require.JS, Browserify, ES6 and TypeScript and all majors build tools (Gulp, Grunt, Webpack, NPM scripts, etc.).

### Connect your App to Baqend

After including the Baqend SDK in your app, connect it with your Baqend. Simply call the connect
method on the DB variable:
```js
//connect to the example app
DB.connect('example');
//Or use a TLS-encrypted (SSL) connection to Baqend
DB.connect('example', true);
```

<div class="note"><strong>Note:</strong> If you use a custom deployment, e.g. the Baqend community edition you must pass a hostname or a complete URL
to the connect call: <code>DB.connect('https://mybaqend.example.com/v1')</code></div>

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

<div class="tip"><strong>Tip:</strong> Baqend not only gives you APIs for serverless development but also hosts and accelerates your assets, like HTML, CSS, images, etc. See <a href="#hosting">Hosting</a> for more details.</div>

### Accessing Data

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

### Promises

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

# Getting Started

These are our recommendations for getting things rolling quickly:

- To get a hands-on overview of how Baqend works, take the [interactive tutorial](https://www.baqend.com/tutorial.html)
- [Start your first Baqend app](https://dashboard.baqend.com/register) and take the Quickstart to build a real application
- With the [Starter Kits](/starter-kits/) you get convenient boilerplate projects that work seamlessly with Baqend
- This section covers how Baqend and the SDK work


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
If you use our <a href="/starter-kits/">Starter Kits</a> the Baqend SDK is already included and you can skip this setup.</div>

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

The Baqend SDK is fully compatible with [Node.js](https://nodejs.org/en/). This means you can use the SDK in a Node.js-based application for saving data, logging in users, etc. Additionally [Baqend modules](../baqend-code/#modules) and [handlers](../baqend-code/#handlers) are based on Node.js and run and scaled automatically by Baqend.

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

If your app is [hosted on Baqend](../hosting), you do not have to specify any parameters, since the 
SDK will automatically detect and use the domain and protocol over which the page is served.

```js
// No parameters needed if your App is hosted on Baqend
DB.connect();
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

Behind the scenes Baqend is requested, the metadata of your app is loaded and the [Data Models](../schema/) are created and initialized.
If you want to register the handler afterwards, you can use the ready method to wait on the SDK initialization.
```js
DB.ready(function() { DB... //work with the DB });
```

If you are familiar with [Promises](#promises) you can alternatively use the returned promise instead of passing 
a callback. This works for all places in the Baqend SDK that exhibit asynchronous behaviour.
```js
DB.ready().then(function() {
  DB... //work with the DB
});
```

<div class="tip"><strong>Tip:</strong> Baqend not only gives you APIs for serverless development but also hosts and accelerates your assets, like HTML, CSS, images, etc. See <a href="/../hosting/">Hosting</a> for more details.</div>

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
  // We fulfill the promise after the randomized delay
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
- [Baqend Starter Kits](/starter-kits): Boilerplate projects connected to Baqend


## Architecture

Baqend Cloud hosts your application data and business logic and delivers it over a **global caching infrastructure** for performance at the physical optimum. 

With Baqend, you use a fully managed backend service with an automatically accelerated **JavaScript API** directly from your application (e.g. written in Angular or React). As the platform provides a rich set of turnkey features and takes over the responsibility for backend performance, major development efforts are saved.

In terms of **architecture** Baqend gives you the hosting of your application (e.g. HTML and JS files) plus the APIs for backend concerns such as data storage, queries, push, OAuth, user management, access control and server-side business logic:

![Baqend's architecture](architecture.png)


## Baqend Dashboard

The Baqend dashboard is the main tool, which you will use to manage and configure your Baqend instance. After you have
created your first app, you have in the left navigation bar a quick overview over all the configurable and usable 
 functionalities of Baqend.
  
Here is a quick overview of those:

**Baqend Modules** - can be used to create Baqend code, which can later be called by your app to execute trusted
business logic. See also [Baqend Modules](../baqend-code/#modules). By clicking the *+* you can create new modules, Afterwards a module 
code template will be opened.

**Tables** - are the part where you can create and extend the data model of Baqend to fit your app requirements.
By clicking on the class name, you can view and edit the table content and its metadata like schema, access 
rules and code hooks. Each table is represented by one entity class and each row is an instance of this class in the SDK.
On the upper right side you can navigate with the tabs through those categories:

  - **Data:** This is the default view of a class and shows the stored instances in a table. You can view, navigate and search 
  in the table. In addition you can add new rows, modify fields and delete existing rows. You can im- and export
  the entire table content and truncate (drop all rows) of the table. [Read More](../crud)
  - **Schema:** Each class is described by its schema. The schema describes which fields a class have and which type 
  those fields have. When you insert data into the table, the data will always be validated against the defined 
  schema and modifications which violate the schema will be rejected. Baqend supports many common types, such as 
  primitive types, geo points, references, collections, json and embedded types. [Read More](../schema)
  - **ACL (Access Control List):** In many apps you would like to restrict the access who is allowed to read and write 
  the data. Therefore you can restrict the access per operation on class or object level. In this view you can modify 
  the access permission for the selected class. You can add new users and roles to the acl and can specify those access 
  restrictions. [Read more](../user-management)
  - **Handler:** are Baqend code hooks, which are invoked before an object is modified. Here you can implement custom
  logic that is invoked every time when an object is inserted, updated or deleted. Within the code you can validate the 
  modification, modify some fields or can completely reject the modifications as your needs. [Read More](../baqend-code)

There are three predefined classes which you can also extend with custom fields:
  
  - **User:** are used to represent a user which is logged in into your app. New users can be created by a registration 
  process or by a login through an [OAuth](../user-management#oauth-login) provider when configured. [Read More](../user-management/#registration)
  - **Role:** Roles can be created to group users and together and use those groups to give them special privileges 
  such as ACLs. There are three predefined roles the admin role, the loggedin role and the node role. Roles contains a predefined users list 
  field, which contains all the members of the role. [Read More](../user-management#roles)
  - **Device:** represents registered devices which can later be used to send them push notifications out of Baqend
  code. Devices can be queried like any other table to send a push notification to multiple devices at once. 
  [Read More](../push)

Additionally you can create a new custom classes with a click on the *+* button near the *Data* label. Type a none used 
name and hit enter. The schema view will appear and you can begin to model your own class schema.

**Logs** - Here you can view the logs generated by accessing the api and your application logs.

  - **AccessLog:** Each request wich is served by our Baqend servers or the CDN generates a log entry. You can view and 
  search in the access logs within a period of 10 days. [Read More](../logging#access-logs)
  - **AppLog:** While developing and later in production is is really common to log specific actions of your app or 
  Baqend code for debugging and usage analysis. Therefore the SDK provides a simple logging API that you can use to
  create log entries which are kept forever. [Read More](../logging#app-logging)
 
**API Explorer** - The API Explorer provides a GUI to serve the underlying REST API of Baqend. Here you can explore and
made direct HTTP calls to your Baqend server.
 
**Settings** - Her you can configure additional settings of your Baqend app like:
  
  - E-Mailing used by the registration process
  - OAuth settings to enable oauth login
  - Push Notifications certificates and keys needed to actually push notifications

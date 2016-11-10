# Overview
Baqend Cloud hosts your application data and business logic and delivers it over a **global caching infrastructure** for performance at the physical optimum. 

With Baqend, you use a fully managed backend service with an automatically accelerated **JavaScript API** directly from your application (e.g. written in Angular or React). As the platform provides a rich set of turnkey features and takes over the responsibility for backend performance, major development efforts are saved.

In terms of **architecture** Baqend gives you the hosting of your application (e.g. HTML and JS files) plus the APIs for backend concerns such as data storage, queries, push, OAuth, user management, access control and server-side business logic:

<img src="img/architektur-guide.png" style="width:90%;">

<div class="note"><strong>Note:</strong> If you have any questions not answered by this guide, feel free to contact us via <a href="mailto:support@baqend.com">support@baqend.com</a> or the chat on the bottom.</div>


##Getting Started
These are our recommendations for getting things rolling quickly:

- To get a hands-on overview of how Baqend works, take the [interactive tutorial](http://www.baqend.com/tutorial.html)
- [Start your first Baqend app](https://dashboard.baqend.com/register) and take the Quickstart to build a real application
- With the [Starter Kits](/starters) you get convenient boilerplate projects that work seamlessly with Baqend
- This guide covers how Baqend and the SDK work in depth

# Baqend JS SDK

The JavaScript SDK is packaged as an UMD module, it can be used with RequireJS, browserify or without any module loader.
To get started please install the Baqend SDK with [npm](https://www.npmjs.com/package/baqend) or [bower](https://libraries.io/bower/baqend) or 
download the complete package from [GitHub](https://github.com/Baqend/js-sdk/releases/latest).

<div class="note"><strong>Note:</strong> If you are not using JavaScript you can use Baqend via its <b>REST API</b> from the programming language of your choice. Baqend's REST API is documented with <a href="http://swagger.io/">Swagger</a> and can be explored <a href="https://dashboard.global.ssl.fastly.net/swagger-ui/?url=https%3A%2F%2Ftoodle-bq.global.ssl.fastly.net%2Fv1%2Fspec&#/crud">here</a>. In the <a href="http://dashboard.baqend.com/">dashboard of you Baqend app</a> you can goto "API Explorer" to explore and use the REST API of your own instance.</div>

## Setup

To install Baqend, just add our CDN-hosted script in your website (available both over HTTPS and HTTP).

```html
<script src="//baqend.global.ssl.fastly.net/js-sdk/latest/baqend.min.js"></script>
```

For additional setup information visit our [GitHub page](https://github.com/Baqend/js-sdk/blob/master/README.md).

<div class="tip"><strong>Tip:</strong>
If you use our <a href="/starters">Starter Kits</a> the Baqend SDK is already included and you can skip this setup.</div>


The Baqend SDK is written and tested for Chrome 24+, Firefox 18+, Internet Explorer 9+, Safari 7+, Node 4+, IOS 7+, Android 4+ and PhantomJS 1.9+


The Baqend SDK does not require any additional dependencies, however it is shipped with a few bundled dependencies:

- core-js, a shim library
- node-uuid, A uuid generator
- validator, A validation library


The Baqend JavaScript SDK and all its bundled dependencies are shipped under the
[MIT License](https://github.com/Baqend/js-sdk/blob/master/LICENSE.md).

To see that Baqend is working, paste the following after the Baqend script tag. It will replace the HTML body with 5 raw todo items from the [tutorial application](http://www.baqend.com/tutorial.html). Delete the snippet afterwards.
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

## Connect your App to Baqend

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


## Accessing Data

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

## Promises

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

# Baqend Dashboard

The baqend dashboard is the main tool, which you will use to manage and configure your baqend instance. After you have 
created your first app, you have in the left navigation bar a quick overview over all the configurable and usable 
 functionalities of baqend. 
  
Here is a quick overview of those:

**Baqend Modules** - can be used to create baqend code, which can later be called by your app to execute trusted 
business logic. See also [Baqend Modules](#modules). By clicking the *+* you can create new modules, Afterwards a module 
code template will be opened.

**Tables** - are the part where you can create and extend the data model of baqend to fit your app requirements. 
By clicking on the class name, you can view and edit the table content and its metadata like schema, access 
rules and code hooks. Each table is represented by one entity class and each row is an instance of this class in the SDK.
On the upper right side you can navigate with the tabs through those categories:

  - **Data:** This is the default view of a class and shows the stored instances in a table. You can view, navigate and search 
  in the table. In addition you can add new rows, modify fields and delete existing rows. You can im- and export
  the entire table content and truncate (drop all rows) of the table. [Read More](#crud)
  - **Schema:** Each class is described by its schema. The schema describes which fields a class have and which type 
  those fields have. When you insert data into the table, the data will always be validated against the defined 
  schema and modifications which violate the schema will be rejected. Baqend supports many common types, such as 
  primitive types, geo points, references, collections, json and embedded types. [Read More](#schema-and-types)
  - **ACL (Access Control List):** In many apps you would like to restrict the access who is allowed to read and write 
  the data. Therefore you can restrict the access per operation on class or object level. In this view you can modify 
  the access permission for the selected class. You can add new users and roles to the acl and can specify those access 
  restrictions. [Read more](#users-roles-and-permissions)
  - **Handler:** are baqend code hooks, which are invoked before an object is modified. Here you can implement custom 
  logic that is invoked every time when an object is inserted, updated or deleted. Within the code you can validate the 
  modification, modify some fields or can completely reject the modifications as your needs. [Read More](#handlers)

There are three predefined classes which you can also extend with custom fields:
  
  - **User:** are used to represent a user which is logged in into your app. New users can be created by a registration 
  process or by a login through an [OAuth](#oauth-login) provider when configured. [Read More](#registration)
  - **Role:** Roles can be created to group users and together and use those groups to give them special privileges 
  such as ACLs. There are three predefined roles the admin role, the loggedin role and the node role. Roles contains a predefined users list 
  field, which contains all the members of the role. [Read More](#roles)
  - **Device:** represents registered devices which can later be used to send them push notifications out of baqend 
  code. Devices can be queried like any other table to send a push notification to multiple devices at once. 
  [Read More](#push-notifications)

Additionally you can create a new custom classes with a click on the *+* button near the *Data* label. Type a none used 
name and hit enter. The schema view will appear and you can begin to model your own class schema.

**Logs** - Here you can view the logs generated by accessing the api and your application logs.

  - **AccessLog:** Each request wich is served by our Baqend servers or the CDN generates a log entry. You can view and 
  search in the access logs within a period of 30 days. [Read More](#app-logging)
  - **AppLog:** While developing and later in production is is really common to log specific actions of your app or 
  baqend code for debugging and usage analysis. Therefore the SDK provides a simple logging API that you can use to 
  create log entries which are kept for an period of 30 days. [Read More](#access-logs)
 
**API Explorer** - The API Explorer provides a GUI to serve the underlying REST API of Baqend. Here you can explore and
made direct HTTP calls to your baqend server.
 
**Settings** - Her you can configure additional settings of your Baqend app like:
  
  - E-Mailing used by the registration process
  - OAuth settings to enable oauth login
  - Push Notifications certificates and keys needed to actually push notifications

# Baqend CLI

The CLI (Command Line Interface) provides a simple way to:

 - Deploy application assets (HTML, images, CSS, etc.)
 - Register Baqend Modules and Handlers

The Baqend CLI can easily be installed globally with `npm install -g baqend` (to get npm you just need to have [Node.JS](https://nodejs.org/en/download/) installed). Afterwards you can use the CLI
by typing `baqend --help` in any folder.

 <div class="note"><strong>Note:</strong> Ensure that your `PATH` system enviroment variable contains the global
 [npm bin path](https://docs.npmjs.com/cli/bin) (`$ npm bin -g`) to let npm installed commands work properly.</div>

<img src="img/cli.png" alt="Baqend CLI" style="width: 100%">

 <div class="tip"><strong>Tip:</strong> A good way to manage a Baqend-based project is to manage the files and collaboration via [git](https://git-scm.com/) and using the CLI to deploy files and code to Baqend.</div>

The Baqend CLI is automatically shipped with our SDK. You can use the baqend CLI directly in any [npm script](https://docs.npmjs.com/misc/scripts).
Therefore add a baqend script entry to the scripts section in your projects **package.json**

```js
  "scripts": {
    "baqend": "baqend"
  }
```

Afterwards you can type `npm run baqend -- --help`
<div class="note"><strong>Note:</strong> The extra `--` are required to seperate the npm run arguments from the Baqend ones.</div>

##Login and Logout

Before you can actually deploy assets and code to your app, you must login the CLI to your Baqend account. By typing
`baqend login` you can save your login credentials on your local machine.

If you do not want so save your login credentials , you can skip the login step and provide the login
credentials each time you deploy.

 <div class="note"><strong>Note:</strong> If you have created your Baqend account with OAuth (Google, Facebook or GitHub) you must add a password to your account first. This can be done in the account settings of the dashboard.</div>

 You can logout the baqend CLI and remove all locally stored credentials by typing `baqend logout`

##Deploy
 
With the deploy command you can upload your static files and assets as well as Baqend code (handlers and modules) to your Baqend app:

```bash
$ baqend deploy your-app-name
```

We expect a folder named `www` by default that is uploaded to the Baqend `www` folder and served as a website.

Read more about Baqend Hosting in the [Hosting](#hosting) chapter.

 <div class="tip"><strong>Tip:</strong> You can provide a different web folder to upload with
`baqend deploy --file-dir dist`.</div>

The CLI can additionally deploy your Baqend code. Baqend code should be located in an folder named `baqend`.
The following screenshot visiualizes a typical project layout including Baqend code.

 <div class="clearfix">
    <img src="img/cli-project.png" alt="CLI Project Layout" style="float: left; margin: 0 20px 20px 0">
All Baqend modules should sit top level within the `baqend` folder.
For example, `baqend/firstModule.js` will be uploaded as `firstModule`.

For each code handler you should create a folder named similar to the table 
it belongs to. Within the folder the files should be named:
  
`baqend/<Table>/insert.js` for an [onInsert](#oninsert) handler <br>
`baqend/<Table>/update.js` for an [onUpdate](#uonpdate) handler <br>
`baqend/<Table>/delete.js` for an [onDelete](#ondelete) handler <br>
`baqend/<Table>/validate.js` for an [onValidate](#onvalidate) handler
       
Therefore `baqend/User/insert.js` contains the insert handler code wich is invoked each time a new user object is inserted
to the `User` table. 

Read more about baqend code in the [Baqend Code](#baqend-code_1) chapter.         
       
</div>

##Typings (TypeScript Support)

The baqend SDK itself comes with a [TypeScript declaration file](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html),
which enables seamless integration into TypeScript and allows better code completion.
The SDK comes with a dynamic API part, which is generated on the fly depending on your current schema.
To make your TypeScript application work properly with this dynamic part you can generate the additional typings for your 
current schema with the CLI.

With `baqend typings your-app-name` the CLI generates the TypeScript declaration file in the current folder.
You can then add the generated file to your [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) file.

You can update the generated file each time you have changed tables or fields in the Baqend Dashboard by just repeating this step.

 <div class="tip"><strong>Tip:</strong> You should check the generated file into your version control system to
 share an up-to-date version of the definition file.</div>

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

## Concurrency with Optimistic Saving

Without the explicit `force` flag, updates and saves can fail due to concurrent operations performed on the same object. With the òptimisticSave` method you can conveniently specify the retry logic to apply, if the update fails. Even under high concurrency one writer will always succeed so that the system still makes progress.

Under the hood, this pattern of optimistic concurrency control relies on version numbers of the objects and conditional HTTP requests that only apply changes when the underlying object has not been changed.

```js
var todo = new DB.Todo.load("myTodo");
todo.optimisticSave(function(todo, abort) {
  //this method may get called multiple times
  if(todo.participants.length > 10) { 
    //you can specify when to stop reytring
    abort();
  }
  todo.participants.push("Johnny"); //apply a change --> will be saved automatically
});
```

<div class="tip"><strong>Tip:</strong> Optimistic saving is particularly useful for server-side code (<a href="#modules">modules</a>) that updates objects and may be invoked concurrently.</div>

## Load / Refresh

Sometimes you want to ensure, that you have the latest version of an previously loaded entity, for example before 
performing an update. In that case you can use the `load({refresh: true})` method of the entity to get the latest 
version from Baqend. 
```js
//updates the local object with the most up-to-date version
todo.load({refresh: true}).then(function() { 
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

## Data Modelling

Here is an example for creating the data model of Todo objects in the dashboard:

<img src="img/tutorial-schema-cropped.gif" style="width:100%">

Under the hood, Baqend stores data in MongoDB. However, in contrast to data modelling in MongoDB, Baqend supports a rich schema that is checked and validated whenever data ist stored. By using the JSON data types Baqend objects can have arbitrary schemaless parts.


<div class="tip"><strong>Tip:</strong> Best practices for <a href="http://martinfowler.com/articles/schemaless">schemaless</a> and <a href="https://en.wikipedia.org/wiki/Relational_model">schema-rich</a> data modelling can both be applied in Baqend by mixing data types with JSON.</div>

### Embedding vs Referencing

The major decision when modelling data in Baqend is the choice between embedding and referencing.

With embedding, related content is stored together. This is also called *denormalization* as the data might be duplicated in multiple places. Embedding is useful for:

- Modelling **contains** relationships. For example a shipping address is "contained" in an invoice object.
- Modelling **one-to-many** (1:n), aggregation and composition relationships. For example a Todo list is composed of multiple todo items.

The advantage of embedding is that data can be read in one chunk making retrieval more efficient. The downside is that whenever embedded objects are contained in multiple parent objects, more than one update has to be made in order to keep all instances of the embedded object consistent with each other.

<img src="img/data-modelling.png" style="width:100%">

With referencing, dependent data is not embedded, but instead references are followed to find related objects. In the world of relational database systems this is called *normalization* and the references foreign keys. Referencing is a good choice if:

- Data is used in multiple places.
- For many-to-many (n:m) relationships. For example a "friends with" relationship would best modelled by a list of references to friend profile objects.
- Deep hierarchies have to be modelled, e.g. the namespace of a file system.

The downside of referencing is that multiple reads and updates are required if connected data is changed.

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

<div class="note"><strong>Note:</strong> The save call will be rejected, if the id already exists!</div>

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
and which parts are schema free. The following table shows all supported attribute types of Baqend 
and their corresponding JavaScript types.

<div class="table-wrapper"><table class="table">
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
</table></div>

## Collections

Collections are typed by a reference, embedded object class or a primitive type. The Baqend SDK 
supports 3 type of collections, which are mapped to native JavaScript arrays, es6 sets and maps:

 <div class="table-wrapper"><table class="table">
  <tr>
    <th>Baqend Collection</th>
    <th>Example</th>
    <th width="50%">Supported element Types</th>
  </tr>
  <tr>
    <td>collection.List</td>
    <td>`new DB.List([1,2,3])` or <br> `new Array(1,2,3)`</td>
    <td>All non-collection types are supported as values</td>
  </tr>
  <tr>
    <td>collection.Set</td>
    <td>`new DB.Set([1,2,3])` or <br> `new Set([1,2,3])`</td>
    <td>Only String, Boolean, Integer, Double, Date, Time, DateTime and References are allowed as values. Only this
    types can be compared by identity.</td>
  </tr>
  <tr>
    <td>collection.Map</td>
    <td>`new DB.Map([["x", 3], ["y", 5]])` or <br> `new Map([["x", 3], ["y", 5]])`</td>
    <td>Only String, Boolean, Integer, Double, Date, Time, DateTime and References are allowed as keys.<br>
    All non collection types are supported as values.</td>
  </tr>
</table></div>

For all collection methods see the MDN docs of 
[Array](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array),
[Set](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Set) and 
[Map](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Map)

# Queries

To retrieve objects by more complex criteria than their id, queries can be used. They are executed on Baqend and 
return the matching objects.
The Baqend SDK features a [query builder](http://www.baqend.com/js-sdk/latest/baqend.Query.Builder.html) that creates 
[MongoDB queries](http://docs.mongodb.org/manual/tutorial/query-documents/) under the hood. It is possible
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

Both `resultList` and `singleResult` [support deep loading](#deep-loading-with-queries) to also load references.

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

<div class="table-wrapper"><table class="table">
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
    <td><code>ge()</code> is an alias</td>
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
    <td><code>le()</code> is an alias</td>
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
      You need a Geospatial Index on this field, to use this kind of query. Read the query index section for more details.
    </td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>withinPolygon('location', &lt;geo point list&gt;)</code></td>
  </tr>
  <tr>  
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/nearSphere/">$geoWithin</a></td>
    <td>GeoPoint</td>
    <td>
      The geo point of the object has to be contained within the given polygon.
      You need a Geospatial Index on this field, to use this kind of query. Read the [query indexes](#query-indexes) section 
      for more details.
    </td>
  </tr>
  </tbody>
</table></div>

References can and should be used in filters. Internally references are converted to ids
 and used for filtering. To get all Todos owned by the currently logged-in user, we can simply use the User instance 
 in the query builder:

```js
DB.Todo.find()
  .equal('owner', DB.User.me) //any other User reference is also valid here
  .resultList(...)
```

<div class="note"><strong>Note:</strong> <code>DB.user.me</code> refers to the currently logged-in User instance. To learn more about users and the
login process see the <a href="#user-roles-and-permissions">User, Roles and Permission chapter</a>.</div>

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
[nor](http://docs.mongodb.org/manual/reference/operator/query/nor/)  expressions. 
For such cases the initial `find()` call returns a 
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

## Query Indexes
Indexes on fields that are frequently queried can massively impact the overall query performance. Therefore our Dashboard
provides a very comfortable way to create custom indexes on fields. It is always an tradeof on which fields you should 
create an index. A good index should be created on fields that contains many distinct values. But to many indexes on the 
same class can also reduce the write throughput. If you like to read more about indexes we currently use, visit the mongo
[indexes docs](https://docs.mongodb.org/manual/indexes/).

To create an Index open the schema view of the class and use the *Index* or *Unique Index* button to create an index. 
Currently we support three types of indexes: 

**Index:** A simple index which contains a single field used to improve querys which filters the specified field. 

**Unique Index:** A index that requires uniqueness of the field values. Inserting or updating objects that violates the 
 unique constraint will be rejected with an ObjectExists error.

**Geospatial Index:** This index can be created on GeoPoint fields and are required for `near` and `withinPolygon` query 
filters. This Index is created on GeoPoint fields by using the *Index* Button.


# Streaming Queries

Baqend does not only feature powerful queries, but also streaming result updates to keep your critical data up-to-date in the face of concurrent updates by other users. 

In order to activate streaming updates for a query, all you have to do is register it as a streaming query and provide a function to execute for every received change event:

```js
var query = DB.Todo.find()
              .matches('name', /^My Todo/)
              .ascending('deadline')
              .limit(20);
var subscription = query.stream()
              .subscribe(event => console.log(event));
//...
new DB.Todo({name: 'My Todo XYZ'}).insert();//insert data
//... 
//{
//  "matchType":"add", 
//  "operation":"insert",
//  "data":{"name":"do groceries",...},
//  "date":"2016-11-09T12:42:31.322Z",
//  "target":{...},
//  "initial":true,
//  "index":1
//}
```

Calling `.stream()` on a query object opens a [websocket](https://developer.mozilla.org/de/docs/WebSockets) connection to Baqend, registers a streaming query and returns an event stream in form of an [RxJS observable](http://reactivex.io/documentation/observable.html) that provides you with updates to the query result as they happen over time.

```js
var stream = DB.Todo.find().stream();
```

To make your code react to result set changes, you can subscribe to the stream and provide a function that is called for every incoming change event:

```js
var subscription = stream.subscribe(event => console.log(event));
```

<div class="note"><strong>Note:</strong> You have to use the <a href="https://github.com/Baqend/js-sdk/blob/master/README.md#baqend-streaming-sdk" target="_blank">Baqend Streaming SDK</a> to use the streaming query feature.</div>

On error, the subscription will automatically be canceled, but you can also provide a custom error handler function that is executed whenever something goes wrong:

```js
var onNext = event => console.log(event);
var onError = error => console.log(error);
var subscription = stream.subscribe(onNext, onError);
```

To stop receiving events from a streaming query, you can simply unsubscribe:

```js
subscription.unsubscribe();
```

<div class="note"><strong>Note:</strong>
Access rules for streaming queries are the same as for regular queries (see <a href="#permissions" target="_blank">permissions</a>). In other words, if your data would not be returned by regular query, it won't be returned by streaming query, either.
</div>

Once subscribed to a stream, you will get an event for every database entity in the initial result set (i.e. every entity matching at subscription time) and for every entity that enters the result set, leaves the result set or is updated while in the result set.

Every event can carry the following information:

- **target:** the query on which `.stream([options])` was invoked.
- **data:** the database entity this event was generated for, e.g. an entity that just entered or left the result set.
- **operation:** the operation by which the entity was altered (`'insert'`, `'update'` or `'delete'`; `'none'` if unknown or not applicable).  
For an example where neither `'insert'`, `'update'` nor `'delete'` can reasonably be applied to an event, consider how the last one in a top-10 query result is pushed out when a new contender enters the top-10: While one event represents the insertion of the new contender itself, another event represents the entity leaving the result which was neither inserted, updated nor deleted. Consequently, Baqend would deliver this event with a `'none'` operation.
- **matchType:** indicates how the transmitted entity relates to the query result.  
Every event is delivered with one of the following match types:
    + `'add'`: the entity entered the result set, i.e. it did not match before and is matching now.
    + `'change'`: the entity was updated, but remains a match.
    + `'changeIndex'` (for sorting queries only): the entity was updated and remains a match, but changed its position within the query result. 
    + `'remove'`: the entity was a match before, but is not matching any longer.
    + `'match'`: the entity matches the query (subsumes `'add'`, `'change'` and `'changeIndex'`). You will only receive this match type, if you explicitly request it. 
- **initial:** a boolean value indicating whether this event reflects the matching status at query time (`true`) or a recent change data change (`false`).
- **index** (for sorting queries only): the position of the matching entity in the ordered result (`undefined` for non-matching entities).
- **date**: server-time from the instant at which the event was generated.


## Options

By default, you receive the initial result set and all events that are required to maintain it. However, the optional argument for the `.stream([options])` function lets you restrict the kind of event notifications to receive by setting the appropriate attribute values:

- **initial** (default: `true`): whether or not you want to receive the initial result set. If set to `true`, every entity matching the query at subscription time will be delivered with match type `add`, irrespective of whether and which restrictions you impose on operations and match types (see the other options). If set to `false`, you will only receive an event when something changes.
- **matchTypes** (default: `['all']`): The default gives you all events with the most specific match type (`'add'`, `'change'`, `'changeIndex'` or `'remove'`). If you are only interested in a specific subset of match types, you can specify any combination of them to listen for.  
If you do not care about the difference between new and updated items, you can also use match type `'match'`. This will yield the same events as the combination of `'add'`, `'change'` and `'changeIndex'`, but the match type of the received events will always be `'match'`. 
- **operations** (default: `['any']`): By default, events will not be sorted out based on their operation, but you can choose any combination of `'insert'`, `'update'`, `'delete'` and `'none'` to narrow down the kind of matches you receive. 



<div class="note"><strong>Note:</strong>
You therefore can only restrict match types or operations, but not both.</div>


## Streaming Simple Queries

*Simple queries* are queries that just return all entities in a collection, no filtering involved. While streaming simple queries can be very useful (for example to monitor all operations on the collection), they can produce vast amounts of events for collections that have many members or are updated very often. Therefore, you should be *particularly* careful to only subscribe to events you really want to be bothered with when using streaming simple queries.

For instance, if you are interested in all todo lists and only want to be notified as *new* lists are created, you could subscribe to the following stream:

```js
var stream = DB.Todo.find().stream({operations: 'insert'});// initial result is delivered by default
```

If, on the other hand, you only care for the creation of new todo lists and not for the ones that are already in the database, you should not request the initial result set:

```js
var stream = DB.Todo.find().stream({initial: false, operations: 'insert'});
```

### Streaming Filter Queries

Like regular filter queries, *streaming filter queries* allow you to select entities based on their attribute values by applying [filters](#filters).

You can, for instance, have the database send you an event for every todo list that is *created* with a name that matches a particular pattern:

```js
var stream = DB.Todo.find()
               .matches('name', /^My Todo/)
               .stream({initial: false, operations: 'insert'});
```

It is important to note, however, that the above query will only tell you when a new todo list matches your query *on insert*; it will *not* produce an event when an already-existing list is renamed to match your pattern, because that would happen by `update` (while the stream is targeting `insert` operations only). 

If you are really looking for a streaming query that gives you new matches irrespective of the triggering operation, you should work with `matchTypes` and leave `operations` at the default:

```js
var stream = DB.Todo.find()
               .matches('name', /^My Todo/)
               .stream({initial: false, matchTypes: 'add'});// operations: ['any'] by default
```

To get the full picture, you can also request the initial result upfront. Initial matches are always delivered with match type `add`:

```js
var stream = DB.Todo.find()
               .matches('name', /^My Todo/)
               .stream({matchTypes: 'add'});// initial: true by default
```

Of course, you can combine several predicates using `and`, `or` and `nor`. The following query keeps you up-to-date on all todo lists that are active and match one pattern or have already been marked as done and match another pattern:

```js
var queryBuilder = DB.Todo.find();
var condition1 = queryBuilder
  .matches('name', /^My Todo/)
  .equal('active', true);

var condition2 = queryBuilder
  .matches('name', /^Your Todo/)
  .equal('done', true);

var stream = queryBuilder
               .or(condition1, condition2)
               .stream();
```

## Streaming Sorting Queries

All features described so far are also available for *sorting queries*, i.e. queries that contain `limit`, `offset`, `ascending`, `descending` or `sort`. 
Streaming sorting queries are great to maintain ordered results such as high-score rankings or prioritized todo lists.

The following maintains your top-20 todo lists, sorted by urgency, name and status:

```js
var stream = DB.Todo.find()
               .matches('name', /^My Todo/)
               .ascending('deadline')
               .ascending('name')
               .descending('active')
               .limit(20)
               .stream();
```

Entities that sort identically are **implicitly ordered by ID**. Thus, a query without explicit ordering will result in more or less random order by default as IDs are generated randomly:

```js
var stream = DB.Todo.find()
               .matches('name', /^My Todo/)
               .limit(20)// no order provided? Implicitly ordered by ID!
               .stream();
```

**The `limit` clause is mandatory** and a query without limit will produce an error on subscription:

```js
var stream = DB.Todo.find()
               .matches('name', /^My Todo/)
               .ascending('deadline')
               .ascending('name')
               .descending('active')
               .stream()//no limit clause
               .subscribe(event => console.log('Next!'), 
                 error => console.log('Error!')); 
//'Error!'
```

A streaming sorting query with `offset` maintains an ordered result, hiding the first few items from you and shaping events accordingly. Since the first index in a sorting query without `offset` is `0`, events for the following subscription will never carry `index` values smaller than `10` or greater than `29`:

```js
var stream = DB.Todo.find()
               .matches('name', /^My Todo/)
               .ascending('deadline')
               .ascending('name')
               .descending('active')
               .offset(10)// skip the first 10 items
               .limit(20)
               .stream();
```

With respect to efficiency, the same rules apply to streaming and non-streaming queries: Sorting huge results is expensive and sorting queries should therefore be avoided when filter queries would do as well.

<div class="note"><strong>Note:</strong> Currently, streaming sorting queries are <em>always executed as anonymous queries</em>, i.e. they will only give you data that is publicly visible. To retrieve data protected by object ACLs, you have to either forgo streaming (use a plain sorting query) or ordering (use a streaming query without <code>limit</code>, <code>offset</code>, <code>ascending</code> and <code>descending</code>).
</div>

## Example: Subscription and Events

For an example of how a streaming query behaves, consider the following example where two users are working concurrently on the same database. <span class="user1">User 1</span> subscribes to a streaming sorting query and listens for the result and updates, whereas <span class="user2">User 2</span> is working on the data. 

**Timestamp 0:** <span class="user1">User 1</span> and <span class="user2">User 2</span> are connected to the same database. 
 
**Timestamp 1:** <span class="user2">User 2</span> inserts `todo1`:
```js
var todo1 = new DB.Todo({name: 'My Todo 1'});
todo1.insert();

//actual result: [ todo1 ]
```

**Timestamp 2:** <span class="user1">User 1</span> subscribes to a streaming query and immediately receives a match event for `todo1`:
```js
var stream = DB.Todo.find()
    .matches('name', /^My Todo/)
    .ascending('name')
    .descending('active')
    .limit(3)
    .stream();
subscription = stream.subscribe((event) => {
  console.log(event.matchType + '/' 
    + event.operation + ': ' 
	+ event.data.name + ' is now at index ' 
	+ event.index);
});
...//one round-trip later
//'add/none: My Todo 1 is now at index 0'
```

**Timestamp 3:** <span class="user2">User 2</span> inserts `todo2`:
```js
var todo2 = new DB.Todo({name: 'My Todo 2'});
todo2.insert();

//actual result: [ todo1, todo2 ]
```

**Timestamp 4:** <span class="user1">User 1</span> receives a new event for `todo2`:
```js
//'add/insert: My Todo 2 is now at index 1'
```

**Timestamp 5:** <span class="user2">User 2</span>: inserts `todo3`:
```js
var todo3 = new DB.Todo({name: 'My Todo 3'});
todo3.insert();

//actual result: [ todo1, todo2, todo3 ]
```

**Timestamp 6:** <span class="user1">User 1</span> receives a new event for `todo3`:
```js
//'add/insert: My Todo 3 is now at index 2'
```

**Timestamp 7:** <span class="user2">User 2</span> updates `todo3` in such a way that its position in the ordered result changes:
```js
todo3.name = 'My Todo 1b (former 3)';
todo3.update();

//actual result: [ todo1, todo3, todo2 ]
```

**Timestamp 8:** <span class="user1">User 1</span> is notified of this update through an event that delivers the new version of `todo3`. The fact that `todo3` had already been a match and just changed its position in the result is encoded in the event's match type `changeIndex`:
```js
//'changeIndex/update: My Todo 1b (former 3) is now at index 1'
```

**Timestamp 9:** <span class="user2">User 2</span> inserts `todo0` which sorts before all other items in the result and therefore is assigned index `0`:
```js
var todo0 = new DB.Todo({name: 'My Todo 0'});
todo0.insert();

//entities in DB: [ todo0, todo1, todo3 ], todo2
//                 <--- within limit ---> 
```
Because of the `.limit(3)` clause, only the first three of all four matching entities are valid matches and the last one — currently `todo2` — is *pushed beyond limit* and therefore leaves the result. 

**Timestamp 10:** <span class="user1">User 1</span> receives two events that correspond to the two relevant changes to the result:
```js
//'remove/none: My Todo 2 is now at index undefined'
//'add/insert: My Todo 0 is now at index 0'
```

**Timestamp 11:** <span class="user2">User 2</span> updates `todo3` again, so that it assumes its original name:
```js
todo3.name = 'My Todo 3';
todo3.update();

//entities in DB: [ todo0, todo1, todo2 ], todo3
//                 <--- within limit ---> 
```
Through this update, `todo2` and `todo3` swap places.

**Timestamp 12:** <span class="user1">User 1</span> receives the corresponding events:
```js
//'remove/update: My Todo 3 is now at index undefined'
//'add/none: My Todo 2 is now at index 2'
```

**Timestamp 13:** <span class="user2">User 2</span> deletes `todo3`:
```js
todo3.delete();

//entities in DB: [ todo0, todo1, todo2 ]
```
Note that the deleted entity was not part of the result set.

**Timestamp 14:** <span class="user1">User 1</span> no match, because deleting `todo3` had no effect on the query result.
```js
//nothing happened
```

User 1 starts receiving the initial result directly after subscription (Timestamp 2). From this point on, any write operation performed by User 2 is forwarded to User 1 — as long as it's affecting the subscribed query's result. Changes to non-matching items have no effect in the eyes of User 1 (Timestamps 13/14).

Be aware that operation-related semantics are rather complex for sorting queries: For example, `insert` and `update` operations may trigger an item to *leave* the result (Timestamps 9/10 and 11/12). Similarly (even though not shown in the example), an `add` event can be triggered by a `delete` when an item enters the result set from beyond limit. When triggered by an operation on a different entity, an event may even be delivered with no operation at all (Timestamps 10 and 12). 

<div class="tip"><strong>Tip:</strong>
Bottom line, be careful when filtering streaming sorting queries by operation!
</div>


## Advanced Features: RxJS

The Baqend Streaming SDK is shipped with [basic support for ES7 Observables](https://github.com/tc39/proposal-observable), so that you can use it without requiring external dependencies. 
To leverage the full potential of Baqend's streaming query engine, though, we recommend using it in combination with the feature-rich RxJS client library.  

In the following, we give you some references and a few examples of what you can do with RxJS and Baqend Streaming Queries.

### RxJS: The ReactiveX JavaScript Client Library

Since the [RxJS documentation is great and extensive](http://reactivex.io/tutorials.html), we do not go into detail on our client library, but rather provide a few references to get you started:

- [What is ReactiveX?](http://reactivex.io/intro.html)
- [What is an observable?](http://reactivex.io/documentation/observable.html)
- [Operators: What can I do with an observable?](http://reactivex.io/documentation/operators.html)
- [Which operator do I need for ...?](http://xgrommx.github.io/rx-book/content/which_operator_do_i_use/instance_operators.html)

### Maintaining Query Results

An obvious advantage of streaming queries over common non-streaming queries is the ability to keep your result up-to-date while you and other users are inserting, updating and deleting data. 

For an example, imagine you and your colleagues are working on some projects and you are interested in the most urgent tasks to tackle. Your query could look something like this:

```js
var query = DB.Todo.find()
              .matches('name', /^My Todo/)
              .ascending('deadline')
              .limit(10);
```

When executed as a common *non-streaming* query, this will give you the current top-10 of the most urgent todos. However, as new tasks might come up and others might be ticked off by your colleagues, you have to evaluate the query again and again if you want to keep an eye on how things are going:

```js
query.resultList(result => console.log(result));
//...
//Did something change?
query.resultList(result => console.log(result));
//...
//Let's check again...
query.resultList(result => console.log(result));
//...
```

This pattern is inefficient and introduces staleness to your critical data. 

With Baqend streaming queries, on the other hand, you can just have the database deliver the relevant changes and thus never miss a beat. 
The following code does not only retrieve an ordered result, but also maintains it:

```js
var maintainResult = (result, event) => {
    if (event.matchType === 'add') {//new entity
      result.splice(event.index, 0, event.data);
    } else if (event.matchType === 'remove') {//leaving entity
      var index = result.indexOf(event.data);
      if (index > -1) { result.splice(index, 1); }
    } else if (event.matchType === 'changeIndex') {//updated position
      var index = result.indexOf(event.data);
      result.splice(index, 1);
      result.splice(event.index, 0, event.data);
    }
    return result;
  };

var subscription = query.stream().scan(maintainResult, [])
                          .subscribe(result => console.log(result));
```

The `scan` operator can be used to maintain a data structure (the *accumulator*) by processing the incoming events. It takes two arguments: a function that is executed for every event (the *maintenance function*) and the initial value for the accumulator. Every invocation uses the accumulator value returned by the previous invocation. 
In this case, the accumulator is the query result and is initialized as an empty array (`[]`). The maintenance function `maintainResult(result, event)` takes the current result and the incoming event and returns the updated `result`. 

Whenever there is a change in the top-10, the complete list will be printed to the console. 

**No need to refresh the result.**

### Real-Time Aggregations

Another neat use case for streaming queries is to compute and maintain aggregates in real-time.  
Similar to result set maintenance, the basic idea is to keep all relevant information in an *accumulator* and to recompute and output the updated aggregate value whenever an event is received. 

#### Count

One of the simpler aggregates over a collection of entities is the *cardinality* or *count*, i.e. the number of entities in the collection. The following code will compute and maintain the cardinality of the query result:

```js
var maintainCardinality = (counter, event) => {
  if (event.matchType === 'add') {// entering item: count + 1
    counter++;
  } else if (event.matchType === 'remove') {// leaving item: count - 1
    counter--;
  }
  return counter;
};

var subscription = stream.scan(maintainCardinality, 0)// update counter
                     .subscribe(value => console.log(value));// output counter
```

The current number of entities in the result set will be printed to the console whenever a change occurs.

<div class="tip"><strong>Tip:</strong>
Count maintenance is a good example where it makes sense to not subscribe to the default match types (<code>['all']</code>), because you are actually only interested in <code>add</code> and <code>remove</code> events: To restrict the events you will receive to those that really matter, register the streaming query with <code>.stream({matchTypes: ['add', 'remove']})</code>.
</div>

#### Average

Now to a more complex example: Let's say you are interested in the **average number of activities** of each of the todo lists matching your query.

```js
var initialAccumulator = {
  contributors: {},// individual activity counts go here
  count: 0,// result set cardinality
  sum: 0,// overall number of activities in the result
  average: 0// computed as: sum/count
};
```

The accumulator is not just an integer, but an object with several values: For maximum precision, we maintain the overall number of activities (`sum`) and result cardinality (`count`) separately and compute the `average` fresh on every event. We remember the number of activities for every individual entity in a map (`contributors`); this is necessary, because otherwise we would not have a clue by how much to decrement `sum` when an entity is updated or leaves the result set.

```js
var maintainAverage = (accumulator, event) => {
  var newValue = event.matchType === 'remove' ? 0 : event.data.activities.length;
  var oldValue = accumulator.contributors[event.data.id] || 0;//default: 0

  if (newValue !== 0) {// remember new value
    accumulator.contributors[event.data.id] = newValue;
  } else {// forget old value
    delete accumulator.contributors[event.data.id];
  }
  accumulator.sum += newValue - oldValue;
  accumulator.count += event.matchType === 'remove' ? -1 : event.matchType === 'add' ? 1 : 0;
  accumulator.average = accumulator.count > 0 ? accumulator.sum / accumulator.count : 0;
  return accumulator;
};
```
 
The maintenance function extracts the current number of activities (`newValue`) from the incoming event and the former value (`oldValue`) from the `contributors` map in the accumulator. Depending on whether the incoming entity contributes to the average or not, it either stores the new value in the map or removes the old value. Finally, `sum` and `count` are updated and the average is computed and stored as `accumulator.average`. 
 
Since we are only interested in the average value, we add another step to extract it from the accumulator via the `map` operator:

```js
var subscription = stream.scan(maintainAverage, initialAccumulator)//update counter
                           .map(accumulator => accumulator.average)//extract average
                           .subscribe(value => console.log(value));//output counter
```

## Limitations

Streaming is available for all queries with the following limitations:

- The initial result of a streaming query is limited to *500 objects*. Streaming sorting queries therefore require a `limit` predicate (the sum of `offset` and `limit` may not exceed 500). 
- Currently, *streaming sorting queries only return public data*, even when executed with admin privileges; to retrieve private data, use non-streaming sorting queries or streaming queries that do not contain `limit`, `offset`, `ascending`, `descending` or `sort`.
- Geospatial queries (`withinSphere`, `withinPolygon`) are currently not available for streaming


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

## Login and Logout

When a user is already registered, he can login with the `DB.User.login()` method. 
```js
DB.User.login('john.doe@example.com', 'MySecretPassword').then(function() {
  //Hey we are logged in again
  console.log(DB.User.me.username); //'john.doe@example.com'  
});
```  

After the successful login a session will be established and all further requests to Baqend are authenticated 
with the currently logged-in user.

Sessions in Baqend are stateless, that means a user is not required to logout in order to close the session. When a
session is started a session token with a specified lifetime is created. If this lifetime is exceeded, the session 
is closed automatically. A logout just locally deletes the session token and removes the current `DB.User.me` object.
```js
DB.User.logout().then(function() {
  //We are logged out again
  console.log(DB.User.me); //null
});
```

## New Passwords

Password can be changed by giving the old password and specifying the new one. Admin users can change the passwords of all users without giving the previous one:
```js
//Using the user name
DB.User.newPassword("Username", "oldPassword", "newPassword").then(()=> {
    //New Password is set
});

//Using a user object
DB.User.me.newPassword("oldPassword", "newPassword").then(...);

//When logged in as an admin
DB.User.newPassword("Username", null, "newPassword").then(...);
```

## Auto login

During initialization the Baqend SDK checks, if the user is already registered and has been logged in. A
new user is anonymous by default and no user object is associated with the DB. Returning users are
automatically logged in and the `DB.User.me` object is present.
```js
DB.ready(function() {
  if (DB.User.me) {
    //do additional things if user is logged in
    console.log('Hello ' + DB.User.me.username); //the username of the user
  } else {
    //do additional things if user is not logged in
    console.log('Hello Anonymous');
  }
});
```

## Roles

The Role class is also a predefined class which has a `name` and  a `users` collection. The users collection 
contains all the members of a role. A user has a specified role if he is included in the roles `users` list. 

```js
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

##Predefined Roles

There are three predefined roles:

- `admin` - Users belonging to this role (e.g. the root) have full access to everything
- `loggedin` - Every user who is logged in, automatically has this role. The role can be used to require a user to have a logged-in account to perform certain actions.
- `node` - When an operation is triggered by a handler or module, the roles of the user who triggered that request are enhanced by the node role. 

Predefined roles can be used just like normal roles. Typical use-case are that you define schema-level permissions to elevate rights of operations triggered by handlers and modules, allow certain things to logged-in users or restrict access to admins.

<div class="note"><strong>Note:</strong> The node role does not have any special privileges by default, but you can use it in ACLs to give it special rights.</div>

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

<div class="table-wrapper"><table class="table">
  <tr>
    <th width="25%">Method</th>
    <th width="50%">Class-based permission</th>
    <th>Object-based permission</th>
  </tr>
  <tr>
    <td><code>.load()</code></td>
    <td>type.loadPermission</td>
    <td>object.acl.read</td>
  </tr>
  <tr>
    <td><code>.find()</code></td>
    <td>type.queryPermission</td>
    <td>object.acl.read</td>
  </tr>
  <tr>
    <td><code>.insert()</code></td>
    <td>type.insertPermission</td>
    <td>-</td>
  </tr>
  <tr>
    <td><code>.update()</code></td>
    <td>type.updatePermission</td>
    <td>object.acl.write</td>
  </tr>
  <tr>
    <td><code>.delete()</code></td>
    <td>type.deletePermission</td>
    <td>object.acl.write</td>
  </tr>
  <tr>
    <td><code>.save()</code></td>
    <td>type.insertPermission if the object is inserted<br>
      type.updatePermission if the object is updated
    </td>
    <td>object.acl.write</td>
  </tr>
  <tr>
    <td><code>.save({force: true})</code></td>
    <td>both type.insertPermission and type.updatePermission will be checked</td>
    <td>object.acl.write</td>
  </tr>
</table></div>

**Note**: There is currently no way to check if a user has permissions to perform an operation without actually 
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

## OAuth login

Another way to login or register is via a 'Sign in with' - 'Google' or 'Facebook' button. 
In general any OAuth provider can be used to authenticate and authorise a user. 
As of now, Baqend supports five providers. 

### Setup
To set them up, you need to register your applications on the provider's 
website. The provider generates a client ID and a client secret. You can find them on the provider's website after 
registration. There is also a text field where you need to add a redirect URL.
Add `https://[APP_NAME]-bq.global.ssl.fastly.net/v1/db/User/[PROVIDER]` (with *APP_NAME* and *PROVIDER* substituted) and 
copy the client ID and client secret into the settings page of the dashboard. 

 <div class="table-wrapper"><table class="table">
    <tr>
        <th colspan="2">Provider Setup</th>
        <th>Notes</th>
    </tr>
    <tr>
        <td>[google](https://console.developers.google.com/project/_/apiui/credential)</td>
        <td>[docs](https://support.google.com/cloud/answer/6158849?hl=de&ref_topic=6262490)</td>
        <td>Add as redirect URL: <br> `https://[APP_NAME]-bq.global.ssl.fastly.net/v1/db/User/OAuth/google`</td>
    </tr>
    <tr>
        <td>[facebook](https://developers.facebook.com/apps)</td>
        <td>[docs](https://developers.facebook.com/docs/facebook-login/v2.4)</td>
        <td>
            To set up Facebook-OAuth open the settings page of your 
            [Facebook app](https://developers.facebook.com/apps), switch to *Advanced*, activate *Web OAuth Login* and 
            add <br> `https://[APP_NAME]-bq.global.ssl.fastly.net/v1/db/User/OAuth/facebook` <br> as *Valid OAuth redirect URI*. 
        </td>
    </tr>
    <tr>
        <td>[github](https://github.com/settings/applications)</td>
        <td>[docs](https://developer.github.com/v3/oauth/)</td>
        <td>Add as redirect URL: <br> `https://[APP_NAME]-bq.global.ssl.fastly.net/v1/db/User/OAuth/github`</td>
    </tr>
    <tr>
        <td>[twitter](https://apps.twitter.com/)</td>
        <td>[docs](https://dev.twitter.com/oauth/overview/faq)</td>
        <td>Add as redirect URL: <br>`https://[APP_NAME]-bq.global.ssl.fastly.net/v1/db/User/OAuth/twitter`
            Twitter dose not support E-Mail scope. In default case a uuid is set as username.
        </td>
    </tr>
    <tr>
        <td>[linkedin](https://www.linkedin.com/secure/developer?newapp=)</td>
        <td>[docs](https://developer.linkedin.com/docs/oauth2)</td>
        <td>Add as redirect URL: <br> `https://[APP_NAME]-bq.global.ssl.fastly.net/v1/db/User/OAuth/linkedin`</td>
    </tr>
</table></div>

OAuth is a way to delegate rights of third party resources owned by users to your application. A simple login always 
receives a token and requests basic information including the unique user ID. The public profile information 
is the most restricted scope a provider can offer. All supported providers (except Twitter) have a public profile + email scope 
which is the default in the Baqend SDK. The Baqend server checks if an email is in the allowed scope and sets it as the
username. For Twitter or if you change the scope within the frontend an uuid will be created as username.

### Login

On the client side, trigger `DB.User.loginWithGoogle(clientID [, options])` to start the OAuth login process. The call 
opens a new window showing the provider-specific login page. To work despite popup blockers the 
call needs to be made on response to a user interaction, e.g. after a click on the sign-in button. Similarly to a 
register or a login call, a promise is returned that completes with the logged-in user. The OAuth login does not 
distinguish between registration and login.

```js
//DB.User.loginWithGoogle(...)
//DB.User.loginWithFacebook(...)
//DB.User.loginWithGitHub(...)
//DB.User.loginWithTwitter(...)
//DB.User.loginWithLinkedIn(...)
DB.User.loginWithGoogle(clientID).then(function(user) {
  //logged in successfully
  db.User.me == user;
});
```

<div class="note"><strong>Note:</strong> An OAuth login will be aborted after 5 minutes of inactivity. The timeout can be changed with the timeout option.</div>

### Baqend Code

To adjust the registration and login behavior an `oauth.[PROVIDER]` Baqend module will appear in your dashboard,
after activating the provider. The passed parameters are the current logged in user and a data object containing the 
OAuth token and basic user information. The token can be used to directly do further API calls or save the token for 
later use.

If you like to edit the OAuth login for example google, create the baqend module `oauth.google`. An oauth template will be
shown up where you can edit the behaviour after the user has been successfully authorized:

```js
exports.call = function(db, data, req) {
    //db.User.me the unresolved user object of the created or logged in user

    //data conatins the profile data send by the OAuth provider
    //data.id The OAuth unique user id
    //data.access_token The OAuth users API token
    //data.email The users email if the required scope was requested by the client
};
```

The following table list the docs the returned profile for the OAuth providers:

 <div class="table-wrapper"><table class="table">
  <tr>
    <th>Provider</th>
    <th>Profile documentation</th>
  </tr>
  <tr>
    <td>google</td>
    <td>
      Just returns the email per default. 
      Visit [OAuth 2.0 Scopes for Google APIs](https://developers.google.com/identity/protocols/googlescopes) for a 
      complete list of supported scopes.
    </td>
  </tr>
  <tr>
    <td>facebook</td>
    <td>Returns the content of the 
    [https://graph.facebook.com/v2.4/me](https://developers.facebook.com/docs/graph-api/reference/v2.4/user) resource</td>
  </tr>
  <tr>
    <td>github</td>
    <td>Returns the [authenticated user profile](https://developer.github.com/v3/users/#get-the-authenticated-user)</td>
  </tr>
  <tr>
    <td>twitter</td>
    <td>Just returns the `access_token`. An Email address can't be queried with the twitter API.</td>
  </tr>  
  <tr>
    <td>linkedin</td>
    <td>
      Returns the content of the 
      [https://api.linkedin.com/v1/people/~?format=json](https://developer.linkedin.com/docs/rest-api) resource.
    </td>
  </tr>  
</table></div>    


<div class="note"><strong>Note:</strong> The returned properties depend on the requested scope.</div>


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

<div class="note"><strong>Note:</strong> Inside Baqend Code data operations (e.g. <code>user.save()</code>) have the access rights of the user starting the 
request enhanced by an additional <code>node</code> role. Calls to Baqend originating from handlers will not trigger another 
<code>onUpdate(db)</code> call. See <a href="#predefined-roles">Predefined Roles</a> for more details.</div>

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
The `body` parameter passed into the function contains the request payload, i.e. the decoded query parameters of a GET request or the parsed body of a `POST` request.

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

In addition to the simplified `call(db, obj, req)` method we provide an advanced way to handle requests within baqend modules. 
You can implement GET and POST request handling separately by implementing a equivalent `get(db, req, res)` and 
`post(db, req, res)`. 

<div class="note"><strong>Note:</strong> that the second parameter is the request object and the third parameter is an express 
<a href="http://expressjs.com/api.html#res">response</a> object.</div>

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

## Handling binary data

As a part of the advanced request handling, it is also possible to upload and download binary files in baqend modules. 

To send binary data to your baqend module, you can specify the 'requestType' option. 
With the 'responseType' option you can receive binary data in the specified type from your baqend module. 
This works similar to the file API and you can use all the listed [file types](#files) as 'requestType' and 'responseType' too.

```js
var svgBase64 = 'PHN2ZyB4bWxucz0...';
var mimeType = 'image/svg+xml';

return db.modules.post(bucket, svgBase64, {
  requestType: 'base64',    //Sending the file as a base64 string 
  mimeType: mimeType,       //Setting the mimeType as Content-Type
  responseType: 'data-url'  //Receiving the data as a data-url
}).then(function(result) {
  result // 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0...'
});
```

To handle the binary files in a baqend module, you must process the incoming raw stream directly. The incoming request 
object is a node.js [Readable Stream](https://nodejs.org/api/stream.html#stream_readable_streams) and you will receive 
the incoming raw data as [Buffer](https://nodejs.org/api/buffer.html) chunks.

To send binary data back to the client, you should set the Content-Type of the response data with the express 
[res.type()](http://expressjs.com/de/api.html#res.type) method and send the data afterwards.

If you have completed the request handling you need to resolve the previously returned promise to signal the completion 
of the request handling.

```js
//this simple baqend handler just sends the uploaded file back to the client
exports.post = function(db, req, res) {
  return new Promise(function(success) {
    //node gives the file stream as chunks of Buffer 
    var chunks = []; 
    req.on('data', function(chunk) {
      chunks.push(chunk);
    });
    req.on('end', function() {
      var requestData = Buffer.concat(chunks);
      // do something with the requestData
      res.status(200)
          .type(req.get('Content-Type'))
          .send(requestData); //sending some data back
      success();
    });
  });
};
```

## Importing code and libraries
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
//require an update (or insert, delete, validate) handler from 'MyClass'
var updateHandler = require('./MyClass/update');
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

The following additional libraries can always be required in baqend code:

- [http](https://nodejs.org/api/http.html) - Node.js http core library
- [https](https://nodejs.org/api/https.html) - Node.js https core library 
- [querystring](https://nodejs.org/api/querystring.html) - Node.js core querystring parsing and serialization library
- [crypto](https://nodejs.org/api/crypto.html) - Node.js core crypto api offers a way of encapsulating secure credentials 
- [baqend](http://www.baqend.com/js-sdk/latest/baqend.html) - The Baqend SDK
- [express](http://expressjs.com/4x/api.html) - HTTP server
- [twilio](http://twilio.github.io/twilio-node/) - APIs for Text Messaging, VoIP & Voice in the Cloud 
- [lwip](https://github.com/EyalAr/lwip/) - a Light Weight Image Processor for NodeJS
- [node-mailjet](https://github.com/mailjet/mailjet-apiv3-nodejs) [API v3](https://dev.mailjet.com) Official Mailjet API v3 NodeJS wrapper 

<div class="note"><strong>Note:</strong> If you need custom Node.js modules from npm, please contact us via <a href="mailto:support@baqend.com">support@baqend.com</a> and we will add them.</div>

## Permissions

Baqend Code is always executed with the permissions of the requesting client. If the requesting user is not logged in, 
all requests made from Baqend code are anonymous. Both anonymous and authenticated invocations are enhanced by the node 
role. This predefined role can be used in class and object ACLs to grant Baqend code additional access rights. 
In addition there are some Baqend API resources which can only be accessed by the admin or the node role. 

# Push Notifications

Baqend provides the ability to send push notifications to end users devices. Before you can send a push notification you 
must first register the Device of the User. Registered devices can then later be used in baqend Code to send push 
notifications to. 

<div class="note"><strong>Note:</strong> Currently Baqend supports IOS and Android devices, support for more platforms are planed. </div>

## Setup Push

### Apple Push Notifcation Service (APNS)

To enable push notifications for iOS devices you have to upload your production or sandbox certificate in the
baqend settings view of your app. Please upload your certificate as a *p12*-file without any password protection. Otherwise it's
not possible for baqend to use it.

The sandbox certificate is needed, when testing the app directly from Xcode. If the app has been published to the app
store or should be tested in *TestFlight*, you must upload your production certificate. It's currently not possible
to use both certificate types at the same time.

[This tutorial](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/AddingCapabilities/AddingCapabilities.html#//apple_ref/doc/uid/TP40012582-CH26-SW6)
show hows to enabled push notification in your app and how to export your certificate as a *p12*-file.

### Google Cloud Messaging (GCM)

To enabled push notifications for Android devices baqend needs your GCM API key. The key can be saved in the baqend settings
view of your app.

To get your API key browse to the [Google Developers Console](https://console.developers.google.com/), open
*Enable and manage APIs*, create or chose your app, click on *Credentials* on the left side. If you already created
an server key, copy it from the list and save it at the baqend settings view of your app, otherwise click on
*Create credentials* -> *API key* -> *Server key* to create a new api key. It's important, that the field
*Accept requests from these server IP addresses* is empty.

In your app itself you have to use the *sender ID* and not the server API key. The *sender ID* is called *project number*
in the Google Developers Console.

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
 
 <div class="table-wrapper"><table class="table">
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
    <td>Additional json data send directly to your app</td>
  </tr>
</table></div>    

## Sending push

Push notifications can only be send within [baqend code](#baqend-code). To send a push notification to one or more devices, you must 
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
  console.log(firstTodo.upComingTodos[0].name); 
});
``` 

To load dependant objects, you can pass the `depth` option while loading the entity. The depth option allows to 
set a reference-depth which will automatically be loaded. A depth value of `0` (the default) just loads the entity. 
```js
DB.Todo.load('7b2c...', {depth: 0}).then(function(firstTodo) {   
  //will throw an object not available error
  console.log(firstTodo.doNext.name); 
  //will still throw an object not available error
  console.log(firstTodo.upComingTodos[0].name); 
});
```

A depth value of `1` loads the entity and one additional level of references. This also includes references in 
collections and embedded objects.
```js
DB.Todo.load('7b2c...', {depth: 1}).then(function(firstTodo) {
  console.log(firstTodo.doNext.name); //'My second Todo'
  console.log(firstTodo.upComingTodos[0].name); //'My second Todo'  
  //will throw an object not available error
  console.log(firstTodo.doNext.doNext.name); 
  //will still throw an object not available error
  console.log(firstTodo.upComingTodos[0].upComingTodos[0].name); 
});
```

Setting the depth value to `2` resolves the next level of references and so on. You can set the depth option to `true` to
load all references by reachability. But be aware of that is dangerous for large object graphs. 

## Deep Loading with Queries

Deep loading also works for query results obtained via `resultList` and `singleResult`:

```js
DB.Todo.find().resultList({depth: 1}, function(result) {
  result.forEach(function(todo) {
    console.log(todo.doNext.name);
  });
});
```

In that case all referenced objects in all objects loaded by the query are fetched, too.

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


# Hosting

With the hosting feature you can serve your website (html, css, js, images) right from your Baqend cloud instance while using your own domain.

### Public File Access

All assets stored in the **www** root folder can be accessed under your app domain (`<appName>.app.baqend.com`) as in the following examples:


 <div class="table-wrapper"><table class="table">
  <tr>
    <th>Folder (`folder`)</th>
    <th>File Name (`name`)</th>
    <th>Public Url</th>
  </tr>
  <tr>
    <td>www</td>
    <td>index.html</td>
    <td>&lt;appName&gt;.app.baqend.com/</td>
  </tr>
  <tr>
    <td>www</td>
    <td>about.html</td>
    <td>&lt;appName&gt;.app.baqend.com/about.html</td>
  </tr>
  <tr>
    <td>www/images</td>
    <td>logo.jpg</td>
    <td>&lt;appName&gt;.app.baqend.com/images/logo.jpg</td>
  </tr>
</table></div>


<div class="tip"><strong>Tip:</strong> Baqend hosting works great with <b>static site generators</b> like <a href="https://jekyllrb.com/">Jekyll</a>, <a href="http://octopress.org/">Hugo</a>, <a href="http://octopress.org/">Octopress</a> or <a href="https://hexo.io/">Hexo</a>. You can start completely static or even import data from CMS like Wordpres. Later you can gradually add dynamic parts using the Baqend SDK. From the first static blog post to a highly dynamic site, everything will be cached and accelerated by Baqend.</div>


### Custom Domains

To serve your website under your own domain you have to create a dns entry and register the custom domain in your Baqend dashboard:

1. Log into the account at your domain provider and add a CNAME rule like the following to your DNS entries:

    `www.yourdomain.com. IN CNAME global.prod.fastly.net.`

    **Note**: You should not use a top level domain as a CNAME, since many DNS providers do not support it. Instead use a sub domain
such as **www.**yourdomain.com. In addition you should ensure that no other DNS-entry is set for the used domain.

2. Log into your Baqend dashboard and open your app settings. In the Hosting section simply add your custom domain `www.yourdomain.com` and click the save button. Your domain will now be registered at the CDN. Instead of `<appName>.app.baqend.com` you can now use `www.yourdomain.com`.

Consult your DNS provider's instructions to configure the CNAME record for your domain name. The steps to add a CNAME record will vary for each registrar's control panel interface.

If you cannot find your provider's CNAME configuration instructions, Google maintains instructions for [most major providers](https://support.google.com/a/topic/1615038). 



<div class="note"><strong>Note:</strong> The registration of your domain as well as your dns-entry can take a few minutes until they are accessable. If you have trouble configuring your CNAME records, contact us at <a href="maito:support@baqend.com">support@baqend.com.</a></div>


### SSL Hosting

All data accessed over the Baqend SDK is SSL encrypted by enforcing encryption at [connect](#connect_the_sdk). If you need SSL encryption for your hosted assets too please contact us ([support@baqend.com](mailto:support@baqend.com?subject=SSL%20Hosting)), as this feature is not automated yet.

# Files

Baqend comes with a powerful File and Asset API. You can create multiple root level folders and apply different 
permissions to those. Files can be uploaded, replaced, downloaded and deleted when the user has the right permissions. 

In addition the SDK comes with a rich set of functionality to transform the file contents to different browser friendly 
formats. In the following table we list all supported file formats:

<div class="table-wrapper"><table class="table">
  <tr>
    <th>type</th>
    <th>JavaScript type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>'arraybuffer'</td>
    <td>ArrayBuffer</td>
    <td>The content is represented as a fixed-length raw binary data buffer<br>
    <code>var buffer = new ArrayBuffer(8)</code></td>
  </tr>
  <tr>
    <td>'blob'</th>
    <td>Blob|File</td>
    <td>The content is represented as a simple blob<br>
    <code>var blob = new Blob(["&lt;a href=..."], {type : 'text/html'})</code></td>
  </tr>
  <tr>
    <td>'json'</td>
    <td>object|array|string</td>
    <td>The file content is represented as json<br>
      <code>var json = {prop: "value"}</code></td>
  </tr>
  <tr>
    <td>'text'</td>
    <td>string</td>
    <td>The file content is represented through the string<br>
    <code>'A Simple Text'</code></td>
  </tr>
  <tr>
    <td>'base64'</td>
    <td>string</td>
    <td>The file content as base64 encoded string<br>
    <code>'PHN2ZyB4bWxucz...'</code></td>
  </tr>
  <tr>
    <td>'data-url'</td>
    <td>string</td>
    <td>A data url which represents the file content<br>
    <code>'data:image/gif;base64,R0lGODlhD...'</code></td>
  </tr>
</table></div>

The file API accept all the listed formats as upload type and transforms the content to the correct binary representation 
while uploading it. The SDK guesses the correct type except for the `base64` type and transforms it automatically. 

When you download a file you can specify in which format the downloaded content should be provided.

## Accessing Files

The simplest way to access a file is retrieve the absolute url form the baqend SDK. Therefore you can use any existing 
file reference or you can create one by yourself. 

```js
//creates the same file reference
//each file reference starts with /file followed by the root folder, e.g. /www
var file = new DB.File('/file/www/myPic.jpg');
var file = new DB.File({name: 'myPic.jpg'});
```

To get the full url to access the file just use the `file.url` shorthand. This ensures that the domain is correctly used, 
checks if the file is stale or can be directly served form the cache and attach authorization credentials if needed. 

In a common html template engine you can just write:
```html
<img src="{{file.url}}">
```

If you manager your files in folders you can access them by adding the folder property:

```js
//creates the same file reference
var file = new DB.File('/file/www/images/myPic.jpg');
//folders start with the root folder, e.g. /www and followed by additional folders
var file = new DB.File({folder: '/www/images', name: 'myPic.jpg'});
```

Note that folders always start with a root folder, since the access control who can access and modify the folder contents 
can only be set for the root folder and is applied to all nesting files and folders.

## Uploading Files

To upload a file you must first create a file with it name and its content.
Afterwards you can simply upload the file by just invoking `upload()`:

```js
var file = new DB.File({name: 'test.png', data: file, type: 'blob'})
file.upload().then(function(file) {
    //upload succeed successfully 
    file.mimeType //contains the media type of the file
    file.lastModified //the upload date
    file.eTag //the eTag of the file
}, function(error) {
    //upload failed with an error 
});
```

In most cases you would like to upload the files which was provided by your user through a file input field or a file 
drag & drop event. 

```html
<input type="file" id="input" multiple onchange="uploadFiles(this.files)">
```

```js
function uploadFiles(files) {
  var pendingUploads = [];

  for (var i = 0, numFiles = files.length; i < numFiles; i++) {
    //If you omit the name parameter, the name of the provided file object is used
    var file = new DB.File({data: files[i]});
    pendingUploads.push(file.upload());
  }
  
  Promise.all(pendingUploads).then(function() {
    //all files are successfully uploaded
  });
}
```

In the cases you want to upload base64 encoded binary data you can use the base64 type in the options object:

```js
var file = new DB.File({name: 'test.png', data: 'R0lGODlhDAAeALMAAG...', type: 'base64', mimeType: 'image/gif'})
file.upload().then(function(file) {
    //upload succeed successfully 
    file.mimeType //contains the media type of the file
    file.lastModified //the upload date
    file.eTag //the eTag of the file
}, function(error) {
    //upload failed with an error 
});
```

If you try to overwrite an existing file and do not have previously fetched the file or its metadata, or the file has 
been changed in the meantime the upload will be rejected to prevent accidental file replacement. 
If you like to skip the verification, you can pass the `{force: true}` option to the `upload()` call. 

<div class="note"><strong>Note:</strong> To upload a file you must have at least the insert or update permission on the root folder and write access on the file. </div>

## Downloading Files

Downloading a file works similar to uploading one. Just create a file reference and call `file.download()`:

```js
var file = new DB.File({name: 'myPic.jpg'});
file.download(function(data) {
    data //is provided as Blob per default

    //accessing the metadata of the file 
    file.mimeType //contains the media type of the file
    file.lastModified //the upload date
    file.eTag //the eTag of the file
});
```

To load the file content in a different format, just request a download `type`

```js
var file = new DB.File({name: 'myPic.jpg', type: 'data-url'});
file.download(function(data) {
    //data is a data url string
    data // "data:image/jpeg;base64,R0lGODlhDAA..."
});
```

<div class="note"><strong>Note:</strong> To download a file you must have at least the load on the root folder and read access on the file. </div>

## Deleting Files

To delete a file just call the `delete()` method after creating the file reference:

```js
var file = new DB.File({name: 'test.png'})
file.delete().then(function(file) {
    //deletion succeed
}, function(error) {
    //upload failed with an error 
});
```

If you try to delete a file and you have previously fetched the file or its metadata and the file has 
been changed in the meantime the deletion will be rejected to prevent accidental file deletions. 
If you like to skip the verification, you can pass the `{force: true}` option to the `delete()` call. 

## File ACLs

The File Permissions works similar to the object acls, you can define permissions on the root folders similar to class-based 
permissions and file permissions similar to object level permissions.

The root folder permissions are applied to all nesting folders and files.

### File Permissions

The following table gives an overview of the required permissions per operation:

<div class="table-wrapper"><table class="table">
  <tr>
    <th width="30%">Method</th>
    <th width="40%">Root-folder-based permission</th>
    <th>File-based permission</th>
  </tr>
  <tr>
    <td><code>.download(), .url</code></td>
    <td>folder.load</td>
    <td>object.acl.read</td>
  </tr>
  <tr>
    <td><code>.upload(&lt;new file&gt;)</code></td>
    <td>folder.insert</td>
    <td>-</td>
  </tr>
  <tr>
    <td><code>.upload(&lt;existing file&gt;)</code></td>
    <td>folder.update</td>
    <td>object.acl.write</td>
  </tr>
  <tr>
    <td><code>.upload({force: true})</code></td>
    <td>both folder.insert and folder.update will be checked</td>
    <td>object.acl.write</td>
  </tr>
  <tr>
    <td><code>.delete()</code></td>
    <td>folder.delete</td>
    <td>object.acl.write</td>
  </tr>
</table></div>

### Set root folder Permissions

Per default only the admin can access root folders with one exception. The `www` folder is public readable for the file 
hosting feature of baqend.

To change the permissions for a specific root folder yous should commonly use the Baqend Dashboard. 
But if you like to change the permissions programmatically you can use the `saveMetadata()` method:

```
//grant full access on the pictures root folder for the current user
DB.File.saveMetadata('pictures', {
   load: new DB.util.Permission().allowAccess(db.User.me),
   insert: new DB.util.Permission().allowAccess(db.User.me),
   update: new DB.util.Permission().allowAccess(db.User.me),
   delete: new DB.util.Permission().allowAccess(db.User.me),
   query: new DB.util.Permission().allowAccess(db.User.me)
});
```

<div class="note"><strong>Note:</strong> To actually change the permissions of a root folder, you must own the admin role or you code must be executed 
as Baqend code.</div>

### Set file Permissions

The file permissions can be set when a file is uploaded. Therefore you can pass the acl option to the File constructor 
or to the upload method. 

```js
var file = new DB.File({
    name: 'test.png', 
    data: file, 
    acl: new DB.Acl()
        .allowReadAccess(db1.User.me)
        .allowWriteAccess(db1.User.me)
});
file.upload().then(...);
```


# Caching

## How Baqends Caching works

Baqend uses a combination of CDN and client caching using a Bloom filter-based data structures called **Cache-Sketch**. This enables Baqend-based applications to use not only CDN caches but also expiration-based caches  —  in most cases the browser cache  —  to cache any _dynamic_ data.

### Caching everything, not just assets

The tricky thing when using such caches is that you must specify a cache lifetime (TTL) when you first deliver the data from the server. After that you do not have any chance to kick the data out. It will be served by the browser cache up to the moment the TTL expires. For static assets it is not such a complex thing, since they usually only change when you deploy a new version of your web application. Therefore, you can use cool tools like [gulp-rev-all](https://github.com/smysnk/gulp-rev-all) and[grunt-filerev](https://github.com/yeoman/grunt-filerev) to hash the assets. By renaming the assets at deployment time you ensure that all users will see the latest version of your page while using caches at their best

But wait! What do you do with all the data which is loaded and changed by your application at runtime? Changing user profiles, updating a post or adding a new comment are seemingly impossible to combine with the browsers cache, since you cannot estimate when such updates will happen in the future. Therefore, caching is just disabled or very low TTLs are used.

<img src="img/normal-caching.png" style="width: 100%;">

#### Baqend’s Cache-Sketch

We have researched and developed a solution where we can check the staleness of any data before we actually fetch them. At the begin of each user session the `connect`call fetches a very small data structure called a Bloom filter, which is a highly compressed representation of a set. Before making a request, the SDK first checks this set to know if it contains an entry for the resource we fetch. An entry in the set indicates that the content was changed in the near past and that the content may be stale. In such cases the SDK bypasses the browser cache and fetches the content from the nearest CDN edge server. In all other cases the content is served directly from the browsers cache. Using the browser cache saves network traffic, bandwidth and is rocket-fast.

In addition, we ensure that the CDN always contains the most recent data, by instantly purging data when it becomes stale.

<img src="img/cache-sketch.png" style="width: 100%;">

The [Bloom filter](http://de.slideshare.net/felixgessert/bloom-filters-for-web-caching-lightning-talk) is a probabilistic data structure with a tunable false positive rate, which means that the set may Indicate containment for objects which were never added. This is not a huge problem since it just means the we first revalidate the freshness of an object before we serve it from the browsers cache. Note that the false positive rate is very low and it is what enables us to make the footprint of the set very small. For an example we just need 11Kbyte to store 20,000 distinct updates.

There is lot of stream processing (query match detection), machine learning (optimal TTL estimation) and distributed coordination (scalable Bloom filter maintenance) happening at the server side. If you’re interested in the nitty-gritty details have a look at this [paper](http://www.baqend.com/paper/btw-cache.pdf) or [these slides](http://de.slideshare.net/felixgessert/talk-cache-sketches-using-bloom-filters-and-web-caching-against-slow-load-times) for a deep-dive.

<div class="note"><strong>Note:</strong> Caching is active for all CRUD operations by default. Query Caching is currently in beta, if you would like to test it please contact <a href="mailto:support@baqend.com">support@baqend.com</a>.</div>


## Configuring Freshness

Any new page load will always return the newest data (a fresh Bloom filter is fetched). While the app is running you can allow a configurable maximum staleness to make optimal use of the browser cache. This does not mean that you will actually see any outdated content, it just provides you with an upper bound that is never exceeded.

There are two settings affecting Bloom filter freshness that can be configured in the dashboard:

 - *Maximum CDN staleness*: this is the staleness bound for all new clients (i.e. that have not cached a Bloom fitler, yet). The default setting is to only do micro-caching of 1 second. This incurs 1 second of staleness at the maximum and protects the server from excessive load under high user volumes.
 - *Maximum total staleness*: defines the maximum staleness seen by the client (CDN staleness + client cache staleness). Internally the client makes sure to update the Bloom filter, when it gets too old.

<div class="tip"><strong>Tip:</strong> You can increase both staleness settings, if your application is under very heavy load. This saves you requests and prevents scalability bottlenecks if you are in the free tier.</div>

If you want to override the total staleness in individual clients, you can set it manually:

```js
DB.configure({
    staleness : 10
}).connect().then(...);
```

For individual operations you can optionally bypass the cache to get **strong consistency** (linearizability):

```js
//To get the newest version via the id
var todo = DB.Todo.load("myTodo", {refresh : true });

//To update a known instance to the latest version
todo.load({refresh : true });
```

## Local Objects

You can request already loaded objects using the `local` flag. It will try to give you an instance you have already loaded and only load it, if it's not present:
```js
//If we have seen "myTodo" in the code we will get exactly that instance
DB.Todo.load("myTodo", {local : true }).then(...);

//local is the default for the instance method
todo.load().then(...);

//This is also useful to see your own unsaved changes, irrespective of updates from other users
todo.done = true;
DB.Todo.load("myTodo", {local : true }).then(function() {
    console.log(todo.done); // true
});
```



# Logging

As required by many apps, we provide a easy to use logging API to log data out of your app. In addition we provide a 
access to the access logs which contains all the resources requested by your users.

App and Access logs are accessible through the dashboard and kept for **30 days**. In addition you can view, query and 
manage the permissions of the logs like any other data you persist to baqend. But you can't modify the schema, the 
logged data nor the permissions of insert, update and delete operations.

<div class="note"><strong>Note:</strong> When querying logs you must always use a date predicate, otherwise you will only get the last 5 minutes of 
the logs.</div>

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

It is easy to include dynamic data into the log message. You can use placeholder in your log message which will be
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

<div class="note"><strong>Note:</strong> App logs can be inserted by everyone by default, to restrict log insertion you can change the insert permission
of the AppLog class in the dashboard.</div>

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

#!["Logo"](/img/angular+baqend.svg) Angular2 and Baqend Starter

With this Angular2 and Baqend starter kit you can build **blazingly fast single page applications** in no time. Setup your project by following the simple steps below.

The starter is based on the [Angular2 Webpack Starter](https://github.com/AngularClass/angular2-webpack-starter) and uses:

* [**Webpack**](http://webpack.github.io) as a great module bundler
* [**SASS**](http://sass-lang.com) as a CSS precompiler with cool features and syntax
* [**TypeScript**](https://www.typescriptlang.org) for typed JavaScript, ES6 features and because it is recommended for Angular2
* [**Bootstrap**](http://getbootstrap.com) for easy modern styling
* [**Baqend**](http://www.baqend.com) as a fully managed backend service for backend-less development

## How to use the template

1. Make sure you have [Node.js](https://nodejs.org/en/) installed on your machine
2. Clone the repository with `git clone https://github.com/Baqend/angular2-starter.git`
3. Install the project with `npm install`
4. Start the server with `npm start` (or `npm run server:dev:hmr` for *hot module replacement* - only changed files are recompiled)
5. Open the url in your browser [http://localhost:3000](http://localhost:3000), you should see a small sample application with signup capability

Your app is currently connected to a Baqend test instance called 'app-starter', which provides common backend features like data and file storage, user authentication (used in the example), queries and push notifications among others.

To develop your own application

1. Launch a free Baqend instance at [baqend.com](http://dashboard.baqend.com/register)
2. Change the app name in your projects `src/app/db.service.ts` from `app-starter` to your app name
3. Your Angular2 app will automatically connect to your app instance
4. To start accessing data or backend features, simply import the `db`-object with `import {db} from "baqend";`
and see our [Guide](http://www.baqend.com/guide/#accessing-data) and [API Docs](http://www.baqend.com/js-sdk/latest/baqend.html) for details

For more information: on [Angular2](https://angular.io/docs/ts/latest/), the structure of this
[project](https://github.com/AngularClass/angular2-webpack-starter) or [Baqend](http://www.baqend.com).

## How the Baqend integration into Angular2 works

Before the Baqend SDK can be used, a connection to the Baqend instance must be established. There are two options
to wait for the initialization.

1. You can use the `DBReady` resolver to delay the route component rendering, or `DBLoggedIn` to prevent navigation to
protected routes that are only accessible by logged in users. For a live example look into the `src/app/app.routes.ts`.

2. Or you can manually wait on `db.ready()` within your components and use the SDK afterwards.
```js
import {Component, OnInit} from '@angular/core';
import {db} from "baqend";

@Component({
  selector: 'myRoute'
})
export class MyRoute implement OnInit {

  ngOnInit(private router:Router) {
    db.ready().then(() => {
      db.MyClass.find()...
    });
  }
```

## How Baqend fits your Backend requirements

Baqend is a fully managed Backend-as-a-Service platform with a strong focus on performance and scalability ([click here for details](http://blog.baqend.com/post/139788321880/bringing-web-performance-to-the-next-level-an)). The [JavaScript API](http://www.baqend.com/js-sdk/latest/baqend.html) gives you access to common backend features while the [dashboard](http://www.baqend.com/guide/#baqend-dashboard) lets you define data models and access rules as well as business logic to execute on the server side.

Baqend's feature set includes:

* Automated Browser and CDN Caching
* Scalable Data Storage
* Realtime Streaming Queries
* Powerful Search and Query Language
* Push Notifications
* User Authentication and OAuth
* File Storage and Hosting
* Access Control on Object and Schema Level

# React, Redux and Baqend Starter
!["Logo"](https://github.com/Baqend/react-redux-starter/raw/master/react_baqend.png)

With this React, Redux and Baqend starter kit you can build **blazingly fast single page applications** in no time. Setup your project by following the simple steps below.

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## How to use the template

1. Make sure you have [Node.js](https://nodejs.org/en/) installed on your machine
2. Install the [yarn](https://yarnpkg.com) package manager with `npm install -g yarn` if you like
3. Clone the repository with `git clone https://github.com/Baqend/react-redux-starter`
4. Install the project with `npm install` or `yarn install`
5. Start the server with `npm start` or `yarn start`
6. Open the url in your browser [http://localhost:3000](http://localhost:3000), you should see a small sample application with signup capability

Your app is currently connected to a Baqend test instance called 'app-starter', which provides common backend features like data and file storage, user authentication (used in the example), queries and push notifications among others.

To develop your own application

1. Launch a free Baqend instance at [baqend.com](http://dashboard.baqend.com/register)
2. Change the app name in your projects `src/App.js` connect method from `app-starter` to your app name
3. Your React app will automatically connect to your app instance
4. To access your data or backend features it´s recommended to use the [redux-baqend-middleware](http://github.com) within your redux actions
5. You can also simply import the `db`-object with `import {db} from 'baqend'`
and see our [Guide](http://www.baqend.com/guide/#accessing-data) and [API Docs](http://www.baqend.com/js-sdk/latest/baqend.html) for details

For more information: on [React](https://facebook.github.io/react/docs/hello-world.html), [Redux](http://redux.js.org/), the structure of this
[project](https://github.com/facebookincubator/create-react-app), or [Baqend](http://www.baqend.com).


## How the Baqend integration into React works

Before the Baqend SDK can be used, a connection to the Baqend instance must be established. This can be easily done by adding the `baqendConnect` enhancer and the `baqendMiddleware` from [redux-baqend-middleware](http://github.com) to your store und use the connect method on your store object after creating it. You can find an example in `src/store/store.js` and `src/App.js`.

React works best when using serializable data structures, therefore it's recommended to convert your db objects into json objects before passing them to you redux store and update your objects from json, when you want to change them. You can either do it manually or let the middleware do it for you. The middleware will wait for your app to be connected before making the requests and dispatching your actions and pass the current db instance to your action methods. All the communication with your Baqend instance is made within your defined redux actions.

```js
return {
  'BAQEND': {
    type: MESSAGES_LOAD,
    payload: (db) => db.Message.find().resultList()
  }
}
```
For more detailed information take a look on the provided example actions or in the [redux-baqend-middleware](http://github.com) repository.


## How Baqend fits your Backend requirements

Baqend is a fully managed Backend-as-a-Service platform with a strong focus on performance and scalability
([click here for details](http://blog.baqend.com/post/139788321880/bringing-web-performance-to-the-next-level-an)).
The [JavaScript API](http://www.baqend.com/js-sdk/latest/baqend.html) gives you access to common backend features
while the [dashboard](http://www.baqend.com/guide/#baqend-dashboard) lets you define data models and access rules as
well as business logic to execute on the server side.

Baqend's feature set includes:

* Automated Browser and CDN Caching
* Scalable Data Storage
* Realtime Streaming Queries
* Powerful Search and Query Language
* Push Notifications
* User Authentication and OAuth
* File Storage and Hosting
* Access Control on Object and Schema Level

#License

[MIT](https://github.com/Baqend/react-redux-starter/blob/master/LICENSE)

#!["Logo"](/img/bootstrap-baqend.svg) Bootstrap Baqend Starter Kit

With [this starter project](https://github.com/Baqend/bootstrap-starter) you can easily build application based on:

- [Bootstrap](http://getbootstrap.com/) for a responsive, easy-to-use frontend
- [Baqend](http://www.baqend.com/) for hosting the application, storing data, managing users and executing server-side logic
- [Handlebars](http://handlebarsjs.com/) for templating and arranging your HTML in the client
- [Less](http://lesscss.org/) for powerfull CSS styling
- [Gulp](http://gulpjs.com/) for building, deploying and live-reloading

## How to use it

    $ git clone git@github.com:Baqend/bootstrap-starter.git
    $ cd bootstrap-starter
    $ npm install

Afterwards, run

    $ gulp

...for a local server with live-reloading anytime you change a file: [http://localhost:5000](http://localhost:5000)

If gulp cannot be found, you need to install it globally with `npm install -g gulp` or if you do not want to install gulp globally `npm run gulp`. If you do not have npm installed, [get it here](https://nodejs.org/en/).

## Connect to Baqend

By default this start connects to `toodle` the instance of the [Baqend tutorial](http://www.baqend.com/#tutorial). To change this go to app > js > main.js and change

```javascript
var app = 'toodle';
DB.connect(app);
```

to match your Baqend app. If you do not have one yet, start [one for free](https://dashboard.baqend.com/register).

The [Baqend guide](http://www.baqend.com/guide/) explains everything else you need to know.

## Deploy

You can easily deploy to Baqend via the command line, by installing it globally with `npm install -g baqend`. Then:

    $ gulp dist
    $ baqend login
    $ baqend deploy -f dist your-app-name

Your app is now published and available, exposing your `index.html` the URL `your-app-name.app.baqend.com`.

If you do not have `baqend` installed globally, you can also use the local version of Baqend:

    $ npm run dist -- build
    $ npm run baqend -- login
    $ npm run baqend -- -f dist your-app-name

**Note:** for now, you need an account registered via email, not via OAuth. If you do not have one, invite your email account via the *Collaboration* tab in the dashboard and use that account for the Baqend CLI.

## Example Tooling for developing with this project

1. Install [Webstorm](https://www.jetbrains.com/webstorm/).
2. Fork [this Github project](https://github.com/Baqend/bootstrap-starter) to have your own repository.
3. Clone your project via `git clone git@github.com:<your cloned repo>` and import that project folder via "File > New > Project from Existing Sources".
3. **Or:** use the dialog "File > New > Project from Version Control > Github" instead.
5. You can either use the Gulp plugin to run tasks or use the commands (e.g. `npm run gulp`) in the terminal.
6. Run gulp default (resp. `npm run gulp`) and navigate to [http://localhost:5000](http://localhost:5000) to see that it works.


#!["Logo"](https://github.com/Baqend/ionic2-starter/raw/master/ionic_baqend.png)

# Ionic 2 and Baqend Starter

With [this Ionic 2 and Baqend starter kit](https://github.com/baqend/ionic2-starter) you can build **blazingly fast hybrid apps** in no time.

This starter is based on the [Ionic2-Tabs-Starter](https://github.com/driftyco/ionic2-starter-tabs).

## HOW-TO

The easiest way to use this starter is to use the ionic cli:

 ```bash
 git clone git@github.com:Baqend/ionic2-starter.git
 cd ionic2-starter
 npm install -g ionic cordova
 npm install
 ionic serve
 ```

 The ionic app is already connected to a Baqend test instance. To connect it to your [own Baqend instance](https://dashboard.baqend.com/register) change the variable `appName` in the `db.service.ts` to the name of your Baqend instance.

 The app uses a `Message` object, which is defined in [the Baqend schema](http://www.baqend.com/guide/#schema-and-types). It has three string attributes: `name`, `text`, `face`.  

## How Baqend fits your Backend requirements

Baqend is a fully managed Backend-as-a-Service platform with a strong focus on performance and scalability ([click here for details](https://medium.baqend.com/bringing-web-performance-to-the-next-level-an-overview-of-baqend-be3521bc2faf)). The [JavaScript API](http://www.baqend.com/js-sdk/latest/baqend.html) gives you access to common backend features while the [dashboard](http://www.baqend.com/guide/#baqend-dashboard) lets you define data models and access rules as well as business logic to execute on the server side.

Baqend's feature set includes:

* Automated Browser and CDN Caching
* Scalable Data Storage
* Realtime Streaming Queries
* Powerful Search and Query Language
* Push Notifications
* User Authentication and OAuth
* File Storage and Hosting
* Access Control on Object and Schema Level


!["Logo"](https://cdn.rawgit.com/Baqend/ionic-starter/master/ionic_baqend.svg)

# Ionic and Baqend Starter

With this [Ionic and Baqend starter kit](https://github.com/baqend/ionic-starter) you can build **blazingly fast hybrid apps** in no time.

This starter is based on the [Ionic-Tabs-Starter](https://github.com/driftyco/ionic-starter-tabs).

## HOW-TO

The easiest way to use this starter is to use the ionic cli:

    $ git clone git@github.com:Baqend/ionic-starter.git
    $ cd ionic-starter
    $ npm install -g ionic cordova
    $ npm install
    $ ionic serve

 The ionic app is already connected to a Baqend test instance. To connect it to your [own Baqend instance](https://dashboard.baqend.com/register) change the variable `appName` in the `service.js` to the name of your Baqend instance. If you will use your app on iOS please
 replace `app-starter` with your Baqend instance name at the bottom of the `config.xml`.

 The app uses a `Message` object, which is defined in [the Baqend schema](http://www.baqend.com/guide/#schema-and-types). It has three string attributes: `name`, `text`, `face`.  

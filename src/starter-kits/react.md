# React and React Native Starter
!["Logo"](https://github.com/Baqend/react-redux-starter/raw/master/react_baqend.png)

## React Starter
With these React, Redux and Baqend starter kits you can build **blazingly fast single page applications** in no time. Setup your project by following the simple steps below.


## [React Starter](https://github.com/Baqend/react-redux-starter)
This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app)

1. Make sure you have [Node.js](https://nodejs.org/en/) installed on your machine
2. Install the [yarn](https://yarnpkg.com) package manager with `npm install -g yarn` if you like
3. Clone the repository with `git clone https://github.com/Baqend/react-redux-starter`
4. Install the project with `npm install` or `yarn install`
5. Start the server with `npm start` or `yarn start`
6. Open the url in your browser [http://localhost:3000](http://localhost:3000), you should see a small sample application with signup capability


## [React Native Starter](https://github.com/Baqend/react-native-starter)
This project was bootstrapped with the [React Native cli](https://facebook.github.io/react-native/docs/getting-started.html).

1. Setup your machine following these [instructions](https://facebook.github.io/react-native/docs/getting-started.html)
2. Install the [yarn](https://yarnpkg.com) package manager with `npm install -g yarn` if you like
3. Clone the repository with `git clone https://github.com/Baqend/react-native-starter`
4. Install the project with `npm install` or `yarn install`
5. Start your app with `react-native run-ios` or `react-native run-android`
6. An Emulator with a sample application should show up

Your app is currently connected to a Baqend test instance called 'app-starter', which provides common backend features like data and file storage, user authentication (used in the example), queries and push notifications among others.

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

## To develop your own application

1. Launch a free Baqend instance at [baqend.com](http://dashboard.baqend.com/register)
2. Change the app name in your projects `src/App.js` connect method from `app-starter` to your app name
3. Your React app will automatically connect to your app instance
4. To access your data or backend features it´s recommended to use the [redux-baqend-middleware](http://github.com) within your redux actions
5. You can also simply import the `db`-object with `import {db} from 'baqend'`
and see our [Guide](http://www.baqend.com/guide/#accessing-data) and [API Docs](http://www.baqend.com/js-sdk/latest/baqend.html) for details

For more information: on [React](https://facebook.github.io/react/docs/hello-world.html), [Redux](http://redux.js.org/), the structure of this
[project](https://github.com/facebookincubator/create-react-app), or [Baqend](http://www.baqend.com).

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

## License

[MIT](https://github.com/Baqend/react-redux-starter/blob/master/LICENSE)

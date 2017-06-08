!["Logo"](https://cdn.rawgit.com/Baqend/ionic1-starter/master/ionic_baqend.svg)
# Ionic and Baqend Starter

With this [Ionic 1 and Baqend starter kit](https://github.com/baqend/ionic1-starter) you can build **blazingly fast hybrid apps** in no time.

This starter is based on the [Ionic-Tabs-Starter](https://github.com/driftyco/ionic-starter-tabs).

## HOW-TO

The easiest way to use this starter is to use the ionic cli:

    $ git clone git@github.com:Baqend/ionic1-starter.git
    $ cd ionic1-starter
    $ npm install -g ionic cordova
    $ npm install
    $ ionic serve

 The ionic app is already connected to a Baqend test instance. To connect it to your [own Baqend instance](https://dashboard.baqend.com/register) change the variable `appName` in the `service.js` to the name of your Baqend instance. If you will use your app on iOS please
 replace `app-starter` with your Baqend instance name at the bottom of the `config.xml`.

 The app uses a `Message` object, which is defined in [the Baqend schema](https://www.baqend.com/guide/topics/schema/). It has three string attributes: `name`, `text`, `face`.  

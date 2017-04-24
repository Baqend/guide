# Push Notifications

Baqend provides the ability to send push notifications to end users devices. Before you can send a push notification you 
must first register the Device of the User. Registered devices can then later be used in Baqend Code to send push
notifications to. 

<div class="note"><strong>Note:</strong> Currently Baqend supports IOS and Android devices, support for more platforms are planed. </div>

## Setup Push

### Apple Push Notifcation Service (APNS)

To enable push notifications for iOS devices you have to upload your production or sandbox certificate in the
Baqend settings view of your app. Please upload your certificate as a *p12*-file without any password protection. Otherwise it's
not possible for Baqend to use it.

The sandbox certificate is needed, when testing the app directly from Xcode. If the app has been published to the app
store or should be tested in *TestFlight*, you must upload your production certificate. It's currently not possible
to use both certificate types at the same time.

[This tutorial](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/AddingCapabilities/AddingCapabilities.html#//apple_ref/doc/uid/TP40012582-CH26-SW6)
show hows to enabled push notification in your app and how to export your certificate as a *p12*-file.

### Google Cloud Messaging (GCM)

To enabled push notifications for Android devices Baqend needs your GCM API key. The key can be saved in the Baqend settings
view of your app.

To get your API key browse to the [Google Developers Console](https://console.developers.google.com/), open
*Enable and manage APIs*, create or chose your app, click on *Credentials* on the left side. If you already created
an server key, copy it from the list and save it at the Baqend settings view of your app, otherwise click on
*Create credentials* -> *API key* -> *Server key* to create a new api key. It's important, that the field
*Accept requests from these server IP addresses* is empty.

In your app itself you have to use the *sender ID* and not the server API key. The *sender ID* is called *project number*
in the Google Developers Console.

## Device Registration

A registered device is represented in Baqend by the Device class. The Device class contains the `deviceOs` field which
contains the platform name of the registered device, currently `Android` or `IOS`. To register a new device you must 
first obtain a device token with your used mobile framework. With the token you can register the device on Baqend.

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

The device class can be extended with custom fields like any other class in Baqend. This allows you to save additional
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

## `PushMessage` Class

To send a push notification, the SDK provides a `PushMessage` class which can be used to send a message to one or more 
devices. In addition to the message itself a `PushMessage` can transport additional information to the end users device.
 
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

## Sending Push

Push notifications can only be sent within [Baqend code](../baqend-code). To send a push notification to one or more devices, you must
first obtain the desired device ids. Therefore you can use the additional data stored in the device object to query those, 
or can save the device reference in another object.

```js
/**
 * The Baqend code sends a push notification to the given list of users.
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


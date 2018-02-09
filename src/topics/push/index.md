# Push Notifications

Baqend provides the ability to send push notifications to end users' devices. Before you can send a push notification, you 
must first register the device of the user. Registered devices can then later be used in Baqend Code to send push
notifications to. 

<div class="note"><strong>Note:</strong> Currently Baqend supports IOS and Android devices, support for more platforms are planed. </div>

## Setup Push

### Apple Push Notifcation Service (APNS)

To enable push notifications for iOS devices, you have to upload your production or sandbox certificate to Baqend first. 
To this end, go to the *Push Notifications* section in the dashboard settings. 
Please upload your certificate as a *p12*-file without any password protection. Otherwise, it's
not possible for Baqend to use it.

The sandbox certificate is needed when testing the app directly from Xcode. If the app has been published to the app
store or should be tested in *TestFlight*, you must upload your production certificate. It's currently not possible
to use both certificate types at the same time.

[This tutorial](http://help.apple.com/xcode/mac/current/#/dev11b059073)
shows how to enable push notification in your app and how to export your certificate as a *p12*-file.

### Google Cloud Messaging (GCM)

To enable push notifications for Android devices, you need to upload your GCM API key to Baqend. 
To this end, go to the *Push Notifications* section in the dashboard settings and enter your API key. 

To get your API key, browse to the [Firebase Console](https://console.firebase.google.com/), open your project and 
click on the settings icon on the left and open your project settings. You can find your project credentials with keys in the *Cloud Messaging* tab. The *legacy server key* is the one that will be stored in the Baqend settings.

To set up a Firebase Cloud Messaging Client App in your Android app, please follow 
[this tutorial](https://firebase.google.com/docs/cloud-messaging/android/client).

## Device Registration

A registered device is represented in Baqend by the Device class. The Device class contains the `deviceOs` field with the platform name of the registered device, currently `Android` or `IOS`. To register a new device, you must 
first obtain a device token with your used mobile framework. With the token, you can then register the device on Baqend.

You don't have to register a device every time your app initializes: Use the `Device.isRegistered` flag to check whether it is really necessary. As illustrated below, you thus only have to request a device token if the device is currently not registered:

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
additional data with your device while registering it, you can pass a `Device` object to the registration method.

A common use case is to save the user with a device, that allows you to send a push notification to the user's device 
later on.

```js
var device = new DB.Device({
    "user": DB.User.me
});

DB.Device.register('IOS', deviceToken, device);
```

## `PushMessage` Class

To send a push notification, the SDK provides a `PushMessage` class which can be used to send a message to one or more 
devices. A push message can transport additional information to the end user's device.
 
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

Push notifications can only be sent within [Baqend code](/topics/baqend-code). To send a push notification to one or more devices, you must
first obtain the desired device IDs. Therefore, you can use the additional data stored in the `Device` object to query those, 
or you can save the device reference in another object.

```js
/**
 * The Baqend code sends a push notification to the given list of users.
 * Therefore, the extended device class contains a user field.
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


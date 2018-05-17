# Push Notifications

Baqend provides the ability to send push notifications to end users' devices. Before you can send a push notification, you 
must first register the device of the user. Registered devices can then later be used in Baqend Code to send push
notifications to. 

<div class="note"><strong>Note:</strong> Currently, Baqend supports IOS, Android devices and Web devices (e.g. Firefox, Chrome), support for more platforms are planed. </div>

## Setup Push

### Web Push
To enable push notifications for Web devices (e.g. Firefox, Chrome), you need to generate a VAPID public key in your settings.
To do this, go to the *Push Notifications* section in the dashboard settings and press the *Generate VAPID Keys* button.

If you want to use the Web Push technology, your application needs a Service Worker. With [Speed Kit](http://www.baqend.com/speedkit.html) a Service Worker is already given and you don't need to configure anything.

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

A registered device is represented in Baqend by the Device class. The Device class contains the `deviceOs` field with the platform name of the registered device, currently `Android` or `IOS`. For `Web Push` see instructions [below](#web-push-registration). To register a new device, you must 
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

### Web Push Registration
When registering a new device you need to retrieve the Push Subscription JSON from the browser's Push Service, respectively.

As already mentioned above you need to have a registered Service Worker.

First, you need to get the subscribe options with the generated public key from your dashboard settings:
```js
function getSubscribeOptions() {
  const applicationServerKey = 'BDkqbc_OV7ARWxaRf9kKI_dkmIyhJRjOFxIcZ9DJa9_4QBKJOZj-zIsn3s3SU_zEVpvK3mR2hzjBIAKqRxHSitE='
  return {
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(applicationServerKey)
  };
}

function urlBase64ToUint8Array(base64String: String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
```

Second, you need to pass the `subscribeOptions` object everytime you register a new device to the subscribe method of the `Push Manager`.
You'll get a `pushSubscription` JSON, which you need to pass on to the `Device.register()` method.

Example code is shown below:
```js
return navigator.serviceWorker.ready.then((registration) => {
  const subscribeOptions = getSubscribeOptions();
  return registration.pushManager.subscribe(subscribeOptions);
}).then((pushSubscription) => {
  const deviceRegistration = {
    'token': pushSubscription,
    'devicetype': 'WebPush'
  };
  
  DB.device.register('WebPush', deviceRegistration);
})
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
    <td>`options`</td>
    <td>Object</td>
    <td>optional - The options object can contain various kind of data to send it to the device</td>
  </tr>
</table></div>    

For further information about the `options` Object and what to pass on, see the [PushMessage Class]() in the SDK documentation.

## Sending Push

Push notifications can be sent from the dashboard or within [Baqend code](/topics/baqend-code). To send a push notification to one or more devices, you must
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
  var options = data.options;
  
  return db.Device.find()
    .in('user', users)
    .resultList()
    .then(function(devices) {
      var pushMessage = db.Device.PushMessage(devices, message, subject, options);
      return db.Device.push(pushMessage);
    });
}
```
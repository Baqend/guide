# Push Notifications

Baqend provides the ability to send push notifications to end users' devices. With push notifications, the 
application can reach out to users to send messages and allow the user to interact with it. Baqend allows you to send
 notifications from the admin panel to registered devices. Those notifications can vary from short sentences to rich 
 and interactive messages to involve the user's opinion.

<div class="note"><strong>Note:</strong> Currently, Baqend supports push on Web devices (e.g. Firefox, Chrome) as well
 as iOS and Android devices for hybrid apps only.</div>
 
Before you can send a  push notification, you must first register the device of the user. Registered devices 
can then later be used in Baqend Code to send push notifications to as well as from the dashboard.

## Setup

Setup for push notifications varies depending on your target platform.

### Web Push
To enable push notifications for Web devices (e.g. Firefox, Chrome), you need to generate a VAPID public key in your 
settings. To do this, go to the *Push Notifications* section in the dashboard settings and press the *Generate VAPID 
Keys* button.

If you want to use the Web Push technology, your application needs a Service Worker. With [Speed Kit](http://www
.baqend.com/speedkit.html) a Service Worker is already given and you don't need to handle registering a user's device
 and handle receiving push events from the server.
 
#### Receiving Push Events
For Web devices the Service Worker of the web application needs to receive the push message from the server and send 
it to the device of the user. The following minimum code in the service worker file is needed to handle push events:
 
```js
self.addEventListener('push', function(event) {
  var payload = event.data ? event.data.json() : 'no payload';
  var title = payload.title;
  
  event.waitUntil(
      self.registration.showNotification(title, payload)
  );
});
```

After implementing the event listener for push, the app is now capable of receiving the push events and sending the 
content as a notification to the user's device.

### iOS (Apple Push Notifcation Service, APNS)

To enable push notifications for iOS devices, you have to upload your production or sandbox certificate to Baqend first. 
To this end, go to the *Push Notifications* section in the dashboard settings. Please upload your certificate as a *p12*-file without any password protection. Otherwise, it's
not possible for Baqend to use it.

The sandbox certificate is needed when testing the app directly from Xcode. If the app has been published to the app
store or should be tested in *TestFlight*, you must upload your production certificate. It's currently not possible
to use both certificate types at the same time.

[This tutorial](https://help.apple.com/xcode/mac/current/#/dev154b28f09)
shows how to enable push notification in your app and how to export your certificate as a *p12*-file.

### Android (Google Cloud Messaging, GCM)

To enable push notifications for Android devices, you need to upload your GCM API key to Baqend. 
To this end, go to the *Push Notifications* section in the dashboard settings and enter your API key. 

To get your API key, browse to the [Firebase Console](https://console.firebase.google.com/), open your project and 
click on the settings icon on the left and open your project settings. You can find your project credentials with keys in the *Cloud Messaging* tab. The *legacy server key* is the one that will be stored in the Baqend settings.

To set up a Firebase Cloud Messaging Client App in your Android app, please follow 
[this tutorial](https://firebase.google.com/docs/cloud-messaging/android/client).


## Device Registration

### General Information about the Device Class

A registered device is represented in Baqend by the device class. The device class contains the `deviceOs` field with
 the platform name of the registered device, currently `Android`, `IOS` and `WebPush`. To register a new device, you must 
first obtain a device token with your used mobile framework. With that token, you can then register the device on Baqend.

You don't have to register a device every time your app initializes: Use the `Device.isRegistered` flag in your app 
to check whether it is really necessary. As illustrated below, you thus only have to request a device token if the 
device is currently not registered:

```js
DB.ready().then(function() {
    if (!DB.Device.isRegistered) {
      // code to register the device
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

Before registering a device, the user needs to grant permission for receiving notifications from the browser. The following
code in your app can be used to ask the user for enabling notifications:

```js
if (!("Notification" in window)) {
    console.error("Notification isn't enabled");
} else if (Notification.permission === "granted") {
    console.log("Notification is enabled");
} else if (Notification.permission !== "denied") {
    Notification.requestPermission(function (permission) {
        // If the user accepts, let's subscribe it
        if (permission === "granted") {
            subscribe();
        }
    });
}
```
For further information when and how to ask the user for permission read the following best practice guide from
[Google](https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications#best_practices).


After successfully enabling the notification, you need to get the subscribe options with the generated public key from your dashboard settings:
```js
function getSubscribeOptions() {
  const msg = new DB.message.VAPIDPublicKey();
  DB.send(msg).then((vapidPublicKey) => {
    return {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      };
  })
}

function urlBase64ToUint8Array(base64String) {
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

Then, you need to pass the `subscribeOptions` object when registering a new device to the subscribe method of the `Push Manager`.
You'll get a `pushSubscription` JSON, which you need to pass on to the `DB.Device.register` method.

Example code is shown below:
```js
return navigator.serviceWorker.ready.then((registration) => {
  const subscribeOptions = getSubscribeOptions();
  return registration.pushManager.subscribe(subscribeOptions);
}).then((pushSubscription) => {
  DB.Device.register('WebPush', pushSubscription);
})
```

With this, you are able to register the user's device and save it in your device schema.

### iOS and Android Registration
<div class="note"><strong>Note:</strong> Currently, Baqend is developing on an iOS and Android SDK for easier implementation, but is not available yet.</div>

To register an iOS or Android device, you need to retreive the token from the used device. It depends on the used 
framework how to get that token. After successfully getting it, pass the token to the `DB.Device.register` method as 
shown below:

```js
DB.ready().then(function() {
    if (!DB.Device.isRegistered) {
        //helper method which fetch a new device token, using your favor framework 
        var deviceToken = requestDeviceToken();
    
        DB.Device.register('IOS', deviceToken);
    }
});
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

For further information about the `options` Object and what to pass on, see the [PushMessage Class](https://www.baqend.com/js-sdk/latest/util.PushMessage.html) in the SDK documentation.

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


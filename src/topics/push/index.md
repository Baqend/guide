# Push Notifications

Baqend provides the ability to send push notifications to end users' devices. 
In this section, we explain how you can [set up](#setup) your Baqend app for push notifications, how to [register](#device-registration) a user device for receiving push notifications, and how to actually [send](#sending-push) push notifications using a Baqend code module or directly from the dashboard.

For the corresponding feature in Speed Kit, please read the [Speed Kit docs on Push Notifications](../speed-kit/push/).

<div class="note"><strong>Note:</strong> Currently, Baqend supports push for Web browsers (e.g. Firefox, Chrome) as well
 as iOS and Android devices for hybrid apps. SDKs for iOS and Android SDK are currently in development.</div>
 

## Setup

Setup for push notifications varies depending on your target platform.

### Web Push
To enable push notifications in your app for Web devices (e.g. Firefox, Chrome), you need to generate a VAPID key pair in your 
settings. To do this, go to the *Push Notifications* section in the dashboard settings and press the *Generate VAPID 
Keys* button.

If you want to use the Web Push technology, your app needs a [**Service Worker**](https://developers.google.com/web/fundamentals/primers/service-workers/). 
If you are already using Baqend's [Speed Kit](http://www.baqend.com/speedkit.html), a Service Worker is already given and you don't need to handle registering a user's device
 and handle receiving push events from the server. 
 
#### Receiving Push Events
For Web devices the Service Worker of the web application needs to receive the push message from the server and send 
it to the device of the user. The following minimum code in the service worker file is needed to handle push events:

On Every Page you must install the Service Worker

In your `index.html`, you can include the service worker like so:
```html
<script type="text/javascript">
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}
</script>
```

A Service Worker file (`/sw.js`) could look like this:
```js
/**
 * This handler process the inital installation event of the service worker
 * It allows the service worker become active as fast as possible
 */
self.addEventListener('install', (event) => {
  console.log('Installed dashboard SW');
  event.waitUntil(self.skipWaiting());
});

/**
 * This handler process the incoming push message and shows the push notification
 */
self.addEventListener('push', (event) => {
  if (event.data === null) {
    return;
  }

  console.log('[Service Worker] Push Received', event);

  const payload = event.data.json();
  const title = payload.title;

  event.waitUntil(
      self.registration.showNotification(title, payload)
  );
});

/**
 * This handler process the click event, if the user interacts with the push notification
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click Received.', event);
  event.notification.close();

  const launchUrl = event.action || event.notification.data.launchUrl;

  if (launchUrl) {
    event.waitUntil(clients.openWindow(launchUrl));
  }
});
```

After implementing the event listener for push, the app is now capable of receiving the push events and sending the 
content as a notification to the user's device.

### iOS (Apple Push Notifcation Service, APNS)

To enable push notifications for iOS devices, you have to upload your production or sandbox certificate to Baqend first. 
[This tutorial](https://help.apple.com/xcode/mac/current/#/dev154b28f09) shows how to enable push notification in your app and how to export your certificate as a *p12*-file.
To upload your certificate to Baqend, go to the *Push Notifications* section in the dashboard settings. Please upload
 your certificate as a *p12*-file without any password protection. Otherwise, it is
not possible for Baqend to use it.

The sandbox certificate is needed when testing the app directly from Xcode. If the app has been published to the app
store or should be tested in *TestFlight*, you must upload your production certificate. It is currently not possible
to use both certificate types at the same time.


### Android (Google Cloud Messaging, GCM)

To enable push notifications for Android devices, you need to upload your GCM API key to Baqend. 
To set up a Firebase Cloud Messaging Client App in your Android app, please follow [this tutorial](https://firebase.google.com/docs/cloud-messaging/android/client).
To upload your certificate to Baqend, go to the *Push Notifications* section in the dashboard settings and enter your API key. 

To get your API key, browse to the [Firebase Console](https://console.firebase.google.com/), open your project and 
click on the settings icon on the left and open your project settings. You can find your project credentials with keys in the *Cloud Messaging* tab. The *legacy server key* is the one that will be stored in the Baqend settings.



## Device Registration

A registered device is represented in Baqend by the device class. The device class contains the `deviceOs` field with
 the platform name of the registered device, currently `Android`, `IOS` and `WebPush`. To register a new device, you must 
first obtain a device token with your used mobile framework. With that token, you can then register the device on Baqend.

You don't have to register a device every time your app initializes: Use the `Device.isRegistered` flag in your app 
to check whether it is really necessary. As illustrated below, you thus only have to request a device token if the 
device is currently not registered.

```js
DB.ready().then(function() {
    if (!DB.Device.isRegistered) {
       // register the device
    }
});
```

The device class can also be extended with custom fields like any other class in Baqend. This allows you to save 
additional data with your device, which you can later use to query the devices that should receive a push 
notification. To persist additional data with your device while registering it, you can pass a `Device` object to 
the registration method.

A common use case is to save the user with a device, that allows you to send a push notification to the user's device 
later on.

```js
var device = new DB.Device({
    "user": DB.User.me
});

DB.Device.register('IOS', deviceToken, device);
```

### Hybrid Apps

To register an iOS or Android device, you need to retrieve the token from the used device. It depends on the used 
framework how to get that token. In this example, we use the `requestDeviceToken()` method to fetch that token. After 
successfully getting it, pass the token to the `DB.Device.register` method as shown below:

```js
DB.ready().then(function() {
    if (!DB.Device.isRegistered) {
        //helper method which fetch a new device token, using your favor framework 
        var deviceToken = requestDeviceToken();
    
        DB.Device.register('IOS', deviceToken);
    }
});
```

For example, when using the Ionic Framework the Firebase plugin is needed as explained [here](https://ionicframework
.com/docs/native/firebase/) to retreive the token for the `requestDeviceToken()` method.


### Web Push
When registering a new device you need to retrieve the Push Subscription JSON from the browser's Push Service.
As already mentioned [above](#web-push), you need to have a registered Service Worker and the VAPID public key from your settings.

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
For further information when and how to ask the user for permission read the following 
[best practice guide](https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications#best_practices) from
Google.


After successfully enabling the notification, you need to get the subscribe options with the generated public key, 
which you can access via `DB.Device.loadWebPushKey()`:
```js
async function getSubscribeOptions() {
  return {
    userVisibleOnly: true,
    applicationServerKey: await DB.Device.loadWebPushKey()
  }
}
```

Then, you need to pass the `subscribeOptions` object when registering a new device to the subscribe method of the `Push Manager`.
You'll get a `pushSubscription` JSON, which you need to pass on to the `DB.Device.register` method. 

Example code is shown below for registering a new device:
```js
async function subscribe() {
  if (DB.Device.isRegistered) {
    return;
  }

  await this.requestPermission();
  const registration = await navigator.serviceWorker.ready;

  const activeSubscription = await registration.pushManager.getSubscription();
  if (activeSubscription != null) {
    await activeSubscription.unsubscribe();
  }

  const pushSubscription = await registration.pushManager.subscribe(await getSubscribeOptions());
  return await DB.Device.register('WebPush', pushSubscription);
}
```

With this, handling the use case that a device is not registered in Baqend but has an active subscription in the Push
 Manager, is covered, too. Every time this use case occurs, you need to unsubscribe the active subscription from the 
 Push Manager, otherwise a new subscription can not be made.

Now you are able to register the user's device and save it in your device schema.

If you want a customized welcome notification for the user, you can use the `onInsert` Handler from the device schema
 and send a push message as the Node user. For more information see [Handlers](../baqend-code/#handlers).

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

Push notifications can be sent programmatically from within a Baqend code module or manually through your app dashboard.

### Sending Push Notifications from Baqend Code

Push notifications can be sent from the dashboard or within [Baqend code](../baqend-code). To send a push notification to one or more devices, you must
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

### Sending Push Notifications from the Dashboard

Using the Baqend dashboard, you can send push notifications to your users in realtime, ranging from short sentences to interactive messages asking for the user's opinion.
 
To send a push notification from within the dashboard of your app, just open the `Send Push` page of the side bar, 
accessable through the `Progressive Web App` menu entry. On the `Send Push` page, you can set a title, a message 
and further options for your notification. Clicking on the `Send to all devices` button will then trigger the 
notification. You'll be asked to confirm the action to avoid accidently sending notifications. It is also possible to 
send the notification to your dashboard to see a preview by clicking the `Preview` button.
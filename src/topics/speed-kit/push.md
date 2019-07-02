# Push Notifications

In this section, we describe how Push Notifications works for Speed Kit. Baqend provides the ability to send push 
notifications to end users devices. For the corresponding feature in Baqend 
Platform, see the [Platform docs on push notifications](../../push/).

## Web Push Setup

Currently, push notifications in Speed Kit are only available for Web Push.

To enable push notifications for your website for Web devices (e.g. Firefox, Chrome), you need to generate a VAPID 
key pair in your settings. To do this, go to the *Push Notifications* section in the dashboard settings and press the
 *Generate VAPID keys* button.
 
## Default Configuration

With the default configuration, push notifications are available in Speed Kit from the start.

The [best practice guide](https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications#best_practices) from Google might help 
you here.

### Web Push Registration
Before subscribing the user's device to your push notifications, the user needs to grant permission for receiving them from the browser.
The [Speed Kit snippet](../intro/#integrate-code-snippet)  provides a method to subscribe the user to push notifications that automatically 
prompts the user for permission. By calling this method, you can decide when to ask the user for permission.
 
```js
SpeedKit.subscribe();
```

The `SpeedKit.subscribe()` method returns a `Promise` which resolves to a String: `WebPushState`. For further information about promises read the [Promise 
guide](../../getting-started/#promises).

One of the following states will be returned:
 <div class="table-wrapper"><table class="table">
  <tr>
    <th>WebPushState</th>
    <th>Description</th>
  </tr>
  <tr>
      <td>unsupported</td>
      <td>The device of the user does not support push notifications.</td>
    </tr>
  <tr>
    <td>undecided</td>
    <td>The user did not decide wether to receive or not receive push notifications, instead, she dismissed the dialog.</td>
  </tr>
  <tr>
    <td>denied</td>
    <td>The user denied receiving push notifications.</td>
  </tr>
  <tr>
    <td>registered</td>
    <td>The user is registered for push notifications.</td>
  </tr>
  <tr>
      <td>unregistered</td>
      <td>The user is accepts receiving push notifications but is not registered in Baqend.</td>
    </tr>
</table></div>    

## Sending Push

Push notifications can be sent through your app dashboard.

### Sending Push Notifications from the Dashboard

Using the Baqend dashboard, you can send push notifications to your users in realtime, ranging from short sentences to interactive messages asking for the user's opinion.
 
To send a push notification from within the dashboard of your app, just open the `Send Push` page of the side bar, 
accessable through the `Progressive Web App` menu entry. On the `Send Push` page, you can set a title, a message 
and further options for your notification. Clicking on the `Send to all devices` button will then trigger the 
notification. You'll be asked to confirm the action to avoid accidently sending notifications. It is also possible to 
send the notification to your dashboard to see a preview by clicking the `Preview` button.
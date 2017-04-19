# Users, Roles, and Permissions

Baqend comes with a powerful user, role, and permission management. This includes a generic registration and login 
mechanism and allows restricting access to insert, load, update, delete, and query operations through per-class and 
per-objects rules. These access control lists (ACLs) are expressed through allow and deny rules on users and roles.

## Registration

To restrict access to a specific role or user, the user needs a user account. Baqend supports a simple registration 
process to create a new user account. The user class is a predefined class which will be instantiated during the registration 
process. A user object has a predefined `username` which uniquely identifies the user (usually an email address) and a `password`. The password
will be hashed and salted by Baqend before being saved.   
```js
DB.User.register('john.doe@example.com', 'MySecretPassword').then(function() {
  //Hey we are logged in
  console.log(DB.User.me.username); //'john.doe@example.com'
});
```    

If you like to set additional user attributes for the registration, you can alternatively create a new user instance and register
the newly created instance with a password.
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

### Email Verification
By default a newly registered user is automatically logged in and does not need to verify his email address.
To enable email verification open the **settings** in the Baqend dashboard and go to the email section.
There you can enable the email verification and setup a template for the verification email, which is then automatically send to every newly registered user.

Until the newly registered user has verified his email address by clicking on the verification link in the verification email, he is considered inactive and cannot log in.
This state is indicated by a read only `inactive` field of type `Boolean` in the user object. After verification this field is automatically set to `false`.
Only the admin is able to set the `inactive` field manually, e.g. to activate or ban users.

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

Sessions in Baqend are stateless, that means there is no state attached to a session on the server side.
When a session is started a session token with a specified lifetime is created to identify the user.
This session is refreshed as long a the user is active. If this lifetime is exceeded, the session
is closed automatically. A logout simply locally deletes the session token and removes the current
`DB.User.me` object.
```js
DB.User.logout().then(function() {
  //We are logged out again
  console.log(DB.User.me); //null
});
```
<div class="note"><strong>Note:</strong> There is no need to close the session on the server side or handle any session state like in a PHP application for example.</div>

<div class="tip"><strong>Tip:</strong>  The <b>maximum session lifetime</b> is determined by the so called session <i>longlife</i> (default: 30 days). After this time the session expired and the user has to explicitly log in again.
You can set the <i>longlife</i> in the settings of your Baqend dashboard.</div>

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

During initialization the Baqend SDK checks, if the user is already registered and has been logged in before in this session and has not logged out explicitly.
As a consequence, returning users are automatically logged in and the `DB.User.me` object is set.
New user are anonymous by default and no user object is associated with the DB.
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

### Loading Users

User objects are private by default, i.e. only admins and the user itself can load or update the object. This behaviour is intended to protect sensitive user information. There are two ways to grant access to user objects:

* The first (**not** recommended) way is to grant access to specific users or groups or even to make the user objects publicly accessible. Because user objects are protected by object-level ACLs you need to have a look at Baqend's [permission system](/#permissions) to change the permissions.
* The second (recommended) way is to divide your user information into two categories `public` and `private`. Then store the private information in the private `user` object and the public information in a separate `profile` object that is publicly accessible and linked to the `user` object.

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
 be set by users which have write-access to an object. As shown in the image below the class-level permissions are checked first. If the requesting user has the right permission on class level, the object-level permissions are checked. Only if the requesting user also has the right permissions on object level, he is granted acces to the entity.

 <img src="img/acls.png" style="width:100%;">

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

<div class="note"><strong>Note:</strong> There is currently no way to check if a user has permissions to perform an operation without actually 
performing the operation. </div>

## Anonymous Users & Public Access
   
Anonymous users only have permissions to serve public resources. A resource is publicly accessible, if
no class or object permission restricts the access to specific users or roles. To check if the object's
permissions allow public access you can check the `acl.isPublicReadAllowed()` and the `todo.acl.isPublicWriteAllowed()` 
methods.
```js
todo.acl.isPublicReadAllowed() //will return true by default
todo.acl.isPublicWriteAllowed() //will return true by default
```

 <div class="note"><strong>Note:</strong> The access can still be restricted to specific roles or users by class-based permissions even if 
  `acl.isPublicReadAllowed()` or `todo.acl.isPublicWriteAllowed()` returns `true`.</div>

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
As of now, Baqend supports the main five providers.

### Setup
To set them up, follow these steps:
 <ul>
 	<li>Register your applications on the provider's website. The table below links to the provider websites and documentation.</li>
 	<li>Keep the <b>client ID</b> and a <b>client secret</b> generated by the provider for later.</li>
 	<li>Take the link from the table below (according to your provider) and set it as the redirect URL on the provider's website.</li>
 	<li>Lastly go to the settings in your Baqend dashboard and paste in the <b>client ID</b> and <b>client secret</b> for the provider in the OAuth section.</li>
 </ul>

### Supported Providers
 <div class="table-wrapper"><table class="table">
    <tr>
        <th colspan="2">Provider Setup</th>
        <th>Notes</th>
    </tr>
    <tr>
        <td>[google](https://console.developers.google.com/project/_/apiui/credential)</td>
        <td>[docs](https://support.google.com/cloud/answer/6158849?hl=de&ref_topic=6262490)</td>
        <td>Add as redirect URL: <br> `https://<appName>.app.baqend.com/v1/db/User/OAuth/google`</td>
    </tr>
    <tr>
        <td>[facebook](https://developers.facebook.com/apps)</td>
        <td>[docs](https://developers.facebook.com/docs/facebook-login/v2.4)</td>
        <td>
            To set up Facebook-OAuth open the settings page of your 
            [Facebook app](https://developers.facebook.com/apps), switch to *Advanced*, activate *Web OAuth Login* and 
            add <br> `https://<appName>.app.baqend.com/v1/db/User/OAuth/facebook` <br> as *Valid OAuth redirect URI*. 
        </td>
    </tr>
    <tr>
        <td>[github](https://github.com/settings/applications)</td>
        <td>[docs](https://developer.github.com/v3/oauth/)</td>
        <td>Add as redirect URL: <br> `https://<appName>.app.baqend.com/v1/db/User/OAuth/github`</td>
    </tr>
    <tr>
        <td>[twitter](https://apps.twitter.com/)</td>
        <td>[docs](https://dev.twitter.com/oauth/overview/faq)</td>
        <td>Add as redirect URL: <br>`https://<appName>.app.baqend.com/v1/db/User/OAuth/twitter`
            Twitter does not support E-Mail scope. In default case a uuid is set as username.
        </td>
    </tr>
    <tr>
        <td>[linkedin](https://www.linkedin.com/secure/developer?newapp=)</td>
        <td>[docs](https://developer.linkedin.com/docs/oauth2)</td>
        <td>Add as redirect URL: <br> `https://<appName>.app.baqend.com/v1/db/User/OAuth/linkedin`</td>
    </tr>
</table></div>

### Login & Registration

In order to use an OAuth provider to register or login users, you call one of the following SDK methods, depending on the provider:

```js
DB.User.loginWithGoogle(clientID, options).then(function(user) {
	//logged in successfully
	db.User.me == user;
});
// Same for
DB.User.loginWithFacebook(...)
DB.User.loginWithGitHub(...)
DB.User.loginWithTwitter(...)
DB.User.loginWithLinkedIn(...)
```
The login call returns a promise and opens a new window showing the provider-specific login page.
The promise is resolved with the logged in user, once the login in the new window is completed.
The OAuth login does not distinguish between registration and login, so you don't have to worry about whether a user is already registered or not.

In the `options` passed to the login you can configure the OAuth scope <a target="blank" href="https://www.baqend.com/js-sdk/latest/binding.UserFactory.html">among others</a>.
The scope defines what data is shared by the OAuth provider.
On registration the username is set to the email address if it's in the allowed scope. Otherwise a `uuid` is used.

<div class="note"><strong>Note:</strong> For the login to work despite popup blockers the call needs to be made on response to a user interaction,
e.g. after a click on the sign-in button. Also, an OAuth login will be aborted after 5 minutes of inactivity. The timeout can be changed with the timeout option.</div>


### Customize Login & Registration

To customize the login and registration behavior you can simply create a Baqend module named `oauth.[PROVIDER]`, which is called after the user is logged in (or registered).
In this module you can access the logged in user and a data object containing the OAuth token as well as the user information shared by the OAuth provider.
The token can be used to directly do further API calls or save the token for later use.

As an example, if you like to edit the OAuth login for google, create the Baqend module `oauth.google`. The module will be called after the user is successfully authorized:

```js
exports.call = function(db, data, req) {
    db.User.me // the unresolved user object of the created or logged in user

    // data contains the profile data send by the OAuth provider
    data.id // The OAuth unique user id
    data.access_token // The OAuth users API token
    data.email // The users email if the required scope was requested by the client
};
```

The following table lists more information on what data can be shared by the OAuth providers:
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

### OAuth Login via Redirect

In some cases, it may be desirable to use the OAuth authorization without opening a new window,
e.g. when cross-window communication is unavailable because of a missing `localStorage` object.

To use the login via redirect, you need to set a redirect parameter when calling the particular login method.
In this case, the SDK does not return the user object, but creates a unique token and redirects to the specified redirect URL.
Your site will be closed and the provider login will open instead.

```js
//Set redirect parameter in loginOption
loginOption = {'redirect': 'http://.../yourRedirectPage'};

//call SDK method with loginOption
DB.User.loginWithGoogle(clientID, loginOption).then(function(user) {
	...
});
```

After communicating with the OAuth provider, the unique token is sent as a query parameter to the specified redirect page.
In case of a failure, the particular error message is sent instead.
The following table lists more information of all possible query parameters:

 <div class="table-wrapper"><table class="table">
  <tr>
    <th>Parameter</th>
    <th>Meaning</th>
  </tr>
  <tr>
    <td>token</td>
    <td>
      A unique token to identify the user object (in case of success)
    </td>
  </tr>
  <tr>
    <td>loginOption</td>
    <td>The specified login options (in case of success)</td>
  </tr>
  <tr>
    <td>errorMessage</td>
    <td>
        A url-encoded error message (in case of failure)
    </td>
  </tr>
</table></div>

In case of success, you can call the following SDK method with the unique token and the specified login options
as parameters to login the user.

```js
DB.User.loginWithToken(token, options).then(function(user) {
	//logged in successfully
	db.User.me == user;
});
```

The login call returns a promise which is resolved with the logged in user. The OAuth login does not distinguish between
registration and login, so you don't have to worry about whether a user is already registered or not.

<div class="note"><strong>Note:</strong> For the login via redirect to work, ensure to register all valid redirect URLs
(e.g. 'http://.../yourRedirectPage') in the "Authorized Domains" section of your dashboard settings.</div>

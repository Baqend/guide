# Files

Baqend comes with a powerful File and Asset API. You can create multiple root level folders and apply different 
permissions to those. Files can be uploaded, replaced, downloaded and deleted when the user has the right permissions. 

In addition the SDK comes with a rich set of functionality to transform the file contents to different browser friendly 
formats. In the following table we list all supported file formats:

<div class="table-wrapper"><table class="table">
  <tr>
    <th>type</th>
    <th>JavaScript type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>'arraybuffer'</td>
    <td><a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer">ArrayBuffer</a></td>
    <td>The content is represented as a fixed-length raw binary data buffer<br>
    <code>var buffer = new ArrayBuffer(8)</code></td>
  </tr>
  <tr>
    <td>'blob'</th>
    <td><a href="https://developer.mozilla.org/en/docs/Web/API/Blob">Blob</a>|<a href="https://developer.mozilla.org/en/docs/Web/API/File">File</a></td>
    <td>The content is represented as a simple blob<br>
    <code>var blob = new Blob(["&lt;a href=..."], {type : 'text/html'})</code><br>
    Note: This does <b>not</b> work in Baqend code</td>
  </tr>
  <tr>
    <td>'json'</td>
    <td>object|array|string</td>
    <td>The file content is represented as json<br>
      <code>var json = {prop: "value"}</code></td>
  </tr>
  <tr>
    <td>'text'</td>
    <td>string</td>
    <td>The file content is represented through the string<br>
    <code>'A Simple Text'</code></td>
  </tr>
  <tr>
    <td>'base64'</td>
    <td>string</td>
    <td>The file content as base64 encoded string<br>
    <code>'PHN2ZyB4bWxucz...'</code></td>
  </tr>
  <tr>
    <td>'data-url'</td>
    <td>string</td>
    <td>A data url which represents the file content<br>
    <code>'data:image/gif;base64,R0lGODlhD...'</code></td>
  </tr>
  <tr>
    <td>'stream'</td>
    <td><a href="https://nodejs.org/api/stream.html">Stream</a></td>
    <td>A stream containing the file content<br>
    See our <a href="#handling-files">example</a>.<br>
    Note: This <b>only</b> works in Baqend code.</td>
  </tr>
  <tr>
    <td>'buffer'</td>
    <td><a href="https://nodejs.org/api/buffer.html">Buffer</a></td>
    <td>A buffer containing the file content<br>
    <code>'var buffer = Buffer.from(array)'</code><br>
    Note: This <b>only</b> works in Baqend code</td>
  </tr>
</table></div>

The file API accepts all the listed formats as upload type and transforms the content to the correct binary representation
while uploading it. The SDK guesses the correct type except for the `base64` type and transforms it automatically. 

When you download a file you can specify in which format the downloaded content should be provided.

## Accessing Files

The simplest way to access a file is to retrieve the absolute url form the Baqend SDK. Therefore you can use any existing
file reference or you can create one by yourself.

The are multiple ways to reference a file:

```js
let file;
// Absolute references have to start with '/file' followed by a root folder e.g. '/www'
file = new DB.File('/file/www/myPic.jpg');
// Alternatively you can give the path of the file, starting with the root folder
file = new DB.File({ path: '/www/myPic.jpg' });
// Or you specify the name and parent (folder) of the file
file = new DB.File({ parent: '/www', name: 'myPic.jpg' });
// Because '/www' is the default parent in can be omitted
file = new DB.File({ name: 'myPic.jpg' });
```

To get the full url to access the file just use the `file.url` shorthand. This ensures that the domain is correctly used, 
checks if the file is stale or can be directly served form the cache and attach authorization credentials if needed. 

In a common html template engine you can just write:
```html
<img src="{{file.url}}">
```
You can also manage your files in folders for example like this:

```js
let file;
// Creates the same file reference
file = new DB.File('/file/www/images/myPic.jpg');
// Parent start with the root folder, e.g. /www and followed by additional folders
file = new DB.File({parent: '/www/images', name: 'myPic.jpg'});
```

<div class="note"><strong>Note:</strong> Parent paths always start with a root folder, since the access control (who can access and modify the folder contents)
can only be set for the root folder and is applied to all nested files and folders.</div>

### Embedded Files
Files can also be embedded in other objects like for example a profile image in a user object (see [primitive types](/#primitives)):
```js
DB.User.me.load().then((user) => {
	const file = user.profileImage;
	// The file url, e.g. 'http://app.baqend.com/v1/file/users/img/myImg.png'
	console.log(file.url); 
});
```


## Metadata
Suppose you have an uploaded file `/www/images/myPic.jpg` and a reference to it. 
Then you can't use the file metadata (mimeType, acls, size, etc.) before you actually download the file 
or load its metadata. 
Therefore you can use the `loadMetadata` method to get additional file metadata 
(not the [content itself](#downloading-files)):

```js
const file = new DB.File('/file/www/images/myPic.jpg');
file.loadMetadata(() => {
	console.log(file.isMetadataLoaded); // true
	console.log(file.lastModified);     // The time of the last update
	console.log(file.size);             // file size in bytes
});
```

To actually check if the metadata of a file is actually available, you can use the `isMetadataLoaded` property.

```js
file.isMetadataLoaded // > false if the metadata was not previously fetched by file.loadMetadata() or file.doanload()
```

## Listing Files
You can also list all files inside a folder. Either provide the path to the folder as string or a file reference representing the folder

```
var folder = new DB.File('/file/www/images/');
DB.File.listFiles(folder).then(function(files) {
	// all the files in the folder '/www/images/'
});

```
<div class="note"><strong>Note:</strong> If you have many files in a folder, you should always specify a limit on how many files are returned. See the <a href="https://www.baqend.com/js-sdk/latest/binding.FileFactory.html">SDK documentation</a> for details.</div>

You can also list all **root folders**:
```
DB.File.listBuckets().then(function(rootFolders) {
	// all root folders
});

```

## Uploading Files

To upload a file you must first create a file with its name and its content.
Afterwards you can simply upload the file by just invoking `upload()`:

```js
const file = new DB.File({ name: 'test.png', data: file, type: 'blob' })
file.upload().then((file) => {
    // Upload succeed successfully 
    console.log(file.mimeType);     // contains the media type of the file
    console.log(file.lastModified); // the upload date
    console.log(file.eTag);         // the eTag of the file
}, (error) => {
    // Upload failed with an error 
});
```

In most cases you would like to upload the files which was provided by your user through a file input field or a file 
drag & drop event. 

```html
<input type="file" id="input" multiple onchange="uploadFiles(this.files)">
```

```js
function uploadFiles(files) {
  const pendingUploads = [];

  for (let i = 0, numFiles = files.length; i < numFiles; i++) {
    // If you omit the name parameter, the name of the provided file object is used
    const file = new DB.File({data: files[i]});
    pendingUploads.push(file.upload());
  }
  
  Promise.all(pendingUploads).then(() => {
    // All files are successfully uploaded
  });
}
```

In the cases you want to upload base64 encoded binary data you can use the base64 type in the options object:

```js
const file = new DB.File({ name: 'test.png', data: 'R0lGODlhDAAeALMAAG...', type: 'base64', mimeType: 'image/gif' });
file.upload().then((file) => {
    // Upload succeed successfully 
    console.log(file.mimeType);     // contains the media type of the file
    console.log(file.lastModified); // the upload date
    console.log(file.eTag);         // the eTag of the file
}, (error) => {
    // Upload failed with an error 
});
```

If you try to overwrite an existing file and do not have previously fetched the file or its metadata, or the file has 
been changed in the meantime the upload will be rejected to prevent accidental file replacement. 
If you like to skip the verification, you can pass the `{force: true}` option to the `upload()` call. 

<div class="note"><strong>Note:</strong> To upload a file you must have at least the insert or update permission on the root folder and write access on the file. </div>

## Downloading Files

Downloading a file works similar to uploading one. Just create a file reference and call `file.download()`:

```js
const file = new DB.File({ name: 'myPic.jpg' });
file.download((data) => {
    console.log(data); // is provided as Blob per default

    // Accessing the metadata of the file 
    console.log(file.mimeType);     // contains the media type of the file
    console.log(file.lastModified); // the upload date
    console.log(file.eTag);         // the eTag of the file
});
```

To load the file content in a different format, just request a download `type`

```js
const file = new DB.File({ name: 'myPic.jpg', type: 'data-url' });
file.download((data) => {
    // Data is now a data URL string
    console.log(data); // "data:image/jpeg;base64,R0lGODlhDAA..."
});
```

<div class="note"><strong>Note:</strong> To download a file you must have at least the load on the root folder and read access on the file. </div>

## Deleting Files

To delete a file just call the `delete()` method after creating the file reference:

```js
const file = new DB.File({ name: 'test.png' });
file.delete().then((file) => {
    // Deletion succeed
}, (error) => {
    // Upload failed with an error 
});
```

If you try to delete a file and you have previously fetched the file or its metadata and the file has 
been changed in the meantime the deletion will be rejected to prevent accidental file deletions. 
If you like to skip the verification, you can pass the `{force: true}` option to the `delete()` call. 

## File ACLs

The File Permissions works similar to the object acls, you can define permissions on the root folders similar to class-based 
permissions and file permissions similar to object level permissions.

The root folder permissions are applied to all nesting folders and files.

### File Permissions

The following table gives an overview of the required permissions per operation:

<div class="table-wrapper"><table class="table">
  <tr>
    <th width="30%">Method</th>
    <th width="40%">Root-folder-based permission</th>
    <th>File-based permission</th>
  </tr>
  <tr>
    <td><code>.download(), .url</code></td>
    <td>folder.load</td>
    <td>object.acl.read</td>
  </tr>
  <tr>
    <td><code>.upload(&lt;new file&gt;)</code></td>
    <td>folder.insert</td>
    <td>-</td>
  </tr>
  <tr>
    <td><code>.upload(&lt;existing file&gt;)</code></td>
    <td>folder.update</td>
    <td>object.acl.write</td>
  </tr>
  <tr>
    <td><code>.upload({force: true})</code></td>
    <td>both folder.insert and folder.update will be checked</td>
    <td>object.acl.write</td>
  </tr>
  <tr>
    <td><code>.delete()</code></td>
    <td>folder.delete</td>
    <td>object.acl.write</td>
  </tr>
</table></div>

### Set root folder Permissions

Per default only the admin can access root folders with one exception. The `www` folder is public readable for the file 
hosting feature of Baqend.

To change the permissions for a specific root folder yous should commonly use the Baqend Dashboard. 
But if you like to change the permissions programmatically you can use the `saveMetadata()` method:

```js
// Grant full access on the pictures root folder for the current user
DB.File.saveMetadata('pictures', {
   load:   new DB.util.Permission().allowAccess(DB.User.me),
   insert: new DB.util.Permission().allowAccess(DB.User.me),
   update: new DB.util.Permission().allowAccess(DB.User.me),
   delete: new DB.util.Permission().allowAccess(DB.User.me),
   query:  new DB.util.Permission().allowAccess(DB.User.me)
});
```

<div class="note"><strong>Note:</strong> To actually change the permissions of a root folder, you must own the admin role or you code must be executed 
as Baqend code.</div>

### Set file Permissions

The file permissions can be set when a file is uploaded. Therefore you can pass the acl option to the File constructor 
or to the upload method. 

```js
const file = new DB.File({
    name: 'test.png', 
    data: file, 
    acl: new DB.Acl()
        .allowReadAccess(DB.User.me)
        .allowWriteAccess(DB.User.me)
});
file.upload().then(...);
```

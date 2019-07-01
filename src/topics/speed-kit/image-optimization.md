# Automatic Image Optimization

In this section, we describe how automatic image optimization works for Speed Kit. 
For the corresponding feature in Baqend Platform, see the [Platform docs on image optimization](../../image-optimization/).


## What does it do?

Speed Kit's automatic image optimization is able to **transcode** accelerated images to the most efficient formats and even **rescale** them to just fit the requesting client’s screen and device pixel ratio (dpr): 

![Baqend optimizes your images automatically and on-the-fly.](image-optimization-speed-kit.png)

To minimize page size, a user with a high-resolution display will receive high-resolution images, while a users with an old mobile phone will receive a smaller version that is natively scaled to the smaller screen dimensions. 
While imperceptible for the user, these optimizations lead to **significant load time improvements** when bandwidth is scarce, e.g. on mobile connections.

### How does it work? 

Image optimization parameters are controlled by the `image` option of the Speed Kit config.  
If you assign an [**object**](#global-configuration), the given parameters will be applied *globally*, i.e. to every image handled by Speed Kit. 
To apply different optimization parameters for different images, you need to specify a list of [**image rules**](#advanced-configuration-image-rules). 

For an extensive list of all available config parameters and their permitted values, read the [Speed Kit API docs](../api/#ImageOptions). 

### Default Configuration
Unless specified otherwise, Speed Kit assumes the following default configuration:

```js
var speedKit = {
  // ... other options ...
  image: {
    quality: 85, // change default quality to 85% 
    downscale: true, // scale images to fit user's screen size and device pixel ratio (dpr)
    webp: true, // convert images to the WebP format automatically
    pjpeg: true, // convert JPEG images to progressive JPEG images automatically
    crop: false // crop images to a specific size
  },
  // ... other options ...
};
```

## Global Configuration

In order to change the global defaults, you can simply override the default with the desired parameterization. 
The following configuration will apply a 90% quality for all images handled by Speed Kit (instead of the default of 85%):

```js
var speedKit = {
  // ... other options ...
  image: {
    quality: 90 // change default quality from 85% to 90%
  },
  // ... other options ...
};
```

**Note:** All the other image optimization parameters (`downscale`, `webp`, etc.) will be left at their respective default values. 

## Advanced Configuration: Image Rules

To apply distinct rules for different images, you can also assign an array of **image rules**. 
Here, each image rule has the following 2 properties: 

- **rules**: an array of image selectors (see [API docs](../speed-kit/api/#ImageRule) for details).
- **options**: the options to applied to the matching images (as described above).


### Example

For example, you could specify different optimization policies for logos and photos on your website like this:

```js
var speedKit = {
  // ... other options ...
  image: [
    {
      rules: [{ pathname: "/images/logos/" }],
      options: { downscale: false }
    }, {
      rules: [{ pathname: "/images/photos/" }],
      options: { quality: 95 }
    }
  ],
  // ... other options ...
};
```



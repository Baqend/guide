# Automatic Image Optimization

In this section, we describe how automatic image optimization works for Speed Kit. 
For the corresponding feature in Baqend Platform, see the [Platform docs on image optimization](../image-optimization/).


## What does it do?

Speed Kit's automatic image optimization is able to **transcode** accelerated images to the most efficient formats and even **rescale** them to just fit the requesting client’s screen: 

![Baqend optimizes your images automatically and on-the-fly.](image-optimization-speed-kit.png)

To minimize page size, a user with a high-resolution display will receive high-resolution images, while a users with an old mobile phone will receive a smaller version that is natively scaled to the smaller screen dimensions. 
While imperceptible for the user, these optimizations lead to **significant load time improvements** when bandwidth is scarce, e.g. on mobile connections.

## How does it work? 

Image optimization parameters are controlled by the `image` option of the Speed Kit config.  

### Configuration Options
By assigning an **object** to `image` option, you configure the global default which will be applied to every image, for example:

```js
var speedKit = {
  // ... other options ...
  image: {
    quality: 90
  },
  // ... other options ...
};
```

To apply custom rules for images individually, you can also assign an array of **image rules**, for example:

```js
var speedKit = {
  // ... other options ...
  image: [
    {
      rules: [{ pathname: "/some/path/" }],
      options: {
        ...
      },
    }, {
      rules: [{ pathname: "/other/path/" }],
      options: {
         ...
      },
    }
  ],
  // ... other options ...
};
```

### Default Configuration
If unspecified, Speed Kit assumes the following default configuration for the `image` property:

```js
var speedKit = {
  // ... other options ...
  image: {
    quality: 85, // change default quality two 85% 
    downscale: true, // scale images to fit user's screen size
    webp: true, // convert images to the WebP format automatically
    pjpeg: true, // convert JPEG images to progressive JPEG images automatically
    crop: false // crop images to a specific size
  },
  // ... other options ...
};
```

For an extensive list of all available config parameters and their permitted values, read the [Speed Kit docs on image optimization](../speed-kit/api/#ImageOptions). 

### Example: change default for quality globally

```js
var speedKit = {
  // ... other options ...
  image: {
    quality: 90 // change default quality from 85% to 90%
  },
  // ... other options ...
};
```


### Example: disable WebP conversion for all images under `"/images/logos/"` and increase quality for all images under `"/images/photos/"`

```js
var speedKit = {
  // ... other options ...
  image: [
    {
      rules: [{ pathname: "/images/logos/" }],
      options: {
        webp: false,
      },
    }, {
      rules: [{ pathname: "/images/photos/" }],
      options: {
        quality: 95,
      },
    }
  ],
  // ... other options ...
};
```



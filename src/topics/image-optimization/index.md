# Automatic Image Optimization

In this section, we describe how automatic image optimization can be used for Baqend Platform. For details on the corresponding feature in Speed Kit, read the [Speed Kit docs on image optimization](../speed-kit/image-optimization/).


## What does it do?

Baqend's automatic image optimization can **transcode** hosted images to the most efficient formats and even **rescale** them to just fit the requesting client’s screen and device pixel ratio (dpr): 

![Baqend optimizes your images automatically and on-the-fly.](image-optimization.png)

To minimize page size, a user with a high-resolution display will receive high-resolution images, while a users with an old mobile phone will receive a smaller version that is natively scaled to the smaller screen dimensions. 
While imperceptible for the user, these optimizations lead to **significant load time improvements** when bandwidth is scarce, e.g. on mobile connections.

## How does it work?

Baqend's image optimization feature is controlled by simply providing **query parameters** when loading an image, for example `width=640` to re-scale or `quality=90` to re-compress your image on-the-fly: 
```javascript
// original image:
https://www.example.com/test.jpg

// re-sized image:
https://www.example.com/test.jpg?bqoptimize=1;width=640

// re-compressed image:
https://www.example.com/test.jpg?bqoptimize=1;quality=90

// both re-sized and re-compressed image:
https://www.example.com/test.jpg?bqoptimize=1;width=640;quality=90
```

## Sandbox

Feel free to play around with our optimization feature below!

<div class="image-optimization-container">
    <div class="image-optimization-url-panel">
      <input class="image-optimization-url-input" type="text" placeholder="image optimization parameters" onkeyup="refreshOptimizedImageDelayed()" id="options" >
    </div>
  <div class="image-optimization-button-panel">
   <button class="btn btn-sm btn-primary" onclick="refreshOptimizedImage('')">reset</button> 
   <button class="btn btn-sm btn-light" onclick="refreshOptimizedImage('?bqoptimize=1;downscale=false')">no downscale</button> 
   <button class="btn btn-sm btn-light" onclick="refreshOptimizedImage('?bqoptimize=1;width=120')">width 120px</button> 
   <button class="btn btn-sm btn-light" onclick="refreshOptimizedImage('?bqoptimize=1;width=1200;downscale=false')">width 1200px</button> 
   <button class="btn btn-sm btn-light" onclick="refreshOptimizedImage('?bqoptimize=1;quality=1')">low-quality</button> 
   <button class="btn btn-sm btn-light" onclick="refreshOptimizedImage('?bqoptimize=1;quality=100')">high-quality</button> 
   <button class="btn btn-sm btn-light" onclick="refreshOptimizedImage('?bqoptimize=1;crop=100,200')">crop</button>
   <button class="btn btn-sm btn-light" onclick="refreshOptimizedImage('?bqoptimize=1;crop=100,200,300,400')">crop with offset</button>
   <button class="btn btn-sm btn-light" onclick="refreshOptimizedImage('?bqoptimize=1;crop=5:4')">crop to 5:4</button>

  </div>
  <div class="image-optimization-image-container">
      <div class="image-optimization-image-container-inner">
       <img class="image-optimization-image" src="" alt="An image optimized by Baqend." id="image" > 
      </div>
  </div>
</div>

<script>
var imageURL = "https://ksm.app.baqend.com/v1/file/www/%2Bimg/flyingq-hd-opt.png";
var options;

function refreshOptimizedImage(providedOptions) {
options = providedOptions || "";
    document.getElementById("options").value=options;
    document.getElementById("image").src = imageURL + options;
};

function refreshOptimizedImageDelayed() {
    debounce(refreshOptimizedImage, 100)();
};

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

refreshOptimizedImage('?bqoptimize=1');
</script>

<!-- 
The ``  

### Parameters

For an extensive list of all the available parameters, please checkout the [**Fastly docs**](https://docs.fastly.com/api/imageopto/). 

If you want to play around with this feature a bit, check out Fastly's image optimization [**sandbox**](https://www.fastly.com/io)!
In the following, you can find an overview of some commonly used parameters:

- **width**: Resizes the image to the specified width in pixels (e.g. `width=640`) or relatively to the original width (e.g. `width=0.3`)
- **height**: Resizes the image to the specified height in pixels (e.g. `height=320`) or relatively to the original height (e.g. `height=0.3`)
- **quality**: Re-compresses the image; accepts values between `1` (low quality) and `100` (high quality)
 -->

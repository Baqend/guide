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
   <button class="btn btn-primary" onclick="refreshOptimizedImage('')">raw image</button> 
    <div class="btn-group">
        <button type="button" data-toggle="dropdown" class="btn btn-light dropdown-toggle">width &amp; height <span class="caret"></span></button>
        <ul class="dropdown-menu">
           <li><a type="button" class="btn btn-light dropdown-item image-optimization-button" onclick="refreshOptimizedImage('?bqoptimize=1;width=50')">width 50px</a></li>
           <li><a type="button" class="btn btn-light dropdown-item image-optimization-button" onclick="refreshOptimizedImage('?bqoptimize=1;width=500')">width 500px</a></li>
           <li><a type="button" class="btn btn-light dropdown-item image-optimization-button" onclick="refreshOptimizedImage('?bqoptimize=1;height=50')">height 50px</a></li>
           <li><a type="button" class="btn btn-light dropdown-item image-optimization-button" onclick="refreshOptimizedImage('?bqoptimize=1;height=500')">height 500px</a></li>
           <li><a type="button" class="btn btn-light dropdown-item image-optimization-button" onclick="refreshOptimizedImage('?bqoptimize=1;width=500;height=500')">width 500px, height 500px</a></li>
        </ul>
    </div>
    <div class="btn-group">
        <button type="button" data-toggle="dropdown" class="btn btn-light dropdown-toggle">quality <span class="caret"></span></button>
        <ul class="dropdown-menu">
           <li><a type="button" class="btn btn-light dropdown-item image-optimization-button" onclick="refreshOptimizedImage('?bqoptimize=1;quality=10')">quality 10%</a></li>
           <li><a type="button" class="btn btn-light dropdown-item image-optimization-button" onclick="refreshOptimizedImage('?bqoptimize=1;quality=30')">quality 30%</a></li>
           <li><a type="button" class="btn btn-light dropdown-item image-optimization-button" onclick="refreshOptimizedImage('?bqoptimize=1;quality=50')">quality 50%</a></li>
           <li><a type="button" class="btn btn-light dropdown-item image-optimization-button" onclick="refreshOptimizedImage('?bqoptimize=1;quality=70')">quality 70%</a></li>
           <li><a type="button" class="btn btn-light dropdown-item image-optimization-button" onclick="refreshOptimizedImage('?bqoptimize=1;quality=85')">quality 85% (default)</a></li>
           <li><a type="button" class="btn btn-light dropdown-item image-optimization-button" onclick="refreshOptimizedImage('?bqoptimize=1;quality=100')">quality 100%</a></li>
        </ul>
    </div>
    <div class="btn-group">
        <button type="button" data-toggle="dropdown" class="btn btn-light dropdown-toggle">crop <span class="caret"></span></button>
        <ul class="dropdown-menu">
           <li><a type="button" class="btn btn-light dropdown-item image-optimization-button" onclick="refreshOptimizedImage('?bqoptimize=1;crop=500,300')">crop to 500 x 300</a></li>
           <li><a type="button" class="btn btn-light dropdown-item image-optimization-button" onclick="refreshOptimizedImage('?bqoptimize=1;crop=500,300,x30,y40')">crop to 500 x 300 (x: 30, y: 40)</a></li>
           <li><a type="button" class="btn btn-light dropdown-item image-optimization-button" onclick="refreshOptimizedImage('?bqoptimize=1;crop=500,300,offset-x30,offset-y40')">crop to 500 x 300 (offset-x: 30, offset-y: 40)</a></li>
           <li><a type="button" class="btn btn-light dropdown-item image-optimization-button" onclick="refreshOptimizedImage('?bqoptimize=1;crop=0.4,0.5')">crop to 40% width and 50% height</a></li>
           <li><a type="button" class="btn btn-light dropdown-item image-optimization-button" onclick="refreshOptimizedImage('?bqoptimize=1;crop=0.4,0.5,offset-x30,offset-y40')">crop to 40% width and 50% height (x: 30, y: 40)</a></li>
        </ul>
    </div>
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
    options = providedOptions !== undefined ? providedOptions : document.getElementById("options").value;
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

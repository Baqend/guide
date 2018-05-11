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
    <label class="image-optimization-input-label" for="url">URL:</label>
    <div class="image-optimization-input-panel">
      <input class="image-optimization-input" type="text" placeholder="image URL" onkeyup="refreshOptimizedImageDelayed()" id="url" >
    </div>
    <label class="image-optimization-input-label" for="options">Options:</label>
    <div class="image-optimization-input-panel">
      <input class="image-optimization-input" type="text" placeholder="image optimization parameters" onkeyup="refreshOptimizedImageDelayed()" id="options" >
    </div>
  <div class="image-optimization-button-panel image-optimization-button-panel-top">
    <div class="btn-group image-optimization-button-container">
   <button class="btn btn-primary" onclick="refreshOptimizedImage('')">raw image</button> 
    </div>
    <div class="btn-group image-optimization-button-container">
        <button type="button" data-toggle="dropdown" class="btn image-optimization-button dropdown-toggle">width &amp; height <span class="caret"></span></button>
        <ul class="dropdown-menu">
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'width':undefined,'height':undefined})">none</a></li>
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'width':150,'height':undefined})">width 150px</a></li>
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'width':0.5,'height':undefined})">width 50%</a></li>
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'width':undefined,'height':150})">height 150px</a></li>
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'width':undefined,'height':0.5})">height 50%</a></li>
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'width':500,'height':500})">width 500px, height 500px</a></li>
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'width':0.2,'height':0.5})">width 20%, height 50%</a></li>
        </ul>
    </div>
    <div class="btn-group image-optimization-button-container">
        <button type="button" data-toggle="dropdown" class="btn image-optimization-button dropdown-toggle">quality <span class="caret"></span></button>
        <ul class="dropdown-menu">
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'quality':undefined})">default</a></li>
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'quality':10})">quality 10%</a></li>
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'quality':30})">quality 30%</a></li>
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'quality':50})">quality 50%</a></li>
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'quality':70})">quality 70%</a></li>
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'quality':85})">quality 85%</a></li>
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'quality':100})">quality 100%</a></li>
        </ul>
    </div>
    <div class="btn-group image-optimization-button-container">
        <button type="button" data-toggle="dropdown" class="btn image-optimization-button dropdown-toggle">crop <span class="caret"></span></button>
        <ul class="dropdown-menu">
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'crop':undefined})">none</a></li>
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'crop':'500,300'})">crop to 500 x 300</a></li>
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'crop':'500,300,x30,y40'})">crop to 500 x 300 (x: 30, y: 40)</a></li>
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'crop':'500,300,offset-x30,offset-y40'})">crop to 500 x 300 (offset-x: 30, offset-y: 40)</a></li>
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'crop':'0.4,0.5'})">crop to 40% width and 50% height</a></li>
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'crop':'0.4,0.5,offset-x30,offset-y40'})">crop to 40% width and 50% height (x: 30, y: 40)</a></li>
        </ul>
    </div>
    <div class="btn-group image-optimization-button-container">
        <button type="button" data-toggle="dropdown" class="btn image-optimization-button dropdown-toggle">format <span class="caret"></span></button>
        <ul class="dropdown-menu">
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'format':undefined})">original</a></li>
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'format':'gif'})">GIF (Graphics Interchange Format)</a></li>
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'format':'png'})">PNG (Portable Network Graphics)</a></li>
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'format':'png8'})">PNG8 (PNG with 8-bit transparency and 256 colors)</a></li>
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'format':'jpg'})">JPEG</a></li>
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'format':'pjpg'})">Progressive JPEG</a></li>
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'format':'webp'})">WebP</a></li>
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'format':'webpll'})">WebP (Lossless)</a></li>
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'format':'webply'})">WebP (Lossy)</a></li>
        </ul>
    </div>
    <div class="btn-group image-optimization-button-container">
        <button type="button" data-toggle="dropdown" class="btn image-optimization-button dropdown-toggle">auto-WebP<span class="caret"></span></button>
        <ul class="dropdown-menu">
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'auto':undefined})">off</a></li>
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'auto':'webp'})">on</a></li>
        </ul>
    </div>
    <div class="btn-group image-optimization-button-container">
        <button type="button" data-toggle="dropdown" class="btn image-optimization-button dropdown-toggle">fit <span class="caret"></span></button>
        <ul class="dropdown-menu">
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'fit':undefined})">none</a></li>
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'fit':'bounds'})">bounds</a></li>
           <li><a type="button" class="btn dropdown-item image-optimization-button" onclick="refreshOptimizedImage({'fit':'crop'})">crop</a></li>
        </ul>
    </div>
  </div>
  
    <div id="warning" class="warning image-optimization-warning"><strong>Only works on Baqend:</strong> 
    If your image is not hosted on Baqend, image optimization will <u>not</u> work.
    </div>
  
  <div class="image-optimization-image-container">
      <div class="image-optimization-image-container-inner">
       <img class="image-optimization-image" src="" alt="An image optimized by Baqend." id="image" > 
      </div>
  </div>
</div>

<script src="../../js/sandbox.js"></script>


## Option List

In this section, we list the available optimization parameters and explain what they can be used for.

### `width` & `height`: Specifying Output Dimensions

By specifying the desired output dimensions of your image, you can make sure that your image is delivered pixel-perfect for the devices of your users. If only one dimension is provided, the other one will be scaled proportionally. If both are provided, you prescribe the aspect ratio of your optimized image.

#### Possible Values

- **pixels** (e.g. `500`): absolute dimension as an integer
- **fraction** (e.g. `0.25`): desired output width/height in relation to the original image width/height

#### Examples

- `width=150` (<a type="button" href="#sandbox" onclick="refreshOptimizedImage('?bqoptimize=1;width=150;')">sandbox</a>): scale image to 50px in width, scaling height proportionally
- `width=0.5` (<a type="button" href="#sandbox" onclick="refreshOptimizedImage('?bqoptimize=1;width=0.5;')">sandbox</a>): scale image to 50% of the original width, scaling height proportionally
- `width=0.5;height=0.2` (<a type="button" href="#sandbox" onclick="refreshOptimizedImage('?bqoptimize=1;width=0.5;height=0.2;')">sandbox</a>): scale image to 50% of the original width and 20% of the original height; might distort image proportions, depending on the original aspect ratio

### `quality`: Lossy Compression

By specifying the output quality, you can recompress an image to save bandwidth for your losers. Please note that quality can be adjusted for **lossy formats only**. Therefore, you have to specify a lossy [destination format](#format-specify-file-type) as well, if your image is stored in a lossless format. 

#### Possible Values

- **percentage**: any number between `1` (poor quality) and `100` (best quality)

#### Examples

- `quality=100` (<a type="button" href="#sandbox" onclick="refreshOptimizedImage('?bqoptimize=1;quality=100;')">sandbox</a>): best-possible quality
- `quality=80` (<a type="button" href="#sandbox" onclick="refreshOptimizedImage('?bqoptimize=1;quality=80;format=jpg;')">sandbox</a>): pretty good quality
- `quality=40` (<a type="button" href="#sandbox" onclick="refreshOptimizedImage('?bqoptimize=1;quality=40;format=jpg;')">sandbox</a>): pretty poor quality
- `quality=1` (<a type="button" href="#sandbox" onclick="refreshOptimizedImage('?bqoptimize=1;quality=1;format=jpg;')">sandbox</a>): worst-possible quality

### `crop`: Select a Cutout

By cropping your image, you can select a subregion as output (thus removing the rest). You can specify the output **dimensions/proportions** by providing absolute pixel values (e.g. <a type="button" href="#sandbox" onclick="refreshOptimizedImage('?bqoptimize=1;crop=500,200;')">`crop=500,200`</a>), relative values (e.g. <a type="button" href="#sandbox" onclick="refreshOptimizedImage('?bqoptimize=1;crop=0.5,0.2;')">`crop=0.5,0.2`</a>), or the destination aspect ratio (e.g. <a type="button" href="#sandbox" onclick="refreshOptimizedImage('?bqoptimize=1;crop=51:2;')">`crop=51:2`</a>). 

Additionally, you can **position** the output area in the source image by providing *destination offsets* (e.g. <a type="button" href="#sandbox" onclick="refreshOptimizedImage('?bqoptimize=1;crop=100,200,offset-x20,offset-y60;')">`offset-x20,offset-y60`</a>) or *source coordinates* for the upper left corner of your cutout (e.g. <a type="button" href="#sandbox" onclick="refreshOptimizedImage('?bqoptimize=1;crop=100,200,x200,y500;')">`x200,y500`</a>, not available for aspect ratios).

#### Possible Values

In principle, there are the following valid **formats**:

- `crop=<width>,<height>`: absolute dimensions, cropped from the image center
- `crop=<width>,<height>,x<position>,y<position>`: absolute dimensions, cropped from a specified position in the source image
- `crop=<width>,<height>,offset-x<offset>,offset-y<offset>`: absolute dimensions, cropped from the image center (shifted by offsets)
- `crop=<width>:<height>`: aspect ratio, crop from the center
- `crop=<width>:<height>,offset-x<offset>,offset-y<offset>`: aspect ratio, cropped from the image center (shifted by offsets)

For each of the above components, the following values are permitted:

- `<width>`/`<height>` & `<position>`:
    - **pixels** (e.g. `500`): absolute dimensions as an integer
    - **fraction** (e.g. `0.25`): destination width/height in relation to the original image dimensions
- `<offset>`:
    - **percentage**: any integer between `1` (left/top) and `100` (right/bottom)

#### Examples
- cropping to **centered cutout**:
    - `crop=100,200` (<a type="button" href="#sandbox" onclick="refreshOptimizedImage('?bqoptimize=1;crop=100,200;')">sandbox</a>): gives you the center of the image, trimmed to 100px by 200px
    - `crop=0.5,0.3` (<a type="button" href="#sandbox" onclick="refreshOptimizedImage('?bqoptimize=1;crop=0.5,0.3;')">sandbox</a>): gives you the center of the image, trimmed to 50% of original width and 30% of original height
    - `crop=4:3` (<a type="button" href="#sandbox" onclick="refreshOptimizedImage('?bqoptimize=1;crop=4:3;')">sandbox</a>): gives you the center of the image, trimmed to achieve an aspect ratio of 4:3
- cropping to **positioned cutout**:
    - `crop=100,200,offset-x0.1,offset-y0.2` (<a type="button" href="#sandbox" onclick="refreshOptimizedImage('?bqoptimize=1;crop=100,200,offset-x0.1,offset-y0.2;')">sandbox</a>): moves the cutout 10% right and 20% downwards from the image center
    - `crop=100,200,x50,y40` (<a type="button" href="#sandbox" onclick="refreshOptimizedImage('?bqoptimize=1;crop=100,200,x50,y40;')">sandbox</a>): moves the cutout 50 pixels right and 40 pixels down (seen from the top-left corner of the original image)

### `format`: Specify File Type

By specifying a format, you choose the file type in which your image should be served. Works for JPEG, PNG, GIF, and WebP images. 
  
<div id="warning" class="warning"><strong>Consider Browser Support:</strong> 
Not all formats are supported by every browser at the moment. For example, Firefox will not display images served as WebP. Therefore, be careful with the format you choose. For WebP, consider using the <a href="#auto-enable-webp-where-available"><code>auto</code> option</a>.
</div>

#### Possible Values

- `gif`: Graphics Interchange Format
- `png`: Portable Network Graphics
- `png8`: Portable Network Graphics palette variant with 8-bit transparency and 256 colors
- `jpg`: JPEG
- `pjpg`: Progressive JPEG
- `webp`: WebP
- `webpll`: WebP (Lossless)
- `webply`: WebP (Lossy)

#### Examples

- `format=jpg` (<a type="button" href="#sandbox" onclick="refreshOptimizedImage('?bqoptimize=1;format=jpg;')">sandbox</a>): specifies that your image will be output as a lossy JPEG file

### `auto`: Enable WebP Where Available

Auto-tuning automatically transcodes the optimized image toThe WebP form it, if supported by the requesting browser. There is only one possible value:

#### Possible Values

- `webp`: enables automatic WebP transcoding

#### Examples

- `auto=webp` (<a type="button" href="#sandbox" onclick="refreshOptimizedImage('?bqoptimize=1,auto=webp;')">sandbox</a>): scale and crop the image to completely fill the bounding box

### `fit`: Fill a Given Bounding Box

With the fitting option, you can you can fill a specified bounding box (see [above](#`width`-&-`height`:-downscaling)), either by scaling and cropping the image to completely fill the bounding box (`crop`) or by rescaling the image to entirely fit into the bounding box (`bounds`).  
There are only two possible values:

- `fit=crop` (<a type="button" href="#sandbox" onclick="refreshOptimizedImage('?bqoptimize=1,width=100,height=100;fit=crop;')">sandbox</a>): scale and crop the image to completely fill the bounding box
- `fit=bounds` (<a type="button" href="#sandbox" onclick="refreshOptimizedImage('?bqoptimize=1,width=100,height=100;fit=bounds')">sandbox</a>): downscale the image to entirely fit the bounding box

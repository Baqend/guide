Accelerating Personalized Content
=================================

Some pages generate personalized or segmented content into their HTML pages. 
Examples include a shopping carts, custom ads, or personal user greetings. 
Normally, there is no point in caching those HTML pages, since there is a more or less unique version for every user. 
With Speed Kit, however, there is a way to just do that. The concept is called **Dynamic Blocks** and it is illustrated below.

<img src="../dynamic-blocks.gif" style="width:85%; display: block; margin-left: auto; margin-right: auto;" alt="Dynamic Blocks make it possible to apply caching acceleration to websites with dynamic content.">

The basic idea behind Dynamic Blocks is to load and display personalized content in two steps:
 
1. **Load and display a generic placeholder with Speed Kit:**  
The initial request for a generic placeholder block can be accelerated with Speed Kit, because it is the same for all users. 
2. **Fill in personalized data:**  
Concurrently, the personalized data is loaded without Speed Kit acceleration. 
When available, the anonymous placeholder is filled with the user-specific content.

With this approach, the website can fetch linked assets much faster and start rendering, even before the personalized content is available.


How To Use It
-------------

First, you identify which parts of your site contain personalized content and mark them as *Dynamic Blocks* (`class="speed-kit-dynamic"`). 
In addition, you have to assign a unique ID to each of your Dynamic Blocks (`data-speed-kit-id="1"`). 
This is needed to match the dynamic blocks when substituting generic with personalized content. You can use a data attribute for the ID. In summary, your dynamic blocks should look like this:

```html
<div class="speed-kit-dynamic" data-speed-kit-id="1">
    Some personalized section...
</div>
<div class="speed-kit-dynamic" data-speed-kit-id="2">
    Another personalized section...
</div>
```

Second, you need to enable the replacement of Dynamic Blocks. 
To this end, include the [**Dynamic Fetcher snippet**](https://www.baqend.com/speed-kit/latest/dynamic-fetcher.js) in the HTML file right after the Speed Kit snippet. 

This snippet can also be configured via the `dynamicBlockConfig` variable. 
Amongst other settings, you can define the query selector used to find your marked Dynamic Blocks as well the tag attribute to get the unique block ID from. 
Here are the default config values:
        
```html
<script>
  window.dynamicBlockConfig = {
    blockSelector: '.speed-kit-dynamic',
    tagAttribute: 'data-speed-kit-id',
    statusClass: 'speed-kit-dynamic',
    forceFetch: true,
  }
</script>  
```

If you want to see all this in action, take a look at our [Dynamic Block Demo](https://dynamic-demo.app.baqend.com/). 


Hiding Generic Content
----------------------

Sometimes it is a good idea to hide generic content in dynamic blocks until it is replaced by the personalized content. To this end, Speed Kit attaches a status class to the main `<html>` element.
Before replacement the `<html>` element has the class `speed-kit-dynamic-loading`, after replacement it has the class `speed-kit-dynamic-loaded`. Instead of `"speed-kit-dynamic"`, you can define a custom class prefix in the config.

You can, for example, use the status class to hide generic content in the dynamic blocks like this:

```css
.speed-kit-loading .speed-kit-dynamic { visibility: hidden; }
.speed-kit-loading .speed-kit-dynamic { visibility: visible; }
```


Dynamic Scripts
---------------

It is also possible to use script tags as dynamic blocks:
      
```html  
<script type="text/template" class="speed-kit-dynamic" data-speed-kit-id="1">
    fetch('https://www.baqend.com');
</script>
```

By using the type `"text/template"` you prevent the script from executing before it is replaced. Speed Kit will make sure that the new script is executed upon replacement.


DOM Diffing
-----------

If you have large Dynamic Blocks where only minor parts of the content change when personalizing, you might want to use our *DOM diffing extension*.
This extension prevents the browser from rerendering the entire Dynamic Block on replacement. 
The extension is still experimental, we will gladly send it to you – just drop us a line: [support@baqend.com](mailto:support@baqend.com)

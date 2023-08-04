# WebP Detection

Tools to detect webp support in the browser and tools to generate images, templates, and styles
which display the correct formats of the image in various browsers, including handling screens
which have a higher density (apple mostly) than 1 LED dot per pixel.




## Including an image via the template


```html
	__::images/thinking-of-getting-a-cat-big__
```

## Background pictures

It's possible to set a picture as the background of a box with the same functionality as the CSS
`background-image` property. This has some performance 
advantages in page load and image size. A class which does this can be imported like 


```less
@import "../node_modules/@dankolz/webp-detection/less/picture-background.less";
```

and then in the markup use like:


```html
	<div class="use-picture-as-background">
		__::images/thinking-of-getting-a-cat-big__
		Some other text
		<p> This is some text.</p>
	</div>

```

By default the template will suggest to the browser that the image will be displayed at its natural size. This
may not be correct if the image is being used as the background for a different sized box. While it will look 
like a background image, the file loaded may be too low rez if the box is bigger than the natural size or will
be larger than is necessary if the box is a smaller size.

While the CSS controls how the image is positioned and scaled, the picture element will determine what file is
loaded. This happens before the dimenions of the image as shown on the screen are determined. So, if we want
the browser to load the most efficient image possible, we need to hint in the markup. 

However, this is only import if the box is not the same width as the screen or the natural size of the image is
narrower than the width of the screen. This template will hint to the browser to use the correct size without 
your intervention in most mobile / small-screen layouts.



```html
	<div class="use-picture-as-background">
		__let v = {imageWidth: 800, imageHeight: 250, imageStyle: ';'}; v::images/thinking-of-getting-a-cat-big__
		Some other text
		<p> This is some text.</p>
	</div>

```
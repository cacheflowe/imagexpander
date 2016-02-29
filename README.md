# Imagexpander

##### A minimal fullscreen image zoom/expander script.

![demo](https://raw.githubusercontent.com/cacheflowe/imagexpander/master/images/demo-sm.gif)

## Usage

Simply add the .js and .css files to your poject, and add an `imagexpander` class to any image you'd like to expand on click. When an image is expanded, a subsequent click, window scroll or ESC key press will hide it. You can also add the attribute `data-imagexpander-large-src` to your image element to load a higher-res image once expanded.

If you'd rather cover the screen instead of letterbox, use the public method `window.imagexpander.setStyleCrop()`

If you'd like to change the screen padding, use the public method `window.imagexpander.setPadding(1)`, where `1` sets no padding, and `0.9` fills 90% of the screen in letterbox style.

## Demo

Check out the [demo](http://cacheflowe.github.io/imagexpander).

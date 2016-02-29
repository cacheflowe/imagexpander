(function(){

  // vendor prefix Transform for browsers that still need it - mostly just Safari
  var transformProp = (function(){
    var testEl = document.createElement('div');
    if(testEl.style.transform == null) {
      var vendors = ['Moz', 'Webkit', 'ms'];
      for(var vendor in vendors) {
        if( testEl.style[ vendors[vendor] + 'Transform' ] !== undefined ) {
          return vendors[vendor] + 'Transform';
        }
      }
    }
    return 'transform';
  })();

  // document-level listener to pick up clicks on expandable images
  var documentClicked = function(e) {
    if(_expandedImg) {
      shrinkImage();
    } else if(e.target.classList && e.target.classList.contains('imagexpander')) {
      expandImage(e.target);
    }
  };

  // calculate size & position
  var expandImage = function(img) {
    // grab img & calc size
    _expandedImg = img;
    var imgBounds = _expandedImg.getBoundingClientRect();
    var containerW = window.innerWidth * _padding;
    var containerH = window.innerHeight * _padding;
    var ratio = getRatioToCrop(containerW, containerH, imgBounds.width, imgBounds.height, _crops);
    var newW = Math.round(_expandedImg.width * ratio);
    var newH = Math.round(_expandedImg.height * ratio);

    // set current size manually to aid with animation
    _expandedImg.style.width = imgBounds.width + 'px';
    _expandedImg.style.maxWidth = imgBounds.width + 'px';
    _expandedImg.style.height = imgBounds.height + 'px';
    _expandedImg.setAttribute('data-shrink-to', imgBounds.width+','+imgBounds.height);

    // add wrapper div to hold height if needed
    if(_expandedImg.parentNode.classList.contains('imagexpander-wrapper') == false) {
      var wrapper = document.createElement('div');
      wrapper.className = 'imagexpander-wrapper';
      _expandedImg.parentNode.insertBefore(wrapper, _expandedImg);
      wrapper.appendChild(_expandedImg);
    }

    // set parent's height to stick where it is
    _expandedImg.parentNode.style.height = _expandedImg.parentNode.getBoundingClientRect().height + 'px';
    setTimeout(function(){
      // calc position. reset to 0,0 by negative offsets, then position from there
      var imgX = Math.round(-imgBounds.left + (window.innerWidth - newW) / 2);
      var imgY = Math.round(-imgBounds.top + (window.innerHeight - newH) / 2);

      // set css
      document.body.style.overflowX = 'hidden';
      _expandedImg.style[transformProp] = 'translate3d(' + imgX + 'px,' + imgY + 'px,0)';
      _expandedImg.style.width = newW + 'px';
      _expandedImg.style.maxWidth = newW + 'px';
      _expandedImg.style.height = newH + 'px';
      _expandedImg.classList.add('imagexpander-showing');

      // add listeners to close
      window.addEventListener('scroll', shrinkImage);
      window.addEventListener('resize', shrinkImage);
      document.addEventListener('keydown', checkEscClose);

      // add high res src if specified
      setTimeout(function(){
        if(img.getAttribute('data-imagexpander-large-src') != null) {
          img.src = img.getAttribute('data-imagexpander-large-src');
        }
      }, 320);

    }, 50);
  };

  // crop/letterbox helper
  var getRatioToCrop = function(containerW, containerH, imageW, imageH, cropFill) {
    var ratioW = containerW / imageW;
    var ratioH = containerH / imageH;
    var shorterRatio = ratioW > ratioH ? ratioH : ratioW;
    var longerRatio = ratioW > ratioH ? ratioW : ratioH;
    return cropFill ? longerRatio : shorterRatio;
  };

  // shrink it
  var shrinkImage = function() {
    if(_expandedImg) {
      var shrinkSize = _expandedImg.getAttribute('data-shrink-to').split(',');
      _expandedImg.classList.remove('imagexpander-showing');
      _expandedImg.style[transformProp] = null;
      _expandedImg.style.width = parseInt(shrinkSize[0]) + 'px';
      _expandedImg.style.maxWidth = parseInt(shrinkSize[0]) + 'px';
      _expandedImg.style.height = parseInt(shrinkSize[1]) + 'px';
      console.log('shrinkTo: ', parseInt(shrinkSize[0]), parseInt(shrinkSize[1]));
      var expandedImg = _expandedImg;
      setTimeout(function(){
        expandedImg.style.width = null;
        expandedImg.style.maxWidth = null;
        expandedImg.style.height = null;
        expandedImg.parentNode.style.height = null;
        expandedImg.removeAttribute('data-shrink-to')
        document.body.style.overflowX = null;
      }, 320);
      window.removeEventListener('scroll', shrinkImage);
      window.removeEventListener('resize', shrinkImage);
      document.removeEventListener('keypress', checkEscClose);
      _expandedImg = null;
    }
  };

  var checkEscClose = function(e) {
    if(e.keyCode == 27) {
      shrinkImage();
    }
  };

  // init w/adjustable params
  var _expandedImg = null;
  var _padding = 0.95;
  var _crops = false;
  document.addEventListener('click', documentClicked);

  // public interface
  var imagexpander = {};
  window.imagexpander = imagexpander;

  window.imagexpander.setStyleCrop = function() {
    _crops = true;
  };

  window.imagexpander.setPadding = function(val) {
    _padding = val;
  };

})();

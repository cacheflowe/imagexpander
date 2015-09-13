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
    _expandedImg = img;
    var imgBounds = _expandedImg.getBoundingClientRect();
    var containerW = window.innerWidth * _padding;
    var containerH = window.innerHeight * _padding;
    var ratio = getRatioToCrop(containerW, containerH, imgBounds.width, imgBounds.height, _crops);
    var targetTop = (window.innerHeight - imgBounds.height) / 2; // top of image if it was centered in the page
    var imgY = targetTop - imgBounds.top;
    var targetLeft = (window.innerWidth - imgBounds.width) / 2; // left of image if it was centered in the page
    var imgX = targetLeft - imgBounds.left;
    _expandedImg.style[transformProp] = 'translate3d(' + imgX + 'px,' + imgY + 'px,0) scale(' + ratio + ')';
    _expandedImg.classList.add('imagexpander-showing');
    window.addEventListener('scroll', shrinkImage);
    window.addEventListener('resize', shrinkImage);
    document.addEventListener('keydown', checkEscClose);
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
      _expandedImg.classList.remove('imagexpander-showing');
      _expandedImg.style[transformProp] = null;
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

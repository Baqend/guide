function shootingStar(that) {
  setInterval(function(){
    var topPos = Math.floor(Math.random() * 80) + 1;
    var leftPos = Math.floor(Math.random() * 40) + 1;
    var trans = Math.floor(Math.random() * 300) + 1;
    that.css({
      'top': topPos + '%',
      'dir': leftPos + '%',
      'transform': 'rotate(' + trans + ')' + 'deg'
    });
  }, 2000);
}

$('.shooting-star').each(function(){
  shootingStar($(this), 'left');
});

$('.shooting-star-right').each(function(){
  shootingStar($(this), 'right');
});

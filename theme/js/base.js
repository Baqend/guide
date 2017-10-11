/* Highlight */
$(document).ready(function () {
  hljs.initHighlightingOnLoad();
  $('table').addClass('table table-striped table-hover');

  $.getJSON("https://api.github.com/repos/Baqend/js-sdk/tags").done(function (json) {
    var release = json[0].name.substring(1);
    var releasTag = $('.release .html .hljs-value');
    var newRelease = releasTag.text().replace('latest', release);
    releasTag.text(newRelease);
  });

  if($('body').has($('#speedKitDoc')).length > 0) {
      getSpeedKitAPIDoc();
  }
});

$('body').scrollspy({
  target: '.bs-sidebar',
});

/* Toggle the `clicky` class on the body when clicking links to let us
 retrigger CSS animations. See ../css/base.css for more details. */
$('a').click(function (e) {
  $('body').toggleClass('clicky');
});

$('#main h1[id], #main h2[id], #main h3[id], #main h4[id], #main h5[id], #main h6[id]').each(function (e) {
  $(this).append($(`<a href="#${$(this).attr('id')}" class="anchor fa fa-link"></a>`))
})

/* Prevent disabled links from causing a page reload */
$("li.disabled a").click(function () {
  event.preventDefault();
});

function shootingStar(that, dir) {
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


/*Printing*/
function onBeforePrint(){
  if (window.Tawk_API && window.Tawk_API.hideWidget)
    window.Tawk_API.hideWidget();
}

function onAfterPrint(){
  if (window.Tawk_API && window.Tawk_API.showWidget)
    window.Tawk_API.showWidget();

}

function getSpeedKitAPIDoc() {
    $.get( "https://www.baqend.com/speed-kit/latest/", function( data ) {
      const content = $(data).find('.content');
      content.children().remove('.page-title');
      $('#speedKitDoc').append(content.children());
    });
}

window.addEventListener('beforeprint', onBeforePrint);
window.addEventListener('afterprint', onAfterPrint);
window.matchMedia('print').addListener((mql) => mql.matches? this.onBeforePrint(): this.onAfterPrint() );

/* Highlight */
$(document).ready(function () {
  hljs.initHighlightingOnLoad();
  $('table').addClass('table table-striped table-hover');

  $.getJSON("https://api.github.com/repos/Baqend/js-sdk/tags").done(function (json) {
    var release = json[0].name.substring(1);
    var releasTag = $('.release .html .hljs-value');
    console.log(release);
    var newRelease = releasTag.text().replace('latest', release);
    releasTag.text(newRelease);
  })
});

$('body').scrollspy({
  target: '.bs-sidebar',
});

/* Toggle the `clicky` class on the body when clicking links to let us
 retrigger CSS animations. See ../css/base.css for more details. */
$('a').click(function (e) {
  $('body').toggleClass('clicky');
});

/* Prevent disabled links from causing a page reload */
$("li.disabled a").click(function () {
  event.preventDefault();
});

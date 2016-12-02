/* Search */

function getSearchTerm()
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == 'q') {
            return sParameterName[1];
        }
    }
}

$(document).ready(function() {
    var search_term = getSearchTerm(),
        $search_modal = $('#mkdocs_search_modal');

    if(search_term) {
        $search_modal.modal();
    }

    $search_modal.on('shown.bs.modal', function () {
        $search_modal.find('#mkdocs-search-query').focus();
    });
});


/* Highlight */
$( document ).ready(function() {
    hljs.initHighlightingOnLoad();
    $('table').addClass('table table-striped table-hover');

    $.getJSON("https://api.github.com/repos/Baqend/js-sdk/tags").done(function (json) {
        var release = json[0].name.substring(1);
        var releasTag = $('.release .html .hljs-value');
        console.log(release);
        var newRelease = releasTag.text().replace('latest',release);
        releasTag.text(newRelease);
    })
});


$('body').scrollspy({
    target: '.bs-sidebar',
});

/* Toggle the `clicky` class on the body when clicking links to let us
 retrigger CSS animations. See ../css/base.css for more details. */
$('a').click(function(e) {
    $('body').toggleClass('clicky');
});

/* Prevent disabled links from causing a page reload */
$("li.disabled a").click(function() {
    event.preventDefault();
});

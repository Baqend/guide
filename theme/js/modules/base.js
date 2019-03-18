$(document).ready(() => {
  const $body = $('body')

  $('table').addClass('table table-striped table-hover')

  $.getJSON('https://api.github.com/repos/Baqend/js-sdk/tags').done((json) => {
    var release = json[0].name.substring(1)
    var releasTag = $('.release .html .hljs-value')
    var newRelease = releasTag.text().replace('latest', release)
    releasTag.text(newRelease)
  })


  if ($body.has($('#speedKitDoc')).length) {
    getSpeedKitAPIDoc()
  }

  if ($body.has($('#JSAPIDoc')).length) {
    getJSAPIDoc()
  }
})

$('body').scrollspy({
  target: '.bs-sidebar',
})

/* Toggle the `clicky` class on the body when clicking links to let us
 retrigger CSS animations. See ../css/base.css for more details. */
$('a').click(() => {
  $('body').toggleClass('clicky')
})

$('#main h1[id], #main h2[id], #main h3[id], #main h4[id], #main h5[id], #main h6[id]').each(function (e) {
  $(this).append($(`<a href="#${$(this).attr('id')}" class="anchor fa fa-link"></a>`))
})

/* Prevent disabled links from causing a page reload */
$('li.disabled a').click(function () {
  event.preventDefault()
})

function getSpeedKitAPIDoc() {
  $.get('https://www.baqend.com/speed-kit/latest/', data => {
    const content = $(data).find('.content')
    const navContent = $(data).find('.bs-sidenav')

    content.children().remove('.page-title')
    content.children().find('a[download]').each(function () {
      const href = $(this).attr('href')
      $(this).attr('href', '/speed-kit/latest/' + href)
    })
    navContent.children().find('a').each(function () {
      const href = $(this).attr('href')
      $(this).attr('href', href)
    })

    $('#speedKitDoc').append(content.children())
    $('.bs-sidenav').append(navContent.children())
  })
}

function getJSAPIDoc() {
  $.get('https://www.baqend.com/js-sdk/latest/baqend.html', data => {
    const content = $(data).find('.content')
    const navContent = $(data).find('.bs-sidenav')

    content.children().remove('.page-title')
    content.children().find('a').each(function () {
      const href = $(this).attr('href')
      // $(this).attr('href', '/js-sdk/latest/' + href);
      $(this).attr('href', 'https://www.baqend.com/js-sdk/latest/' + href)
    })
    navContent.children().find('a').each(function () {
      const href = $(this).attr('href')
      $(this).attr('href', 'https://www.baqend.com/js-sdk/latest/' + href)
    })

    $('#JSAPIDoc').append(content.children())
    $('.bs-sidenav').append(navContent.children())
  })
}

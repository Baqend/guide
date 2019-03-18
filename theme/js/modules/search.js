import Mustache from 'mustache'
import lunr from '../lib/lunr.min.js'
import results_template from '../templates/search-results-template.mustache'

function getSearchTerm() {
  const sPageURL = window.location.search.substring(1)
  const sURLVariables = sPageURL.split('&')
  for (let i = 0; i < sURLVariables.length; i++) {
    const sParameterName = sURLVariables[i].split('=')
    if (sParameterName[0] === 'q') {
      return decodeURIComponent(sParameterName[1].replace(/\+/g, '%20'))
    }
  }
}

$.getJSON(`${base_url}/search/search_index.json`).then((data) => {
  const index = lunr(function () {
    this.field('title', { boost: 10 })
    this.field('text')
    this.ref('location')
  })

  const documents = {}

  for (var i = 0; i < data.docs.length; i++) {
    const doc = data.docs[i]
    doc.location = base_url + '/' + doc.location
    index.add(doc)
    documents[doc.location] = doc
  }

  const $results = document.getElementById('search-results')

  const search = () => {
    let query = document.getElementById('search-query').value

    // Fix search query to match our spelling…
    query = query.replace(/(\w+)time\b/gi, '$1 time')
    query = query.replace(/(\w+)aware\b/gi, '$1 aware')

    while ($results.firstChild) {
      $results.removeChild($results.firstChild)
    }

    if (query === '') {
      $results.insertAdjacentHTML('beforeend', '<p class="search-no-results">Please enter a search query ...</p>')
      return
    }

    const results = index.search(query)

    if (results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        const result = results[i]
        const doc = documents[result.ref]
        doc.base_url = base_url
        doc.summary = doc.text.substring(0, 200)
        const html = Mustache.to_html(results_template, doc)
        $results.insertAdjacentHTML('beforeend', html)
      }
    } else {
      $results.insertAdjacentHTML('beforeend', `<p class="search-no-results">No results found for “${query}”</p>`)
    }
  }

  const $searchInput = document.getElementById('search-query')

  const term = getSearchTerm()
  if (term) {
    $searchInput.value = term
    search()
  }

  // $searchInput.addEventListener('mouseover', function () {
  //   $searchInput.focus();
  // });

  $searchInput.addEventListener('keyup', function (event) {
    // Focus first result on arrow down
    if (event.key === 'ArrowDown') {
      const firstResult = $results.getElementsByTagName('a').item(0)
      if (firstResult) {
        firstResult.focus()
        event.preventDefault()
      }
      return
    }

    search()
  })

  // Switch focus between results with arrow keys
  $results.addEventListener('keydown', function (event) {
    const active = document.activeElement
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const nodes = $results.getElementsByTagName('a')
      let activeIndex = -1
      for (let i = 0; i < nodes.length; i += 1) {
        if (active == nodes.item(i)) {
          activeIndex = i
          break
        }
      }

      if (activeIndex == -1) {
        return
      }

      event.preventDefault()
      const next = event.key === 'ArrowDown' ? Math.min(nodes.length - 1, activeIndex + 1) : Math.max(0, activeIndex - 1)
      nodes.item(next).focus()
    }
  })
})

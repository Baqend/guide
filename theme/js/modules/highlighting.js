import hljs from 'highlight.js/lib/highlight'
import javascript from 'highlight.js/lib/languages/javascript'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import http from 'highlight.js/lib/languages/http'

// Register WebPagetest script language
hljs.registerLanguage('wptscript', (hljs) => {
  const KEYWORDS = {
    keyword: 'blockDomains logData navigate setHeader',

    built_in: 'authorization',
  }

  const NUMBER = {
    className: 'number',
    variants: [
      { begin: '\\b(0[bB][01]+)' },
      { begin: '\\b(0[oO][0-7]+)' },
      { begin: hljs.C_NUMBER_RE }
    ],
    relevance: 0
  };

  const URL = {
    className: 'string',
    begin: /https?:/,
    end: /$/,
  }

  return {
    case_insensitive: true,
    keywords: KEYWORDS,
    contains: [
      NUMBER,
      URL,
      hljs.C_LINE_COMMENT_MODE,
    ],
  }
})

// Register languages we use
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('css', css)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('http', http)

// Initialize highlight.js
hljs.initHighlightingOnLoad()

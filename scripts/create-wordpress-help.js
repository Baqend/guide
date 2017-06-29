const DomParser = require('dom-parser');
const path = require('path');
const fs = require('fs');


function replaceNextTag(string, tag) {
  const regex = new RegExp(`<${tag}[^<]*>((.|\\n)(?!</${tag}>))*.</${tag}>`);
  return string.replace(regex, '');
}

function insertCode(string, tag, code) {
  const regex = new RegExp(`<${tag}[^<]*>(((.|\\n)(?!</${tag}>))*.)</${tag}>`, 'g');
  return string.replace(regex, code);
}

const sourceFilePath = path.resolve(__dirname, '../docs/topics/wordpress/index.html');
const destFilePath = path.resolve(__dirname, '../../baqend-wordpress/baqend/views/help.phtml');

console.info(`Parsing data from ${sourceFilePath}\nand writing it to ${destFilePath}`);

fs.readFile(sourceFilePath, { encoding: 'utf8' }, (err, html) => {
  if (err) throw new Error(err);

  const parser = new DomParser();
  const document = parser.parseFromString(html);

  const content = document.getElementById('page-content');
  let result = content.innerHTML;

  // Remove introduction
  result = replaceNextTag(result, 'h1');
  result = replaceNextTag(result, 'p');

  // Remove Installation instructions
  result = replaceNextTag(result, 'h2');
  result = replaceNextTag(result, 'p');

  result = insertCode(result, 'h2', "<h2><? _e('$1', 'baqend') ?></h2>");
  result = insertCode(result, 'p', "<p><? _e('$1', 'baqend') ?></p>");

  result = `<div class="wrap"><h1><? _e('Baqend &rsaquo; Help', 'baqend') ?></h1>\n${result}</div>`;

  fs.writeFile(destFilePath, result, { encoding: 'utf8' }, (err) => {
    if (err) throw new Error(err);
  });
});


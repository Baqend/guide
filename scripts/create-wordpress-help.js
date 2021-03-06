const DomParser = require('dom-parser');
const path = require('path');
const fs = require('fs');
const copy = require('copy');


function replaceNextTag(string, tag) {
  const regex = new RegExp(`<${tag}[^<]*>((.|\\n)(?!</${tag}>))*(.|\\n)</${tag}>`);
  return string.replace(regex, '');
}

function insertCode(string, tag, code) {
  const regex = new RegExp(`<${tag}([^<]*)>(((.|\\n)(?!</${tag}>)(?!<${tag}>))*.)</${tag}>`, 'g');
  return string.replace(regex, code);
}

function replaceImgSrc(string) {
  const regex = /<\?php _e\('<img alt="([^"]+)" src="\.\/([\w\/.-]+)"([^<>]*)>', 'baqend'\); \?>/g;
  return string.replace(regex, '<img alt="<?php _e( \'$1\', \'baqend\' ); ?>" src="<?php echo plugin_dir_url( __DIR__ ); ?>img/$2"$3>');
}

const wordPressPath = path.resolve(__dirname, '../../baqend-wordpress/baqend');
const sourceFilePath = path.resolve(__dirname, '../docs/topics/wordpress/index.html');
const destViewsPath = path.resolve(wordPressPath, './views/help.php');
const destImgPath = path.resolve(wordPressPath, './img');

console.info(`Parsing data from ${sourceFilePath}\nand writing it to ${destViewsPath}`);

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
  result = replaceNextTag(result, 'ol');
  // result = replaceNextTag(result, 'ol');

  result = insertCode(result, 'h2', "<h2$1><?php _e('$2', 'baqend'); ?></h2>");
  result = insertCode(result, 'p', "<p><?php _e('$2', 'baqend'); ?></p>");
  result = insertCode(result, 'li', "<li$1><?php _e('$2', 'baqend'); ?></li>");
  result = insertCode(result, 'strong', "<strong><?php _e('$2', 'baqend'); ?></strong>");

  result = replaceImgSrc(result);

  result = `<?php /*\n\nGenerated from Guide – Do not change manually!\n\n*/ ?><div class="wrap baqend-help"><h1><?php _e( 'Speed Kit', 'baqend' ); ?> &rsaquo; <?php _e( 'Help', 'baqend' ); ?></h1>\n<?php include 'tabs.php'; ?>${result}</div>\n`;

  fs.writeFile(destViewsPath, result, { encoding: 'utf8' }, (err) => {
    if (err) throw new Error(err);

    copy(path.resolve(__dirname, '../docs/topics/wordpress/*.png'), destImgPath, (err) => {
      if (err) throw new Error(err);
    });
  });
});


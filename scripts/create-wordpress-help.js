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

function footer() {
  return `
<?php if ( $hosting_enabled ): ?>
  <h2 id="hosting"><?php _e('Hosting', 'baqend'); ?></h2>
  <p><?php _e('The WordPress plugin makes it easy using <a href="https://www.baqend.com/guide/topics/hosting/">Baqend Hosting</a>, too.
  Enable Hosting by going into the Account tab and checking “Show Hosting settings”.', 'baqend'); ?></p>
  <p><?php _e('Now, when you go to the Hosting tab, you have several options to configure Speed Kit for you:', 'baqend'); ?></p>
  <ul>
  <li><strong><?php _e('Additional URLs to process', 'baqend'); ?></strong><ul>
  <li><?php _e('Here you can add additional URLs separated by new lines which will also be checked when collecting your blog contents.', 'baqend'); ?></li>
  </ul>
  </li>
  <li><strong><?php _e('URLs which should be excluded', 'baqend'); ?></strong><ul>
  <li><?php _e('When these URLs occur during the content collecting, they will not be uploaded to Baqend.', 'baqend'); ?></li>
  </ul>
  </li>
  <li><strong><?php _e('URL type to use on Baqend', 'baqend'); ?></strong><ul>
  <li><?php _e('Choose between relative or absolute URLs to be used in your hosted copy. ', 'baqend'); ?></li>
  </ul>
  </li>
  <li><strong><?php _e('Destination scheme', 'baqend'); ?></strong><ul>
  <li><?php _e('The HTTP scheme being used by your hosted copy. This is either HTTPS or HTTP.', 'baqend'); ?></li>
  </ul>
  </li>
  <li><strong><?php _e('Destination host', 'baqend'); ?></strong><ul>
  <li><?php _e('The HTTP host where your hosted copy will be deployed at. This is normally your domain name.', 'baqend'); ?></li>
  </ul>
  </li>
  <li><strong><?php _e('Working directory', 'baqend'); ?></strong><ul>
  <li><?php _e('This is the working directory in which all files are collected temporarily.', 'baqend'); ?></li>
  </ul>
  </li>
  </ul>
  <p><?php _e('Click “Save Settings” once you are ready.', 'baqend'); ?></p>
<?php endif; ?>
`;
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
  result = replaceNextTag(result, 'h3');
  result = replaceNextTag(result, 'ol');
  result = replaceNextTag(result, 'h3');
  result = replaceNextTag(result, 'p');
  // result = replaceNextTag(result, 'ol');

  result = insertCode(result, 'h2', "<h2$1><?php _e('$2', 'baqend'); ?></h2>");
  result = insertCode(result, 'p', "<p><?php _e('$2', 'baqend'); ?></p>");
  result = insertCode(result, 'li', "<li$1><?php _e('$2', 'baqend'); ?></li>");
  result = insertCode(result, 'strong', "<strong><?php _e('$2', 'baqend'); ?></strong>");

  result = replaceImgSrc(result);

  result = `<?php /*\n\nGenerated from Guide – Do not change manually!\n\n*/ ?><div class="wrap baqend-help"><h1><?php _e('Baqend &rsaquo; Help', 'baqend'); ?></h1>\n<?php include 'tabs.php'; ?>${result}${footer()}</div>\n`;

  fs.writeFile(destViewsPath, result, { encoding: 'utf8' }, (err) => {
    if (err) throw new Error(err);

    copy(path.resolve(__dirname, '../docs/topics/wordpress/*.png'), destImgPath, (err) => {
      if (err) throw new Error(err);
    });
  });
});


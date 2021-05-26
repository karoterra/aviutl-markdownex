const https = require('https');
const fs = require('fs');

const outputPath = process.argv[2];

function getFilename(url) {
  return url.match(/https?:\/\/[\w!"\/+\-_~;.,]+\/([\w+\-_~;]+)\.\w+\?v\d+/)[1] + '.svg';
}

function generate(json) {
  const files = fs.readdirSync('./assets/twemoji/assets/svg');
  const data = {};
  for (const key in json) {
    const filename = getFilename(json[key]);
    if (files.indexOf(filename) != -1) {
      data[key] = filename;
    }
  }
  fs.writeFileSync(outputPath, JSON.stringify(data, undefined, 4));
}

const options = {
  hostname: 'api.github.com',
  path: '/emojis',
  method: 'GET',
  headers: {
    'User-Agent': 'https://github.com/karoterra/aviutl-markdownex',
    'Accept': 'application/vnd.github.v3+json',
  },
};

https.get(options, res => {
  let body = '';

  res.on('data', chunk => {
    body += chunk;
  });

  res.on('end', () => {
    let json = JSON.parse(body);
    generate(json);
  });
}).on('error', e => {
  console.log('problem with request: ' + e.message);
});

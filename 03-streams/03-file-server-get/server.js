const fs = require('node:fs')
const url = require('url');
const http = require('http');
const path = require('path');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  if (url.pathname.split('/').length > 2) {
    res.statusCode = 400
    res.end()
    return
  }

  const stream = fs.createReadStream(filepath)

  stream.pipe(res)

  stream.on('error', (err) => {
    if (err.code === 'ENOENT') {
      res.statusCode = 404
      res.end()
    }
  })

  switch (req.method) {
    case 'GET':

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;

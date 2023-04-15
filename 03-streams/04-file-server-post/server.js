const fs = require('node:fs')
const url = require('url');
const http = require('http');
const path = require('path');

const LimitSizeStream = require('./LimitSizeStream')

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);
  const limitStream = new LimitSizeStream({
    limit: 1000000,
  })

  if (url.pathname.split('/').length > 2) {
    res.statusCode = 400
    res.end()
    return
  }

  const filepath = path.join(__dirname, 'files', pathname);
  const streamOut = fs.createWriteStream(filepath, {
    flags: 'wx'
  })

  req.pipe(limitStream).pipe(streamOut)

  limitStream.on('error', (err) => {
    if (err.code === 'LIMIT_EXCEEDED') {
      fs.unlink(filepath, () => {
        res.statusCode = 413
        res.end()
      })
    }
  })

  req.on('error', (err) => {
    if (err.code === 'ECONNRESET') {
      fs.unlink(filepath, () => {
        res.end()
      })
    }
  })

  streamOut.on('error', (err) => {
    if (err.code === 'EEXIST') {
      res.statusCode = 409
      res.end()
    }
  })

  streamOut.on('close', () => {
    res.statusCode = 201
    res.end()
  })



  switch (req.method) {
    case 'POST':

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;

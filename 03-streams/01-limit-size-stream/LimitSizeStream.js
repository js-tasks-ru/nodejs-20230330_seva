const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options)

    this.limit = options.limit
    this.readBytes = 0
  }

  _transform(chunk, encoding, callback) {
    this.readBytes += chunk.length

    if (this.readBytes > this.limit) {
      callback(new LimitExceededError())
    } else {
      callback(null, chunk)
    }
  }
}

module.exports = LimitSizeStream;

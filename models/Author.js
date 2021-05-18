const _ = require('lodash');

function Author(_node) {
  _.extend(this, _node.properties);

  if (this.id) {
    this.id = this.id.toNumber();
  }
  if (this.authid) {
    this.authid = this.authid;
  }
}

module.exports = Author;

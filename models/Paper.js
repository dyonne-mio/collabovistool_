const _ = require('lodash');

function Paper(_node) {
  _.extend(this, _node.properties);

  if (this.id) {
    this.id = this.id.toNumber();
  }
  if (this.paperid) {
    this.paperid = this.paperid;
  }
}

module.exports = Paper;
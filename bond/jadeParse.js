var Duplex = require('stream').Duplex;
var jade = require('jade');
var util = require('util');
var fs = require('fs');

util.inherits(JadeParse, Duplex);

function JadeParse(opt) {
    if (!(this instanceof JadeParse))
        return new JadeParse(opt);

    Duplex.call(this, opt);
    var self = this;

    this.obj = {};
    this.articles = { articles: [] };
    this.mergeObj = function(obj) {
        for (var attr in obj) {
            self.obj[attr] = obj[attr];
        }
    };
    this.isMerge = function(obj) {
        for (var i = 0;i<self.articles.articles.length;i++) {
            if (self.articles.articles[i].title == obj.title)
                return false;
        }
        return true;
    }
}

JadeParse.prototype._write = function(chunk, encode, callback) {
    var chunkObj = JSON.parse(chunk.toString());
    if ((chunkObj.flag == 'article') && (this.isMerge(chunkObj))) {
        this.articles.articles.push(chunkObj);
        this.mergeObj(this.articles);
    }else if (chunkObj.flag != 'article'){
        this.mergeObj(chunkObj);
    }

    callback();
    return true;
};

JadeParse.prototype._read = function(size) {
    this.push(JSON.stringify(this.obj));
    this.push(null);
}

module.exports = JadeParse;

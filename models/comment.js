var MongoClient = require('mongodb').MongoClient,
    settings = require('../settings');

function Comment(name, day, title, comment) {
  this.name = name;
  this.day = day;
  this.title = title;
  this.comment = comment;
}

module.exports = Comment;

Comment.prototype.save = function(callback) {
  var name = this.name,
      day = this.day,
      title = this.title,
      comment = this.comment;
  if (settings.usepwd = "true") {
    MongoClient.connect("mongodb://" + settings.username + ":" + settings.password + "@" + settings.host + ":" + settings.port + "/" + settings.db + "?safe=true", function(err, db) {
      if (err) {
        return callback(err);
      }
      db.collection('posts', function (err, collection) {
        if (err) {
          db.close();
          return callback(err);
        }
        //通过用户名、发表日期及标题查找文档，并把一条留言添加到该文档的 comments 数组里
        collection.findAndModify({"name":name,"time.day":day,"title":title}
        , [['time',-1]]
        , {$push:{"comments":comment}}
        , {new: true}
        , function (err,comment) {
            db.close();
            callback(null);
        });   
      });
    });
  }
  MongoClient.connect("mongodb://" + settings.host + ":" + settings.port + "/" + settings.db + "?safe=true", function(err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('posts', function (err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
      //通过用户名、发表日期及标题查找文档，并把一条留言添加到该文档的 comments 数组里
      collection.findAndModify({"name":name,"time.day":day,"title":title}
      , [['time',-1]]
      , {$push:{"comments":comment}}
      , {new: true}
      , function (err,comment) {
          db.close();
          callback(null);
      });   
    });
  });
};
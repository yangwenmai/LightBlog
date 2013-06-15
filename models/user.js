var MongoClient = require('mongodb').MongoClient,
    settings = require('../settings');

function User(user){
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
};

module.exports = User;

User.prototype.save = function(callback) {//存储用户信息
  //要存入数据库的用户文档
  var user = {
      name: this.name,
      password: this.password,
      email: this.email
  };
  if (settings.usepwd == "true") {
    MongoClient.connect("mongodb://" + settings.username + ":" + settings.password + "@" + settings.host + ":" + settings.port + "/" + settings.db + "?safe=true", function(err, db) {
    //打开数据库
      if(err){
        return callback(err);
      }
      //读取 users 集合
      db.collection('users', function(err, collection){
        if(err){
          db.close();
          return callback(err);
        }
        //将用户数据插入 users 集合
        collection.insert(user,{safe: true}, function(err, user){
          db.close();
          callback(err, user);//成功！返回插入的用户信息
        });
      });
    });
    return;
  }
  MongoClient.connect("mongodb://" + settings.host + ":" + settings.port + "/" + settings.db + "?safe=true", function(err, db) {
  //打开数据库
    if(err){
      return callback(err);
    }
    //读取 users 集合
    db.collection('users', function(err, collection){
      if(err){
        db.close();
        return callback(err);
      }
      //将用户数据插入 users 集合
      collection.insert(user,{safe: true}, function(err, user){
        db.close();
        callback(err, user);//成功！返回插入的用户信息
      });
    });
  });
};

User.get = function(name, callback){//读取用户信息
  if (settings.usepwd == "true") {
    MongoClient.connect("mongodb://" + settings.username + ":" + settings.password + "@" + settings.host + ":" + settings.port + "/" + settings.db + "?safe=true", function(err, db) {
    //打开数据库
      if(err){
        return callback(err);
      }
      //读取 users 集合
      db.collection('users', function(err, collection){
        if(err){
          db.close();
          return callback(err);
        }
        //查找用户名 name 值为 name文档
        collection.findOne({
          name: name
        },function(err, doc){
          db.close();
          if(doc){
            var user = new User(doc);
            callback(err, user);//成功！返回查询的用户信息
          } else {
            callback(err, null);//失败！返回null
          }
        });
      });
    });
    return;
  }
  MongoClient.connect("mongodb://" + settings.host + ":" + settings.port + "/" + settings.db + "?safe=true", function(err, db) {
  //打开数据库
    if(err){
      return callback(err);
    }
    //读取 users 集合
    db.collection('users', function(err, collection){
      if(err){
        db.close();
        return callback(err);
      }
      //查找用户名 name 值为 name文档
      collection.findOne({
        name: name
      },function(err, doc){
        db.close();
        if(doc){
          var user = new User(doc);
          callback(err, user);//成功！返回查询的用户信息
        } else {
          callback(err, null);//失败！返回null
        }
      });
    });
  });
};

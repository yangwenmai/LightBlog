var crypto = require('crypto'),
    User = require('../models/user.js'),
    Post = require('../models/post.js'),
    Comment = require('../models/comment.js');



module.exports = function(app){
　app.get('/', function(req,res){
    //判断是否是第一页，并把请求的页数转换成 number 类型
    var page = req.query.p?parseInt(req.query.p):1;
    //查询并返回第 page 页的10篇文章
    Post.getTen(null, page, function(err, posts){
      if(err){
        posts = [];
      } 
      res.render('index',{
        title: app.get('sitename') + ' | ' + app.get('sitedescription'),
        sitename: app.get('sitename'),
        sitedescription: app.get('sitedescription'),
        pagename: '主页',
        user: req.session.user,
        posts: posts,
        page: page,
        postsLen: posts.length,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });


//安装页面（安装后请删除）
  app.get('/install', checkNotLogin);
  app.get('/install',function(req,res){
    res.render('install', {
      title: '安装' + ' | ' + app.get('sitename'),
      sitename: app.get('sitename'),
      sitedescription: app.get('sitedescription'),
      pagename: '安装',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });

  app.post('/install', checkNotLogin);
　app.post('/install', function(req,res){
    var name = req.body.name,
        password = req.body.password,
        password_re = req.body['password-repeat'];
    //检验用户两次输入的密码是否一致
    if(password_re != password){
      req.flash('error','两次输入的密码不一致!'); 
      return res.redirect('/install');
    }
    //生成密码的散列值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
        name: req.body.name,
        password: password,
        email: req.body.email
    });
    //检查用户名是否已经存在 
    User.get(newUser.name, function(err, user){
      if(user){
        err = '用户已存在!';
      }
      if(err){
        req.flash('error', err);
        return res.redirect('/install');
      }
      //如果不存在则新增用户
      newUser.save(function(err){
        if(err){
          req.flash('error',err);
          return res.redirect('/install');
        }
        req.session.user = newUser;//用户信息存入 session
        req.flash('success','创建管理员账号成功，开始你的博客之旅！');
        res.redirect('/');
      });
    });
  });
//结束

  app.get('/login', checkNotLogin);
　app.get('/login', function(req, res){
    res.render('login',{
      title: '登录' + ' | ' + app.get('sitename'),
      sitename: app.get('sitename'),
      sitedescription: app.get('sitedescription'),
      pagename: '登录',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    }); 
  });

  app.post('/login', checkNotLogin);
  app.post('/login', function(req, res){
    //生成密码的散列值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    //检查用户是否存在
    User.get(req.body.name, function(err, user){
      if(!user){
        req.flash('error', '用户不存在!'); 
        return res.redirect('/login'); 
      }
      //检查密码是否一致
      if(user.password != password){
        req.flash('error', '密码错误!'); 
        return res.redirect('/login');
      }
      //用户名密码都匹配后，将用户信息存入 session
      req.session.user = user;
      req.flash('success','登录成功!');
      res.redirect('/');
    });
  });

  app.get('/post', checkLogin);
  app.get('/post',function(req,res){
    res.render('post', {
      title: '发表' + ' | ' + app.get('sitename'),
      sitename: app.get('sitename'),
      sitedescription: app.get('sitedescription'),
      pagename: '发表',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });

  app.post('/post', checkLogin);
  app.post('/post', function(req, res){
    var currentUser = req.session.user,
        tags = [{"tag":req.body.tag1},{"tag":req.body.tag2},{"tag":req.body.tag3}];
    var md5 = crypto.createHash('md5'),
        email_MD5 = md5.update(currentUser.email.toLowerCase()).digest('hex'),
        head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48";
    post = new Post(currentUser.name, head, req.body.title, tags, req.body.post);
    post.save(function(err){
      if(err){
        req.flash('error', err); 
        return res.redirect('/');
      }
      req.flash('success', '发表成功!');
      res.redirect('/');
    });
  });
  
  app.get('/logout', checkLogin);
  app.get('/logout', function(req, res){
    req.session.user = null;
    req.flash('success','登出成功!');
    res.redirect('/');
  });

  app.get('/archive', function(req,res){
    Post.getArchive(function(err, posts){
      if(err){
        req.flash('error',err); 
        return res.redirect('/');
      }
      res.render('archive',{
        title: '存档' + ' | ' + app.get('sitename'),
        sitename: app.get('sitename'),
        sitedescription: app.get('sitedescription'),
        pagename: '存档',
        posts: posts,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });

  app.get('/tags', function(req,res){
    Post.getTags(function(err, posts){
      if(err){
        req.flash('error',err); 
        return res.redirect('/');
      }
      res.render('tags',{
        title: '标签' + ' | ' + app.get('sitename'),
        sitename: app.get('sitename'),
        sitedescription: app.get('sitedescription'),
        pagename: '标签',
        posts: posts,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });

  app.get('/tags/:tag', function(req,res){
    Post.getTag(req.params.tag, function(err, posts){
      if(err){
        req.flash('error',err); 
        return res.redirect('/');
      }
      res.render('tag',{
        title: '搜索:'+ req.params.tag + ' | ' + app.get('sitename'),
        sitename: app.get('sitename'),
        sitedescription: app.get('sitedescription'),      
        pagename: '标签:'+ req.params.tag,
        posts: posts,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });

  app.get('/links', function(req,res){
    res.render('links',{
      title: '友情链接' + ' | ' + app.get('sitename'),
      sitename: app.get('sitename'),
      sitedescription: app.get('sitedescription'),
      pagename: '友情链接',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });

  app.get('/search', function(req,res){
    Post.search(req.query.keyword, function(err, posts){
      if(err){
        req.flash('error',err); 
        return res.redirect('/');
      }
      res.render('search',{
        title: "搜索:"+ req.query.keyword + ' | ' + app.get('sitename'),
        pagename: "搜索:"+ req.query.keyword,
        sitename: app.get('sitename'),
        sitedescription: app.get('sitedescription'),
        posts: posts,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });

  app.get('/u/:name', function(req,res){
    var page = req.query.p?parseInt(req.query.p):1;
    //检查用户是否存在
    User.get(req.params.name, function(err, user){
      if(!user){
        req.flash('error','用户不存在!'); 
        return res.redirect('/');
      }
      //查询并返回该用户第 page 页的10篇文章
      Post.getTen(user.name, page, function(err, posts){
        if(err){
          req.flash('error',err); 
          return res.redirect('/');
        } 
        res.render('user',{
          title: "用户:" + user.name + ' | ' + app.get('sitename'),
          sitename: app.get('sitename'),
          sitedescription: app.get('sitedescription'),
          pagename: "用户:" + user.name,
          posts: posts,
          page: page,
          postsLen: posts.length,
          user : req.session.user,
          success : req.flash('success').toString(),
          error : req.flash('error').toString()
        });
      });
    }); 
  });

  app.get('/u/:name/:day/:title', function(req,res){
    Post.getOne(req.params.name, req.params.day, req.params.title, function(err, post){
      if(err){
        req.flash('error',err); 
        return res.redirect('/');
      }
      res.render('article',{
        title: req.params.title + ' | ' + app.get('sitename'),
        sitename: app.get('sitename'),
        sitedescription: app.get('sitedescription'),
        pagename: req.params.title,
        post: post,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });
  app.post('/u/:name/:day/:title', function(req,res){
    var date = new Date(),
        time = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
    var md5 = crypto.createHash('md5'),
        email_MD5 = md5.update(req.body.email.toLowerCase()).digest('hex'),
        head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48"; 
    var comment = {"name":req.body.name, "head":head, "email":req.body.email, "website":req.body.website, "time":time, "content":req.body.content};
    var newComment = new Comment(req.params.name, req.params.day, req.params.title, comment);
    newComment.save(function(err){
      if(err){
        req.flash('error',err); 
        return res.redirect('/');
      }
      req.flash('success', '评论成功!');
      res.redirect('back');
    });
  });

  app.all('*', function(req,res){
    res.render("404");
  });
};

function checkLogin(req, res, next){
  if(!req.session.user){
    req.flash('error','未登录!'); 
    return res.redirect('/login');
  }
  next();
}

function checkNotLogin(req,res,next){
  if(req.session.user){
    req.flash('error','已登录!'); 
    return res.redirect('/');
  }
  next();
}
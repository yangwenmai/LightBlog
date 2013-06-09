
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , MongoStore = require('connect-mongo')(express)
  , settings = require('./settings')
  , flash = require('connect-flash');

var app = express();

// all environments
app.set('appname', 'LightBlog');
app.set('sitename', settings.sitename);
app.set('sitedescription', settings.sitedescription);
app.set('port', process.env.PORT || settings.httpport);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(flash());
app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
  secret: settings.cookieSecret,
  key: settings.db,
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  store: new MongoStore({
    db: settings.db,
    username: settings.username,
    password: settings.password
  })
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
  console.log(app.get('appname') + ' is running on port ' + app.get('port'));
  console.log('Thank you for using LightBlog!');
});

routes(app);
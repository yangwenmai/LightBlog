LightBlog
=========
项目构建状态：[![Build Status](https://travis-ci.org/sanddudu/LightBlog.png?branch=master)](https://travis-ci.org/sanddudu/LightBlog)  
项目依赖状态：[![依赖模块状态](https://david-dm.org/sanddudu/LightBlog.png)](http://david-dm.org/sanddudu/LightBlog)

Live Demo上线，地址：http://code5light.com:8888/  

##什么是LightBlog
LightBlog是一个基于Node.js，Express框架，Mongodb的支持markdown语法的轻量级博客系统    
源代码基于nswbmw的[N-Blog](https://github.com/nswbmw/N-blog)，使用bootstrap改进了前端，支持强制验证的数据库连接，减少了核心代码定义的信息，改入settings.js定义，更加便于使用

##分支说明

    * master：所有中文版LightBlog文件  
    * necessary-package：如果不能使用npm进行安装，请下载这个分支
    * en（尚未创建）：所有英文版LightBlog文件

##安装方法
（以下假定你已经安装了Node.js和npm并且环境变量设置正确，如果你没有配置npm，请到necessary-package分支下载带依赖文件的版本【不保证完全为最新版】，并直接跳到settings.js修改）  
下载所有代码并解压到一个文件夹  
打开Node.js command prompt，进入代码目录，执行  

    npm install 

npm会自动下载需要的依赖  
待安装完成之后，修改目录下的settings.js里的相关信息  
（！注意！：如果你的mongodb使用了--auth参数进行启动，请删除models里的comment.js、db.js、user.js、post.js，并将剩余的文件的文件名去掉.safe）  
（！注意！：如果你的mongodb使用了--auth参数进行启动，请确保settings.js里的数据库用户名和密码被正确配置【在设置的数据库内建立的用户而不是在admin内建立的用户】）  
修改完成后，执行  

    node app.js

LightBlog便会开始运行在你设定的端口上（默认8888）  
进入localhost:[你的端口号]/install添加管理员用户  
添加完成之后删除views下的install.ejs和routes下的index.js里的安装部分  
开始博客之旅！

##许可证
本程序根据GPLV2许可证发布

##TO-DO List
添加修改文章和删除文章的功能

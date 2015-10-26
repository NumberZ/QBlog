var crypto = require("crypto");
var User = require('../models/user');
var Post = require('../models/post');
module.exports = function(app) {
    function checkLogin(req,res,next) {
        if(!req.session.user) {
            req.flash('error','未登录');
            res.redirect('/login');
        }
        next();
    }
    app.get('/', function(req, res) {
        Post.get(null,function(err,posts) {
            if(err){
                posts = [];
            }

            if(!req.session.user) {
                posts = [];
            }
             console.log(posts);
            res.render('index', {
            title: '主页',
            user: req.session.user,
            posts:posts,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
            });
        });
    });

    app.get('/reg', function(req, res) {
        res.render('reg', {
        title: '注册',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
        });
    });

    app.post('/reg', function(req, res) {
        var name = req.body.name,
        password = req.body.password,
        email = req.body.email,
        password_re = req.body['password-repeat'];
        if(password != password_re) {
            req.flash('error','两次输入的密码不一样');
            res.redirect('/reg');
        }
        var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
        var newUser = new User({
            name:name,
            password:password,
            email:email
        });
        User.get(newUser.name,function(err,user){
            if(err) {
                req.flash('error',err);
                return res.redirect('/');
            }
            if(user) {
                req.flash('error','用户已经存在');
                return res.json({
                    messageID :1
                });
            }
            newUser.save(function(err,user) {
                if(err) {
                    req.flash('error',err);
                    return res.resdirect('/reg');
                }
                req.session.user = user;
                req.flash('success','注册成功！');
                res.redirect('/');
            });
        });
    });

    app.get('/login', function(req, res) {
        res.render('login', {
            title: '登录',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()});
    });

    app.post('/login', function(req, res) {
        var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
        User.get(req.body.name,function(err,user) {
            if(!user) {
                req.flash('error','用户不存在');
                return res.json({
                   messageID:2
                });
            }
            if (user.password != password) {
              req.flash('error', '密码错误!'); 
              return res.redirect('/login');
            }
            req.session.user = user;
            req.flash('success', '登陆成功!');
            res.redirect('/');
            });
    });

    app.get('/post', function(req, res) {
        res.render('post', {
            title: '发表',
            user:req.session.user
        });
    });

    app.post('/post',checkLogin);

    app.post('/post', function(req, res) {
        var currentUser = req.session.user,
        post = new Post(currentUser.name,req.body.title,req.body.post);
        post.save(function(err){
            if(err){
                req.flash('err',err);
                return res.resdirect('/');
            }
            req.flash('success','发布成功！');
            return res.redirect('/');
        })
    });
    app.get('/logout', function (req, res) {
      req.session.user = null;
      req.flash('success', '登出成功!');
      res.redirect('/');
    });
};

const express = require('express');
const mongoose = require('mongoose');


require('./db');
require('./auth');
const passport = require('passport');

const app = express();


const session = require('express-session');
const sessionOptions = {
	secret: 'secret cookie thang (store this elsewhere!)',
	resave: true,
	saveUninitialized: true
};
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
    app.locals.user = req.user;
    if(req.user === undefined){
        app.locals.logged = false; 
    }
    else{
        app.locals.logged = true;
        app.locals.username = req.user.username;
    }
    app.locals.domain = req.headers.host;
	next();
});


const path = require('path');



const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');
const User = mongoose.model('User');

app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'add session secret here!',
    resave: false,
    saveUninitialized: true,
}));



app.get('/', (req, res) => { // home page where you can filter posts by key word and sort stuff
    console.log(req.query);


    Post.find({}, function(err,postList){ // filters
        if(err){
            throw err;
        }
        else{
            if(req.query.search === "" || req.query.search === undefined){
                res.render('homePage', {"plist": postList});
            }
            else{
                const deSpaced = postList.map(function(aPost){
                    return aPost.Content.split(' ');
                });
                const filtered = deSpaced.filter(function(elem){
                    for(let i = 0; i < elem.length; i++){
                        for(let j = 0; j < req.query.search.split(' ').length; j++){
                            if(elem[i].toLowerCase().substring(0,elem[i].length-1) === req.query.search.split(' ')[j].toLowerCase() || elem[i].toLowerCase().substring(0,elem[i].length) === req.query.search.split(' ')[j].toLowerCase()){
                                return true;
                            }
                        }
                    }
                    return false; 
                });
                const reSpaced = filtered.map(function(elem){
                    return elem.join(" ");
                });
                const fpostList = postList.filter(function(aPost){
                    for(let i = 0; i < reSpaced.length; i++){
                        if(reSpaced[i].toLowerCase().trim() === aPost.Content.toLowerCase().trim() || reSpaced[i].toLowerCase().trim() === aPost.Content.toLowerCase().trim()){
                            return true;
                        }
                    }
                    return false;
                });
                res.render('homePage', {"plist": fpostList});
            }
        }
    });
    
});


class slugBoi{
    constructor(){
        this.slug = "";
    }

    setSlug(slug){
        this.slug = slug;
    }

    getSlug(){
        return this.slug;
    }
}

app.get('/EditPage/:slug', (req, res) => {
    res.render('EditPage', {"i":req.params.slug});
});

app.post('/EditPage/:slug', (req, res) => {
    const sb = new slugBoi();
    Comment.findOne({_id: req.params.slug}, function(err,comment){ // filters
        if(err){
            throw err;
        }
        else{
            Post.findOne({_id: comment.ID}, function(err, aPost){ // filters
                if(err){
                    throw err;
                }
                else{
                    sb.setSlug(aPost._id);
                    //IDobj.pslug = aPost._id;
                    Comment.update({_id:req.params.slug}, {Content: req.body.title}, function(err,commentList){ // For each created post on the data base 
                        if(err){
                            throw err;
                        }
                        else{
                            res.redirect('/Post/'+sb.getSlug());
                        }
                    });
                }
            });
        }
    });
    
});


app.post('/Modify/:username/:slug', (req, res) => {
    if(req.user !== undefined && req.params.username === req.user.username){
        const route = '/EditPage/' + req.params.slug;
        res.redirect(route);
    }
    else{
        Comment.findOne({_id: req.params.slug}, function(err,comment){ // filters
            if(err){
                throw err;
            }
            else{
                Post.findOne({_id: comment.ID}, function(err, aPost){ // filters
                    if(err){
                        throw err;
                    }
                    else{
                        Comment.find({ID: aPost._id}, function(err,comments){ // filters
                            if(err){
                                throw err;
                            }
                            else{
                                res.render("PostPage",{"pid":aPost._id,"content":aPost.Content, "poster": aPost.Poster, "id":req.params.slug, "comments":comments, "message": "You can't modify another user's answer!!"});
                            }
                        });      
                    }
                });
            }
        });      

    }
});


app.post('/Delete/:username/:slug', (req, res) => {
    if(req.user !== undefined && req.params.username === req.user.username){
        //const IDobj = {};
        const sb = new slugBoi();
        Comment.findOne({_id: req.params.slug}, function(err,comment){ // filters
            if(err){
                throw err;
            }
            else{
                Post.findOne({_id: comment.ID}, function(err, aPost){ // filters
                    if(err){
                        throw err;
                    }
                    else{
                        //IDobj.pslug = aPost._id;
                        sb.setSlug(aPost._id);
                        Comment.deleteOne({ _id: req.params.slug }, function(err) {
                                if(err){
                                    throw err;
                                }
                                else{
                                    res.redirect('/Post/'+sb.getSlug());
                                }
                              });
                    }
                });
            }
        });
        
    }
    else{            
        Comment.findOne({_id: req.params.slug}, function(err,comment){ // filters
            if(err){
                throw err;
            }
            else{
                Post.findOne({_id: comment.ID}, function(err, aPost){ // filters
                    if(err){
                        throw err;
                    }
                    else{
                        Comment.find({ID: aPost._id}, function(err,comments){ // filters
                            if(err){
                                throw err;
                            }
                            else{
                                res.render("PostPage",{"pid":aPost._id,"content":aPost.Content, "poster": aPost.Poster, "id":req.params.slug, "comments":comments, "message": "You can't delete another user's answer!!"});
                            }
                        });      
                    }
                });
            }
        });   
    }

});

app.get('/random', (req, res) => { // random redirects to a random page
});

app.get('/Post/:slug', (req, res) => { // random redirects to a random page
    Post.findOne({slug: req.params.slug}, function(err, aPost){ // filters
        if(err){
            throw err;
        }
        else{
            Comment.find({ID: req.params.slug}, function(err,comments){ // filters
                if(err){
                    throw err;
                }
                else{
                    res.render("PostPage",{"pid":aPost._id,"content":aPost.Content, "poster": aPost.Poster, "id":req.params.slug, "comments":comments});
                }
            });      
        }
    });
});

app.post('/Post/:slug', (req, res) => { // random redirects to a random page
    if(req.user === undefined){
        Post.findOne({slug: req.params.slug}, function(err, aPost){ // filters
            if(err){
                throw err;
            }
            else{
                Post.findOne({slug: req.params.slug}, function(err, aPost){ // filters
                    if(err){
                        throw err;
                    }
                    else{
                        Comment.find({ID: req.params.slug}, function(err,comments){ // filters
                            if(err){
                                throw err;
                            }
                            else{
                                res.render("PostPage",{"pid":aPost._id,"content":aPost.Content, "poster": aPost.Poster, "id":req.params.slug, "comments":comments, "message": "Error"});
                            }
                        });      
                    }
                });             
            }
        });
    }
    else{
        const date = new Date();
        const n = date.toDateString();
        const time = date.toLocaleTimeString();
        const newComment= new Comment({
            Content: req.body.title,
            Likes: 0,
            Dislikes: 0,
            ID: req.params.slug,
            Poster: req.user.username,
            Date: n + " " + time,
        });
        newComment.save(function(err){ // adds an object to database
            if(err){
                throw err;
            }
            else{
                res.redirect('/Post/'+req.params.slug);
                    
            }
        });
            
    }
});


app.post('/', (req, res) => { // submitting a post will redirect to homepage
    if(req.user === undefined){
        Post.find({}, function(err,postList){ // filters
            if(err){
                throw err;
            }
            else{
                res.render('homePage', {"plist": postList, "message":"You must be logged in to submit a Question!"});
            }
        });
    }
    else{
        Post.find({}, function(err,postList){ // filters
            if(err){
                throw err;
            }
            else{
                const date = new Date();
                const n = date.toDateString();
                const time = date.toLocaleTimeString();
                const newPost = new Post({
                    Content: req.body.title,
                    Likes: 0,
                    Dislikes: 0,
                    NumberOfComments: 0,
                    ID: postList.length,
                    Poster: req.user.username,
                    Date: n + " " + time,
                    Comment: []
                });
                newPost.save(function(err){ // adds an object to database
                    if(err){
                        throw err;
                    }
                    else{
                        res.redirect("/");
                    }
                });
            }
        });
    }
    
    
});






app.get('/register', (req, res) => {
    res.render("register");
});

app.post('/register', (req, res) => {
    User.register(new User({username:req.body.username}), 
      req.body.password, function(err, user){
    if (err) {
      res.render('register',{message:'Your registration information is not valid'});
    } else {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/');
      });
    }
  }); 
});
        

app.get('/login', (req, res) => {
    res.render("login");
});

app.post('/login', (req, res, next) => {
    passport.authenticate('local', function(err,user) {
        if(user) {
          req.logIn(user, function(err) {
            res.redirect('/');
          });
        } else {
          res.render('login', {message:'Your login or password is incorrect.'});
        }
      })(req, res, next);
});

app.get('/logout', (req,res) => {
        req.logout();
        res.redirect('/');
});

module.exports = app.listen(process.env.PORT || 3000);

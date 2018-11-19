const express = require('express');
const mongoose = require('mongoose');

require('./db');
const session = require('express-session');
const path = require('path');

const app = express();


const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');


app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'add session secret here!',
    resave: false,
    saveUninitialized: true,
}));



app.get('/', (req, res) => { // home page where you can filter posts by key word and sort stuff
    Post.find({}, function(err,postList){ // filters
        if(err){
            throw err;
        }
        else{
            res.render('homePage', {"plist": postList});
        }
    });
    
});




app.get('/EditPage/:slug', (req, res) => {
    res.render('EditPage', {"i":req.params.slug});
});

app.post('/EditPage/:slug', (req, res) => {
    Post.update({slug:req.params.slug}, {Content: req.body.title}, function(err,postList){ // For each created post on the data base 
       if(err){
           throw err;
       }
       else{
           res.redirect("/");
       }
   });
});


app.post('/Modify/:slug', (req, res) => {
    const route = '/EditPage/' + req.params.slug;
    res.redirect(route);
});


app.post('/Delete/:slug', (req, res) => {
    Post.deleteOne({ slug: req.params.slug }, function (err) {
        if(err){
            throw err;
        }
        else{
            res.redirect("/");
        }
      });
});

app.get('/random', (req, res) => { // random redirects to a random page
});



app.post('/', (req, res) => { // submitting a post will redirect to homepage
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
                Poster: "Anon",
                Date: n + " " + time,
                Comment: []
            });
            newPost.save(function(err){ // adds sound object to database
                if(err){
                    throw err;
                }
                else{
                    res.redirect("/");
                }
            });
        }
    });
    
});


Post.find({}, function(err,postList){ // For each created post on the data base 
    if(err){
        throw err;
    }
    else{
        for(let i = 1; i <= postList.length; i++){ // each created post will have its url path as /postPage + its ID
            const route = '/postPage' + String(i);
            app.get(route, (req, res) => { // you get to view that certain post and you can sort comments
            });
            app.post(route, (req, res) => { // submitting a comment will redirect to the same page
            });
        }
        
    }
});




app.get('/register', (req, res) => {
});

app.post('/register', (req, res) => {
});
        

app.get('/login', (req, res) => {
});

app.post('/login', (req, res) => {
});

app.listen(process.env.PORT || 3000);

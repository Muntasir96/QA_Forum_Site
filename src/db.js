const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

// add your schemas
// use plugins (for slug)
// register your model


const Comment = new mongoose.Schema({
    Content: String,
    Likes: Number,
    Dislikes: Number,
    ID: Number,
    Poster: String,
    Date: String
});

const Post = new mongoose.Schema({
    Content: String,
    Likes: Number,
    Dislikes: Number,
    NumberOfComments: Number,
    ID: Number,
    Poster: String,
    Date: String,
    Comment: [Comment]
});

const User = new mongoose.Schema({
    ID: Number,
    userName: String,
    passWord: String
});

Post.plugin(URLSlugs("_id"));

mongoose.model('Post',Post);
mongoose.model('Comment',Comment);
mongoose.model('User',User);


// is the environment variable, NODE_ENV, set to PRODUCTION? 
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/ms2';
}

mongoose.connect(dbconf);

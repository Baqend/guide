#Library + alle Schemata laden:
<script...>

Globale Variable db
db.User.methods.fullName = function() {}
db.Post = Post;

new Post().save();
new db.Post().save();
db.Post.find
db.Post.find

var db = new DB();
var obj = db.Post.fromJSON(rawObj);
function validate(db, obj) {
    var post = new Post();
    post.use(db);
    
}
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const commentsschema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  middlename: {
    type: String
  },
  lastname: {
    type: String,
    required: true
  },
  comments: {
    type: String,
    required: true
  },
  upvote: {
    type: Number
  },
  downvote: {
    type: Number
  },
  userid: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "users"
  },
  userwhoupvoted: {
   users:[
     {
       userids:{
         type:Schema.Types.ObjectId
       }
     }
   ]
  },
  userwhodownvoted: {
    users:[
      {
        userids:{
          type:Schema.Types.ObjectId
        }
      }
    ]
   }
});
commentsschema.methods.upvoteco = function(c) {
  this.upvote = ++c.upvote;
 if(this.upvote<0){
   this.upvote=0
 }
  return this.save();
};
commentsschema.methods.downvoteco = function(c) {
this.downvote=++c.downvote 

  if(this.downvote<0){
    this.downvote=0
  }
  
  return this.save();
};

commentsschema.methods.upvotecoagain=function(c,q){
  this.upvote-=1
  this.userwhoupvoted.users=q
  if(this.upvote<0){
    this.upvote=0
  }
  return this.save()
}

commentsschema.methods.downvotecoagain=function(c,q){
  this.downvote-=1
  this.userwhodownvoted.users=q
  if(this.downvote<0){
    this.downvote=0
  }
  return this.save()
}


module.exports = mongoose.model("comments", commentsschema);

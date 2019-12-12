
const Comments = require('../modals/Comments')
exports.gethome = (req, res, next) => {
  Comments.find().then(c => {
    // console.log(c);    
    let flash = req.flash("error");
    let errormssg = null;
    if (flash) {
      errormssg = flash[0];
    } else {
      errormssg = null;
    }
    res.render("home/home", { title: "Home", details:c,flash: errormssg});
  });
};

exports.postcomment = (req, res, next) => {
  if(!req.user){
    req.flash('error','Please Login before making this comment.')
    return res.redirect('/')
  }
  const comment = req.body.comment;
  if(comment===''){
    req.flash('error','Please write a comment.')
    return res.redirect('/')
  }
  const fname = req.user.firstname;
  const mname=req.user.middlename
  const lname=req.user.lastname
  // console.log(comment);
 
  const commentinpage = new Comments({
    firstname: fname,
    middlename:mname,
    lastname:lname,
    comments: comment,
    upvote: 0,
    downvote: 0,
    userid:req.user._id
  });
  return commentinpage.save().then(() => {
    res.redirect("/");
  });
};

exports.getupvote=(req,res,next)=>{
  const id=req.params.id

  if(!req.user){
    req.flash('error','Please Login with your account !')
    return res.redirect('/')
  }
  
  Comments.findById(id).then(c=>{
    if(req.user._id.toString()===c.userid.toString()){
      req.flash('error','You cannot upvote your own comment')
      return res.redirect('/')
    }
    let ischeck=c.userwhodownvoted.users.filter(i=>{
      return i._id.toString()===req.user._id.toString()
    })
    if(ischeck.length!==0){
    
      c.downvote-=1
      let last=c.userwhodownvoted.users.filter(i=>{
        return i._id.toString()!==req.user._id.toString()
      })
      c.userwhodownvoted.users=last
    }
    else if(ischeck.length===0){
      console.log('ok')
    }
  
      let isalready=c.userwhoupvoted.users.filter(i=>{
        return i._id.toString()==req.user._id.toString()
      })
      if(isalready.length===0) {
        c.userwhoupvoted.users.push(req.user._id)
        c.upvoteco(c).then(()=>{
          return res.redirect('/')
        })
      }
      else if(isalready.length!==0){
      let shoulduserremove=c.userwhoupvoted.users.filter(i=>{
        return i._id.toString()!==req.user._id.toString()
      })
      c.upvotecoagain(c,shoulduserremove).then(()=>{
        return res.redirect('/')
      })
      }
      
  })
}

exports.getdownvote=(req,res,next)=>{
  const id=req.params.id
  if(!req.user){
    req.flash('error','Please Login with your account !')
    return res.redirect('/')
  }
  Comments.findById(id).then(c=>{
    if(req.user._id.toString()===c.userid.toString()){
      req.flash('error','You cannot downvote your own comment')
      return res.redirect('/')
    }

    let ischeck=c.userwhoupvoted.users.filter(i=>{
      return i._id.toString()===req.user._id.toString()
    })
    console.log(ischeck)
    if(ischeck.length!==0){
    
      c.upvote-=1
      let last=c.userwhoupvoted.users.filter(i=>{
        return i._id.toString()!==req.user._id.toString()
      })
      c.userwhoupvoted.users=last
    }
    else if(ischeck.length===0){
      console.log('ok')
    }

    let isalready=c.userwhodownvoted.users.filter(i=>{
      return i._id.toString()==req.user._id.toString()
    })
    if(isalready.length===0) {
      c.userwhodownvoted.users.push(req.user._id)
      c.downvoteco(c).then(()=>{
        return res.redirect('/')
      })
    }
    else if(isalready.length!==0){
     
      let shoulduserremove=c.userwhodownvoted.users.filter(i=>{
        return i._id.toString()!==req.user._id.toString()
      })
      c.downvotecoagain(c,shoulduserremove).then(()=>{
        return res.redirect('/')
      })
      }
  })
}
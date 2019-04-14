const User          = require('../models/user');
const JWT           = require('jsonwebtoken');
const {JWT_SECRET}  = require('../config');
const bcrypt        = require('bcryptjs');
const path          = require('path');
const crypto        = require('crypto-extra');



const hbs      = require('nodemailer-express-handlebars'),
 email         = process.env.MAILER_EMAIL_ID || 'dealss400@gmail.com',
 pass          = process.env.MAILER_PASSWORD || 'thakurpeople1997',
 nodemailer    = require('nodemailer');
var smtpTransport = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
  auth: {
    user: email,
    pass: pass
  }
});

var handlebarsOptions = {
  viewEngine: 'handlebars',
  viewPath: path.resolve('./templates/'),
  extName: '.html'
};

smtpTransport.use('compile', hbs(handlebarsOptions));










signToken = user => {
  return JWT.sign({
    iss: 'Shriya',
    sub: user.id,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
  }, JWT_SECRET);
}

module.exports = {
  signUp: async (req, res, next) => {
    const { email, password } = req.value.body;

    // Check if there is a user with the same email
    const foundUser = await User.findOne({ "local.email": email });
    if (foundUser) { 
      return res.status(403).json({ error: 'Email is already in use'});
    }

    // Create a new user
    const newUser = new User({ 
      method: 'local',
      local: {
        email: email, 
        password: password
      }
    });

    await newUser.save();

    // // Generate the token
    // const token = signToken(newUser);
    // // Respond with token
    // res.status(200).json({ token });
    res.status(200).json({newUser})
  },

  signIn: async (req, res, next) => {
    // Generate token
    const token = signToken(req.user);
    res.status(200).json({ token });
  },

  // resetpassword: (req, res, next)=> {
  //   const { email, password } = req.value.body;
  //   const foundUser = await User.findOne({ "local.email": email });
  //   if (!foundUser) { 
  //     return res.json({ success:false,error: 'Email does not exist'});
  //   }else{
  //     User.local.resettoken=signToken(req.user);
  //     await User.save(function(err){
  //       if (err){
  //         res.json({success:false, message: err});
  //       }else{

  //         res.json({success:true, message:'Please check your email for reset password'});
  //       }
  //     });
  //   }

  // },
  
  forgot_password:(req, res, next)=>{
    async.waterfall([
      function(done) {
        User.findOne({
          email: req.body.email
        }).exec(function(err, user) {
          if (user) {
            done(err, user);
          } else {
            done('User not found.');
          }
        });
      },
      function(user, done) {
        // create the random token
        crypto.randomBytes(20, function(err, buffer) {
          var token = buffer.toString('hex');
          done(err, user, token);
        });
      },
      function(user, token, done) {
        User.findByIdAndUpdate({ _id: user._id }, { reset_password_token: token, reset_password_expires: Date.now() + 86400000 }, { upsert: true, new: true }).exec(function(err, new_user) {
          done(err, token, new_user);
        });
      },
      function(token, user, done) {
        var data = {
          to: user.local.email,
          from: email,
          template: 'forgot-password-email',
          subject: 'Password help has arrived!',
          context: {
            url: 'http://localhost:3000/users/reset_password?token=' + token,
          }
        };
  
        smtpTransport.sendMail(data, function(err) {
          if (!err) {
            return res.json({ message: 'Kindly check your email for further instructions' });
          } else {
            return done(err);
          }
        });
      }
    ], function(err) {
      return res.status(422).json({ message: err });
    });
  },
  reset_password:(req,res,next)=>{
      User.findOne({
        reset_password_token: req.body.token,
        reset_password_expires: {
          $gt: Date.now()
        }
      }).exec(function(err, user) {
        if (!err && user) {
          if (req.body.newPassword === req.body.verifyPassword) {
            user.hash_password = bcrypt.hashSync(req.body.newPassword, 10);
            user.reset_password_token = undefined;
            user.reset_password_expires = undefined;
            user.save(function(err) {
              if (err) {
                return res.status(422).send({
                  message: err
                });
              } else {
                var data = {
                  to: user.email,
                  from: email,
                  template: 'reset-password-email',
                  subject: 'Password Reset Confirmation',
                  context: {
                    name: user.fullName.split(' ')[0]
                  }
                };
    
                smtpTransport.sendMail(data, function(err) {
                  if (!err) {
                    return res.json({ message: 'Password reset' });
                  } else {
                    return done(err);
                  }
                });
              }
            });
          } else {
            return res.status(422).send({
              message: 'Passwords do not match'
            });
          }
        } else {
          return res.status(400).send({
            message: 'Password reset token is invalid or has expired.'
          });
        }
      });
    
  },


  googleOAuth: async (req, res, next) => {
    // Generate token
    console.log('got here');
    const token = signToken(req.user);
    res.status(200).json({ token });
  },

  updateUser:(req, res, next)=>{
    // User.findByIdAndUpdate({_id:req.params.id},req.body).then(function(){
    //   User.findOne({_id:req.params.id}).then(function(user){
    //     res.send(user);
    //   });
    // });

      User.findById({_id:req.user.id},function(err, user){
        if(!user){
          return res.json({message:'no account found'});
        }

        //to trim
        // const email = req.body.email.trim();
        // const firstname = req.body.firstname.trim();
        // const lastname = req.body.lastname.trim();

        const email = req.body.email;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;

        //validate
        if(!email || !firstname || !lastname){
          return res.json({message:'one of the field is empty'});
        }

        
        user.local.email = email; 
        user.first_name = firstname;
        user.last_name = lastname;

        user.save(function (err) {
          res.send(user);
      });
       

     });
  },

  deleteUser:(req,res, next)=>{
    User.findByIdAndRemove({_id:req.user.id}).then(function(user){
      if(user){
        res.send('deleted user'+user);
      }
      else{
        res.json({message:'user not found'});
      }
    });
  },

  viewUser:(req, res, next)=>{
    User.findById({_id:req.user.id}).then(function(user){
      if(user){
        res.json(user);
      }
      else{
        res.json({message:'user not found'});
      }
    });
  },

  changePassword: (req, res, next)=>{
    User.findById({_id:req.user.id}).then(function(user){
      const oldPassword=req.body.oldPassword;
      const newPassword=req.body.newPassword;

      const validate=bcrypt.compare(oldPassword, user.local.password);

      if(validate){
        // Generate a salt
        const salt = bcrypt.genSalt(10);
        // Generate a password hash (salt + hash)
        const passwordHash = bcrypt.hash(newPassword, salt);

        user.local.password=passwordHash;
        user.save(function (err) {
          res.send(user);
        });
      }
      else{
        res.send('wrong password');
      }
    });
  },
  
  secret: async (req, res, next) => {
    console.log('I managed to get here!');
    res.json({ secret: "resource" });
  }
}
const express                   = require('express');
const router                    = require('express-promise-router')();

const passport                  = require('passport');
const passportConf              = require('../passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const UsersController           = require('../controllers/users');
const QuizController            = require('../controllers/quiz');

const passportSignIn            = passport.authenticate('local', { session: false });
const passportJWT               = passport.authenticate('jwt', { session: false });

const multer 		                = require('multer');
const path			                = require('path');


router.route('/signup')
  .post(validateBody(schemas.authSchema), UsersController.signUp);

router.route('/signin')
  .post(passportSignIn, UsersController.signIn);

router.route('/oauth/google')
  .post(passport.authenticate('googleToken', { session: false }), UsersController.googleOAuth);

//in headers (x-auth-token: token) 
router.route('/secret')
  .get(passportJWT, UsersController.secret);

router.route('/update')
  .put(passportJWT, UsersController.updateUser);

router.route('/delete')
  .delete(passportJWT, UsersController.deleteUser);

router.route('/view')
  .get(passportJWT, UsersController.viewUser);

router.route('/changePassword')
  .post(passportJWT, UsersController.changePassword);

router.route('/index')
    .get((req, res)=>res.render('index'));
  
router.route('/uploadImage')
    .post(QuizController.uploadImage);

  // router.route('/getQuiz')
  //   .get(QuizController.getQuiz);

  router.route('/getQuiz')
    .get(passportJWT,QuizController.getQuiz);

  router.route('/saveResult')
    .post(passportJWT,QuizController.saveResult);

  router.route('/analysis')
    .get(QuizController.analysis);

    const storage = multer.diskStorage({
      destination: './uploads',
      filename: function(req, file, callback){
        callback(null,file.originalname + '-' + Date.now() + path.extname(file.originalname));

      }

  });
  const upload = multer({
      storage: storage,
      // limits:{fileSize: 1000000},
      fileFilter: function(req, file, cb){
        checkFileType(file, cb);
      }
  });

  // Check File Type
  function checkFileType(file, cb){
      // Allowed ext
      const filetypes = /jpeg|jpg|png|gif/;
      // Check ext
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
       // Check mime
      const mimetype = filetypes.test(file.mimetype);

      if(mimetype && extname){
          return cb(null,true);
      } else {
          cb('Error: Images Only!');
      }
  }

  router.route('/createQuestion')
    .post(upload.single('myImage'),QuizController.createQuestion);

  router.route('/yogaSutras')
    .post(QuizController.yogaSutras);
    

  // router.route('/forgotpassword') //
  //   .post(validateBody(schemas.authSchema), UsersController.forgot_password);

  // router.route('/reset_password') //
  //   // .get(UsersController.render_reset_password_template)
  //   .post(UsersController.reset_password);

  


module.exports = router;
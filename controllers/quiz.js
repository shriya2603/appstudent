const Quiz          = require('../models/quiz');
const multer 		= require('multer');
const ejs 			= require('ejs');
const path			= require('path');


module.exports = {

    uploadImage:(req,res)=>{
       //set storage engine 
        const storage = multer.diskStorage({
            destination: './public/uploads/',
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
        }).single('myImage');
  
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
        upload(req, res,(err) => {
            if(err){
              res.render('index', {
                msg: err
              });
            } else {
              if(req.file == undefined){
                res.render('index', {
                  msg: 'Error: No File Selected!'
                });
              } else {
                      const newImage = new Quiz();
                      newImage.imageName=req.file.filename;
                      newImage.save(res.render('index', {
                        msg: 'File Uploaded!',
                        file: `/uploads/${req.file.filename}`
                }));
                         
              }
            }
        });





    }


}
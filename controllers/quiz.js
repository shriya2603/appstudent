const Quiz      = require('../models/quiz');
const Result    = require('../models/result');
const multer 		= require('multer');
const ejs 			= require('ejs');
const path			= require('path');


module.exports = {

  uploadImage:(req,res)=>{//this is with views
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





  },

  

  // getQuiz:(req, res)=>{
  //   Quiz.find({thematic:req.body.thematic}).then(function(quiz){
  //     const question =quiz[Math.floor(Math.random()*quiz.length)];
  //     // console.log(question);
  //     if(question!=null){
  //       res.json({question});
  //     }
  //     else{
  //       res.json({message:'quiz of this thematic not found'});
  //     }
  //   });
  // },
  getQuiz:(req, res)=>{
    Quiz.find({thematic:req.params.thematic}).then(function(quiz){
      const question =quiz[Math.floor(Math.random()*quiz.length)];
      // console.log(question);
      if(question!=null){
        res.json({question});
      }
      else{
        res.json({message:'quiz of this thematic not found'});
      }
    });
  },

  saveResult:(req,res)=>{
    const newResult=new Result();
    newResult.userId=req.body.userId;
    newResult.quizId=req.body.quizId;
    newResult.userResult=req.body.userResult;

    newResult.save(function (err) {
      if (err) {
          console.log("Saving Result Failed.." + err);
          res.json({ success: false, data: err });
      }
      else {
          console.log("Result is Saved..",newResult.userResult);
          res.json({ success: true, data: newResult });
      }
    });


  },

  analysis:(req,res)=>{
    
    Quiz.findById({_id:req.body.id}).then(function(quiz){
      const o1=quiz.option1;
      const p1=quiz.point1;

      const o2=quiz.option2;
      const p2=quiz.point2;

      // const o3=quiz.option3;
      // const p3=quiz.point3;

      // const o4=quiz.option4;
      // const p4=quiz.point4;
      console.log(p1);
      console.log(p2);
     
      
      // const maxPoint=Math.max(p1,p2,p3,p4);
      const maxPoint=Math.max(p1,p2);

      console.log(maxPoint);

      G1=(p1-1)/(maxPoint-1);
      G2=(p2-1)/(maxPoint-1);
      // G3=(p3-1)/(maxPoint-1);
      // G4=(p4-1)/(maxPoint-1);

      Result.find({quizId:req.body.id}).then(function(result){
        // console.log(result[0].userResult);
        const r=result.length;
        // console.log(r);
        let numberUserselected1=0;
        let numberUserselected2=0;
        // let numberUserselected3=0;
        // let numberUserselected4=0;
        var i=result.length-1;
        do{
          
          
          if(result[i].userResult==o1){
            numberUserselected1=numberUserselected1+1;
          }else if(result[i].userResult==o2){
            numberUserselected2=numberUserselected2+1;
          }else if(result[i].userResult==o3){
            numberUserselected3=numberUserselected3+1;
          }else{
            numberUserselected4=numberUserselected4+1;
          }
          i=i-1;
        }while(i>0);
        console.log(numberUserselected2);

        const percentage1=(numberUserselected1/4);
        const percentage2=(numberUserselected2/4);
        // const percentage3=(numberUserselected3/5);
        // const percentage4=(numberUserselected4/5);
        console.log(percentage2);

        const pp1=percentage1*G1;
        const pp2=percentage2*G2;
        // const pp3=percentage3*G3;
        // const pp4=percentage4*G4;
        
        // const totalGradeScore=pp1+pp2+pp3+pp4;
        const totalGradeScore=pp1+pp2;
        res.json({totalGradeScore});
      });
    });
  },
  createQuestion:(req,res)=>{//
    const newQuiz = new Quiz();
    newQuiz.question=req.body.question;
    newQuiz.option1=req.body.option1;
    newQuiz.point1=req.body.point1;

    newQuiz.option2=req.body.option2;
    newQuiz.point2=req.body.point2;

    newQuiz.option3=req.body.option3;
    newQuiz.point3=req.body.point3;
    
    newQuiz.option4=req.body.option4;
    newQuiz.point4=req.body.point4;

    newQuiz.rightAnswer=req.body.rightAnswer;
    newQuiz.imageName=req.file.path;
    newQuiz.yogaSutra=req.body.yogaSutra;
    newQuiz.thematic=req.body.thematic;
    
    newQuiz.save(function (err) {
      res.send(newQuiz.question);
    });
    

  },
  yogaSutras:(req,res)=>{
    Quiz.findById({_id:req.body.id}).then(function(quiz){
      const quizsutra = new Quiz();
      const yogaSutra=quiz.yogaSutra;
      res.json({yogaSutra});

    });

  }

  
}

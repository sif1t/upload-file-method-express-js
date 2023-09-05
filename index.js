const express = require('express');
const multer = require("multer");
const path = require("path");

//File upload folder 
const UPLOADS_FOLDER = "./uploads/";

//define the storage
const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, UPLOADS_FOLDER );
    },
    filename:(req, file, cd) => {
        const fileExt = path.extname(file.originalname);
        const fileName = file.originalname
                              .replace(fileExt,"")
                              .toLowerCase()
                              .split ("")
                              .join ("-")+"-" + Date.now();
        cd(null, fileName + fileExt);

    },
});

//preapre the final multer upload object
var upload = multer({
   storage:storage,
   limits: {
     fileSize: 1000000, //1mb
   },
   fileFilter: (req, file, cd) => {
    if (file.fieldname === "avatar"){
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        cd (null, true);
      } else {
        cd (new Error("only .jpg, .png or .jpg formet allow!"));
      }
    } else if (file.fieldname === "doc"){
        if(file.mimetype === "application/pdf"){
            cd (null, true);
        }else {
            cd (new Error("only .pdf formet allowed!"));
        }
    } else {
        cd (new Error("There was an unknow error!"));
    }
   },
});

const app = express();

//application route
app.post('/', upload.fields([
    {name: 'avatar', maxCount:1},
    {name: 'doc', maxCount: 1}]
    ), (req, res) => {
    res.send ('hello world');
});

// default error handler 
app.use((err, req, res, next) => {
     if(err){
        if(err instanceof multer.MulterError){
            res.status(500).send ("There was an upload error!");
        }else{
          res.status(500).send (err.message);
        }
    }else{
        res.send('succes');
     }
});



app.listen (3000, () => {
    console.log ("app listening at poirt 3000");
});


'use strict';

let express = require('express');
let router = express.Router();

// model
let imports = require('../models/imports');

let moment = require('moment');
let _ = require('lodash');
let fse = require('fs-extra');
let rimraf = require('rimraf');
let JSZip = require('jszip');
let fs = require('fs');
let path = require('path');

let multer  = require('multer');
let uploadDir = './public/uploads';
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fse.ensureDirSync(uploadDir);
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

let upload = multer({ storage: storage });

/* GET home page. */
router.post('/smokings', upload.single('file'), (req, res, next) => {

  let db = req.db;

  let filePath = req.file.path;
  let tmpDir = './extracted/' + moment().format('x');

  fse.ensureDirSync(tmpDir);

  fs.readFile(filePath, function (err, data) {
    if (err) throw err;

    let zip = new JSZip();

    zip.loadAsync(data)
      .then(function (zip) {
        //console.log(zip);
        // you now have every files contained in the loaded zip
        zip.file("smoking.txt").async("string")
          .then(_data => {
            let tmpFile = path.join(tmpDir, 'smoking.txt');
            fs.writeFileSync(tmpFile, _data);

            imports.smoking(db, tmpFile)
              .then(() => {
                rimraf.sync(filePath);
                rimraf.sync(tmpDir);
                res.send({ ok: true });
              }, err => {
                console.log(err);
                res.send({ ok: false, msg: err });
              });
          }, err => {
            console.log(err);
            res.send({ ok: false, msg: err });
          });
      });

  });

});


module.exports = router;

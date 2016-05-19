'use strict';

let express = require('express');
let router = express.Router();

let Encrypt = require('../models/encrypt');
let Labfu = require('../models/labfu.js');
let Person = require('../models/person');
let Chronicfu = require('../models/chronicfu');
let Services = require('../models/service');
let Admission = require('../models/admission');
let CommunityService = require('../models/community_service');
let DiagnosisOpd = require('../models/diagnosis_opd');
let DiagnosisIpd = require('../models/diagnosis_ipd');
let ProcedureOpd = require('../models/procedure_opd');
let DrugOpd = require('../models/drug_opd');
let ChargeOpd = require('../models/charge_opd');
let ChargeIpd = require('../models/charge_ipd');
let DrugIpd = require('../models/drug_ipd');
let Allergy = require('../models/drugallergy');

let ProcedureIpd = require('../models/procedure_ipd');

/* GET home page. */
router.get('/', (req, res, next) => {
  //
  // let string = 'Satit Rianpit';
  // let encrypt_text = encrypt.encrypt(string);
  // let decrypt_text = encrypt.decrypt(encrypt_text);

  res.send({ok: true, msg: 'Welcome to iChronic Server 2 service'})
});

router.post('/labfu', (req, res, next) => {

  let db = req.db;
  let cid = req.body.cid;
  let labcode = req.body.labcode;
  // Get hpid
  Person.getHpid(db, cid)
    .then(rows => {
      let hpid = [];
      rows.forEach(v => {
        hpid.push(v.hpid);
      });

      return Labfu.getLabHistory(db, hpid, labcode);
    })
    .then(rows => res.send({ok: true, rows: rows}), err => res.send({ok: false, msg: err}));

});

router.post('/chronicfu', (req, res, next) => {

  let db = req.db;
  let cid = req.body.cid;
  // Get hpid
  Person.getHpid(db, cid)
    .then(rows => {
      let hpid = [];
      rows.forEach(v => {
        hpid.push(v.hpid);
      });

      return Chronicfu.getFu(db, hpid);
    })
    .then(rows => res.send({ok: true, rows: rows}), err => res.send({ok: false, msg: err}));

});

router.post('/services', (req, res, next) => {

  let db = req.db;
  let cid = req.body.cid;
  // Get hpid
  Person.getHpid(db, cid)
    .then(rows => {
      let hpid = [];
      rows.forEach(v => {
        hpid.push(v.hpid);
      });

      return Services.getServices(db, hpid);
    })
    .then(rows => res.send({ok: true, rows: rows}), err => res.send({ok: false, msg: err}));

});

router.post('/admission', (req, res, next) => {

  let db = req.db;
  let cid = req.body.cid;
  // Get hpid
  Person.getHpid(db, cid)
    .then(rows => {
      let hpid = [];
      rows.forEach(v => {
        hpid.push(v.hpid);
      });

      return Admission.getAdmission(db, hpid);
    })
    .then(rows => res.send({ok: true, rows: rows}), err => res.send({ok: false, msg: err}));

});

router.post('/labfu/service', (req, res, next) => {

  let db = req.db;
  let cid = req.body.cid;
  // Get hpid
  Person.getHpid(db, cid)
    .then(rows => {
      let hpid = [];
      rows.forEach(v => {
        hpid.push(v.hpid);
      });

      return Labfu.getService(db, hpid);
    })
    .then(rows => res.send({ok: true, rows: rows}), err => res.send({ok: false, msg: err}));

});

router.post('/labfu/list', (req, res, next) => {

  let db = req.db;
  let hospcode = req.body.hospcode;
  let pid = req.body.pid;
  let seq = req.body.seq;

  if (!hospcode || !pid || !seq) {
    res.send({ok: false, msg: 'Incorrect parameters'})
  } else {
    Labfu.getLabTest(db, hospcode, pid, seq)
      .then(rows => res.send({ok: true, rows: rows}), err => res.send({ok: false, msg: err}));
  }

});

router.post('/labfu/creatinine', (req, res, next) => {

  let db = req.db;
  let cid = req.body.cid;

  if(!cid) {
    res.send({ok: false, msg: 'Incorrect parameters'})
  } else {
    Person.getHpid(db, cid)
      .then(rows => {
        let hpid = [];
        rows.forEach(v => {
          hpid.push(v.hpid);
        });

        return Labfu.getCreatinine(db, hpid);
      })
      .then(rows => res.send({ok: true, rows: rows}), err => res.send({ok: false, msg: err}));
  }

});

router.post('/community_service', (req, res, next) => {

  let db = req.db;
  let cid = req.body.cid;
  // Get hpid
  Person.getHpid(db, cid)
    .then(rows => {
      let hpid = [];
      rows.forEach(v => {
        hpid.push(v.hpid);
      });

      return CommunityService.getService(db, hpid);
    })
    .then(rows => res.send({ok: true, rows: rows}), err => res.send({ok: false, msg: err}));

});

router.post('/services/info', (req, res, next) => {

  let db = req.db;
  let hospcode = req.body.hospcode;
  let pid = req.body.pid;
  let seq = req.body.seq;

  if (!hospcode || !pid || !seq) {
    res.send({ok: false, msg: 'Incorrect parameters'})
  } else {
    Services.getServiceInfo(db, hospcode, pid, seq)
      .then(rows => res.send({ok: true, rows: rows}), err => res.send({ok: false, msg: err}));
  }

});

router.post('/services/diagnosis_opd', (req, res, next) => {

  let db = req.db;
  let hospcode = req.body.hospcode;
  let pid = req.body.pid;
  let seq = req.body.seq;

  if (!hospcode || !pid || !seq) {
    res.send({ok: false, msg: 'Incorrect parameters'})
  } else {
    DiagnosisOpd.getDiag(db, hospcode, pid, seq)
      .then(rows => res.send({ok: true, rows: rows}), err => res.send({ok: false, msg: err}));
  }

});


router.post('/services/procedure_opd', (req, res, next) => {

  let db = req.db;
  let hospcode = req.body.hospcode;
  let pid = req.body.pid;
  let seq = req.body.seq;

  if (!hospcode || !pid || !seq) {
    res.send({ok: false, msg: 'Incorrect parameters'})
  } else {
    ProcedureOpd.getProcedure(db, hospcode, pid, seq)
      .then(rows => res.send({ok: true, rows: rows}), err => res.send({ok: false, msg: err}));
  }

});

router.post('/services/drug_opd', (req, res, next) => {

  let db = req.db;
  let hospcode = req.body.hospcode;
  let pid = req.body.pid;
  let seq = req.body.seq;

  if (!hospcode || !pid || !seq) {
    res.send({ok: false, msg: 'Incorrect parameters'})
  } else {
    DrugOpd.getDrug(db, hospcode, pid, seq)
      .then(rows => res.send({ok: true, rows: rows}), err => res.send({ok: false, msg: err}));
  }

});

router.post('/services/charge_opd', (req, res, next) => {

  let db = req.db;
  let hospcode = req.body.hospcode;
  let pid = req.body.pid;
  let seq = req.body.seq;

  if (!hospcode || !pid || !seq) {
    res.send({ok: false, msg: 'Incorrect parameters'})
  } else {
    ChargeOpd.getCharge(db, hospcode, pid, seq)
      .then(rows => res.send({ok: true, rows: rows}), err => res.send({ok: false, msg: err}));
  }

});

router.post('/services/procedure_ipd', (req, res, next) => {

  let db = req.db;
  let hospcode = req.body.hospcode;
  let pid = req.body.pid;
  let an = req.body.an;

  if (!hospcode || !pid || !an) {
    res.send({ok: false, msg: 'Incorrect parameters'})
  } else {
    ProcedureIpd.getProcedure(db, hospcode, pid, an)
      .then(rows => res.send({ok: true, rows: rows}), err => res.send({ok: false, msg: err}));
  }

});

router.post('/services/drug_ipd', (req, res, next) => {

  let db = req.db;
  let hospcode = req.body.hospcode;
  let pid = req.body.pid;
  let an = req.body.an;

  if (!hospcode || !pid || !an) {
    res.send({ok: false, msg: 'Incorrect parameters'})
  } else {
    DrugIpd.getDrug(db, hospcode, pid, an)
      .then(rows => res.send({ok: true, rows: rows}), err => res.send({ok: false, msg: err}));
  }

});

router.post('/services/charge_ipd', (req, res, next) => {

  let db = req.db;
  let hospcode = req.body.hospcode;
  let pid = req.body.pid;
  let an = req.body.an;

  if (!hospcode || !pid || !an) {
    res.send({ok: false, msg: 'Incorrect parameters'})
  } else {
    ChargeIpd.getCharge(db, hospcode, pid, an)
      .then(rows => res.send({ok: true, rows: rows}), err => res.send({ok: false, msg: err}));
  }

});

router.post('/services/diagnosis_ipd', (req, res, next) => {

  let db = req.db;
  let hospcode = req.body.hospcode;
  let pid = req.body.pid;
  let an = req.body.an;

  if (!hospcode || !pid || !an) {
    res.send({ok: false, msg: 'Incorrect parameters'})
  } else {
    DiagnosisIpd.getDiag(db, hospcode, pid, an)
      .then(rows => res.send({ok: true, rows: rows}), err => res.send({ok: false, msg: err}));
  }

});


// Drugallergy
router.post('/allergy', (req, res, next) => {

  let db = req.db;
  let cid = req.body.cid;
  // Get hpid
  Person.getHpid(db, cid)
    .then(rows => {
      let hpid = [];
      rows.forEach(v => {
        hpid.push(v.hpid);
      });

      return Allergy.getAllergy(db, hpid);
    })
    .then(rows => res.send({ok: true, rows: rows}), err => res.send({ok: false, msg: err}));

});

module.exports = router;

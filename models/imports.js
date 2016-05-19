'use strict';

let Q = require('q');

module.exports = {
  smoking(db, file) {
    var q = Q.defer();

    var sql = `
      LOAD DATA LOCAL INFILE ? REPLACE INTO TABLE chronic_smokings FIELDS
      TERMINATED BY "|" LINES TERMINATED BY "\r\n" IGNORE 1 ROWS
      (HOSPCODE, CID, @DATE_SERV, @UPDATED) SET DATE_SERV=STR_TO_DATE(@DATE_SERV, "%Y%m%d"), UPDATED=STR_TO_DATE(@UPDATED, "%Y%m%d%H%i%s")
      `;
    db.raw(sql, [file])
      .then(function () {
        q.resolve();
      })
      .catch(function (err) {
        q.reject(err);
      });

    return q.promise;
  }
};
'use strict';

let crypto = require('crypto'),
  algorithm = 'aes-256-ctr',
  key = '4ced64a5b5acf531b4d5852e740526d1';

module.exports = {
  encrypt(text) {
    let cipher = crypto.createCipher(algorithm, key);
    let crypted = cipher.update(text,'utf8','hex');

    crypted += cipher.final('hex');

    return crypted;
  },

  decrypt(text) {
    var decipher = crypto.createDecipher(algorithm, key);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    
    return dec;
  }
};
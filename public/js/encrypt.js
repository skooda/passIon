function decryptArea(id) {
  var area = $(id);
  var areaParts = area.value.split('|');
  area.value = passion.decrypt(location.hash.substr(1), areaParts[0], areaParts[1]);
}

(function(that) {
  /**
   * Encrypt data by assimetric encription
   */
  var encrypt = function(text) {
    var keyBytes = getRandomBytes(new Uint8Array(16));
    var ivBytes = getRandomBytes(new Uint32Array(1));

    var textBytes = aesjs.util.convertStringToBytes(text);
    var aes = new aesjs.ModeOfOperation.ctr(keyBytes, new aesjs.Counter(ivBytes));

    return {
      'key': bytesToBase64(keyBytes),
      'iv': ivBytes[0],
      'encrypted': bytesToBase64(aes.encrypt(textBytes))
    };
  };

  /**
   * Decrypt data by assimetric encription
   */
  var decrypt = function(key, iv, encrypted) {
    var keyBytes = base64ToBytes(key);
    var ivBytes = new Uint32Array([iv]);

    var textBytes = base64ToBytes(encrypted);
    var aes = new aesjs.ModeOfOperation.ctr(keyBytes, new aesjs.Counter(ivBytes));

    return aesjs.util.convertBytesToString(aes.decrypt(textBytes));
  };

  /**
   * Returns buffer filled with random bytes
   */
  var getRandomBytes = function(buffer) {
    if (!ArrayBuffer.isView(buffer)) {
      throw new TypeError("Can only work with ArrayBuffer instances (Uint8Array, Uint32Array, etc.)");
    }
    // secure method
    if (window.crypto && window.crypto.getRandomValues) {
      return window.crypto.getRandomValues(buffer);
    }
    // backward compatibility random generator (mainly for IE 10 and lower)
    var maxValue = Math.pow(256, buffer.BYTES_PER_ELEMENT);
    for (var i = 0; i < buffer.length; i++) {
      buffer[i] = Math.floor(Math.random() * maxValue);
    }

    return buffer;
  };


  // little bit tricky conversions taking place in here
  // we use aesjs hex converter first since btoa() and atob() functions don't support UTF-16 encoded strings
  var bytesToBase64 = function(bytes) {
    return btoa(aesjs.util.convertBytesToString(bytes, 'hex'));
  };

  var base64ToBytes = function(base64str) {
    return aesjs.util.convertStringToBytes(atob(base64str), 'hex');
  };

  that.passion = {
    encrypt: encrypt,
    decrypt: decrypt
  };
})(window);
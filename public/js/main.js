/**
* Some helpfull snippets
*/
String.prototype.lines = function() { return this.split(/\r*\n/); }
String.prototype.lineCount = function() { return this.lines().length - (navigator.userAgent.indexOf("MSIE") != -1); }

function $(id) {
  return document.getElementById(id);
}
/**
 * Send post request
 */
function postRequest(url, params, callback) {
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  http.onreadystatechange = function() { //Call a function when the state changes.
    if(http.readyState == 4 && http.status == 200) {
      callback(http.responseText);
    }
  };

  http.send(params);
}

/**
 * Submit data and run callback with data url
 */
function submit(data, callback) {
  data = passion.encrypt(data);

  postRequest('/set', "pass="+encodeURIComponent(data.encrypted) + "&iv="+encodeURIComponent(data.iv), function(response) {
    callback(response + "#" + data.key);
  });
}

/**
 * Update output text
 */
function updateOutput(res) {
  output = $('output');
  output.value = 'http://' + window.location.host + res;
  $('step2').style.display = 'block';
}

/**
 * Get input to encrypt
 */
function getInput(elId) {
  var input = $(elId);
  return input.value;
}

/**
 * Main translation process
 */
function doTranslation() {
  $('step1').style.display = 'none';
  var data = getInput('input');
  submit(data, updateOutput);
}

var multiline = false;

/**
 * Activate multiline mode
 */
function setMultiline() {
  multiline = true;
  $('input').className += ' multiline';
  $('tooltip-single').style.display = 'none';
  $('tooltip-multi').style.display = 'block';
}

/**
 * On dom load
 */
document.addEventListener("DOMContentLoaded", function() {
  /* Handle btn-click */
  var btn = $('btn-submit');
  btn.style.display = 'none';
  btn.addEventListener("click", doTranslation);

  /*  */
  var input = $('input');
  input.addEventListener("keyup", function(ev) {
    if (input.value.length > 0) btn.style.display = 'inline-block';
    else btn.style.display = 'none';

    if ((ev.keyCode == 10 || ev.keyCode == 13) && (!ev.ctrlKey) && (!ev.altKey) && (!ev.shiftKey) && (!ev.cmdKey) && (!ev.metaKey) && (!multiline)) {
      // ENTER without modifiers (like ALT/SHIFT/CTRL...) in "single-line" mode
      doTranslation();
    } else if ((ev.keyCode == 10 || ev.keyCode == 13) && ev.ctrlKey && multiline) {
      // ENTER with CTRL modifier in "multi-line" mode
      doTranslation();
    } else {
      // Any other key
      var lineCount = input.value.lineCount();
      input.rows = lineCount + 1;

      if (lineCount > 1) setMultiline();
    }
  })
});


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

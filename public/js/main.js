/**
* Some helpfull snippets
*/
String.prototype.lines = function() { return this.split(/\r*\n/); }
String.prototype.lineCount = function() { return this.lines().length - (navigator.userAgent.indexOf("MSIE") != -1); }

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
  data = encrypt(data);

  postRequest('/set', "pass="+encodeURIComponent(data.encrypted), function(response) {
    callback(response + "#" + data.privateKey);
  });
}

/**
 * Update output text
 */
function updateOutput(res) {
  output = document.getElementById('output');
  output.value = 'http://' + window.location.host + res;
  document.getElementById('step2').style.display = 'block';
}

/**
 * Get input to encrypt
 */
function getInput(elId) {
  input = document.getElementById(elId);
  return input.value;
}

/**
 * Main translation process
 */
function doTranslation() {
  document.getElementById('step1').style.display = 'none';
  data = getInput('input');
  submit(data, updateOutput);
}

var multiline = false;
/**
 * On dom load
 */
document.addEventListener("DOMContentLoaded", function() {
  /* Handle btn-click */
  btn = document.getElementById('btn-submit');
  btn.style.display = 'none';
  btn.addEventListener("click", doTranslation);

  /*  */
  input = document.getElementById('input');
  input.addEventListener("keyup", function(ev) {
    if (input.value.length > 0) btn.style.display = 'inline-block';
    else btn.style.display = 'none';

    if ((ev.keyCode == 10 || ev.keyCode == 13) && (!ev.ctrlKey) && (!ev.altKey) && (!ev.shiftKey) && (!ev.cmdKey) && (!ev.metaKey) && (!multiline)) { // ENTER/RETURN KEY without modifiers (like ALT/SHIFT/CTRL...)
      doTranslation();
    } else {
      lineCount = input.value.lineCount();
      input.rows = lineCount + 1;

      if (lineCount > 1) {
        input.className += ' multiline';
        multiline = true;
      }
    }
  })


});

/**
 * Encrypt data by assimetric encription
 */
function encrypt(text) {
    enc = new JSEncrypt();
    enc.getKey();

    return {
        'privateKey': enc.getPrivateKeyB64(),
        'publicKey': enc.getPublicKeyB64(),
        'encrypted': enc.encrypt(text)
    };
}

/**
 * Decrypt data by assimetric encription
 */
function decrypt(privateKey, encrypted) {
  enc = new JSEncrypt();
  enc.setPrivateKey(privateKey);

  return enc.decrypt(encrypted);
}

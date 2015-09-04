/**
 * Send post request
 */
function postRequest(url, params, callback) {
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  http.onreadystatechange = function() {//Call a function when the state changes.
    if(http.readyState == 4 && http.status == 200) {
      callback(http.responseText);
    }
  }

  http.send(params);
}

/**
 * Submit password and run callback with password url
 */
function submit(password, callback) {
  var url = "/set";
  var params = "pass="+data;
  postRequest(url, params, callback);
}

function updateOutput(res) {
  output = document.getElementById('output');
  output.innerHTML = 'Heslo dostupné na URL: ' + window.location.host + res;
}

function getInput(elId) {
  input = document.getElementById(elId);
  return input.value;
}

function doTranslation() {
  data = getInput('data');
  submit(data, updateOutput);
}

document.addEventListener("DOMContentLoaded", function() {
  btn = document.getElementById('btn-send');
  btn.addEventListener("click", doTranslation);
});
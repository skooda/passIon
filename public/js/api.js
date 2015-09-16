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
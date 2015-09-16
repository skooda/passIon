/**
* Some helpfull snippets
*/
String.prototype.lines = function() { return this.split(/\r*\n/); }
String.prototype.lineCount = function() { return this.lines().length - (navigator.userAgent.indexOf("MSIE") != -1); }

function $(id) {
  return document.getElementById(id);
}
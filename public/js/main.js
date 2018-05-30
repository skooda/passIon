/**
 * Update output text
 */
function updateOutput(res) {
  output = $('output');
  output.value = window.location.protocol + '//' + window.location.host + res;
  $('step2').style.display = 'block';
  selectOutput();
}

/**
 * Main translation process
 */
function doTranslation() {
  $('step1').style.display = 'none';
  var data = $('input').value;
  submit(data, updateOutput);
}

/**
 * If str looks like an url, do a redirect
 */
function attemptRedirect(str) {
    if (isUrl(str)) {
        window.location.href = str;
    }
}

/**
 * Returns true if str looks like an URL (without any additional text)
 */
function isUrl(str) {
    // Used @stephenhay (38 chars) regex from https://mathiasbynens.be/demo/url-regex
    // for its simplicity and greediness (better match all urls than not matching a weird url)
    return /^\s*(https?|ftp):\/\/[^\s\/$.?#].[^\s]*\s*$/i.test(str);
}

/**
 * Activate multiline mode
 */
var multiline = false;

function setMultiline() {
  multiline = true;
  $('input').className += ' multiline';
  $('tooltip-single').style.display = 'none';
  $('tooltip-multi').style.display = 'block';
}

function handleKeyDown(ev, element, multiline) {
    if (element.value.length > 0) $('btn-submit').style.display = 'inline-block';
    else $('btn-submit').style.display = 'none';

    if (isUrl(element.value)) $('redirect-notice').style.display = 'block';
    else $('redirect-notice').style.display = 'none';

    if ((ev.keyCode == 10 || ev.keyCode == 13) && (!ev.ctrlKey) && (!ev.altKey) && (!ev.shiftKey) && (!ev.cmdKey) && (!ev.metaKey) && (!multiline)) {
      // ENTER without modifiers (like ALT/SHIFT/CTRL...) in "single-line" mode
      ev.preventDefault();
      doTranslation();
      return false;
    }

    if ((ev.keyCode == 10 || ev.keyCode == 13) && ev.ctrlKey && multiline) {
      // ENTER with CTRL modifier in "multi-line" mode
      ev.preventDefault();
      doTranslation();
      return false;
    }

    // Any other key
    var lineCount = element.value.lineCount();
    element.rows = lineCount + 1;

    if (lineCount > 1) setMultiline();
}

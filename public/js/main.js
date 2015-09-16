/**
 * Update output text
 */
function updateOutput(res) {
  output = $('output');
  output.value = 'http://' + window.location.host + res;
  $('step2').style.display = 'block';
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

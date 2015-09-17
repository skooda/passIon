function selectOutput()
{
  $('output').focus();
  $('output').select();
}

function copyToClipboard(ev)
{
  selectOutput();
  if (! document.execCommand('copy')) {
    window.prompt("Copy to clipboard is blocked by your browser privacy policy. You can copy using system-wide keyboard shortcut from following input:", $('output').value);
  };
}
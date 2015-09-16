function selectOutput()
{
  $('output').focus();
  $('output').select();
}

function copyToClipboard(ev)
{
  selectOutput();
  document.execCommand('copy');
}
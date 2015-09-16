/**
 * Common information slider/rollup functions
 */

function hideRollup() {
  $('rollup-inner').className = 'hidden';
}

function showRollup() {
  $('rollup-inner').className = '';
}

function toggleRollup() {
  if ($('rollup-inner').className == '') {
    hideRollup();
  } else {
    showRollup();
  }
}
// Helper to format seconds into a human-friendly string
function formatElapsed(seconds, hours = false) {
  if (!seconds && seconds !== 0) return '';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours && hrs > 0) return `${hrs} hour${hrs === 1 ? '' : 's'}`;
  if (mins > 0) return `${mins} minute${mins === 1 ? '' : 's'}`;
  return `${secs} second${secs === 1 ? '' : 's'}`;
}

function parseInterval(value) {
  // accepts strings like '10s', '30s', '1m', '5m', '10m', '30m', '60m'
  const num = parseFloat(value);
  if (value.endsWith('s')) return num * 1000;
  if (value.endsWith('m')) return num * 60 * 1000;
  return num;
}


function formatTimeRemaining(ms) {
  if (ms <= 0) return '0s';
  const totalSeconds = Math.ceil(ms / 1000);
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}m ${secs}s`;
}

export { formatElapsed, parseInterval, formatTimeRemaining };
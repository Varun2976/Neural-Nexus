// Shield Extension - Background Service Worker (MV3)

chrome.runtime.onInstalled.addListener(() => {
  console.log('Shield Extension installed');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SCAN_RESULT') {
    // Handle scan results from content scripts
    console.log('Scan result received:', message.data);
  }
  return true;
});

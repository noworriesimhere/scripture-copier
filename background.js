chrome.runtime.onInstalled.addListener(() => {
  console.log('JW.org Scripture Copier installed!');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'copyScripture') {
    chrome.permissions.request({ permissions: ['clipboardWrite'] }, granted => {
      if (granted) {
        navigator.clipboard.writeText(request.scriptureText)
          .then(() => {
            console.log('Scripture copied:', request.scriptureText);
            sendResponse({ success: true });
          })
          .catch(error => {
            console.error('Error copying scripture:', error);
            sendResponse({ success: false, error });
          });
      } else {
        console.error('Permission to write to clipboard not granted.');
        sendResponse({ success: false, error: 'Permission not granted.' });
      }
    });

    return true;
  }
});

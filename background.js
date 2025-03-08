chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('datosabiertos.gob.pe')) {
      chrome.action.openPopup();
    }
});
function extractLastPathSegment(url) {
    const regex = /\/([^\/]+)$/;
    const match = url.match(regex);
    return match ? match[1] : null;  // Return the extracted segment or null if no match
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('datosabiertos.gob.pe/dataset')) {
        fetch(`https://rodcar.github.io/open-ideas/json/${extractLastPathSegment(tab.url)}.json`, {
            cache: 'no-store'
        })
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                chrome.action.openPopup();
            }
        })
        .catch(error => {
            console.error('Failed to fetch data:', error);
        });
    }
});
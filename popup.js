function extractLastPathSegment(url) {
    const regex = /\/([^\/]+)$/;
    const match = url.match(regex);
    return match ? match[1] : null;  // Return the extracted segment or null if no match
}

window.addEventListener('load', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = encodeURIComponent(tab.url);
  
    try {
      //const response = await fetch(`https://example.com/data?url=${url}`);
      const response = await fetch(`https://rodcar.github.io/open-ideas/json/${extractLastPathSegment(tab.url)}.json`);
      const data = await response.json();
      //document.getElementById('result').textContent = JSON.stringify(data, null, 2);
      document.getElementById('result').textContent = data.complementary_info;
    } catch (error) {
      //console.error('Failed to fetch data:', error);
      document.getElementById('result').textContent = 'Failed to load data';
    }
});
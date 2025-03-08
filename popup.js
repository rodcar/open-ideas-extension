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
      const response = await fetch(`https://rodcar.github.io/open-ideas/json/${extractLastPathSegment(tab.url)}.json`, {
        cache: 'no-store'
      });
      const data = await response.json();
      const resultElement = document.getElementById('result');
      resultElement.textContent = data.complementary_info;
      console.log(data);

      // Create a card element to display the data
      const card = document.createElement('div');
      card.className = 'p-4 bg-white rounded shadow';
      card.innerHTML = `
          <h2 class="text-lg font-semibold mb-2">${data.title}</h2>
          <p class="text-gray-700 mb-2">${data.description}</p>
          <p class="text-gray-700"><strong>Técnica:</strong> ${data.technique}</p>
          <p class="text-gray-700"><strong>Columnas:</strong> ${data.columns}</p>
      `;

      // Append the card to the ideasList
      document.getElementById('ideasList').appendChild(card);

      // Hide the skeleton loading card
      document.querySelector('.animate-pulse').style.display = 'none';
    } catch (error) {
      //console.error('Failed to fetch data:', error);
      document.getElementById('result').textContent = 'Failed to load data';
    }
});
function extractLastPathSegment(url) {
    const regex = /\/([^\/]+)$/;
    const match = url.match(regex);
    return match ? match[1] : null;  // Return the extracted segment or null if no match
}

function highlightCapsWords(text) {
    return text.replace(/\b([A-Z_]+)\b/g, '<span class="text-red-500 font-medium font-mono">$1</span>');
}

function saveIdea(idea) {
    let savedIdeas = JSON.parse(localStorage.getItem('savedIdeas')) || [];
    savedIdeas.push(idea);
    localStorage.setItem('savedIdeas', JSON.stringify(savedIdeas));
}

function loadSavedIdeas() {
    const savedIdeas = JSON.parse(localStorage.getItem('savedIdeas')) || [];
    const ideasList = document.getElementById('ideasList');
    ideasList.innerHTML = '';

    savedIdeas.forEach(item => {
        const card = document.createElement('div');
        card.className = 'p-4 bg-white rounded shadow';
        card.innerHTML = `
            <h2 class="text-lg font-semibold mb-2"><i class="fa-solid ${item.type}"></i> ${item.title}</h2>
            <p class="text-gray-700 mb-2">${item.description}</p>
            <p class="text-gray-700"><strong>Técnica:</strong> ${item.technique}</p>
            <p class="text-gray-700"><strong>Columnas:</strong> ${highlightCapsWords(item.columns)}</p>
        `;
        ideasList.appendChild(card);
    });
}

let showingSavedIdeas = false;

function toggleSavedIdeas() {
    const showSavedIdeasButton = document.getElementById('showSavedIdeas');
    if (showingSavedIdeas) {
        loadCurrentIdeas();
        showSavedIdeasButton.innerHTML = '<i class="fa-solid fa-archive"></i>';
    } else {
        loadSavedIdeas();
        showSavedIdeasButton.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
    }
    showingSavedIdeas = !showingSavedIdeas;
}

function loadCurrentIdeas() {
    // Re-fetch and display the current ideas
    window.dispatchEvent(new Event('load'));
}

function animateLikeButton(button) {
    button.classList.add('animate-like');
    setTimeout(() => {
        button.classList.remove('animate-like');
    }, 500); // Duration of the animation
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

      // Clear the existing ideas list
      const ideasList = document.getElementById('ideasList');
      ideasList.innerHTML = '';

      // Iterate over the data list and create a card for each item
      data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'p-4 bg-white rounded shadow relative';
        card.innerHTML = `
          <h2 class="text-lg font-semibold mb-2"><i class="fa-solid ${item.type}"></i> ${item.title}</h2>
          <p class="text-gray-700 mb-2">${item.description}</p>
          <p class="text-gray-700 mb-2"><strong>Técnica:</strong> ${item.technique}</p>
          <p class="text-gray-700 mb-2"><strong>Columnas:</strong> ${highlightCapsWords(item.columns)}</p>
          <button class="like-button absolute top-2 right-2 border border-gray-500 text-gray-500 w-10 h-10 rounded-full flex items-center justify-center">
            <i class="fa-solid fa-thumbs-up"></i>
          </button>
        `;
        const likeButton = card.querySelector('.like-button');
        likeButton.addEventListener('click', () => {
            saveIdea(item);
            animateLikeButton(likeButton);
        });
        ideasList.appendChild(card);
      });

      // Hide the skeleton loading card
      document.querySelector('.animate-pulse').style.display = 'none';
    } catch (error) {
      //console.error('Failed to fetch data:', error);
      document.getElementById('result').textContent = 'Failed to load data';
    }
});

document.getElementById('showSavedIdeas').addEventListener('click', toggleSavedIdeas);
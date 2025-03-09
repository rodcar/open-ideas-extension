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

function deleteIdea(index) {
    let savedIdeas = JSON.parse(localStorage.getItem('savedIdeas')) || [];
    savedIdeas.splice(index, 1);
    localStorage.setItem('savedIdeas', JSON.stringify(savedIdeas));
    loadSavedIdeas();
}

function loadSavedIdeas() {
    const savedIdeas = JSON.parse(localStorage.getItem('savedIdeas')) || [];
    const ideasList = document.getElementById('ideasList');
    ideasList.innerHTML = '';

    // Reverse the savedIdeas array to show the most recently saved ideas first
    savedIdeas.reverse();

    savedIdeas.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'p-4 bg-white rounded shadow relative';
        card.innerHTML = `
            <h2 class="text-lg font-semibold mb-2" style="padding-right: 3rem;"><i class="fa-solid ${item.type}"></i> ${item.title}</h2>
            <p class="text-gray-700 mb-2">${item.description}</p>
            <p class="text-gray-700"><strong>Técnica:</strong> ${item.technique}</p>
            <p class="text-gray-700"><strong>Columnas:</strong> ${highlightCapsWords(item.columns)}</p>
            <div class="absolute top-2 right-2 flex space-x-2">
                <div class="relative">
                    <button class="dropdown-button border border-gray-400 text-gray-400 w-10 h-10 rounded-full flex items-center justify-center">
                        <i class="fa-solid fa-ellipsis-v"></i>
                    </button>
                    <div class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
                        <button class="like-option block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Save</button>
                        <button class="copy-option block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Copy</button>
                    </div>
                </div>
            </div>
            <button class="delete-button absolute top-2 right-2 border border-red-500 text-red-500 w-10 h-10 rounded-full flex items-center justify-center">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        card.querySelector('.delete-button').addEventListener('click', () => deleteIdea(index));
        const dropdownButton = card.querySelector('.dropdown-button');
        const dropdownMenu = card.querySelector('.dropdown-menu');
        dropdownButton.addEventListener('click', () => {
            dropdownMenu.classList.toggle('hidden');
        });
        card.querySelector('.like-option').addEventListener('click', () => {
            saveIdea(item);
            animateLikeButton(dropdownButton);
            dropdownMenu.classList.add('hidden');
        });
        card.querySelector('.copy-option').addEventListener('click', () => {
            const ideaInfo = `
                Title: ${item.title}
                Description: ${item.description}
                Technique: ${item.technique}
                Columns: ${item.columns}
            `;
            navigator.clipboard.writeText(ideaInfo);
            dropdownMenu.classList.add('hidden');
        });
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

function animateDescription(description) {
    description.classList.add('animate-description');
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

      if (data.length === 0) {
        ideasList.innerHTML = '<p class="text-gray-700">No data available for this URL.</p>';
      } else {
        // Iterate over the data list and create a card for each item
        data.forEach(item => {
          const card = document.createElement('div');
          card.className = 'p-4 bg-white rounded shadow relative';
          card.innerHTML = `
            <h2 class="text-lg font-semibold mb-2" style="padding-right: 3rem;"><i class="fa-solid ${item.type}"></i> ${item.title}</h2>
            <p class="text-gray-700 mb-2">${item.description}</p>
            <p class="text-gray-700 mb-2"><strong>Técnica:</strong> ${item.technique}</p>
            <p class="text-gray-700 mb-2"><strong>Columnas:</strong> ${highlightCapsWords(item.columns)}</p>
            <div class="absolute top-2 right-2 flex space-x-2">
                <div class="relative">
                    <button class="dropdown-button border border-gray-400 text-gray-400 w-10 h-10 rounded-full flex items-center justify-center">
                        <i class="fa-solid fa-ellipsis-v"></i>
                    </button>
                    <div class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
                        <button class="like-option block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Save</button>
                        <button class="copy-option block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Copy</button>
                    </div>
                </div>
            </div>
            <div class="flex justify-center mt-4">
              <button class="explore-button border border-blue-500 text-blue-500 py-2 px-4 rounded-full flex items-center">
                  <i class="fa-solid fa-magnifying-glass mr-2"></i> Explora esta idea
              </button>
            </div>
          `;
          const dropdownButton = card.querySelector('.dropdown-button');
          const dropdownMenu = card.querySelector('.dropdown-menu');
          dropdownButton.addEventListener('click', () => {
              dropdownMenu.classList.toggle('hidden');
          });
          card.querySelector('.like-option').addEventListener('click', () => {
              saveIdea(item);
              animateLikeButton(dropdownButton);
              dropdownMenu.classList.add('hidden');
          });
          card.querySelector('.copy-option').addEventListener('click', () => {
              const ideaInfo = `
                  Title: ${item.title}
                  Description: ${item.description}
                  Technique: ${item.technique}
                  Columns: ${item.columns}
              `;
              navigator.clipboard.writeText(ideaInfo);
              dropdownMenu.classList.add('hidden');
          });
          const exploreButton = card.querySelector('.explore-button');
          exploreButton.addEventListener('click', () => {
              exploreButton.style.display = 'none';
              const explorationHeading = document.createElement('h3');
              explorationHeading.className = 'text-blue-500 font-bold flex items-center text-base';
              explorationHeading.innerHTML = '<i class="fa-solid fa-magnifying-glass mr-2"></i> Exploración';
              const description = document.createElement('div');
              description.className = 'text-gray-700 mt-2';
              if (item.more_ideas && item.impact && item.scalability && item.viability) {
                  description.innerHTML = `
                      <p class="mb-2"><strong class="text-blue-500"><i class="fa-solid fa-lightbulb mr-2"></i>Ideas creativas:</strong> ${item.more_ideas}</p>
                      <p class="mb-2"><strong class="text-blue-500"><i class="fa-solid fa-chart-line mr-2"></i>Impacto:</strong> ${item.impact}</p>
                      <p class="mb-2"><strong class="text-blue-500"><i class="fa-solid fa-expand-arrows-alt mr-2"></i>Escalabilidad:</strong> ${item.scalability}</p>
                      <p><strong class="text-blue-500"><i class="fa-solid fa-check-circle mr-2"></i>Viabilidad:</strong> ${item.viability}</p>
                  `;
              } else {
                  description.innerHTML = '<p class="text-gray-700">Lo sentimos, aún no se ha explorar esta idea.</p>';
              }
              card.appendChild(explorationHeading);
              card.appendChild(description);
              animateDescription(description);
          });
          ideasList.appendChild(card);
        });
      }

      // Hide the skeleton loading card
      document.querySelector('.animate-pulse').style.display = 'none';
    } catch (error) {
      //console.error('Failed to fetch data:', error);
      document.getElementById('result').textContent = 'Failed to load data';
    }
});

document.getElementById('showSavedIdeas').addEventListener('click', toggleSavedIdeas);
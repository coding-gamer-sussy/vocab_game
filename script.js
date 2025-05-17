let english = [], chinese = [], pos = [], index = 0;

async function loadFiles() {
  [english, chinese, pos] = await Promise.all([
    fetch('english.txt').then(r => r.text()).then(t => t.trim().split('\n')),
    fetch('chinese.txt').then(r => r.text()).then(t => t.trim().split('\n')),
    fetch('pos.txt').then(r => r.text()).then(t => t.trim().split('\n'))
  ]);
  nextWord();
}

function nextWord() {
  if (english.length === 0) return;
  index = Math.floor(Math.random() * english.length);

  document.getElementById('question').innerHTML =
    `<strong>${english[index]}</strong> (${pos[index]})<br>意思：${chinese[index]}`;

  // Track number of words practiced
  let practiced = Number(localStorage.getItem('wordsPracticed') || '0');
  localStorage.setItem('wordsPracticed', practiced + 1);
}

function addFavorite() {
  let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
  let word = english[index];
  if (!favs.includes(word)) {
    favs.push(word);
    localStorage.setItem('favorites', JSON.stringify(favs));
    alert(`Added "${word}" to favorites!`);
  } else {
    alert(`"${word}" is already in favorites.`);
  }
}

function saveUsername() {
  let name = document.getElementById('usernameInput').value.trim();
  if (name) {
    localStorage.setItem('username', name);
    alert(`Saved name: ${name}`);
  }
}

loadFiles();

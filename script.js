let english = [], chinese = [], pos = [], index = 0;

async function loadFiles() {
  [english, chinese, pos] = await Promise.all([
    fetch('english_voc.txt').then(r => r.text()).then(t => t.trim().split('\n')),
    fetch('chinese_voc.txt').then(r => r.text()).then(t => t.trim().split('\n')),
    fetch('part_of_speech.txt').then(r => r.text()).then(t => t.trim().split('\n'))
  ]);
  nextWord();
}

function nextWord() {
  if (english.length === 0) return;
  index = Math.floor(Math.random() * english.length);
  document.getElementById('question').innerHTML =
    `<strong>${english[index]}</strong> (${pos[index]})<br>意思：${chinese[index]}`;
  // Increase the word practice count every time a new word is shown
  let practiced = Number(localStorage.getItem('wordsPracticed') || '0');
  localStorage.setItem('wordsPracticed', practiced + 1);
}

loadFiles();

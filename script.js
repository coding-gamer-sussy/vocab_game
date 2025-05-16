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
}

loadFiles();

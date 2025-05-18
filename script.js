let words = [], english = [], pos = [];
let currentIndex = 0;

function loadFiles() {
  Promise.all([
    fetch('chinese.txt').then(res => res.text()),
    fetch('english.txt').then(res => res.text()),
    fetch('pos.txt').then(res => res.text())
  ]).then(([ch, en, p]) => {
    words = ch.trim().split('\n');
    english = en.trim().split('\n');
    pos = p.trim().split('\n');
    nextWord();
  });
}

function checkAnswer() {
  const ans = document.getElementById('answer').value.trim().toLowerCase();
  const correct = english[currentIndex].toLowerCase();
  document.getElementById('result').textContent = ans === correct ? '✅ Correct!' : `❌ Wrong. Answer: ${correct}`;
  nextWord();
}

function nextWord() {
  currentIndex = Math.floor(Math.random() * words.length);
  document.getElementById('chinese').textContent = words[currentIndex] + ' (' + pos[currentIndex] + ')';
  document.getElementById('answer').value = '';
}

function addToFavorites() {
  const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
  const word = `${words[currentIndex]} (${english[currentIndex]})`;
  if (!favs.includes(word)) {
    favs.push(word);
    localStorage.setItem('favorites', JSON.stringify(favs));
    alert('Added to favorites!');
  }
}

function startQuiz() {
  questionTotal = parseInt(document.getElementById('questionCount').value);
  quizIndices = [];
  for (let i = 0; i < questionTotal; i++) {
    quizIndices.push(Math.floor(Math.random() * words.length));
  }
  quizCurrent = 0;
  correctCount = 0;
  wrongList = [];
  document.getElementById('quiz-settings').style.display = 'none';
  document.getElementById('quiz-area').style.display = 'block';
  askQuizQuestion();
}

function askQuizQuestion() {
  const idx = quizIndices[quizCurrent];
  document.getElementById('quiz-progress').textContent = `Question ${quizCurrent + 1} of ${questionTotal}`;
  document.getElementById('quiz-question').textContent = `${words[idx]} (開頭-${english[idx][0]}) (${pos[idx]})`;
  document.getElementById('quiz-answer').value = '';
}


function submitQuizAnswer() {
  const idx = quizIndices[quizCurrent];
  const userAns = document.getElementById('quiz-answer').value.trim().toLowerCase();
  const correctAns = english[idx].toLowerCase();
  if (userAns === correctAns) {
    correctCount++;
    document.getElementById('quiz-feedback').textContent = '✅ Correct!';
  } else {
    document.getElementById('quiz-feedback').textContent = `❌ Wrong! Answer: ${correctAns}`;
    const wrongs = JSON.parse(localStorage.getItem('wrongs') || '[]');
    const entry = `${words[idx]} (${correctAns})`;
    if (!wrongs.includes(entry)) {
      wrongs.push(entry);
      localStorage.setItem('wrongs', JSON.stringify(wrongs));
    }
  }

  quizCurrent++;
  if (quizCurrent < questionTotal) {
    askQuizQuestion();
  } else {
    const correctness = correctCount / questionTotal;
    const xp = Math.round(Math.sqrt(questionTotal * correctCount) * (1 / (1.01 - correctness)) * Math.log10(questionTotal));
    const prevXP = parseInt(localStorage.getItem('totalXP') || '0');
    const prevCount = parseInt(localStorage.getItem('totalPracticed') || '0');
    localStorage.setItem('totalXP', prevXP + xp);
    localStorage.setItem('totalPracticed', prevCount + questionTotal);
    document.getElementById('quiz-result').textContent = `You got ${correctCount}/${questionTotal} correct. XP Gained: ${xp}`;
    document.getElementById('quiz-area').style.display = 'none';
  }
}

function promptUsername() {
  if (!localStorage.getItem('username')) {
    const name = prompt("Enter your username:", "Guest");
    if (name) {
      localStorage.setItem('username', name);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  promptUsername();
});

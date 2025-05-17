let english = [], chinese = [], pos = [];
let currentWordIndex;

function loadFiles() {
  fetch('english.txt')
    .then(res => res.text())
    .then(text => {
      english = text.trim().split('\n');
      return fetch('chinese.txt');
    })
    .then(res => res.text())
    .then(text => {
      chinese = text.trim().split('\n');
      return fetch('pos.txt');
    })
    .then(res => res.text())
    .then(text => {
      pos = text.trim().split('\n');
      nextWord();
    });
}

function nextWord() {
  currentWordIndex = Math.floor(Math.random() * english.length);
  document.getElementById('chinese').textContent = chinese[currentWordIndex] + ' (' + pos[currentWordIndex] + ')';
  document.getElementById('answer').value = '';
  document.getElementById('result').textContent = '';
}

function checkAnswer() {
  const userAns = document.getElementById('answer').value.trim().toLowerCase();
  const correct = english[currentWordIndex].toLowerCase();
  document.getElementById('result').textContent = userAns === correct ? 'Correct!' : 'Wrong! Answer: ' + correct;
}

function addToFavorites() {
  if (currentWordIndex === undefined) return;
  let wordEntry = `${chinese[currentWordIndex]} = ${english[currentWordIndex]} (${pos[currentWordIndex]})`;
  let storedFavs = JSON.parse(localStorage.getItem('favorites') || '[]');
  if (!storedFavs.includes(wordEntry)) {
    storedFavs.push(wordEntry);
    localStorage.setItem('favorites', JSON.stringify(storedFavs));
    alert("Added to favorites!");
  } else {
    alert("Already in favorites.");
  }
}

// ---- Quiz Mode (used in quiz.html) ----
let quizTotal = 0, quizCorrect = 0, quizWrong = [];

function startQuiz() {
  quizTotal = Number(prompt("How many questions?"));
  quizCorrect = 0;
  quizWrong = [];
  askQuestion(0);
}

function askQuestion(i) {
  if (i >= quizTotal) return finishQuiz();

  const index = Math.floor(Math.random() * english.length);
  const userAns = prompt(`${chinese[index]} (開頭-${english[index][0]}) (${pos[index]})`).trim().toLowerCase();
  if (userAns === english[index].toLowerCase()) {
    quizCorrect++;
  } else {
    quizWrong.push(`${chinese[index]} = ${english[index]} (${pos[index]})`);
  }
  askQuestion(i + 1);
}

function finishQuiz() {
  const correctness = quizCorrect / quizTotal;
  const xp = Math.floor(Math.sqrt(quizTotal * quizCorrect) * (1 / (1.01 - correctness)) * Math.log10(quizTotal));

  // Save XP
  let prevXP = Number(localStorage.getItem('totalXP') || '0');
  localStorage.setItem('totalXP', prevXP + xp);

  // Save Words Practiced
  let prevPracticed = Number(localStorage.getItem('totalPracticed') || '0');
  localStorage.setItem('totalPracticed', prevPracticed + quizTotal);

  // Save Wrongs
  let storedWrongs = JSON.parse(localStorage.getItem('wrongs') || '[]');
  for (let item of quizWrong) {
    if (!storedWrongs.includes(item)) {
      storedWrongs.push(item);
    }
  }
  localStorage.setItem('wrongs', JSON.stringify(storedWrongs));

  alert(`Quiz finished! Correct: ${quizCorrect}/${quizTotal}, XP earned: ${xp}`);
}

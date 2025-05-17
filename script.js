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

// QUIZ VARIABLES
let quizIndex = 0, quizTotal = 0, quizCorrect = 0;
let quizOrder = [], quizWrong = [];

// Start Quiz
function startQuiz() {
  quizTotal = parseInt(document.getElementById('quizCount').value);
  if (isNaN(quizTotal) || quizTotal < 1) return alert("Enter a valid number.");
  
  quizIndex = 0;
  quizCorrect = 0;
  quizWrong = [];

  quizOrder = [];
  for (let i = 0; i < quizTotal; i++) {
    quizOrder.push(Math.floor(Math.random() * english.length));
  }

  document.getElementById('setup').style.display = 'none';
  document.getElementById('quiz').style.display = 'block';
  showQuizQuestion();
}

// Show current quiz question
function showQuizQuestion() {
  let i = quizOrder[quizIndex];
  let hint = english[i][0]; // first letter
  document.getElementById('quizQuestion').innerHTML =
    `${chinese[i]} (${hint}-) [${pos[i]}]`;
  document.getElementById('quizAnswer').value = '';
  document.getElementById('quizAnswer').focus();
  document.getElementById('progress').innerText = `Question ${quizIndex + 1} of ${quizTotal}`;
}

// Handle answer
function submitAnswer() {
  let i = quizOrder[quizIndex];
  let userAns = document.getElementById('quizAnswer').value.trim().toLowerCase();
  let correctAns = english[i].toLowerCase();

  if (userAns === correctAns) {
    quizCorrect++;
  } else {
    quizWrong.push(`${chinese[i]} = ${correctAns}`);
  }

  quizIndex++;
  if (quizIndex < quizTotal) {
    showQuizQuestion();
  } else {
    finishQuiz();
  }
}

// End of quiz
function finishQuiz() {
  document.getElementById('quiz').style.display = 'none';
  document.getElementById('result').style.display = 'block';

  let correctness = quizCorrect / quizTotal;
  let xp = Math.sqrt(quizTotal * quizCorrect) * (1 / (1.01 - correctness)) * Math.log10(quizTotal);
  xp = Math.round(xp);

  // Save XP to localStorage
  let prevXP = Number(localStorage.getItem('totalXP') || '0');
  localStorage.setItem('totalXP', prevXP + xp);

  document.getElementById('scoreSummary').innerText =
    `Correct: ${quizCorrect} / ${quizTotal} (${Math.round(correctness * 100)}%)`;
  document.getElementById('xpGained').innerText = `You earned ${xp} XP!`;

  document.getElementById('wrongList').innerHTML = 
    quizWrong.length > 0 ? `<strong>Incorrect words:</strong><br>${quizWrong.join('<br>')}` : '';
}

loadFiles();

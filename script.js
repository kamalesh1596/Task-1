// --- QUIZ DATA ---
const quizData = [
    { q: "What is the capital of France?", a: ["Berlin", "Madrid", "Paris"], correct: 2 },
    { q: "Which language runs in the browser?", a: ["Java", "C", "JavaScript"], correct: 2 },
    { q: "What does CSS stand for?", a: ["Cascading Style Sheets", "Color Style Sheets", "Computing Shells"], correct: 0 }
];

let currentIdx = 0;
let score = 0;// --- 1. QUIZ LOGIC ---
function loadQuiz() {
    const q = quizData[currentIdx];
    document.getElementById('question').innerText = q.q;
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    
    q.a.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = 'option-btn';
        btn.onclick = () => {
            if (i === q.correct) score++;
            currentIdx++;
            if (currentIdx < quizData.length) loadQuiz();
            else showResult();
        };
        optionsDiv.appendChild(btn);
    });
}

function showResult() {
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('result-container').classList.remove('hidden');
    document.getElementById('final-score').innerText = `${score} / ${quizData.length}`;
}

// --- 2. SAVING & LOADING SCORES (Fixed using localStorage) ---
function saveScore() {
    const username = document.getElementById('username').value;
    if (!username) return alert("Enter a name!");

    // Get existing scores or empty array    const highScores = JSON.parse(localStorage.getItem('quizScores')) || [];
    
    // Add new score    highScores.push({ name: username, score: score });
    
    // Sort scores (Highest first)
    highScores.sort((a, b) => b.score - a.score);
    
    // Save back to localStorage (limit to top 5)
    localStorage.setItem('quizScores', JSON.stringify(highScores.slice(0, 5)));

    alert("Score Saved!");
    displayScores();
    resetQuiz();
}

function displayScores() {
    const scoreList = document.getElementById('score-list');
    const highScores = JSON.parse(localStorage.getItem('quizScores')) || [];
    
    scoreList.innerHTML = highScores.length === 0 
        ? "<li>No scores yet</li>" 
        : highScores.map(s => `<li><strong>${s.name}</strong>: ${s.score}</li>`).join('');
}

function resetQuiz() {
    currentIdx = 0;
    score = 0;    document.getElementById('quiz-container').classList.remove('hidden');
    document.getElementById('result-container').classList.add('hidden');
    document.getElementById('username').value = '';
    loadQuiz();}

// --- 3. WEATHER API FETCH ---
async function fetchWeather() {
    const display = document.getElementById('joke-text');
    display.innerText = "Loading local weather...";
    try {
        // Fetching real-time weather for London (Public API)
        const res = await fetch('https://wttr.in/London?format=j1');
        const data = await res.json();
        const temp = data.current_condition[0].temp_C;
        const desc = data.current_condition[0].weatherDesc[0].value;
        display.innerHTML = `<strong>London:</strong> ${temp}°C, ${desc}`;    } catch (err) {
        display.innerText = "Weather API unavailable.";
    }
}// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadQuiz();
    displayScores();
    fetchWeather();
});
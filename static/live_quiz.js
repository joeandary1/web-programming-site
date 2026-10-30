// State variables for Live Quiz
let total = 0;
const cache = {}; // Caches fetched questions by index to prevent redundant network requests
let currentQuestion = 0;
const userAnswers = []; // Populated as questions are answered

// Helper function to fetch one question with client-side caching
async function getQuestion(index) {
  if (cache[index]) {
    return cache[index];
  }

  const response = await fetch(`/api/question/${index}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch question ${index} (Status ${response.status})`);
  }

  const data = await response.json();
  cache[index] = data;
  return data;
}

// Render the current question with loading/error state management
async function renderQuestion() {
  const loadingEl = document.getElementById("loading");
  const errorEl = document.getElementById("error");

  loadingEl.hidden = false;
  errorEl.hidden = true;

  try {
    const q = await getQuestion(currentQuestion);

    document.getElementById("progress").textContent =
      `Question ${currentQuestion + 1} of ${total}`;
    document.getElementById("questionText").textContent = q.question;

    const choicesContainer = document.getElementById("choices");
    choicesContainer.innerHTML = "";

    for (let i = 0; i < q.choices.length; i++) {
      const label = document.createElement("label");
      label.className = "choice";

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "answer";
      radio.value = i;

      if (userAnswers[currentQuestion] === i) {
        radio.checked = true;
      }

      radio.onclick = function () {
        saveAnswer(i);
      };

      label.appendChild(radio);
      label.appendChild(document.createTextNode(" " + q.choices[i]));
      choicesContainer.appendChild(label);
    }

    document.getElementById("firstBtn").disabled = currentQuestion === 0;
    document.getElementById("previousBtn").disabled = currentQuestion === 0;
    document.getElementById("nextBtn").disabled = currentQuestion === total - 1;
    document.getElementById("lastBtn").disabled = currentQuestion === total - 1;
  } catch (err) {
    errorEl.textContent = "Error loading question: " + err.message;
    errorEl.hidden = false;
  } finally {
    loadingEl.hidden = true;
  }
}

function saveAnswer(choiceIndex) {
  userAnswers[currentQuestion] = choiceIndex;
}

function goNext() {
  if (currentQuestion < total - 1) {
    currentQuestion++;
    renderQuestion();
  }
}

function goPrevious() {
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
}

function goFirst() {
  currentQuestion = 0;
  renderQuestion();
}

function goLast() {
  currentQuestion = total - 1;
  renderQuestion();
}

// Calculate total score dynamically across all fetched questions
async function calculateScore() {
  let score = 0;
  for (let i = 0; i < total; i++) {
    const q = await getQuestion(i);
    if (userAnswers[i] === q.answer) {
      score++;
    }
  }
  return score;
}

function calculatePercentage(score) {
  return total > 0 ? Math.round((score / total) * 100) : 0;
}

function getPerformanceMessage(percentage) {
  if (percentage >= 80) return "Excellent";
  if (percentage >= 60) return "Good";
  if (percentage >= 50) return "Pass";
  return "Needs improvement";
}

// Build answer review summary including unanswered items
async function buildCorrection() {
  let correction = "";

  for (let i = 0; i < total; i++) {
    const q = await getQuestion(i);
    let userAnswerIndex = userAnswers[i];

    let userAnswerText = userAnswerIndex !== undefined ? q.choices[userAnswerIndex] : "Not answered";
    let correctAnswerText = q.choices[q.answer];
    let resultText = userAnswerIndex === q.answer ? "Correct" : "Incorrect";

    correction += `Question ${i + 1}: ${q.question}\n`;
    correction += `Your answer: ${userAnswerText}\n`;
    correction += `Correct answer: ${correctAnswerText}\n`;
    correction += `Result: ${resultText}\n`;
    correction += `Explanation: ${q.explanation}\n\n`;
  }

  return correction;
}

async function submitQuiz() {
  const score = await calculateScore();
  const percentage = calculatePercentage(score);
  const message = getPerformanceMessage(percentage);
  const correction = await buildCorrection();
  showResults(score, percentage, message, correction);
}

// Results presentation and confetti animation
function showResults(score, percentage, message, correction) {
  document.getElementById("quizPanel").style.display = "none";

  const resultsPanel = document.getElementById("resultsPanel");
  resultsPanel.style.display = "block";
  resultsPanel.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 800, fill: "forwards" });

  document.getElementById("scoreText").innerHTML = `<i class="fa-solid fa-bullseye"></i> Score: ${score} / ${total}`;
  document.getElementById("percentageText").innerHTML = `<i class="fa-solid fa-percent"></i> Percentage: ${percentage}%`;
  document.getElementById("performanceText").textContent = message;
  document.getElementById("correction").textContent = correction;

  if (percentage >= 50) {
    var duration = 3000;
    var end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#007aff', '#5856d6', '#ff2d55']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#007aff', '#5856d6', '#ff2d55']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }
}

// Initializer: Fetches total count first, then displays first question
async function init() {
  try {
    const response = await fetch("/api/questions/count");
    if (!response.ok) {
      throw new Error("Failed to fetch questions count");
    }
    const data = await response.json();
    total = data.count;
    await renderQuestion();
  } catch (err) {
    const errorEl = document.getElementById("error");
    if (errorEl) {
      errorEl.textContent = "Initialization error: " + err.message;
      errorEl.hidden = false;
    }
  }
}

init();
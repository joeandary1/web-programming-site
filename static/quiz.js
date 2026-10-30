// ======================================================
// QUESTIONS
// ======================================================

// ===============================
// Show Results (WITH CONFETTI)
// ===============================
function showResults(score, percentage, message, correction) {
    document.getElementById("quizPanel").style.display = "none";
    
    const resultsPanel = document.getElementById("resultsPanel");
    resultsPanel.style.display = "block";
    
    // Add a nice fade-in animation to the results
    resultsPanel.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 800, fill: "forwards" });

    document.getElementById("scoreText").innerHTML = `<i class="fa-solid fa-bullseye"></i> Score: ${score} / ${questions.length}`;
    document.getElementById("percentageText").innerHTML = `<i class="fa-solid fa-percent"></i> Percentage: ${percentage}%`;
    document.getElementById("performanceText").textContent = message;
    document.getElementById("correction").textContent = correction;

    // Trigger Confetti if they passed!
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

const questions = [
  {
    question: "Which keyword declares a block-scoped variable that can later be reassigned?",
    choices: ["var", "let", "const", "static"],
    answer: 1,
    explanation: "let declares a block-scoped variable whose value may later be reassigned.",
  },
  {
    question: "Which JavaScript operator tests strict equality (value and type)?",
    choices: ["=", "==", "===", "!="],
    answer: 2,
    explanation: "The === operator compares both value and type.",
  },
  {
    question: "Which property gives the number of elements in a JavaScript array?",
    choices: ["size", "count", "length", "index"],
    answer: 2,
    explanation: "The length property returns the number of elements in an array.",
  },
  {
    question: "What is the output type of the typeof operator in JavaScript?",
    choices: ["number", "boolean", "string", "object"],
    answer: 2,
    explanation: "The typeof operator always returns a string indicating the type of the unevaluated operand.",
  },
  {
    question: "Which keyword is used to create a JavaScript Class?",
    choices: ["object", "class", "function", "template"],
    answer: 1,
    explanation: "Use the keyword class to create a class in JavaScript.",
  }
];


let currentQuestion = 0;
const userAnswers = new Array(questions.length);


function saveAnswer(choiceIndex) {
  userAnswers[currentQuestion] = choiceIndex;
}


function goNext() {
  if (currentQuestion < questions.length - 1) {
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
  currentQuestion = questions.length - 1;
  renderQuestion();
}


function calculateScore() {
  let score = 0;
  for (let i = 0; i < questions.length; i++) {
    if (userAnswers[i] === questions[i].answer) {
      score++;
    }
  }
  return score;
}


function calculatePercentage(score) {
  return Math.round((score / questions.length) * 100);
}


function getPerformanceMessage(percentage) {
  if (percentage >= 80) {
    return "Excellent";
  } else if (percentage >= 60) {
    return "Good";
  } else if (percentage >= 50) {
    return "Pass";
  } else {
    return "Needs improvement";
  }
}


function buildCorrection() {
  let correction = "";

  for (let i = 0; i < questions.length; i++) {
    let q = questions[i];
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


function submitQuiz() {
  const score = calculateScore();
  const percentage = calculatePercentage(score);
  const message = getPerformanceMessage(percentage);
  const correction = buildCorrection();
  showResults(score, percentage, message, correction);
}

function renderQuestion() {
  const q = questions[currentQuestion];


  document.getElementById("progress").textContent =
    `Question ${currentQuestion + 1} of ${questions.length}`;


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
  document.getElementById("nextBtn").disabled =
    currentQuestion === questions.length - 1;
  document.getElementById("lastBtn").disabled =
    currentQuestion === questions.length - 1;
}


function showResults(score, percentage, message, correction) {
  document.getElementById("quizPanel").style.display = "none";
  document.getElementById("resultsPanel").style.display = "block";
  document.getElementById("scoreText").textContent =
    `Score: ${score} / ${questions.length}`;
  document.getElementById("percentageText").textContent =
    `Percentage: ${percentage}%`;
  document.getElementById("performanceText").textContent = message;
  document.getElementById("correction").textContent = correction;
}


renderQuestion();
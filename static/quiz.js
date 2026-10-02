// ===============================
// GIN446 - Week 5 Quiz
// Interactive Quiz Application
// ===============================

const questions = [
    {
        question: "Which keyword declares a block-scoped variable that can later be reassigned?",
        choices: ["var", "let", "const", "static"],
        answer: 1,
        explanation: "The let keyword declares a block-scoped variable whose value can later be changed."
    },

    {
        question: "Which operator tests strict equality in JavaScript?",
        choices: ["=", "==", "===", "!="],
        answer: 2,
        explanation: "The === operator compares both the value and the data type."
    },

    {
        question: "Which data structure stores multiple values in an ordered collection?",
        choices: ["Array", "Boolean", "String", "Object property"],
        answer: 0,
        explanation: "An array stores multiple values in an ordered collection using indexes."
    },

    {
        question: "What does a JavaScript function return if there is no return statement?",
        choices: ["null", "0", "false", "undefined"],
        answer: 3,
        explanation: "If a function does not explicitly return a value, JavaScript returns undefined."
    },

    {
        question: "Which statement is used to make a decision based on a condition?",
        choices: ["if", "for", "function", "return"],
        answer: 0,
        explanation: "The if statement executes code when its condition is true."
    },

    {
        question: "Which method adds an element to the end of an array?",
        choices: ["pop()", "push()", "shift()", "slice()"],
        answer: 1,
        explanation: "The push() method adds one or more elements to the end of an array."
    },

    {
        question: "Which JavaScript data type is used for text?",
        choices: ["Number", "Boolean", "String", "Array"],
        answer: 2,
        explanation: "A String is used to represent text in JavaScript."
    },

    {
        question: "Which loop is commonly used when you want to repeat code a specific number of times?",
        choices: ["if", "for", "switch", "try"],
        answer: 1,
        explanation: "A for loop is commonly used when the number of repetitions is controlled by a counter."
    },

    {
        question: "How do you access the name property of an object called user?",
        choices: [
            "user[name]",
            "user.name",
            "user->name",
            "user::name"
        ],
        answer: 1,
        explanation: "Dot notation, user.name, is used to access the name property of the user object."
    },

    {
        question: "Which keyword is used to declare a function?",
        choices: ["function", "define", "method", "func"],
        answer: 0,
        explanation: "The function keyword is used to declare a function in JavaScript."
    }
];


// ===============================
// Quiz State
// ===============================

let currentQuestion = 0;

const userAnswers = new Array(questions.length).fill(null);


// ===============================
// Save Answer
// ===============================

function saveAnswer(choiceIndex) {

    userAnswers[currentQuestion] = Number(choiceIndex);

}


// ===============================
// Navigation Functions
// ===============================

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


// ===============================
// Calculate Score
// ===============================

function calculateScore() {

    let score = 0;

    for (let i = 0; i < questions.length; i++) {

        if (userAnswers[i] === questions[i].answer) {

            score++;
        }
    }

    return score;
}


// ===============================
// Calculate Percentage
// ===============================

function calculatePercentage(score) {

    if (questions.length === 0) {

        return 0;
    }

    return Math.round((score / questions.length) * 100);
}


// ===============================
// Performance Message
// ===============================

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


// ===============================
// Build Correction
// ===============================

function buildCorrection() {

    let correction = "";

    for (let i = 0; i < questions.length; i++) {

        const question = questions[i];

        const userAnswerIndex = userAnswers[i];

        let userAnswer;

        if (
            userAnswerIndex === null ||
            userAnswerIndex === undefined
        ) {

            userAnswer = "Not Answered";

        } else {

            userAnswer = question.choices[userAnswerIndex];
        }

        const correctAnswer =
            question.choices[question.answer];

        const result =
            userAnswerIndex === question.answer
                ? "Correct"
                : "Incorrect";


        correction +=
            "Question " + (i + 1) + "\n" +
            question.question + "\n" +
            "Your answer: " + userAnswer + "\n" +
            "Correct answer: " + correctAnswer + "\n" +
            "Result: " + result + "\n" +
            "Explanation: " + question.explanation + "\n\n";
    }

    return correction;
}


// ===============================
// Submit Quiz
// ===============================

function submitQuiz() {

    const score = calculateScore();

    const percentage = calculatePercentage(score);

    const message = getPerformanceMessage(percentage);

    const correction = buildCorrection();

    showResults(
        score,
        percentage,
        message,
        correction
    );
}


// ===============================
// Display Question
// ===============================

function renderQuestion() {

    const question = questions[currentQuestion];


    // Progress

    document.getElementById("progress").textContent =
        "Question " +
        (currentQuestion + 1) +
        " of " +
        questions.length;


    // Question

    document.getElementById("questionText").textContent =
        question.question;


    // Choices

    const choicesContainer =
        document.getElementById("choices");

    choicesContainer.innerHTML = "";


    for (let i = 0; i < question.choices.length; i++) {

        const label = document.createElement("label");

        label.className = "choice";


        const radio = document.createElement("input");

        radio.type = "radio";

        radio.name = "answer";

        radio.value = i;


        // Keep previously selected answer

        if (userAnswers[currentQuestion] === i) {

            radio.checked = true;
        }


        // Save answer when selected

        radio.addEventListener("click", function () {

            saveAnswer(i);

        });


        label.appendChild(radio);

        label.appendChild(
            document.createTextNode(
                " " + question.choices[i]
            )
        );


        choicesContainer.appendChild(label);
    }


    // Navigation buttons

    document.getElementById("firstBtn").disabled =
        currentQuestion === 0;


    document.getElementById("previousBtn").disabled =
        currentQuestion === 0;


    document.getElementById("nextBtn").disabled =
        currentQuestion === questions.length - 1;


    document.getElementById("lastBtn").disabled =
        currentQuestion === questions.length - 1;
}

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

// ===============================
// Start Quiz
// ===============================

renderQuestion();
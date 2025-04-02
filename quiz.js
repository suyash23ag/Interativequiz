// Quiz state
let currentQuestionIndex = 0
let score = 0
let selectedOption = null
let timerInterval = null
let timeLeft = 0
let isShowingFeedback = false

// Constants
const TIME_PER_QUESTION = 20 // seconds

// DOM Elements
const homeCard = document.getElementById("home-card")
const quizCard = document.getElementById("quiz-card")
const resultsCard = document.getElementById("results-card")
const leaderboardCard = document.getElementById("leaderboard-card")

const questionNumberEl = document.getElementById("question-number")
const scoreEl = document.getElementById("score")
const timeRemainingEl = document.getElementById("time-remaining")
const timerProgressEl = document.getElementById("timer-progress")
const questionTextEl = document.getElementById("question-text")
const optionsContainerEl = document.getElementById("options-container")
const feedbackEl = document.getElementById("feedback")
const nextBtnEl = document.getElementById("next-btn")
const finalScoreEl = document.getElementById("final-score")
const playerNameEl = document.getElementById("player-name")
const nameErrorEl = document.getElementById("name-error")

// Button Elements
const startQuizBtn = document.getElementById("start-quiz-btn")
const viewLeaderboardBtn = document.getElementById("view-leaderboard-btn")
const submitScoreBtn = document.getElementById("submit-score-btn")
const playAgainBtn = document.getElementById("play-again-btn")
const backBtn = document.getElementById("back-btn")

// Event Listeners
startQuizBtn.addEventListener("click", startQuiz)
viewLeaderboardBtn.addEventListener("click", showLeaderboard)
nextBtnEl.addEventListener("click", goToNextQuestion)
submitScoreBtn.addEventListener("click", submitScore)
playAgainBtn.addEventListener("click", restartQuiz)
backBtn.addEventListener("click", goToHome)

// Dummy data for quiz questions (replace with your actual data)
const quizQuestions = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correctAnswer: 2,
    points: 10,
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1,
    points: 5,
  },
]

// Dummy function for calculating time bonus (replace with your actual logic)
function calculateTimeBonus(timeLeft, totalTime) {
  const percentageRemaining = timeLeft / totalTime
  return Math.round(percentageRemaining * 5) // Example: Up to 5 bonus points
}

// Dummy function for loading leaderboard data (replace with your actual logic)
function loadLeaderboard() {
  // Get existing scores from localStorage
  const scores = JSON.parse(localStorage.getItem("quizScores")) || []

  // Sort scores (highest first)
  scores.sort((a, b) => b.score - a.score)

  // Display scores in the leaderboard (example)
  const leaderboardList = document.getElementById("leaderboard-list")
  leaderboardList.innerHTML = "" // Clear previous entries

  scores.forEach((score, index) => {
    const listItem = document.createElement("li")
    listItem.textContent = `${index + 1}. ${score.name} - ${score.score} points (${new Date(score.date).toLocaleDateString()})`
    leaderboardList.appendChild(listItem)
  })
}

// Functions
function startQuiz() {
  homeCard.classList.add("hidden")
  quizCard.classList.remove("hidden")

  // Reset quiz state
  currentQuestionIndex = 0
  score = 0
  scoreEl.textContent = score

  // Load first question
  loadQuestion()
}

function loadQuestion() {
  const currentQuestion = quizQuestions[currentQuestionIndex]

  // Update question number
  questionNumberEl.textContent = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`

  // Update question text
  questionTextEl.textContent = currentQuestion.question

  // Clear previous options
  optionsContainerEl.innerHTML = ""

  // Add options
  currentQuestion.options.forEach((option, index) => {
    const optionBtn = document.createElement("button")
    optionBtn.className = "option"
    optionBtn.textContent = option
    optionBtn.dataset.index = index
    optionBtn.addEventListener("click", () => selectOption(index))
    optionsContainerEl.appendChild(optionBtn)
  })

  // Reset state for new question
  selectedOption = null
  isShowingFeedback = false
  feedbackEl.classList.add("hidden")
  nextBtnEl.classList.add("hidden")

  // Start timer
  startTimer()
}

function startTimer() {
  // Clear any existing timer
  if (timerInterval) {
    clearInterval(timerInterval)
  }

  // Set initial time
  timeLeft = TIME_PER_QUESTION
  updateTimerDisplay()

  // Start the timer
  timerInterval = setInterval(() => {
    timeLeft--
    updateTimerDisplay()

    if (timeLeft <= 0) {
      clearInterval(timerInterval)
      handleTimeUp()
    }
  }, 1000)
}

function updateTimerDisplay() {
  // Update time text
  timeRemainingEl.textContent = `${timeLeft} seconds`

  // Update progress bar
  const percentage = (timeLeft / TIME_PER_QUESTION) * 100
  timerProgressEl.style.width = `${percentage}%`
}

function handleTimeUp() {
  if (!isShowingFeedback) {
    // Mark as time's up
    isShowingFeedback = true

    // Show feedback
    feedbackEl.innerHTML = `
      <i class="fas fa-times-circle"></i>
      <div>
        <p><strong>Time's up!</strong></p>
        <p>The correct answer was: ${quizQuestions[currentQuestionIndex].options[quizQuestions[currentQuestionIndex].correctAnswer]}</p>
      </div>
    `
    feedbackEl.className = "feedback incorrect"
    feedbackEl.classList.remove("hidden")

    // Disable all options
    const options = optionsContainerEl.querySelectorAll(".option")
    options.forEach((option) => {
      option.classList.add("disabled")

      // Highlight correct answer
      if (Number.parseInt(option.dataset.index) === quizQuestions[currentQuestionIndex].correctAnswer) {
        option.classList.add("correct")
      }
    })

    // Show next button
    nextBtnEl.classList.remove("hidden")
  }
}

function selectOption(index) {
  if (isShowingFeedback) return

  // Stop the timer
  clearInterval(timerInterval)

  // Set selected option
  selectedOption = index
  isShowingFeedback = true

  // Check if answer is correct
  const currentQuestion = quizQuestions[currentQuestionIndex]
  const isCorrect = index === currentQuestion.correctAnswer

  // Update score if correct
  if (isCorrect) {
    const timeBonus = calculateTimeBonus(timeLeft, TIME_PER_QUESTION)
    const pointsEarned = currentQuestion.points + timeBonus
    score += pointsEarned
    scoreEl.textContent = score

    // Show feedback
    feedbackEl.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <div>
        <p><strong>Correct!</strong></p>
        <p>+${currentQuestion.points} points ${timeBonus > 0 ? `(Time bonus: +${timeBonus})` : ""}</p>
      </div>
    `
    feedbackEl.className = "feedback correct"
  } else {
    // Show feedback
    feedbackEl.innerHTML = `
      <i class="fas fa-times-circle"></i>
      <div>
        <p><strong>Incorrect!</strong></p>
        <p>The correct answer was: ${currentQuestion.options[currentQuestion.correctAnswer]}</p>
      </div>
    `
    feedbackEl.className = "feedback incorrect"
  }

  feedbackEl.classList.remove("hidden")

  // Update option styling
  const options = optionsContainerEl.querySelectorAll(".option")
  options.forEach((option, i) => {
    if (i === index) {
      option.classList.add(isCorrect ? "correct" : "incorrect")
    } else {
      option.classList.add("disabled")

      // Highlight correct answer if user selected wrong
      if (!isCorrect && i === currentQuestion.correctAnswer) {
        option.classList.add("correct")
      }
    }
  })

  // Show next button
  nextBtnEl.classList.remove("hidden")
}

function goToNextQuestion() {
  if (currentQuestionIndex < quizQuestions.length - 1) {
    currentQuestionIndex++
    loadQuestion()
  } else {
    showResults()
  }
}

function showResults() {
  quizCard.classList.add("hidden")
  resultsCard.classList.remove("hidden")
  finalScoreEl.textContent = `${score} points`
}

function submitScore() {
  const playerName = playerNameEl.value.trim()

  if (!playerName) {
    nameErrorEl.classList.remove("hidden")
    return
  }

  nameErrorEl.classList.add("hidden")

  // Save score to localStorage
  saveScore(playerName, score)

  // Show leaderboard
  showLeaderboard()
}

function saveScore(name, score) {
  // Get existing scores from localStorage
  let scores = JSON.parse(localStorage.getItem("quizScores")) || []

  // Add new score
  scores.push({ name, score, date: new Date().toISOString() })

  // Sort scores (highest first)
  scores.sort((a, b) => b.score - a.score)

  // Keep only top 10 scores
  scores = scores.slice(0, 10)

  // Save back to localStorage
  localStorage.setItem("quizScores", JSON.stringify(scores))
}

function restartQuiz() {
  resultsCard.classList.add("hidden")
  playerNameEl.value = ""
  nameErrorEl.classList.add("hidden")
  startQuiz()
}

function showLeaderboard() {
  homeCard.classList.add("hidden")
  quizCard.classList.add("hidden")
  resultsCard.classList.add("hidden")
  leaderboardCard.classList.remove("hidden")

  // Load leaderboard data
  loadLeaderboard()
}

function goToHome() {
  leaderboardCard.classList.add("hidden")
  homeCard.classList.remove("hidden")
}

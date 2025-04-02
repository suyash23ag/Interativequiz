// DOM Elements
const leaderboardContainer = document.getElementById("leaderboard-container")
const leaderboardLoading = document.getElementById("leaderboard-loading")
const leaderboardEmpty = document.getElementById("leaderboard-empty")

// Functions
function loadLeaderboard() {
  // Show loading
  leaderboardLoading.classList.remove("hidden")
  leaderboardEmpty.classList.add("hidden")

  // Clear previous entries
  const entries = leaderboardContainer.querySelectorAll(".leaderboard-entry")
  entries.forEach((entry) => entry.remove())

  // Simulate loading delay (in a real app, this would be a fetch to a server)
  setTimeout(() => {
    // Get scores from localStorage
    const scores = JSON.parse(localStorage.getItem("quizScores")) || []

    // Hide loading
    leaderboardLoading.classList.add("hidden")

    if (scores.length === 0) {
      leaderboardEmpty.classList.remove("hidden")
      return
    }

    // Create leaderboard entries
    scores.forEach((entry, index) => {
      const entryElement = createLeaderboardEntry(entry, index)
      leaderboardContainer.appendChild(entryElement)
    })
  }, 1000)
}

function createLeaderboardEntry(entry, index) {
  const entryElement = document.createElement("div")
  entryElement.className = "leaderboard-entry"

  const rankElement = document.createElement("div")
  rankElement.className = "rank"

  const rankNumberElement = document.createElement("div")
  rankNumberElement.className = `rank-number ${index < 3 ? `rank-${index + 1}` : ""}`

  if (index < 3) {
    // Use icons for top 3
    const iconElement = document.createElement("i")
    if (index === 0) {
      iconElement.className = "fas fa-trophy"
    } else if (index === 1) {
      iconElement.className = "fas fa-medal"
    } else {
      iconElement.className = "fas fa-award"
    }
    rankNumberElement.appendChild(iconElement)
  } else {
    rankNumberElement.textContent = index + 1
  }

  const nameElement = document.createElement("div")
  nameElement.className = "player-name"
  nameElement.textContent = entry.name

  rankElement.appendChild(rankNumberElement)
  rankElement.appendChild(nameElement)

  const scoreElement = document.createElement("div")
  scoreElement.className = "player-score"
  scoreElement.textContent = `${entry.score} pts`

  entryElement.appendChild(rankElement)
  entryElement.appendChild(scoreElement)

  return entryElement
}


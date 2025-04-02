// Quiz questions and answers
const quizQuestions = [
    {
      id: 1,
      question: "Which programming language is React built with?",
      options: ["JavaScript", "Python", "Java", "C++"],
      correctAnswer: 0,
      points: 10,
    },
    {
      id: 2,
      question: "What does CSS stand for?",
      options: ["Computer Style Sheets", "Creative Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"],
      correctAnswer: 2,
      points: 10,
    },
    {
      id: 3,
      question: "Which of the following is NOT a JavaScript framework?",
      options: ["React", "Angular", "Vue", "Django"],
      correctAnswer: 3,
      points: 10,
    },
    {
      id: 4,
      question: "What is the purpose of the 'addEventListener' method in JavaScript?",
      options: ["To handle events", "To create variables", "To optimize rendering", "To define functions"],
      correctAnswer: 0,
      points: 10,
    },
    {
      id: 5,
      question: "Which HTML tag is used to create a hyperlink?",
      options: ["<link>", "<a>", "<href>", "<url>"],
      correctAnswer: 1,
      points: 10,
    },
  ]
  
  // Calculate time bonus based on remaining time
  function calculateTimeBonus(timeRemaining, maxTime) {
    // Award up to 5 points based on how quickly the question was answered
    return Math.round((timeRemaining / maxTime) * 5)
  }
  
  

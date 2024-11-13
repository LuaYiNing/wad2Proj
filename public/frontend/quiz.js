const quizData = {
  general: {
    name: "General Food Waste",
    questions: [
      {
        question: "What percentage of food is wasted globally?",
        answers: [
          { text: "33%", correct: true, x: 200, y: 100 },
          { text: "15%", correct: false, x: 400, y: 100 },
          { text: "50%", correct: false, x: 600, y: 100 }
        ],
        explanation: "About 33% of all food produced globally is wasted, which has significant environmental and economic impacts."
      },
      {
        question: "Which sector contributes most to food waste?",
        answers: [
          { text: "Restaurants", correct: false, x: 200, y: 100 },
          { text: "Households", correct: true, x: 400, y: 100 },
          { text: "Farms", correct: false, x: 600, y: 100 }
        ],
        explanation: "Households contribute the most to food waste due to over-purchasing, improper storage, and lack of awareness."
      },
      {
        question: "How much money is lost annually due to food waste?",
        answers: [
          { text: "$500B", correct: false, x: 200, y: 100 },
          { text: "$750B", correct: false, x: 400, y: 100 },
          { text: "$1T", correct: true, x: 600, y: 100 }
        ],
        explanation: "Food waste costs the global economy nearly $1 trillion every year."
      }
    ]
  },
  video1: {
    name: "Hidden Cost of Food Waste",
    questions: [
      {
        question: "What can individuals do to reduce food waste?",
        answers: [
          { text: "Plan ahead", correct: false, x: 200, y: 100 },
          { text: "Store properly", correct: false, x: 400, y: 100 },
          { text: "All options", correct: true, x: 600, y: 100 }
        ],
        explanation: "To reduce food waste, individuals should plan meals, store food properly, and avoid over-purchasing."
      },
      {
        question: "How much food is lost in developing countries?",
        answers: [
          { text: "20%", correct: false, x: 200, y: 100 },
          { text: "40%", correct: true, x: 400, y: 100 },
          { text: "60%", correct: false, x: 600, y: 100 }
        ],
        explanation: "In developing countries, about 40% of food is lost due to poor infrastructure, lack of storage facilities, and inefficient supply chains."
      },
      {
        question: "What percentage of fruits and vegetables are wasted?",
        answers: [
          { text: "25%", correct: false, x: 200, y: 100 },
          { text: "35%", correct: false, x: 400, y: 100 },
          { text: "45%", correct: true, x: 600, y: 100 }
        ],
        explanation: "Around 45% of all fruits and vegetables produced globally are wasted, often due to aesthetic standards and spoilage."
      }
    ]
  },
  video2: {
    name: "Turn the Tables on Food Waste",
    questions: [
      {
        question: "Why does food go to waste?",
        answers: [
          { text: "Overbuying", correct: false, x: 200, y: 100 },
          { text: "Poor storage", correct: false, x: 400, y: 100 },
          { text: "All reasons", correct: true, x: 600, y: 100 }
        ],
        explanation: "Food waste is caused by a combination of overbuying, poor storage, and not using food before it expires."
      },
      {
        question: "Which action category doesn't reduce waste?",
        answers: [
          { text: "Prevent", correct: false, x: 200, y: 100 },
          { text: "Store", correct: true, x: 400, y: 100 },
          { text: "Donate", correct: false, x: 600, y: 100 }
        ],
        explanation: "While storing food properly is important, it is not categorized as a proactive action to reduce waste compared to prevention or donation."
      },
      {
        question: "What's the first step in preventing food waste?",
        answers: [
          { text: "Planning", correct: true, x: 200, y: 100 },
          { text: "Storage", correct: false, x: 400, y: 100 },
          { text: "Recycling", correct: false, x: 600, y: 100 }
        ],
        explanation: "Planning meals in advance helps prevent over-purchasing, which is a key step in reducing food waste."
      }
    ]
  },
  video3: {
    name: "Food Expiration Dates",
    questions: [
      {
        question: "Do 'Best by' dates indicate food safety?",
        answers: [
          { text: "True", correct: false, x: 200, y: 100 },
          { text: "False", correct: true, x: 400, y: 100 }
        ],
        explanation: "'Best by' dates are indicators of quality, not safety. Food can often still be consumed after this date."
      },
      {
        question: "What does 'Best by' date indicate?",
        answers: [
          { text: "Safety", correct: false, x: 200, y: 100 },
          { text: "Quality", correct: true, x: 400, y: 100 },
          { text: "Expiration", correct: false, x: 600, y: 100 }
        ],
        explanation: "'Best by' dates indicate the peak quality of a product, not its safety."
      },
      {
        question: "Which date label is about food safety?",
        answers: [
          { text: "Best by", correct: false, x: 200, y: 100 },
          { text: "Use by", correct: true, x: 400, y: 100 },
          { text: "Sell by", correct: false, x: 600, y: 100 }
        ],
        explanation: "'Use by' dates are the only labels that relate to food safety, especially for perishable items."
      }
    ]
  }
};

let game = null;
const quizInfo = document.querySelector('.quiz-info');
function resizeCanvas() {
  const canvas = document.getElementById('gameCanvas');
  const containerWidth = canvas.parentElement.clientWidth;
  
  // Update canvas size
  canvas.style.width = containerWidth + 'px';
  
  // Update canvas internal dimensions
  canvas.width = containerWidth;
}

// Call on load
resizeCanvas();

// Update when window resizes
window.addEventListener('resize', resizeCanvas);
class QuizGame {
  constructor(category) {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.score = 0;
    this.currentQuestionIndex = 0;
    this.category = category;
    this.questions = quizData[category].questions;
    this.answeredCurrentQuestion = false;
    this.totalQuestions = this.questions.length;
    this.correctAnswers = 0;

    // Set canvas size
    resizeCanvas();
    this.canvas.height = 600;
    
    // Game state
    this.ball = {
      x: this.canvas.width / 2,
      y: this.canvas.height - 40,
      radius: 15,
      color: '#3b82f6',
      velocity: { x: 0, y: 0 },
      shooting: false
    };

    this.mousePos = { x: 0, y: 0 };
    this.aimLine = { x: 0, y: 0 };

    // Event listeners
    this.boundHandleMouseMove = this.handleMouseMove.bind(this);
    this.boundHandleClick = () => this.shootBall();

    this.canvas.addEventListener('mousemove', this.boundHandleMouseMove);
    this.canvas.addEventListener('click', this.boundHandleClick);

    // Start game loop
    this.gameLoop();
    this.displayQuestion();
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mousePos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  shootBall() {
    if (!this.ball.shooting && !this.answeredCurrentQuestion) {
      const angle = Math.atan2(
        this.mousePos.y - this.ball.y,
        this.mousePos.x - this.ball.x
      );
      const speed = 15;
      this.ball.velocity.x = Math.cos(angle) * speed;
      this.ball.velocity.y = Math.sin(angle) * speed;
      this.ball.shooting = true;
    }
  }

  showFeedback(correct) {
    const modal = document.getElementById('feedbackModal');
    const result = modal.querySelector('.result');
    const points = modal.querySelector('.points');
    const explanationEl = modal.querySelector('.explanation');
  
    // Get the explanation of the current question
    const currentQuestion = this.questions[this.currentQuestionIndex];
    const explanation = currentQuestion.explanation;
  
    // Set the result text based on whether the answer was correct or not
    result.textContent = correct ? 'Correct!' : 'Wrong!';
    result.style.color = correct ? '#059669' : '#dc2626';
  
    // Set the points awarded
    points.textContent = correct ? '+100 points' : '+0 points';
  
    // Display the explanation
    explanationEl.textContent = explanation;
  
    // Show the modal
    modal.style.display = 'block';
  }
  
  handleNextQuestion() {
    quizInfo.style.display = 'block';
    document.getElementById('feedbackModal').style.display = 'none';
    this.answeredCurrentQuestion = false;

    if (this.currentQuestionIndex + 1 >= this.questions.length) {
      this.showCompletion();
    } else {
      this.currentQuestionIndex++;
      this.displayQuestion();
      this.resetBall();
    }
  }

  showCompletion() {
    resetQuizInfo();
    document.getElementById('gameCanvas').style.display = 'none';
    document.getElementById('backButton').style.display = 'none';
    document.getElementById('completionScreen').style.display = 'flex';
    document.getElementById('finalScore').textContent =
      `You scored ${this.correctAnswers}/${this.totalQuestions} (${Math.round(this.score / (this.totalQuestions * 100) * 100)}%)`;
  }

  checkCollision() {
    if (this.answeredCurrentQuestion) return;

    const currentQuestion = this.questions[this.currentQuestionIndex];
    currentQuestion.answers.forEach(answer => {
      const dx = this.ball.x - answer.x;
      const dy = this.ball.y - answer.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.ball.radius + 30) {
        this.answeredCurrentQuestion = true;
        if (answer.correct) {
          this.score += 100;
          this.correctAnswers++;
          document.getElementById('score').textContent = `Score: ${this.score}`;
        }
        this.resetBall();
        this.showFeedback(answer.correct);
      }
    });
  }

  resetBall() {
    this.ball.x = this.canvas.width / 2;
    this.ball.y = this.canvas.height - 40;
    this.ball.velocity = { x: 0, y: 0 };
    this.ball.shooting = false;
  }

  displayQuestion() {
    const questionEl = document.getElementById('question');
    const currentQuestion = this.questions[this.currentQuestionIndex];

    // Display the question text
    let questionText = `${currentQuestion.question}<br>`;

    // Display the options with A, B, C labels
    const optionLabels = ['A', 'B', 'C'];
    currentQuestion.answers.forEach((answer, index) => {
      questionText += `<div>${optionLabels[index]}. ${answer.text}</div>`;
    });

    questionEl.innerHTML = questionText;
  }


  update() {
    if (this.ball.shooting) {
      this.ball.x += this.ball.velocity.x;
      this.ball.y += this.ball.velocity.y;

      if (this.ball.x < 0 || this.ball.x > this.canvas.width) {
        this.ball.velocity.x *= -1;
      }
      if (this.ball.y < 0 || this.ball.y > this.canvas.height) {
        this.resetBall();
      }

      this.checkCollision();
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const currentQuestion = this.questions[this.currentQuestionIndex];
    const optionLabels = ['A', 'B', 'C'];

    currentQuestion.answers.forEach((answer, index) => {
      this.ctx.beginPath();
      this.ctx.arc(answer.x, answer.y, 30, 0, Math.PI * 2);

      // Use neutral color before answer, show correct/incorrect after
      this.ctx.fillStyle = this.answeredCurrentQuestion ?
        (answer.correct ? '#22c55e' : '#ef4444') :
        '#64748b';

      this.ctx.fill();
      this.ctx.closePath();

      // Draw A, B, C on the targets
      this.ctx.fillStyle = 'white';
      this.ctx.font = '20px system-ui';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(optionLabels[index], answer.x, answer.y + 6);
    });

    // Draw the ball
    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.ball.color;
    this.ctx.fill();
    this.ctx.closePath();

    // Draw the aim line
    if (!this.ball.shooting && !this.answeredCurrentQuestion) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.ball.x, this.ball.y);
      this.ctx.lineTo(this.mousePos.x, this.mousePos.y);
      this.ctx.strokeStyle = '#94a3b8';
      this.ctx.setLineDash([5, 5]);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }
  }

  gameLoop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.gameLoop());
  }

  cleanup() {
    this.canvas.removeEventListener('mousemove', this.boundHandleMouseMove);
    this.canvas.removeEventListener('click', this.boundHandleClick);
  }
}

function showCategoryScreen() {
  resetQuizInfo();
  document.getElementById('categoryScreen').style.display = 'flex';
  document.getElementById('gameCanvas').style.display = 'none';
  document.getElementById('backButton').style.display = 'none';
  document.getElementById('completionScreen').style.display = 'none';
  document.getElementById('feedbackModal').style.display = 'none';
  if (game) {
    game.cleanup();
    game = null;
  }
}

function startQuiz(category) {
  quizInfo.style.display = 'block';
  document.getElementById('categoryScreen').style.display = 'none';
  document.getElementById('gameCanvas').style.display = 'block';
  document.getElementById('backButton').style.display = 'block';
  document.getElementById('feedbackModal').style.display = 'none';

  if (game) {
    game.cleanup();
  }
  game = new QuizGame(category);

  // Set up next button handler
  document.getElementById('nextButton').onclick = () => game.handleNextQuestion();
}

function retryQuiz() {
  quizInfo.style.display = 'block';
  document.getElementById('completionScreen').style.display = 'none';
  document.getElementById('gameCanvas').style.display = 'block';
  document.getElementById('backButton').style.display = 'block';
  startQuiz(game.category);
}
function resetQuizInfo() {
  quizInfo.style.display = 'none';
  this.score = 0;
}
// Show category screen initially
showCategoryScreen();
document.addEventListener('DOMContentLoaded', () => {
    // Game state variables
    let cards = [];
    let flippedCards = [];
    let moves = 0;
    let matchedPairs = 0;
    let timer = 0;
    let timerInterval;
    let gameStarted = false;
    let totalPairs = 8; // Default for medium (4x4)
    
    // DOM elements
    const gameBoard = document.getElementById('game-board');
    const movesDisplay = document.getElementById('moves');
    const timerDisplay = document.getElementById('timer');
    const newGameBtn = document.getElementById('new-game');
    const playAgainBtn = document.getElementById('play-again');
    const modal = document.getElementById('modal');
    const finalTime = document.getElementById('final-time');
    const finalMoves = document.getElementById('final-moves');
    const finalScore = document.getElementById('final-score');
    const difficultySelect = document.getElementById('difficulty');
    
    // Emoji icons for cards (pair of each)
    const emojis = [
        '⛏️', '😎', '🛀', '🥳', '😍', '🤪', '🎆', '😇',
        '🤠', '🥶', '🤑', '🤯', '🥵', '🤢', '👻', '👽',
        '🤖', '👾', '🐶', '🐱', '🦊', '🐻', '🐼', '🦁',
        '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🦄', '🐝'
    ];
    
    // Initialize game
    function initGame() {
        // Reset game state
        clearInterval(timerInterval);
        gameStarted = false;
        moves = 0;
        matchedPairs = 0;
        timer = 0;
        flippedCards = [];
        movesDisplay.textContent = moves;
        timerDisplay.textContent = timer;
        
        // Set grid size based on difficulty
        const difficulty = difficultySelect.value;
        if (difficulty === 'easy') {
            totalPairs = 6; // 3x4 grid
        } else if (difficulty === 'medium') {
            totalPairs = 8; // 4x4 grid
        } else if (difficulty === 'hard') {
            totalPairs = 18; // 6x6 grid
        }
        
        // Clear the game board
        gameBoard.innerHTML = '';
        
        // Set appropriate class for grid size
        gameBoard.className = 'game-board';
        if (difficulty === 'hard') {
            gameBoard.classList.add('hard');
        }
        
        // Create cards
        createCards();
    }
    
    // Create card elements
    function createCards() {
        // Get emojis for this game
        const gameEmojis = emojis.slice(0, totalPairs);
        const cardEmojis = [...gameEmojis, ...gameEmojis]; // Create pairs
        
        // Shuffle cards
        shuffleArray(cardEmojis);
        
        // Create card elements
        cards = cardEmojis.map((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.index = index;
            card.dataset.emoji = emoji;
            
            const front = document.createElement('div');
            front.className = 'front';
            front.textContent = emoji;
            
            const back = document.createElement('div');
            back.className = 'back';
            
            card.appendChild(front);
            card.appendChild(back);
            
            card.addEventListener('click', flipCard);
            
            gameBoard.appendChild(card);
            return card;
        });
    }
    
    // Shuffle array using Fisher-Yates algorithm
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Flip a card
    function flipCard() {
        // Don't allow flipping if game hasn't started, card is already flipped or matched
        if (!gameStarted) {
            startTimer();
            gameStarted = true;
        }
        
        if (flippedCards.length === 2 || this.classList.contains('flipped') || this.classList.contains('matched')) {
            return;
        }
        
        // Flip the card
        this.classList.add('flipped');
        flippedCards.push(this);
        
        // Check for match when two cards are flipped
        if (flippedCards.length === 2) {
            moveCounter();
            checkForMatch();
        }
    }
    
    // Check if flipped cards match
    function checkForMatch() {
        const [card1, card2] = flippedCards;
        const emoji1 = card1.dataset.emoji;
        const emoji2 = card2.dataset.emoji;
        
        if (emoji1 === emoji2) {
            // Match found
            card1.classList.add('matched');
            card2.classList.add('matched');
            flippedCards = [];
            matchedPairs++;
            
            // Check if game is won
            if (matchedPairs === totalPairs) {
                endGame();
            }
        } else {
            // No match - flip back after delay
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
            }, 1000);
        }
    }
    
    // Increment move counter
    function moveCounter() {
        moves++;
        movesDisplay.textContent = moves;
    }
    
    // Start game timer
    function startTimer() {
        timerInterval = setInterval(() => {
            timer++;
            timerDisplay.textContent = timer;
        }, 1000);
    }
    
    // End game (all pairs matched)
    function endGame() {
        clearInterval(timerInterval);
        
        // Calculate score (lower is better)
        const score = Math.floor((totalPairs * 1000) / (moves * timer));
        
        // Show modal with results
        finalTime.textContent = timer;
        finalMoves.textContent = moves;
        finalScore.textContent = score;
        modal.style.display = 'flex';
    }
    
    // Event listeners
    newGameBtn.addEventListener('click', initGame);
    playAgainBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        initGame();
    });
    
    difficultySelect.addEventListener('change', initGame);
    
    // Initialize first game
    initGame();
});
let playerName = '';
        let word = '';
        let guessedLetters = new Set();
        let mistakes = 0;
        let gameOver = false;
        let win = false;

        const playerNameDisplay = document.getElementById('player-name-display');
        const hangmanContainer = document.getElementById('hangman-container');
        const wordDisplay = document.getElementById('word-display');
        const remainingAttempts = document.getElementById('remaining-attempts');
        const lettersContainer = document.getElementById('letters-container');
        const inputWord = document.getElementById('input-word');
        const startGameButton = document.getElementById('start-game');
        const gameOverMessage = document.getElementById('game-over-message');
        const resetGameButton = document.getElementById('reset-game');
        const gameOverDiv = document.getElementById('game-over');

        // Función para pedir el nombre del jugador usando SweetAlert
        const askPlayerName = () => {
            Swal.fire({
                title: 'Ingrese su nombre',
                input: 'text',
                inputLabel: 'Nombre del Jugador',
                inputPlaceholder: 'Escribe tu nombre',
                allowOutsideClick: false,
                inputValidator: (value) => {
                    if (!value) {
                        return 'Por favor ingresa tu nombre';
                    }
                }
            }).then((result) => {
                playerName = result.value;
                playerNameDisplay.innerText = `Jugador: ${playerName}`;
                startGameButton.classList.remove('hidden'); // Mostrar el botón de inicio después de ingresar el nombre
            });
        };

        // Mostrar "Game Over" si pierde 3 veces
        const handleGameOver = () => {
            Swal.fire({
                title: 'Game Over',
                text: 'Has perdido tres veces.',
                icon: 'error',
                confirmButtonText: 'Reiniciar'
            }).then(() => {
                resetGame();
            });
        };

        const drawHangman = () => {
            hangmanContainer.innerHTML = `
                <svg height="200" width="200">
                    <line x1="70" y1="175" x2="70" y2="25" stroke="currentColor" stroke-width="3" />
                    <line x1="70" y1="25" x2="110" y2="25" stroke="currentColor" stroke-width="3" />
                    <line x1="110" y1="25" x2="110" y2="45" stroke="currentColor" stroke-width="3" />
                    ${mistakes >= 1 ? '<circle id="hangman-head" cx="110" cy="65" r="15" stroke="currentColor" stroke-width="3" fill="none" />' : ''}
                    ${mistakes >= 2 ? '<line x1="110" y1="80" x2="110" y2="140" stroke="currentColor" stroke-width="3" />' : ''}
                    ${mistakes >= 3 ? '<line x1="110" y1="90" x2="80" y2="110" stroke="currentColor" stroke-width="3" />' : ''}
                    ${mistakes >= 4 ? '<line x1="110" y1="90" x2="140" y2="110" stroke="currentColor" stroke-width="3" />' : ''}
                    ${mistakes >= 5 ? '<line x1="110" y1="140" x2="80" y2="175" stroke="currentColor" stroke-width="3" />' : ''}
                    ${mistakes >= 6 ? '<line x1="110" y1="140" x2="140" y2="175" stroke="currentColor" stroke-width="3" />' : ''}
                    ${mistakes === 6 ? `
                        <line x1="100" y1="60" x2="103" y2="63" stroke="currentColor" stroke-width="3" />
                        <line x1="103" y1="60" x2="100" y2="63" stroke="currentColor" stroke-width="3" />
                        <line x1="117" y1="60" x2="120" y2="63" stroke="currentColor" stroke-width="3" />
                        <line x1="120" y1="60" x2="117" y2="63" stroke="currentColor" stroke-width="3" />
                    ` : ''}
                    ${mistakes === 6 ? `
                        <line x1="105" y1="65" x2="115" y2="75" stroke="currentColor" stroke-width="3" />
                        <line x1="115" y1="65" x2="105" y2="75" stroke="currentColor" stroke-width="3" />
                    ` : ''}
                </svg>
            `;
        };

        const updateWordDisplay = () => {
            wordDisplay.innerText = word.split('').map(letter => guessedLetters.has(letter) ? letter : '_').join(' ');
        };

        const handleGuess = (letter) => {
            if (gameOver) return;

            guessedLetters.add(letter);

            if (!word.includes(letter)) {
                mistakes++;
                if (mistakes >= 6) {
                    gameOver = true;
                    gameOverMessage.innerText = `Juego terminado. La palabra era: ${word}`;
                    gameOverDiv.classList.remove('hidden');

                    // Activar el movimiento de péndulo en el muñeco
                    const hangmanHead = document.getElementById('hangman-head');
                    if (hangmanHead) {
                        hangmanHead.classList.add('animate-swing'); // Agregar animación al muñeco
                    }
                }
            } else {
                const remainingLetters = word.split('').filter(char => !guessedLetters.has(char));
                if (remainingLetters.length === 0) {
                    win = true;
                    gameOver = true;
                    gameOverMessage.innerText = '¡Felicidades! Has ganado.';
                    gameOverDiv.classList.remove('hidden');
                }
            }

            drawHangman();
            remainingAttempts.innerText = `Intentos restantes: ${6 - mistakes}`;
            updateWordDisplay();
        };

        const startGame = () => {
            word = inputWord.value.trim().toUpperCase();
            if (word) {
                guessedLetters = new Set();
                mistakes = 0;
                gameOver = false;
                win = false;
                drawHangman();
                remainingAttempts.innerText = `Intentos restantes: 6`;
                lettersContainer.innerHTML = '';
                updateWordDisplay();

                // Ocultar el campo de entrada y el botón de inicio
                inputWord.classList.add('hidden');
                startGameButton.classList.add('hidden');

                // Crear botones para las letras
                const letters = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
                for (let letter of letters) {
                    const button = document.createElement('button');
                    button.innerText = letter;
                    button.classList.add('letter-button');
                    button.disabled = guessedLetters.has(letter) || gameOver;
                    button.addEventListener('click', () => {
                        handleGuess(letter);
                        button.disabled = true; // Desactivar el botón al hacer clic
                    });
                    lettersContainer.appendChild(button);
                }
            }
        };

        const resetGame = () => {
            word = '';
            guessedLetters = new Set();
            mistakes = 0;
            gameOver = false;
            win = false;
            drawHangman();
            remainingAttempts.innerText = `Intentos restantes: 6`;
            lettersContainer.innerHTML = '';
            updateWordDisplay();
            gameOverDiv.classList.add('hidden');
            inputWord.value = ''; // Limpiar el input
            inputWord.classList.remove('hidden'); // Mostrar el input
            startGameButton.classList.remove('hidden'); // Mostrar el botón de inicio
        };

        startGameButton.addEventListener('click', startGame);
        resetGameButton.addEventListener('click', resetGame);
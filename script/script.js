const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
  words = [
    { word: 'apple', hint: 'A fruit that is red and often used to make pies.' },
    { word: 'banana', hint: 'A yellow fruit, loved by monkeys.' },
    { word: 'cat', hint: 'A small domestic animal.' },
    { word: 'dog', hint: 'A domesticated animal known as man’s best friend.' },
    { word: 'flower', hint: 'A colorful and fragrant bloom often found in gardens.' },
    { word: 'guitar', hint: 'A musical instrument with strings that is often played with fingers or a pick.' },
    { word: 'house', hint: 'A building for human habitation.' },
    { word: 'island', hint: 'A piece of land surrounded by water.' },
    { word: 'jacket', hint: 'A piece of clothing worn on the upper body.' },
    { word: 'lemon', hint: 'A yellow citrus fruit with a sour taste.' },
    { word: 'mountain', hint: 'A large landform that rises prominently above its surroundings.' },
    { word: 'notebook', hint: 'A book with blank pages for writing notes.' },
    { word: 'orange', hint: 'A round citrus fruit with a tough bright orange rind.' },
    { word: 'penguin', hint: 'A flightless bird found in the Southern Hemisphere.' },
    { word: 'rainbow', hint: 'A meteorological phenomenon that is caused by reflection, refraction, and dispersion of light.' },
    { word: 'sunflower', hint: 'A tall plant with a large, bright yellow flower head.' },
    { word: 'umbrella', hint: 'A portable canopy designed to protect against rain or sunlight.' },
  ],
  hangmanBodyPartsAttr = [
    { src: './img/head.svg', class: ['body-part', 'head-item', 'hidden'], id: 'head-item', alt: 'gallow img element' },
    { src: './img/body.svg', class: ['body-part', 'body-item', 'hidden'], id: 'body-item', alt: 'gallow img element' },
    { src: './img/leftHand.svg', class: ['body-part', 'left-hand', 'hand', 'hidden'], id: 'left-hand', alt: 'gallow img element' },
    { src: './img/rightHand.svg', class: ['body-part', 'right-hand', 'hand', 'hidden'], id: 'right-hand', alt: 'gallow img element' },
    { src: './img/leftLeg.svg', class: ['body-part', 'left-leg', 'leg', 'hidden'], id: 'left-leg', alt: 'gallow img element' },
    { src: './img/rightLeg.svg', class: ['body-part', 'right-leg', 'leg', 'hidden'], id: 'right-leg', alt: 'gallow img element' }
  ],
  promptTextValues = {
    greeting: {
      title: 'Congratulations!',
      text: 'You\'ve done a great job!',
    },
    loser: {
      title: 'Oh no!',
      text: 'You will succeed, but not this time...',
    }
  },
  usedIndexes = [],
  chosenLetters = [];

secretWordLetters = document.querySelectorAll('.secret-word-letter');

let incorrectGussesNumber = 0,
  openedLettersNumber = 0,
  index,
  greeting = true;

const closeModal = () => {
  document.querySelector('.greeting-prompt').classList.add('display-none');
}

const createHtmlStructure = () => {
  document.querySelector('body').insertAdjacentHTML('afterbegin', `
    <header class='header'>
    <h1 class='title'>Hangman game</h1>
  </header>
  <main class='main'>
    <section class='gallow'>
    </section>

    <section class='text-zone'>
      <div class='secret-word-wrapper' id='secret-word-wrapper'>
      </div>

      <div class='question-wrapper'>
        <span>Hint: </span>
        <span id='question-text'></span>
      </div>

      <div class='incorrect-number-wrapper'>
        Incorrect guesses: <span class='red-text'><span id='incorrect-guesses-number'>0 </span>/6</span>
      </div>

      <div class='keyboard-wrapper' id='keyboard-wrapper'>
      </div>
    </section>
  </main>
  `)
}

const addGallowImg = () => {
  hangmanBodyPartsAttr.forEach((el) => {
    const img = document.createElement('img');
    img.id = el.id;
    img.setAttribute('src', el.src);
    img.setAttribute('alt', el.alt);
    el.class.map((className) => {
      img.classList.add(className);
    });
    document.querySelector('.gallow').appendChild(img);
  });
}

const addModal = () => {
  document.querySelector('body').insertAdjacentHTML('beforeend', `
  <article class='greeting-prompt display-none'>
    <div class='prompt-container'>
      <h2 class='greeting-title'></h2>
      <p class='greeting-text'>${greeting ? promptTextValues.greeting.text : promptTextValues.loser.text}</p>
      <p>Secret word: <span class='prompt-word'></span></p>
      <div>
        <button class='prompt-btn' id='modal-start-game-btn' type='button'>Play again</button>
      </div>
    </div>
  </article>
  `);

  document.querySelector('#modal-start-game-btn').addEventListener('click', () => {
    closeModal();
    startGame();
  });
}

const showModal = () => {
  document.querySelector('.greeting-title').innerText = greeting ? promptTextValues.greeting.title : promptTextValues.loser.title;
  document.querySelector('.greeting-text').innerText = greeting ? promptTextValues.greeting.text : promptTextValues.loser.text;
  document.querySelector('.prompt-word').innerText = words[index].word;
  document.querySelector('.greeting-prompt').classList.remove('display-none');
}


const generateIndex = () => {
  index = Math.round(Math.random() * (words.length - 1));
  if (!usedIndexes.includes(index)) {
    usedIndexes.push(index);
    return;
  }
  generateIndex();
}

const disableKeyboard = () => {
  document.querySelector('#keyboard-wrapper').childNodes.forEach((el) => {
    el.disabled = true;
  });
}

const setActiveKeyboard = () => {
  document.querySelector('#keyboard-wrapper').childNodes.forEach((el) => {
    el.disabled = false;
  });
}

const insertLetterBtns = () => {
  alphabet.map((el) => {
    document.querySelector('#keyboard-wrapper').insertAdjacentHTML('beforeend', `
      <button type='button' title=${el} class='keyboard-letter' id=${el}>${el}</button>
    `);
  });
}

const addListenerToLetterBtns = () => {
  document.querySelectorAll('.keyboard-letter').forEach((el) => {
    el.addEventListener('click', () => {
      el.disabled = true;
      checkLetter(el.innerText);
    });
  });
}

const displayLetter = (currentLetter) => {
  words[index].word.split('').map((el, index) => {
    if (el === currentLetter) {
      const currentLetterSpan = document.querySelectorAll('.secret-word-letter')[index];
      currentLetterSpan.innerText = currentLetter;
      currentLetterSpan.classList.add('border-none');
      openedLettersNumber += 1;
    }
  });
}

const checkForWin = () => {
  if (words[index].word.length === openedLettersNumber) {
    disableKeyboard();
    setTimeout(() => {
      greeting = true;
      showModal();
    }, 500);
  }
}

const showBodyPart = () => {
  document.querySelectorAll('.body-part')[incorrectGussesNumber].classList.remove('hidden');
  incorrectGussesNumber += 1;
  document.querySelector('#incorrect-guesses-number').innerText = incorrectGussesNumber;
}

const hideBodyPart = () => {
  document.querySelectorAll('.body-part').forEach(el => {
    el.classList.add('hidden');
  })
  incorrectGussesNumber = 0;
  document.querySelector('#incorrect-guesses-number').innerText = incorrectGussesNumber;
}

const checkForLose = () => {
  if (incorrectGussesNumber === 6) {
    disableKeyboard();
    setTimeout(() => {
      greeting = false;
      showModal();
    }, 500)
  }
}

const checkLetter = (letter) => {
  const currentLetter = letter.toLowerCase();

  if (words[index].word.includes(currentLetter)) {
    displayLetter(currentLetter);
    checkForWin();
    return;
  }

  showBodyPart();
  checkForLose();
}

const displayKeyboard = () => {
  insertLetterBtns();
  addListenerToLetterBtns();
}

displaySecretWordLettersPlaceholder = () => {
  const secretWordWrapper = document.querySelector('#secret-word-wrapper');
  secretWordWrapper.innerHTML = '';
  for (let i = 0; i < words[index].word.length; i++) {
    secretWordWrapper.insertAdjacentHTML('beforeend', `
      <span class='secret-word-letter' key=${index}></span>
    `);
  }
}

const displayQuestion = () => {
  document.querySelector('#question-text').innerText = words[index].hint;
}

const startGame = () => {
  incorrectGussesNumber = 0;
  openedLettersNumber = 0;
  hideBodyPart();
  generateIndex();
  displaySecretWordLettersPlaceholder();
  displayQuestion();
  setActiveKeyboard();
}

const displayInterface = () => {
  createHtmlStructure();
  addGallowImg();
  displayKeyboard();
  addModal();
  startGame();
}

displayInterface();

document.addEventListener("keydown", (event) => {
  const keyName = event.key.toLowerCase();
  if (alphabet.includes(keyName)) {
    document.querySelectorAll('.keyboard-letter').forEach((el) => {
      if (el.innerText.toLowerCase() === keyName) {
        el.disabled = true;
      }
    });
    checkLetter(keyName);
    return;
  }
})

console.log('Responsive / adaptive UI from 1440px to 360px viewport: +10\n  The generation of DOM elements is implemented.body in the index.html is empty(can contain only script tag).This requirement can be checked by pressing Ctrl + U(Windows) or Option(⌥) + Command(⌘) + U(Mac): +20\n  The game starts with the correct default view(empty gallows, underscores for secret word, etc.) and a random question: +5\n  The user can play the game by using the virtual keyboard: +20\n  The user can play the game by using the physical keyboard: +20\n When the letter is correct, it appears instead of the corresponding underscore.If the letter repeats in the word, all corresponding underscores must be replaced by it: +15\n When the letter is incorrect: \n the incorrect guesses counter is updated: +5\n a body part is added to the gallows: +10\n The clicked / pressed letter is disabled: +5\n The body parts appear on the gallows in the logical order(head, body, left arm, right arm, left leg, right leg): +5\n When the user runs out of 6 attempts or wins the game, the modal window appears: +10\n The modal window includes the message about the game\'s outcome(winning or losing), the secret word and the \'play again\' button: +10\n  When the user clicks the \'play again\' button, the game starts over by showing a new question and resetting the gallows, the incorrect guesses counter and the underscores for the secret word: +15\n');
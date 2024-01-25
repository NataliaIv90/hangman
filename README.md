# HANGMAN project

Deploy: [link]()

Done 25.01.2024
 
## Task:

[task](https://github.com/rolling-scopes-school/js-fe-course-en/blob/main/tasks/hangman/hangman.md)

## Screenshots:

![Start game screenshot](./img/hangman2.png)

![Game process screenshot](./img/hangman1.png)

![End game prompt screenshot](./img/hangman3.png)

## Requirements

+ Responsive/adaptive UI from 1440px to 360px viewport.
+ The generation of DOM elements is implemented. body in the index.html is empty (can contain only script tag). This requirement can be checked by pressing Ctrl+U (Windows) or Option(⌥)+Command(⌘)+U (Mac)
+ The game starts with the correct default view (empty gallows, underscores for secret word, etc.) and a random question.
+ The user can play the game by using the virtual keyboard.
+ The user can play the game by using the physical keyboard.
+ When the letter is correct, it appears instead of the corresponding underscore. If the letter repeats in the word, all corresponding underscores must be replaced by it.
+ When the letter is incorrect: the incorrect guesses counter is updated, a body part is added to the gallows.
+ The clicked/pressed letter is disabled.
+ The body parts appear on the gallows in the logical order (head, body, left arm, right arm, left leg, right leg).When the user runs + out of 6 attempts or wins the game, the modal window appears.
+ The modal window includes the message about the game's outcome+  (winning or losing), the secret word and the 'play again' button.
+ When the user clicks the 'play again' button, the game starts over by showing a new question and resetting the gallows, the incorrect guesses counter and the underscores for the secret word.

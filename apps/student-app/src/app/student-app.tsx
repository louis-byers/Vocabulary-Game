import React from 'react';
import { useState } from 'react';
import { Data, WordList, Word } from '@vocabulary-game/types';

function get_test_data(course_code: string) {
  return test_data();
}
function test_data(): Data {
  return {
    author: {
      id: '42',
      email: 'useremail@gmail.com',
      first_name: 'Educator',
      last_name: 'User',
    },
    id: '1',
    course_title: 'WR 95',
    course_code: 'QWERTY',
    last_updated: new Date(),
    word_lists: [
      {
        id: '1',
        name: 'WR 95 Test List',
        words: [
          {
            word: 'buttress',
            hint: 'A structure built against a wall in order to support or strengthen it.',
          },
          {
            word: 'prestigious',
            hint: 'Something having the respect and admiration that someone or something gets for being successful or important.',
          },
        ],
      },
    ],
  };
}

export function StudentApp({ title }: { title: string }) {
  const [error, setError] = useState('null');
  const [screen, setScreen] = useState('splash');
  const [course_code, setCourse] = useState('');
  const [word_list_name, setWordList] = useState('');
  // Setup the state

  // create the variables
  var wordLists;
  var data: Data;
  var score = 0;
  var time_remaining = 60;
  var word_list: WordList;
  var hint = '';
  var word = '';
  var answered = false;
  var is_correct = false;
  var words_in_game: Word[] = [];
  // Score Related Methods
  function increment_score() {
    score++;
  }
  function set_word_list(selected_list: WordList) {
    word_list = selected_list;
  }

  // Pick random word from word list
  function next_word() {
    const word_obj =
      word_list.words[Math.floor(Math.random() * word_list.words.length)];
    hint = word_obj.hint;
    word = word_obj.word;
    words_in_game.push(word_obj);
  }

  // To reset the game
  function reset_game() {
    score = 0;
    time_remaining = 60;
    hint = '';
    word = '';
  }

  // to populate the LI elements for the word lists ()
  // Idea is to set the word list here, then confirm later in the form
  function get_word_list_items() {
    const listItems = data.word_lists.map((word_list: WordList) => {
      return (
        <li
          onClick={(e) => handleSetWordList(e, word_list.id)}
          id={word_list.id}
        >
          <b>{word_list.name}:</b> word_list.words.length
        </li>
      );
    });
    wordLists = { listItems };
  }

  // Creates a list of words that were in the game.
  // Populates a UL element on game-words page.
  function get_words_from_game() {
    const listItems = words_in_game.map((word: Word) => {
      return (
        <li id="word${word.word}">
          <b>word.word:</b> word.hint
        </li>
      );
    });
    return { listItems };
  }

  // Button to go to Crouse page
  function handleToCourse(e: any) {
    try {
      setError('null');
      setScreen('course');
    } catch (err) {
      setError('error-word-list');
    }
  }

  // Back button to return to Splash page
  function handleBackToSplash(e: any) {
    try {
      setError('null');
      setScreen('splash');
    } catch (err) {
      setError('error-course');
    }
  }

  // Back button to return to Course Code page
  function handleBackToCourse(e: any) {
    try {
      setError('null');
      setScreen('course');
    } catch (err) {
      setError('error-word-list');
    }
  }

  // Back button to return to Word List page
  function handleBackToWordLists(e: any) {
    try {
      setError('null');
      setScreen('word-list');
    } catch (err) {
      setError('error-word-list');
    }
  }

  // Back button to return to Score page
  function handleBackToScore(e: any) {
    try {
      setError('null');
      setScreen('score');
    } catch (err) {}
  }

  // Replay button that resets the game and starts it again.
  function handleResetGame(e: any) {
    try {
      setError('null');
      reset_game();
      setScreen('game');
    } catch (err) {}
  }

  // Button to visit Word Review page
  function handleToGameWords(e: any) {
    try {
      setError('null');
      setScreen('game-words');
    } catch (err) {}
  }

  // Handles course code submission
  async function handleSubmitCourse(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      // GET on course GUID
      await submitCourse(course_code);

      data = get_test_data(course_code);
      get_word_list_items();
      setError('null');
      setScreen('word-list');
    } catch (err) {
      setError('error-course');
    }
  }

  // Handles setting the word list to chosen list item ID
  async function handleSetWordList(
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    id: string
  ) {
    try {
      word_list = data.word_lists.filter((wrd_lst: WordList) => {
        return wrd_lst.id === id;
      });
      setError('null');
    } catch (err) {
      setError('error-word-list');
    }
  }

  // Handles text entry into Course Code Text field
  function handleCourseChange(e: {
    target: { value: React.SetStateAction<string> };
  }) {
    setCourse(e.target.value);
  }

  // handles the submission of the word list once its chosen.
  async function handleSubmitWordList(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      // Set current_word_list
      word_list = {
        id: '',
        name: '',
        words: [],
      };
    } catch (err) {}
  }

  // Handles word submission. I'll probably change this to a correct / skip button later to simulate head nods and shakes
  async function handleSubmitWord(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      answered = true;
      // await submitWord(e.target.value);
      // get answer
      //check answer against word, if lower cases match, is_correct = true
      is_correct = true;
    } catch (err) {
      is_correct = false;
    }
  }

  return (
    <>
      <div
        id="splash-screen"
        className={screen === 'splash' ? 'content' : 'hidden-content'}
      >
        <h1>Vocab Game</h1>
        <div>Splash Screen</div>
        <div>tap screen to start</div>
        <button onClick={handleToCourse} id="start-btn" disabled={false}>
          Start
        </button>
      </div>

      <div
        id="course-selection"
        className={screen === 'course' ? 'content' : 'hidden-content'}
      >
        <h1>Vocab Game</h1>
        <div id="course-select">
          <form id="course-select-form" onSubmit={handleSubmitCourse}>
            {error === 'error-course' ? (
              <span id="errorCourse" className="error">
                Failed to load course guid.
              </span>
            ) : null}
            <label>Enter Course Code: </label>
            <input
              type="text"
              id="course-guid"
              name="course-guid"
              placeholder="qwerty"
              value={course_code}
              onChange={handleCourseChange}
            />
            <br></br>
            <button type="submit" id="submit-course-code" disabled={false}>
              Submit
            </button>
          </form>
          <button id="back-to-splash-btn" onClick={handleBackToSplash}>
            Back
          </button>
        </div>
      </div>

      <div
        id="word-list-selection"
        className={screen === 'word-list' ? 'content' : 'hidden-content'}
      >
        <h1>Vocab Game</h1>
        {error === 'error-course' ? (
          <span id="errorCourse" className="error">
            Failed to load course guid.
          </span>
        ) : null}
        <div id="word-list-select">
          <form id="course-select-form" onSubmit={handleSubmitCourse}>
            {error === 'error-word-list' ? (
              <span id="errorCourse" className="error">
                Failed to load course guid.
              </span>
            ) : null}
            <label>Select Word List: </label>
            <ul id="word-list-list">{wordLists}</ul>
            <button type="submit" id="submit-word-list-btn">
              Submit
            </button>
          </form>
          <button id="back-to-course-btn" onClick={handleBackToCourse}>
            Back
          </button>
        </div>
      </div>

      <div
        id="game-screen"
        className={screen === 'game' ? 'content' : 'hidden-content'}
      >
        <form id="course-select-form" onSubmit={handleSubmitWord}>
          <h1 id="word-hint-header">{hint}</h1>
          <label>Enter Word: </label>
          <input
            type="text"
            id="word-test"
            name="word-test"
            placeholder="word"
          />
          <br></br>
          <button disabled={false}>Check</button>
          <div id="word-answer">
            <h2
              id="word-answer-header"
              className={
                answered
                  ? is_correct
                    ? 'correct-word'
                    : 'incorrect-word'
                  : 'word'
              }
            >
              {word}
            </h2>
          </div>
          <div id="score">Score: {score}</div>
          <div id="time-left">
            {time_remaining} {time_remaining === 1 ? 'second' : 'seconds'}
          </div>
        </form>
      </div>

      <div
        id="game-screen"
        className={screen === 'score' ? 'content' : 'hidden-content'}
      >
        <h1 id="score-header">Congrats!</h1>
        <div>
          You got {score} of {words_in_game.length}!
        </div>
        <button id="back-to-course-btn" onClick={handleResetGame}>
          Replay
        </button>
        <button id="game-words-btn" onClick={handleToGameWords}>
          Review Words
        </button>
        <br></br>

        <button id="back-to-word-list-btn" onClick={handleBackToWordLists}>
          New Wordlist
        </button>
        <button id="back-to-course-btn" onClick={handleBackToCourse}>
          Change Course
        </button>
      </div>

      <div
        id="game-screen"
        className={screen === 'game-words' ? 'content' : 'hidden-content'}
      >
        <h1>Vocab Game</h1>
        <ul>
          <li>
            <b>Word</b>: <i>hint</i>
          </li>
          {}
        </ul>
        <button onClick={handleBackToScore}>Back to Score</button>
      </div>
    </>
  );
}

// Stub of GET request for data
function submitCourse(code: string) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = code.toLowerCase() !== 'qwerty';
      if (shouldError) {
        reject(new Error('Unable to find course: "' + code + '".'));
      } else {
        resolve('Correct!');
      }
    }, 1500);
  });
}

export default StudentApp;

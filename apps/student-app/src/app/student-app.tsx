import React from 'react';
import { useState } from 'react';
import { Data, WordList, Word } from '@vocabulary-game/types';

//TEST DATA
function get_test_data(course_code: string) {
  return test_data();
}
function test_data(): Promise<Data> {
  return Promise.resolve({
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
  });
}

export function StudentApp({ title }: { title: string }) {
  enum StudentState {
    splash_state,
    course_state,
    word_list_state,
    game_state,
    score_state,
    review_words_state,
  }
  // Setup the state
  const [error, setError] = useState('null');
  const [screen, setScreen] = useState(StudentState.splash_state);
  const [course_code, setCourse] = useState('');
  //
  const [score, setScore] = useState(0);
  const [countdown, setCountdown] = useState(60);
  const [time_game_end, setTimeGameEnd] = useState<Date | null>(null);
  //
  const [data, setData] = useState<Data | null>(null);
  const [selected_word_list, setSelectedWordList] = useState<WordList | null>({
    id: '',
    name: '',
    words: [],
  } as WordList);
  const [current_word, setCurrentWord] = useState<Word>({word: 'EMPTY', hint: 'EMPTY'} as Word);

  const [words_in_game, setWordsInGame] = useState<Word[]>([]);
  const [words_correct, setWordsCorrect] = useState<Word[]>([]);
  const [words_skipped, setWordsSkipped] = useState<Word[]>([]);


  // function updateTimer() {
  //   const countdownElement = document.getElementById("countdown");
  //   countdownElement.innerHTML = countdown.toString();
    
  //   if (countdown === 0) {
  //     clearInterval(timerInterval);
  //     end_game()
  //   } else {
  //     setCountdown(countdown-1);
      
  //   }
  //   countdownElement.innerHTML = "${countdown} ${countdown === 1 ? 'second' : 'seconds'}";
  // }
  // const timerInterval = setInterval(updateTimer, 1000);
  // Starts a new game.
  // Can only reset game if word list is selected
  function start_new_game(): void {
    try {
      setError('null');
      setScore(0)
      // var end_time: Date = new Date()
      // end_time.setSeconds(end_time.getSeconds() + 60)
      // setTimeGameEnd(end_time)
      setScreen(StudentState.game_state)
      setCurrentWord(selected_word_list?.words[Math.floor(Math.random() * selected_word_list?.words.length)] ?? {word: 'EMPTY', hint: 'EMPTY'} as Word);
    } catch (err) {
      setError('error-start-game');
    }
    
  }

  function end_game() {
    try {
      setError('null');
      setScreen(StudentState.score_state);
    } catch (err) {
      setError('error-game');
    }
  }

  // function get_time_left(): number {
  //   return Math.floor((time_game_end? - new Date().getTime()) / 1000);
  // }

  // Pick random word from word list and saves current word as skipped or correct
  function next_word(is_answer_correct:boolean): void {
    setWordsInGame(words_in_game.concat(words_in_game, [current_word]));
    if (is_answer_correct) {
      setWordsCorrect(words_correct.concat(words_correct, [current_word]));
      setScore(words_correct.length)
    }
    else {
      setWordsSkipped(words_skipped.concat(words_skipped, [current_word]));
    }
    setCurrentWord(selected_word_list?.words[Math.floor(Math.random() * selected_word_list?.words.length)] ?? {word: 'EMPTY', hint: 'EMPTY'} as Word);
  }

  // to populate the LI elements for the word lists ()
  // Idea is to set the word list here, then confirm later in the form
  function populate_word_list_items() {
    return data?.word_lists.map((word_list: WordList) => {
      return (
        <li
          id={word_list.id} key={word_list.id}
        >
          <button id={`word-list-${word_list.id}`} onClick={() => handleSetWordList(word_list.id)}>
            <b>{word_list.name}:</b> Words: {word_list.words.length}
            </button>
        </li>
      );
    });

  }

  // Creates a list of words that were in the game.
  // Populates a UL element on game-words page.
  function get_words_from_game() {
    return words_in_game.map((word: Word) => {
      return (
        <li id={`word-${word.word}`}  key={`word-${word.word}`}>
          <b className={words_correct.includes(word) ? 'correct-word' : 'incorrect-word'}>{word.word}:</b> {word.hint}
        </li>
      );
    });
  }

  // Button to go to Crouse page
  function handleToCourse(e: any): void {
    try {
      setError('null');
      setScreen(StudentState.course_state);
    } catch (err) {
      setError('error-word-list');
    }
  }

  // Back button to return to Splash page
  function handleBackToSplash(e: any): void {
    try {
      setError('null');
      setScreen(StudentState.splash_state);
    } catch (err) {
      setError('error-course');
    }
  }

  // Back button to return to Course Code page
  function handleBackToCourse(e: any): void {
    try {
      setError('null');
      setScreen(StudentState.course_state);
    } catch (err) {
      setError('error-word-list');
    }
  }

  // Back button to return to Word List page
  function handleBackToWordLists(e: any): void {
    try {
      setError('null');
      setScreen(StudentState.word_list_state);
    } catch (err) {
      setError('error-word-list');
    }
  }

  // Back button to return to Score page
  function handleBackToScore(e: any): void {
    try {
      setError('null');
      setScreen(StudentState.score_state);
    } catch (err) {}
  }

  // Replay button that resets the game and starts it again.
  function handleResetGame(e: any): void {
    try {
      setError('null');
      start_new_game();
      setScreen(StudentState.game_state);
    } catch (err) {}
  }

  // Button to visit Word Review page
  function handleToGameWords(e: any): void {
    try {
      setError('null');
      setScreen(StudentState.review_words_state);
    } catch (err) {}
  }

  // Handles course code submission
  async function handleSubmitCourse(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    try {
      // GET on course GUID
      // STUB getting the data
      setData(await submitCourse(course_code));
      setError('null');
      setScreen(StudentState.word_list_state);
    } catch (err) {
      setError('error-course');
    }
  }

  // Handles setting the word list to chosen list item ID
  async function handleSetWordList(
    id: string
  ): Promise<void> {
    try {
      ;
      setSelectedWordList(data?.word_lists.find((wrd_lst: WordList) => {
        return wrd_lst.id === id;
      }) ?? null)
      setError('null');
      start_new_game()
    } catch (err) {
      setError('error-word-list');
    }
  }

  // Handles text entry into Course Code Text field
  function handleCourseChange(e: {
    target: { value: React.SetStateAction<string> };
  }): void {
    setCourse(e.target.value);
  }


  return (
    <>
      <div id="splash-screen"
        className={screen === StudentState.splash_state ? 'content' : 'hidden-content'}
      >
        <h1>Vocab Game</h1>
        <div>Splash Screen</div>
        <div>tap screen to start</div>
        <button onClick={handleToCourse} id="start-btn" disabled={false}>
          Start
        </button>
      </div>

      <div id="course-selection"
        className={screen === StudentState.course_state ? 'content' : 'hidden-content'}
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

      <div id="word-list-selection"
        className={screen === StudentState.word_list_state ? 'content' : 'hidden-content'}
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
            <ul id="word-list-list">
              {populate_word_list_items()}
              </ul>
          </form>
          <button id="back-to-course-btn" onClick={handleBackToCourse}>
            Back
          </button>
        </div>
      </div>

      <div id="game-screen"
        className={screen === StudentState.game_state ? 'content' : 'hidden-content'}
      >
        <form id="course-select-form" >
          <h1 id="word-hint-header">{current_word?.hint}</h1>
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
            >
              {current_word?.word}
            </h2>
          </div>
          <div id="score">Score: {score}</div>
          <div id="countdown"></div>
        </form>
      </div>

      <div id="score-screen"
        className={screen === StudentState.score_state ? 'content' : 'hidden-content'}
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
        id="review-game-screen"
        className={screen === StudentState.review_words_state ? 'content' : 'hidden-content'}
      >
        <h1>Vocab Game</h1>
        <ul>
          {get_words_from_game()}
        </ul>
        <button onClick={handleBackToScore}>Back to Score</button>
      </div>
    </>
  );
}

// Stub of GET request for data
function submitCourse(code: string): Promise<Data> {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (code.toLowerCase() !== 'qwerty') {
        reject(new Error('Unable to find course: "' + code + '".'));
      } else {
        get_test_data(code).then(d => resolve(d))
      }
    }, 1500);
  });
}

export default StudentApp;

import { useState, useEffect } from 'react';
import './Quizzical.css';

// Type definitions for the quiz application
interface Answer {
  value: string;
  isSelected: boolean;
  isCorrect: boolean;
  isIncorrect: boolean;
  isAnswer: boolean;
}

interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers: Answer[];
  isCorrect?: boolean;
}

interface ApiQuestion {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface ApiResponse {
  results: ApiQuestion[];
}

// A simple function to decode HTML entities from the API response
// This handles things like &quot; and &#039;
function decodeHtml(html: string): string {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

// A helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function App() {
  // State variables for the quiz application
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [message, setMessage] = useState<string>('');

  // useEffect hook to fetch questions from the API when the quiz starts
  useEffect(() => {
    if (quizStarted) {
      setLoading(true);
      setMessage(''); // Clear any previous messages
      // Fetch data from the OpenTDB API using the user-specified amount
      fetch(`https://opentdb.com/api.php?amount=${questionCount}&type=multiple`)
        .then(res => res.json())
        .then((data: ApiResponse) => {
          // Map over the results to clean up the data and add necessary properties
          const formattedQuestions: Question[] = data.results.map(q => {
            const allAnswers = shuffleArray([...q.incorrect_answers, q.correct_answer]);
            return {
              ...q,
              question: decodeHtml(q.question),
              correct_answer: decodeHtml(q.correct_answer),
              // Map all answers to a new array of objects with additional state
              all_answers: allAnswers.map(ans => ({
                value: decodeHtml(ans),
                isSelected: false,
                isCorrect: false,
                isIncorrect: false,
                isAnswer: ans === q.correct_answer,
              }))
            };
          });
          setQuestions(formattedQuestions);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch questions:", err);
          setLoading(false);
          // Show a message box for the error
          setMessage("Failed to load quiz questions. Please try again.");
          handlePlayAgain();
        });
    }
  }, [quizStarted, questionCount]);

  // Function to handle a user clicking an answer button
  function handleAnswerClick(questionIndex: number, answerIndex: number): void {
    // Only allow answer changes if the quiz isn't finished
    if (isFinished) return;

    // Use a functional update to ensure we're working with the latest state
    setQuestions(prevQuestions => {
      // Create a copy of the questions array
      const newQuestions = [...prevQuestions];
      // Create a copy of the specific question being updated
      const updatedQuestion = { ...newQuestions[questionIndex] };
      // Map over the answers for that question
      updatedQuestion.all_answers = updatedQuestion.all_answers.map((ans, idx) => ({
        ...ans,
        // If this is the selected answer, toggle its `isSelected` state
        isSelected: idx === answerIndex ? !ans.isSelected : false,
      }));
      // Replace the old question object with the new one
      newQuestions[questionIndex] = updatedQuestion;
      return newQuestions;
    });
  }

  // Function to check the user's answers and calculate the score
  function handleCheckAnswers(): void {
    let newScore = 0;
    // Map over the questions to determine correct/incorrect answers
    const checkedQuestions: Question[] = questions.map(q => {
      const selectedAnswer = q.all_answers.find(ans => ans.isSelected);
      let isCorrect = false;

      // Check if a selected answer exists and if it's the correct one
      if (selectedAnswer && selectedAnswer.isAnswer) {
        newScore++;
        isCorrect = true;
      }
      
      // Update the state of each answer for styling
      const updatedAnswers: Answer[] = q.all_answers.map(ans => ({
        ...ans,
        isCorrect: ans.isAnswer, // Mark the correct answer
        isIncorrect: ans.isSelected && !ans.isAnswer, // Mark selected but wrong answers
      }));

      return {
        ...q,
        all_answers: updatedAnswers,
        isCorrect,
      };
    });

    // Update state with the new score and marked questions
    setScore(newScore);
    setIsFinished(true);
    setQuestions(checkedQuestions);
  }

  // Function to reset the quiz to its initial state
  function handlePlayAgain(): void {
    setQuizStarted(false);
    setQuestions([]);
    setIsFinished(false);
    setScore(0);
    setQuestionCount(5); // Reset to default amount
  }

  // Map over the questions to render each one
  const questionElements = questions.map((q, qIndex) => (
    <div key={qIndex} className="question-card">
      <h2 className="text-lg font-bold text-gray-800 mb-2">{q.question}</h2>
      <div className="flex flex-wrap gap-2">
        {/* Map over the answers for each question */}
        {q.all_answers.map((ans, aIndex) => (
          <button
            key={aIndex}
            onClick={() => handleAnswerClick(qIndex, aIndex)}
            className={`
              answer-button
              ${ans.isSelected && !isFinished && 'selected-answer'}
              ${!ans.isSelected && !isFinished && 'default-answer'}
              ${isFinished && ans.isCorrect && 'correct-answer'}
              ${isFinished && ans.isIncorrect && 'incorrect-answer'}
              ${isFinished && !ans.isSelected && !ans.isCorrect && 'faded-answer'}
              ${isFinished && ans.isSelected && ans.isCorrect && 'correct-answer'}
            `}
            // Disable buttons after checking answers
            disabled={isFinished}
          >
            {ans.value}
          </button>
        ))}
      </div>
      <div className="my-4 border-b border-gray-300 border-dashed"></div>
    </div>
  ));

  return (
    <>
      {/* Main container for the app */}
      <main className="main-container">
        {/* Background blobs */}
        <div className="blob top-left-blob"></div>
        <div className="blob bottom-right-blob"></div>

        {/* Message box for errors */}
        {message && (
          <div className="message-box">
            <p>{message}</p>
            <button onClick={() => setMessage('')} className="message-box-close">OK</button>
          </div>
        )}
        
        {/* Start Page */}
        {!quizStarted && (
          <section className="start-page">
            <h1 className="start-page-title">Quizzical</h1>
            <p className="start-page-subtitle">Test your knowledge with 5 to 20 questions!</p>
            <div className="question-count-container">
              <label htmlFor="questionCount" className="question-count-label">Number of Questions (5-20):</label>
              <input
                type="number"
                id="questionCount"
                className="question-count-input"
                min="5"
                max="20"
                value={questionCount}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (value >= 5 && value <= 20) {
                    setQuestionCount(value);
                  } else if (value < 5) {
                    setQuestionCount(5);
                  } else if (value > 20) {
                    setQuestionCount(20);
                  } else {
                    setQuestionCount(5);
                  }
                }}
              />
            </div>
            <button
              onClick={() => {
                if (questionCount >= 5 && questionCount <= 20) {
                  setQuizStarted(true);
                } else {
                  setMessage("Please enter a number of questions between 5 and 20.");
                }
              }}
              className="start-button"
            >
              Start Quiz
            </button>
          </section>
        )}

        {/* Quiz Page */}
        {quizStarted && (
          <section className="quiz-page">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading questions...</p>
              </div>
            ) : (
              <>
                {/* Render the questions */}
                <div className="questions-container">
                  {questionElements}
                </div>

                {/* Quiz buttons and score */}
                <div className="quiz-footer">
                  {isFinished && (
                    <p className="quiz-score">
                      You scored {score}/{questions.length} correct answers
                    </p>
                  )}
                  {/* Check Answers / Play Again Button */}
                  {!isFinished ? (
                    <button onClick={handleCheckAnswers} className="check-button">
                      Check answers
                    </button>
                  ) : (
                    <button onClick={handlePlayAgain} className="play-again-button">
                      Play again
                    </button>
                  )}
                </div>
              </>
            )}
          </section>
        )}
      </main>
    </>
  );
}

# Quizzical 🧠

Welcome to **Quizzical**, a fun and interactive quiz application built with React\! Test your knowledge on a wide variety of topics with a customizable number of questions.

## 🚀 Live Demo

Check out the live version of the application here:
[https://quizzical-beryl.vercel.app/](https://quizzical-beryl.vercel.app/)

## ✨ Features

  - **Dynamic Questions**: Fetches new multiple-choice questions from the Open Trivia Database API for a fresh experience every time.
  - **Customizable Quiz**: Choose the number of questions you want, from **5 to 20**.
  - **Interactive UI**: Click to select your answers and get immediate feedback on your performance.
  - **Score Tracking**: See your final score and the correct answers after completing the quiz.
  - **Responsive Design**: Enjoy a seamless experience on both desktop and mobile devices.
  - **HTML Entity Decoding**: Handles and decodes special characters (like `&quot;`) from the API response for clean, readable text.
  - **CSS Animations**: Includes subtle animations for a polished look and feel. The text animations and effects were inspired by the techniques found in this article: [https://prismic.io/blog/css-text-animations](https://prismic.io/blog/css-text-animations).

## 🛠️ Technologies Used

This project was built using the following technologies:

  - **React**: A JavaScript library for building user interfaces.
  - **useState & useEffect**: React hooks for managing state and side effects, such as data fetching.
  - **Open Trivia Database API**: A free, public API that provides a wide range of quiz questions.
      - **API Endpoint**: `https://opentdb.com/api.php?amount=<NUMBER>&type=multiple`
  - **CSS**: For styling the components and creating the visual effects.
  - **JavaScript/TypeScript**: The core programming languages used for the application logic.

## 💻 How to Run Locally

To run this project on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd quizzical
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Start the development server:**
    ```bash
    npm run dev
    ```
5.  Open your browser and visit `http://localhost:3000`.

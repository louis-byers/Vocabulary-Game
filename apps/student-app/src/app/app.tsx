// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import React, {Component} from 'react'
import StudentApp from './student-app';

import { Route, Routes, Link } from 'react-router-dom';

export function App() {
  return (
    <StudentApp title="student-app" />
  );
}

export default App;

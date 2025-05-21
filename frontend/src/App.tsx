import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TaskPage from "./pages/TaskPage";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/tasks" element={<TaskPage/>} />
          <Route path="/" element={<Navigate replace to="/tasks" />} />
        </Routes>
      </Router>
  );
}

export default App;

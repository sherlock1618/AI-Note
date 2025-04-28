import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SideBar from './components/SideBar';
import NotesPage from './pages/NotePage';
import NoteEditor from './pages/NoteEditor';
import HomePage from './pages/HomePage';
import Trash from './components/Trash';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <SideBar />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path="/notes" element={<ProtectedRoute><NotesPage /></ProtectedRoute>}/>
          <Route path="/notes/:id" element={<ProtectedRoute><NoteEditor /></ProtectedRoute> } />
          <Route path="/notes/new" element={<ProtectedRoute><NoteEditor /></ProtectedRoute>} />
          <Route path="*" element={<div>404 Not Found</div>} />
          <Route path="/trash" element={<ProtectedRoute><Trash /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
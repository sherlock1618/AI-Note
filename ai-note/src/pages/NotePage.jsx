import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchNotes, deleteNote } from '../services/notesApi';
import NoteCard from '../components/NoteCard';
import AddNoteCard from '../components/AddNoteCard';
import '../styles/NotePage.css';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const loadNotes = async () => {
    try {
      setRefreshing(true);
      const data = await fetchNotes();
      
      console.log('API Response:', data);
      
      const validatedNotes = data.map(note => {
        if (!note._id && !note.id) {
          console.error('Note missing ID:', note);
          return { ...note, _id: `temp-${Math.random().toString(36).substr(2, 9)}` };
        }
        return note;
      });
      
      setNotes(validatedNotes);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load notes:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleAddNote = () => {
    navigate('/notes/new');
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      setNotes(prevNotes => prevNotes.filter(note => (note._id || note.id) !== id));
    } catch (err) {
      setError(err.message);
      console.error('Failed to delete note:', err);
    }
  };

  const handleRefresh = () => {
    loadNotes();
  };

  const handleNoteClick = (noteId) => {
    if (!noteId) {
      console.error('Cannot navigate - note missing ID:', noteId);
      return;
    }
    navigate(`/notes/${noteId}`);
  };

  if (loading) return <div className="loading">Loading notes...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  console.log('Rendering notes:', notes);

  return (
    <div className="notes-container">
      <div className="notes-header">
        <h2>Your Notes</h2>
        <button 
          className="refresh-btn" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      <div className="notes-grid">
        {notes.map(note =>  {
          const noteId = note._id || note.id;
          
          if (!noteId) {
            console.error('Skipping note render - missing ID:', note);
            return null;
          }
          console.log('Rendering note:', noteId);

          return (
            <NoteCard 
              key={noteId}
              note={note} 
              onDelete={() => handleDelete(noteId)}
              onClick={() => handleNoteClick(noteId)}
            />
          );
        })}
        <AddNoteCard onClick={handleAddNote} />
      </div>
    </div>
  );
};

export default NotesPage;
import { useState, useEffect } from 'react';
import { fetchDeletedNotes, restoreNote, deleteNotePermanently } from '../services/notesApi';
import { FaTrashRestore, FaTrashAlt, FaHistory } from 'react-icons/fa';
import '../styles/Trash.css';

const Trash = () => {
  const [deletedNotes, setDeletedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDeletedNotes = async () => {
      try {
        const data = await fetchDeletedNotes();
        setDeletedNotes(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadDeletedNotes();
  }, []);

  const handleRestore = async (noteId) => {
    try {
      await restoreNote(noteId);
      setDeletedNotes(deletedNotes.filter(note => note._id !== noteId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeletePermanently = async (noteId) => {
    if (window.confirm('Permanently delete this note? This cannot be undone.')) {
      try {
        await deleteNotePermanently(noteId);
        setDeletedNotes(deletedNotes.filter(note => note._id !== noteId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) return <div className="loading">Loading deleted notes...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="trash-container">
      <div className="trash-header">
        <h2><FaHistory /> Trash</h2>
        <p className="trash-info">
          Deleted notes are kept for 30 days before being permanently removed.
        </p>
      </div>

      {deletedNotes.length === 0 ? (
        <div className="empty-trash">
          <p>No deleted notes</p>
        </div>
      ) : (
        <div className="deleted-notes-list">
          {deletedNotes.map(note => (
            <div key={note._id} className="deleted-note-card">
              <div className="note-content">
                <h3>{note.title}</h3>
                <p className="note-preview">
                  {note.content.substring(0, 100)}
                  {note.content.length > 100 && '...'}
                </p>
                <div className="note-meta">
                  <span>Deleted on: {formatDate(note.deletedAt)}</span>
                  <span>Originally created: {formatDate(note.createdAt)}</span>
                </div>
              </div>
              <div className="note-actions">
                <button 
                  onClick={() => handleRestore(note._id)}
                  className="restore-btn"
                  title="Restore note"
                >
                  <FaTrashRestore /> Restore
                </button>
                <button
                  onClick={() => handleDeletePermanently(note._id)}
                  className="delete-permanently-btn"
                  title="Delete permanently"
                >
                  <FaTrashAlt /> Delete Forever
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trash;
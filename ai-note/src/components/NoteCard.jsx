import { Link } from 'react-router-dom';
import '../styles/NoteCard.css';

const NoteCard = ({ note, onDelete }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const noteId = note._id || note.id;

  return (
    <div className="note-card">
      <Link to={`/notes/${noteId}`} className="note-link">
        <h3>{note.title}</h3>
        <div className="note-content">
          {note.content.split('\n').map((line, i) => (
            <p key={i}>{line || <br />}</p>
          ))}
        </div>
        <div className="note-footer">
          <span className="note-date">{formatDate(note.createdAt)}</span>
          <span className="note-id">#{noteId}</span>
        </div>
      </Link>
      <button 
        className="delete-btn"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (window.confirm('Delete this note permanently?')) {
            onDelete(noteId);
          }
        }}
        aria-label="Delete note"
      >
        x
      </button>
    </div>
  );
};

export default NoteCard;
import '../styles/AddNoteCard.css';

const AddNoteCard = ({ onClick }) => {
  return (
    <div className="add-note-card" onClick={onClick}>
      <div className="add-icon">+</div>
      <p>Add New Note</p>
    </div>
  );
};

export default AddNoteCard;
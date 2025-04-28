const {
    createNote,
    getAllNotes,
    getNoteById,
    updateNote,
    deleteNote,
  } = require('../models/notes.model'); 
  
  async function HTTPCreateNote(req, res) {
    const { id } = req.user;
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const data = {
      userId: id,
      title,
      content,
    }
    console.log('data', data);
    try {
      const note = await createNote(data);
      return res.status(201).json(note);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ error: err.message });
    }
  }
  
  async function HTTPGetNotes(req, res) {
    const { id } = req.user;
    try {
      const notes = await getAllNotes(id);
      return res.status(200).json(notes);
    } catch (err) {
      console.error(err);
      if (err.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      if (err.message === 'No notes found') {
        return res.status(404).json({ error: 'No notes found' });
      }
      return res.status(500).json({ error: err.message });
    }
  }
  
  async function HTTPGetNoteById(req, res) {
    const { id } = req.user;
    try {
      const Note = await getNoteById(req.params.id, id);
      if (!Note) return res.status(404).json({ error: 'Note not found' });
      return res.status(200).json(Note);
    } catch (err) {
      console.error(err);
      if (err.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid note ID' });
      }
      return res.status(500).json({ error: err.message });
    }
  }
  
  async function HTTPUpdateNote(req, res) {
    const { id } = req.user;
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    console.log('title', title, 'content', content);
    try {
      const updated = await updateNote(req.params.id, {title, content}, id);
      if (!updated) return res.status(404).json({ error: 'Note not found' });
      return res.status(200).json(updated);
    } catch (err) {
      console.error(err);
      if (err.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid note ID' });
      }
      if (err.message === 'Note is deleted') {
        return res.status(400).json({ error: 'Note is deleted' });
      }
      return res.status(400).json({ error: err.message });
    }
  }
  
  async function HTTPDeleteNote(req, res) {
    const { id } = req.user;
    try {
      const deleted = await deleteNote(req.params.id, id);
      if (!deleted) return res.status(404).json({ error: 'Note not found' });
      return res.status(200).json({ message: 'Note deleted' });
    } catch (err) {
      console.error(err);
      if (err.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid note ID' });
      }
      if (err.message === 'Note is deleted') {
        return res.status(400).json({ error: 'Note is deleted' });
      }
      return res.status(500).json({ error: err.message });
    }
  }
  
  module.exports = {
    HTTPCreateNote,
    HTTPGetNotes,
    HTTPGetNoteById,
    HTTPUpdateNote,
    HTTPDeleteNote,
  };
  
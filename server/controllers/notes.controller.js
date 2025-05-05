const {
    createNote,
    getAllNotes,
    getNoteById,
    updateNote,
    deleteNote,
    deleteNotePermenantly,
    restoreNote,
  } = require('../models/notes.model'); 

async function HTTPCreateNote(req, res) {
  const { id } = req.user;
  const { title, content, summary } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const data = {
    userId: id,
    title,
    content,
    summary,
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
    if (notes.length === 0) return res.status(404).json({ error: 'No notes found' });
    const filteredNotes = notes.filter(note => !note.isDeleted);
    return res.status(200).json(filteredNotes);
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
    const note = await getNoteById(req.params.id, id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    return res.status(200).json(note);
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
  const { title, content, summary } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  console.log('title', title, 'content', content, 'summary', summary);
  try {
    const updated = await updateNote(req.params.id, {title, content, summary}, id);
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
    return res.status(500).json({ error: err.message });
  }
}

async function HTTPDeleteNote(req, res) {
  const { id } = req.user;
  const noteId = req.params.id;
  if (!noteId) return res.status(400).json({ error: 'Note ID is required' });
  try {
    const deleted = await deleteNote(noteId, id);
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

async function HTTPSearchNotes(req, res) {
  const { id } = req.user;
  const { query } = req.params;
  try {
    const notes = await getAllNotes(id);
    const filteredNotes = notes.filter((note) => {
      return note.title.toLowerCase().includes(query.toLowerCase()) || note.content.toLowerCase().includes(query.toLowerCase());
    });
    if (filteredNotes.length === 0) return res.status(404).json({ error: 'No notes found' });
    return res.status(200).json(filteredNotes);
  } catch (err) {
    console.error(err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    return res.status(500).json({ error: err.message });
  }
}

async function HTTPGetDeletedNotes(req, res) {
  const { id } = req.user;
  try {
    const notes = await getAllNotes(id);
    const deletedNotes = notes.filter(note => note.isDeleted === true);

    if (deletedNotes.length === 0) {
      console.log('No deleted notes found for user:', id);
      return res.status(404).json({ error: 'No deleted notes found' });
    }

    return res.status(200).json(deletedNotes);
  } catch (err) {
    console.error(err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    return res.status(500).json({ error: err.message });
  }
}

async function HTTPDeleteNotePermenantly(req, res){
  const { id } = req.params;
  const userId = req.user?.id;
  if(!id){
    return res.status(400).json({error: "note id is required!"});
  }
  try{
    const deletedNote = await deleteNotePermenantly(id, userId);
    if(!deletedNote){
      return res.status(404).json("note not found!");
    }

    return res.status(200).json(deleteNote);
  } catch(err){
    console.error(err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    return res.status(500).json({ error: err.message });
  }
}

async function HTTPRestoreNote(req, res){
  const { id } = req.params;
  const userId = req.user?.id;
  if(!id){
    return res.status(400).json({error: "note id is required!"});
  }
  try{
    const restoredNote = await restoreNote(id, userId);
    if(!restoredNote){
      return res.status(404).json("note not found!");
    }

    return res.status(200).json(restoredNote);
  } catch(err){
    console.error(err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    return res.status(500).json({ error: err.message });
  }
}

async function HTTPSuggestTitle(req, res) {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Content is required' });
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: `Suggest 3 titles for the following note content:\n\n${content}` }],
      }),
    });
    const data = await response.json();
    const titles = data.choices[0].message.content
      .split('\n')
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(line => line);
      console.log("titles: ", titles);
    if (response.ok) {
      return res.status(200).json(titles);
    } else {
      return res.status(500).json({ error: data.error.message });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

async function HTTPSummarizeNote(req, res) {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Content is required' });
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: `Summarize the following note content:\n\n${content}` }],
      }),
    }); 
    const data = await response.json();
    if (response.ok) {
      return res.status(200).json(data.choices[0].message.content);
    } else {
      return res.status(500).json({ error: data.error.message });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  HTTPCreateNote,
  HTTPGetNotes,
  HTTPGetNoteById,
  HTTPUpdateNote,
  HTTPDeleteNote,
  HTTPSearchNotes,
  HTTPGetDeletedNotes,
  HTTPSuggestTitle,
  HTTPSummarizeNote,
  HTTPDeleteNotePermenantly,
  HTTPRestoreNote,
};
  
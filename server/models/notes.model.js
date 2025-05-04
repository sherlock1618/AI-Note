const Note = require('./schemas/notes.mongo');
const mongoose = require('mongoose');

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function createNote(data) {
  const note = new Note(data);
  return await note.save();
}

async function getAllNotes(userId) {
  return await Note.find({userId}).sort({ createdAt: -1 });
}

async function getNoteById(id, userId) {
  if (!isValidObjectId(id)) return null;
  const note = await Note.findById(id);
  if (!note) return null;
  if (note.userId.toString() !== userId.toString()) return null;
  return note;
}

async function updateNote(id, updates, userId) {
  if (!isValidObjectId(id)) return null;
  const note = await Note.findById(id);
  if (!note) return null;
  if (note.userId.toString() !== userId.toString()) return null;
  if (note.isDeleted) return null;
  const { title, content } = updates;
  if (!title || !content) return null;
  note.title = title;
  note.content = content;
  note.updatedAt = new Date();
  await note.save();
  return note;
}

async function deleteNote(id, userId) {
  if (!isValidObjectId(id)) return null;
  const note = await Note.findById(id);
  if (!note) return null;
  if (note.userId.toString() !== userId.toString()) return null;
  note.isDeleted = true;
  await note.save();
  return note;
}

module.exports = {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
};

const express = require('express');
const {
  HTTPGetNotes,
  HTTPGetNoteById,
  HTTPCreateNote,
  HTTPUpdateNote,
  HTTPDeleteNote,
} = require('../controllers/notes.controller');

const router = express.Router();

router.get('/', HTTPGetNotes);
router.post('/', HTTPCreateNote);
router.get('/:id', HTTPGetNoteById);
router.put('/:id', HTTPUpdateNote);
router.delete('/:id', HTTPDeleteNote);

module.exports = router;

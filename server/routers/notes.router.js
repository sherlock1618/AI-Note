const express = require('express');
const {
  HTTPGetNotes,
  HTTPGetNoteById,
  HTTPCreateNote,
  HTTPUpdateNote,
  HTTPDeleteNote,
  HTTPSuggestTitle,
  HTTPSummarizeNote,
  HTTPGetDeletedNotes,
  HTTPDeleteNotePermenantly,
  HTTPRestoreNote,
} = require('../controllers/notes.controller');

const router = express.Router();

router.get('/', HTTPGetNotes);
router.post('/', HTTPCreateNote);
router.get('/deleted', HTTPGetDeletedNotes);
router.delete('/deleted-notes/:id', HTTPDeleteNotePermenantly);
router.put('/deleted-notes/:id', HTTPRestoreNote);
router.get('/:id', HTTPGetNoteById);
router.put('/:id', HTTPUpdateNote);
router.delete('/:id', HTTPDeleteNote);
router.post('/suggested-titles', HTTPSuggestTitle);
router.post('/summerize', HTTPSummarizeNote);


module.exports = router;

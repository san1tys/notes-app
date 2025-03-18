const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const authenticateToken = require('../middleware/auth');
const { validateNote } = require('../validations/noteValidation');

router.post('/add-note', authenticateToken, validateNote, noteController.addNote);
router.put('/edit-note/:noteId', authenticateToken, validateNote, noteController.editNote);
router.get('/get-all-notes', authenticateToken, noteController.getAllNotes);
router.delete('/delete-note/:noteId', authenticateToken, noteController.deleteNote);
router.put('/update-note-pinned/:noteId', authenticateToken, noteController.updateNotePinned);
router.get('/search-notes', authenticateToken, noteController.searchNotes);

module.exports = router;
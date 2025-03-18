const Note = require('../models/note.model');


exports.addNote = async (req, res) => {
    const { title, content, tags } = req.body;
    const { user } = req.user;

    if (!title || !content) {
        return res.status(400).json({ error: true, message: "Title and Content are required" });
    }

    try {
        const note = new Note({ title, content, tags: tags || [], userId: user._id });
        await note.save();

        return res.json({ error: false, note, message: "Note added successfully" });
    } catch (err) {
        return res.status(500).json({ error: true, message: "Internal Server Error", details: err.message });
    }
};


exports.editNote = async (req, res) => {
    const { noteId } = req.params;
    const { title, content, tags, isPinned } = req.body;
    const { user } = req.user;

    if (!title && !content && !tags && typeof isPinned !== "boolean") {
        return res.status(400).json({ error: true, message: "No changes provided" });
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        if (note.userId.toString() !== user._id) {
            return res.status(403).json({ error: true, message: "You don't have permission to edit this note" });
        }

        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (typeof isPinned === "boolean") note.isPinned = isPinned;

        await note.save();

        return res.json({ error: false, message: "Note updated successfully", note });
    } catch (err) {
        return res.status(500).json({ error: true, message: "Server error", details: err.message });
    }
};


exports.getAllNotes = async (req, res) => {
    const { user } = req.user;

    try {
        const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });

        return res.json({
            error: false,
            notes,
            message: "All notes retrieved successfully",
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
};


exports.deleteNote = async (req, res) => {
    const { noteId } = req.params;
    const { user } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        await Note.deleteOne({ _id: noteId, userId: user._id });

        return res.json({
            error: false,
            message: "Note deleted successfully",
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
};


exports.updateNotePinned = async (req, res) => {
    const { noteId } = req.params;
    const { isPinned } = req.body;
    const { user } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        if (note.userId.toString() !== user._id) {
            return res.status(403).json({ error: true, message: "You don't have permission to edit this note" });
        }

        note.isPinned = isPinned;
        await note.save();

        return res.json({ error: false, message: "Note updated successfully", note });
    } catch (err) {
        return res.status(500).json({ error: true, message: "Server error", details: err.message });
    }
};


exports.searchNotes = async (req, res) => {
    const { user } = req.user;
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: true, message: "Search query is required" });
    }

    try {
        const matchingNotes = await Note.find({
            userId: user._id,
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { content: { $regex: new RegExp(query, "i") } },
            ],
        });

        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Notes matching the search query retrieved successfully",
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
};
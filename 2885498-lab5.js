const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory storage (must start empty)
let books = [];

// Helper functions
function findBookById(id) {
    return books.find((book) => book.id === id);
}

function findBookIndexById(id) {
    return books.findIndex((book) => book.id === id);
}

// GET /whoami
app.get('/whoami', (req, res) => {
    res.status(200).json({
        studentNumber: '2885498'
    });
});

// GET /books
app.get('/books', (req, res) => {
    res.status(200).json(books);
});

// GET /books/:id
app.get('/books/:id', (req, res) => {
    const book = findBookById(req.params.id);

    if (!book) {
        return res.status(404).json({
            error: 'Book not found'
        });
    }

    res.status(200).json(book);
});

// POST /books
app.post('/books', (req, res) => {
    const { id, title, details } = req.body || {};

    if (!id || !title) {
        return res.status(400).json({
            error: 'Missing required fields'
        });
    }

    const newBook = {
        id: String(id),
        title: title,
        details: Array.isArray(details) ? details : []
    };

    books.push(newBook);

    res.status(201).json(newBook);
});

// PUT /books/:id
app.put('/books/:id', (req, res) => {
    const book = findBookById(req.params.id);

    if (!book) {
        return res.status(404).json({
            error: 'Book not found'
        });
    }

    const { title, details } = req.body || {};

    if (title === undefined && details === undefined) {
        return res.status(400).json({
            error: 'Missing required fields'
        });
    }

    if (title !== undefined) {
        book.title = title;
    }

    if (details !== undefined && Array.isArray(details)) {
        book.details = details;
    }

    res.status(200).json(book);
});

// DELETE /books/:id
app.delete('/books/:id', (req, res) => {
    const bookIndex = findBookIndexById(req.params.id);

    if (bookIndex === -1) {
        return res.status(404).json({
            error: 'Book not found'
        });
    }

    books.splice(bookIndex, 1);

    res.status(200).json({
        message: 'Book deleted'
    });
});

// POST /books/:id/details
app.post('/books/:id/details', (req, res) => {
    const book = findBookById(req.params.id);

    if (!book) {
        return res.status(404).json({
            error: 'Book not found'
        });
    }

    const { id, author, genre, publicationYear } = req.body || {};

    if (!id || !author || !genre || publicationYear === undefined) {
        return res.status(400).json({
            error: 'Missing required fields'
        });
    }

    const newDetail = {
        id: String(id),
        author: author,
        genre: genre,
        publicationYear: publicationYear
    };

    if (!Array.isArray(book.details)) {
        book.details = [];
    }

    book.details.push(newDetail);

    res.status(201).json(book);
});

// DELETE /books/:id/details/:detailId
app.delete('/books/:id/details/:detailId', (req, res) => {
    const book = findBookById(req.params.id);

    if (!book) {
        return res.status(404).json({
            error: 'Book or detail not found'
        });
    }

    const detailIndex = book.details.findIndex(
        (detail) => detail.id === req.params.detailId
    );

    if (detailIndex === -1) {
        return res.status(404).json({
            error: 'Book or detail not found'
        });
    }

    book.details.splice(detailIndex, 1);

    res.status(200).json(book);
});

// Handle invalid JSON bodies
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            error: 'Invalid JSON'
        });
    }
    next();
});

// Optional catch-all for unknown routes
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
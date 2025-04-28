const mongoose = require('mongoose');
const http = require('http');
const dbURI = process.env.DB_URI || 'mongodb://localhost:27017/mydatabase';
const app = require('./app');
const server = http.createServer(app);
const port = process.env.PORT || 3000;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
require('dotenv').config();

async function connectToDatabase() {
    try {
        await mongoose.connect(dbURI, clientOptions);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

async function startServer() {
    try {
        await connectToDatabase();
        server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
}
startServer();

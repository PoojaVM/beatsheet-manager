import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get('/', (req, res) => res.send('Hello from the server!'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/api/message', (_req, res) => {
    console.log("GET /api/message");
    res.json({ message: "Hello from the backend!" });
});
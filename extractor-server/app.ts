import express from 'express';
import appRoutes from './routes/app-routes.ts';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import deleteFiles from './utils/delete-files.ts';

const __filename = fileURLToPath(import.meta.url); // get current file path
const __dirname = path.dirname(__filename); // get current directory
const tmpDir = path.join(__dirname, 'tmp');

const app = express();

deleteFiles(tmpDir);

// Allow all origins (safe only for dev/testing)
app.use(cors());

// Make ./tmp accessible via /tmp URL
app.use('/tmp', express.static(path.join(__dirname, 'tmp')));

// Parse JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialise routes
app.use('/', appRoutes);

const PORT: number = 3000;

app.listen(PORT, () => {
  console.log(`Listening on port:`, { PORT });
});

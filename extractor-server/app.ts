import express from 'express';
import appRoutes from './routes/app-routes.ts';
import cors from 'cors';

const app = express();

// Parse JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allow all origins (safe only for dev/testing)
app.use(cors());

// Initialise routes
app.use('/', appRoutes);

const PORT: number = 3000;

app.listen(PORT, () => {
  console.log(`Listening on port:`, { PORT });
});

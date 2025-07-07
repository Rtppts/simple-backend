import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
const port = 3001;
const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ...(isProduction && {
    ssl: { rejectUnauthorized: false },
  }),
});

app.use(cors());
app.use(express.json());

// ดึงชื่อทั้งหมด
app.get('/names', async (req, res) => {
  const result = await pool.query('SELECT * FROM names ORDER BY id');
  res.json(result.rows);
});

// เพิ่มชื่อ
app.post('/names', async (req, res) => {
  const { name } = req.body;
  await pool.query('INSERT INTO names(name) VALUES($1)', [name]);
  res.sendStatus(200);
});

// ลบชื่อ
app.delete('/names/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM names WHERE id = $1', [id]);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

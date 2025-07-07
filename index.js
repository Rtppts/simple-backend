const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// ตั้งค่าการเชื่อมต่อกับ PostgreSQL โดยใช้ตัวแปรที่ Railway ให้มา
const app = express();
const port = process.env.PORT || 3001;

const pool = new Pool({
  host: process.env.PGHOST, // ใช้ PGHOST จาก Railway
  port: process.env.PGPORT, // ใช้ PGPORT จาก Railway
  user: process.env.PGUSER, // ใช้ PGUSER จาก Railway
  password: process.env.PGPASSWORD, // ใช้ PGPASSWORD จาก Railway
  database: process.env.PGDATABASE, // ใช้ PGDATABASE จาก Railway
  ssl: {
    rejectUnauthorized: false, // สำหรับการเชื่อมต่อกับ PostgreSQL บน Railway
  },
});

app.use(cors({
  origin: '*', // อนุญาตให้ทุกโดเมนเข้าถึง
}));

app.use(express.json());

// ดึงชื่อทั้งหมด
app.get('/names', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM names ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// เพิ่มชื่อ
app.post('/names', async (req, res) => {
  const { name } = req.body;
  try {
    await pool.query('INSERT INTO names(name) VALUES($1)', [name]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ลบชื่อ
app.delete('/names/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM names WHERE id = $1', [id]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

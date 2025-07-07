const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

// โหลดค่า environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// ใช้ตัวแปรจาก .env ที่ตั้งค่าใน Railway
const pool = new Pool({
  host: process.env.PGHOST,        // PGHOST จาก Railway
  port: process.env.PGPORT,        // PGPORT จาก Railway
  user: process.env.POSTGRES_USER, // POSTGRES_USER จาก Railway
  password: process.env.PGPASSWORD, // PGPASSWORD จาก Railway
  database: process.env.PGDATABASE, // PGDATABASE จาก Railway
  ssl: {
    rejectUnauthorized: false,     // เชื่อมต่อกับ PostgreSQL ผ่าน SSL
  },
});

// ตั้งค่า CORS
app.use(cors({
  origin: '*',  // อนุญาตให้ทุกโดเมนเข้าถึง API
}));

app.use(express.json());

// ดึงชื่อทั้งหมดจากฐานข้อมูล
app.get('/names', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM names ORDER BY id');
    res.json(result.rows);  // ส่งข้อมูลที่ดึงจากฐานข้อมูล
  } catch (err) {
    res.status(500).json({ error: err.message });  // ถ้ามีข้อผิดพลาด
  }
});

// เพิ่มชื่อใหม่ลงในฐานข้อมูล
app.post('/names', async (req, res) => {
  const { name } = req.body;
  try {
    await pool.query('INSERT INTO names(name) VALUES($1)', [name]);  // เพิ่มชื่อ
    res.sendStatus(200);  // ส่งสถานะ 200 (สำเร็จ)
  } catch (err) {
    res.status(500).json({ error: err.message });  // ถ้ามีข้อผิดพลาด
  }
});

// ลบชื่อจากฐานข้อมูล
app.delete('/names/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM names WHERE id = $1', [id]);  // ลบชื่อ
    res.sendStatus(200);  // ส่งสถานะ 200 (สำเร็จ)
  } catch (err) {
    res.status(500).json({ error: err.message });  // ถ้ามีข้อผิดพลาด
  }
});

// เริ่มต้นเซิร์ฟเวอร์ที่พอร์ตที่กำหนด
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

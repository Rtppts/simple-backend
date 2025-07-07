const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

// โหลด environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// เชื่อมต่อกับ PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // ใช้ DATABASE_URL จาก .env
  ssl: {
    rejectUnauthorized: false,  // เชื่อมต่อด้วย SSL สำหรับ PostgreSQL บน Railway
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

// เพิ่มชื่อใหม่เข้าไปในฐานข้อมูล
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
  console.log(`Server running on http://localhost:${port}`);  // พิมพ์ข้อความเมื่อเซิร์ฟเวอร์ทำงาน
});

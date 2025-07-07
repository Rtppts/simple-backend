const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// เริ่มต้นแอปพลิเคชัน Express
const app = express();
const port = 3001; // ใช้พอร์ต 3001 หรือพอร์ตที่ต้องการ

// ตั้งค่าการเชื่อมต่อกับ PostgreSQL โดยไม่ใช้ .env
const pool = new Pool({
  user: 'postgres',  // ชื่อผู้ใช้ PostgreSQL
  host: 'caboose.proxy.rlwy.net',  // Host ของ PostgreSQL จาก Railway
  database: 'railway',  // ชื่อฐานข้อมูล PostgreSQL
  password: 'zTxiggRrugvRIURgWUEsaFwfglMcHjRt',  // รหัสผ่าน PostgreSQL
  port: 35539,  // พอร์ตที่ใช้เชื่อมต่อกับ PostgreSQL บน Railway
  ssl: {
    rejectUnauthorized: false,  // ใช้ SSL สำหรับการเชื่อมต่อ
  },
});

// ตั้งค่า CORS
app.use(cors({
  origin: '*', // หรือกำหนดเป็น 'http://localhost:5173' ถ้าต้องการให้อนุญาตแค่โดเมนนี้
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'], // ให้อนุญาต GET, POST, DELETE และ OPTIONS
  allowedHeaders: ['Content-Type', 'Authorization'], // อนุญาตให้ใช้ headers เฉพาะที่จำเป็น
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

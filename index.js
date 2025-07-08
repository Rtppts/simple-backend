const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// เริ่มต้นแอปพลิเคชัน Express
const app = express();
const port = 3001;  // ใช้พอร์ตจาก Railway ถ้ามี หรือใช้ 3001

// ตั้งค่าการเชื่อมต่อกับ PostgreSQL บน Railway
const pool = new Pool({
  user: 'postgres',  // ชื่อผู้ใช้ PostgreSQL
  host: 'postgres.railway.internal',  // Host ของ PostgreSQL จาก Railway
  database: 'railway',  // ชื่อฐานข้อมูล PostgreSQL
  password: 'zTxiggRrugvRIURgWUEsaFwfglMcHjRt',  // รหัสผ่าน PostgreSQL
  port: 5432,  // พอร์ตที่ใช้เชื่อมต่อกับ PostgreSQL บน Railway
  ssl: {
    rejectUnauthorized: false,  // ใช้ SSL สำหรับการเชื่อมต่อ
  },
});

// ตั้งค่า CORS
app.use(cors({
  origin: '*',  // อนุญาตให้ทุกโดเมนเข้าถึง API
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'], // อนุญาตให้ใช้ HTTP methods GET, POST, DELETE, OPTIONS
  allowedHeaders: '*', // อนุญาตให้ทุก header ผ่านได้
}));

app.use(express.json());

// ดึงชื่อทั้งหมดจากฐานข้อมูล
app.get('/names', async (req, res) => {
  console.log('คำร้องส่งมาถึง Backend (GET /names)');  // ดีบัก
  try {
    const result = await pool.query('SELECT * FROM names ORDER BY id');
    res.json(result.rows);  // ส่งข้อมูลที่ดึงจากฐานข้อมูล
  } catch (err) {
    console.error('Error fetching names:', err);  // log ข้อความผิดพลาด
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลจากฐานข้อมูล', details: err.message });
  }
});

// เพิ่มชื่อใหม่ลงในฐานข้อมูล
app.post('/names', async (req, res) => {
  console.log('คำร้องส่งมาถึง Backend (POST /names)');  // ดีบัก
  const { name } = req.body;
  try {
    if (!name || name.trim() === "") {
      throw new Error("Name is required");  // ตรวจสอบว่า name ไม่ว่าง
    }
    await pool.query('INSERT INTO names(name) VALUES($1)', [name]);  // เพิ่มชื่อ
    res.json({ message: 'ดำเนินการสำเร็จ' });  // ส่งข้อความตอบกลับเป็นภาษาไทย
  } catch (err) {
    console.error('Error adding name:', err);  // log ข้อความผิดพลาด
    res.status(400).json({ error: 'ไม่สามารถเพิ่มชื่อได้', details: err.message });
  }
});

// ลบชื่อจากฐานข้อมูล
app.delete('/names/:id', async (req, res) => {
  console.log('คำร้องส่งมาถึง Backend (DELETE /names/:id)');  // ดีบัก
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM names WHERE id = $1', [id]);  // ลบชื่อ
    if (result.rowCount === 0) {
      throw new Error('ไม่พบชื่อในฐานข้อมูลที่ตรงกับ ID นี้');  // ถ้าไม่มีชื่อในฐานข้อมูลที่ตรงกับ ID
    }
    res.json({ message: 'ดำเนินการสำเร็จ' });  // ส่งข้อความตอบกลับเป็นภาษาไทย
  } catch (err) {
    console.error('Error deleting name:', err);  // log ข้อความผิดพลาด
    res.status(400).json({ error: 'ไม่สามารถลบชื่อได้', details: err.message });
  }
});

// เริ่มต้นเซิร์ฟเวอร์ที่พอร์ตที่กำหนด
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

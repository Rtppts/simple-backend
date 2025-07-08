const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// เริ่มต้นแอปพลิเคชัน Express
const app = express();
const port = process.env.PORT || 3001;  // ใช้พอร์ตจาก Railway ถ้ามี หรือใช้ 3001

// ตั้งค่าการเชื่อมต่อกับ PostgreSQL บน Railway
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
  origin: '*',  // อนุญาตให้ทุกโดเมนเข้าถึง API
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'], // อนุญาตให้ใช้ HTTP methods GET, POST, DELETE, OPTIONS
  allowedHeaders: ['Content-Type', 'Authorization'], // อนุญาตให้ใช้ headers เฉพาะที่จำเป็น
}));

app.use(express.json());

// ดึงชื่อทั้งหมดจากฐานข้อมูล
app.get('/names', async (req, res) => {
  console.log('GET request to /names');  // ดีบัก
  try {
    const result = await pool.query('SELECT * FROM names ORDER BY id');
    res.json(result.rows);  // ส่งข้อมูลที่ดึงจากฐานข้อมูล
  } catch (err) {
    console.error('Error fetching names:', err);  // log ข้อความผิดพลาด
    res.status(500).json({ error: 'Failed to fetch names from database', details: err.message });  // ส่งข้อความผิดพลาด
  }
});

// เพิ่มชื่อใหม่ลงในฐานข้อมูล
app.post('/names', async (req, res) => {
  console.log('POST request to /names');  // ดีบัก
  const { name } = req.body;
  try {
    if (!name || name.trim() === "") {
      throw new Error("Name is required");  // ตรวจสอบว่า name ไม่ว่าง
    }
    await pool.query('INSERT INTO names(name) VALUES($1)', [name]);  // เพิ่มชื่อ
    res.sendStatus(200);  // ส่งสถานะ 200 (สำเร็จ)
  } catch (err) {
    console.error('Error adding name:', err);  // log ข้อความผิดพลาด
    res.status(400).json({ error: 'Failed to add name', details: err.message });  // ส่งข้อความผิดพลาด
  }
});

// ลบชื่อจากฐานข้อมูล
app.delete('/names/:id', async (req, res) => {
  console.log('DELETE request to /names/:id');  // ดีบัก
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM names WHERE id = $1', [id]);  // ลบชื่อ
    if (result.rowCount === 0) {
      throw new Error('No name found with this ID');  // ถ้าไม่มีชื่อในฐานข้อมูลที่ตรงกับ ID
    }
    res.sendStatus(200);  // ส่งสถานะ 200 (สำเร็จ)
  } catch (err) {
    console.error('Error deleting name:', err);  // log ข้อความผิดพลาด
    res.status(400).json({ error: 'Failed to delete name', details: err.message });  // ส่งข้อความผิดพลาด
  }
});

// เริ่มต้นเซิร์ฟเวอร์ที่พอร์ตที่กำหนด
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

# ใช้ Node.js image จาก Docker Hub
FROM node:16

# ตั้งค่าทำงานใน /app directory
WORKDIR /app

# คัดลอก package.json และ package-lock.json (หากมี) ไปยัง container
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์ทั้งหมดจากโฟลเดอร์ Backend ไปยัง container
COPY . .

# เปิดพอร์ตที่ Node.js จะใช้งาน
EXPOSE 3001

# รันแอปพลิเคชันเมื่อ container เริ่มทำงาน
CMD ["node", "index.js"]

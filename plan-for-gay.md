ระบบบันทึกข้อมูล dog
--tech stack--
backend
---express.js---
restful api (JWT Authentication, bcrypt)
mysql (postgresql)

frontend
vue + vite + tailwindcss + daisyui (Pinia/Vue Router)

ฟีเจอร์ของระบบ
- ระบบสมาชิก (Authentication):
  - สมัครสมาชิก (Register) และ เข้าสู่ระบบ (Login)
  - ออกจากระบบ (Logout)
- จัดการข้อมูลสุนัข (CRUD - เพิ่ม ลบ เเก้ไข ค้นหา)
  - บุคคลทั่วไป: สามารถดูและค้นหาข้อมูลได้
  - สมาชิกที่เข้าสู่ระบบ: สามารถเพิ่ม ลบ เเก้ไข ข้อมูลได้
- ฟิลเตอร์ตัวกรองข้อมูลด้วย เพศ / สี / อายุ / พันธ์ / ที่อยู่ / สถานะ
- เเสดงผลรูปเเบบ card / table

docker + docker-compose ( ทำ dockerfile ทั้ง backend เเละ  frontend ให้ด้วย)

github collab เเบ่ง branch ในการทำงาน ในทีมมีสมาชิก 2 คน 

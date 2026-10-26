# ICT-Challenge

เว็บติวภาษาไทยสำหรับ ICT Challenge 2026 แบบ interactive มี 17 บท, pre-test เพื่อข้ามสิ่งที่รู้แล้ว, เส้นทางเร่งด่วน 10 บท, ข้อฝึก 188 ข้อ และห้องเขียน Python ที่รันและตรวจคำตอบใน browser ผ่าน Pyodide

ข้อฝึกแต่งใหม่ตามขอบเขตผู้จัด ไม่ใช่ข้อสอบเก่าหรือเว็บไซต์ทางการของผู้จัด

## เปิดในเครื่อง

```bash
cd tutor-web
python3 start.py
```

เปิด <http://127.0.0.1:8765/> หรือดับเบิลคลิก `tutor-web/เปิดเว็บติว.command` บน macOS ดูรายละเอียดที่ [tutor-web/README.md](tutor-web/README.md)

## Host บน Vercel

1. ไปที่ [Vercel — New Project](https://vercel.com/new) แล้ว import `Thatsadon9/ICT-Challenge`
2. ใช้ **Root Directory: `./`** และ **Framework Preset: Other**
3. ใช้ค่าจาก `vercel.json`: Build Command `node tutor-web/scripts/build.mjs`, Output Directory `dist`, Install Command ว่าง
4. กด Deploy โดยไม่ต้องใส่ Environment Variables

Build จะคัดลอกเฉพาะไฟล์เว็บ รวมฟอนต์ เอกสารอ้างอิง และ Python runtime ไปที่ `dist/` ไม่เผยแพร่ local launcher, scripts หรือไฟล์ผลทดสอบ เส้นทางภายในใช้ URL hash จึงไม่ต้องตั้ง SPA rewrite

ความคืบหน้าและโค้ดเก็บใน localStorage แยกตาม browser/origin หากย้ายจาก localhost ไป Vercel ให้ Export ความคืบหน้าในเว็บเดิม แล้ว Import ในเว็บใหม่ ข้อมูลไม่ได้ซิงก์ข้ามเครื่องอัตโนมัติ

## ตรวจสอบและ build

ใช้ Node.js และ Python 3 โดยไม่มี npm dependencies:

```bash
node tutor-web/scripts/check.mjs
node tutor-web/scripts/build.mjs
python3 -m http.server 8766 --bind 127.0.0.1 --directory dist
```

`check` ตรวจข้อมูลข้อฝึก เกณฑ์ pre-test การข้ามบท และรันเฉลย Python กับ test cases ส่วน production เป็นไฟล์ static ทั้งหมด ไม่ต้องมี Python server บน Vercel

## เอกสาร

- [เริ่มเตรียมตัว](START_HERE.md)
- [หลักสูตรและแผนเตรียมตัว](study/01_CURRICULUM.md)
- [รายละเอียดเว็บและสิทธิ์ของ runtime/ฟอนต์](tutor-web/README.md)
- [ขอบเขตการแข่งขันทางการ](https://ict.sit.kmutt.ac.th/topics)

โฟลเดอร์ `python/`, `output/` และ QA screenshots/exports เป็นข้อมูลในเครื่อง ไม่รวมใน Git

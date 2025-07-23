# 🚀 การ Deploy Food Ordering App ฟรีใน Railway

## สิ่งที่เตรียมไว้แล้ว ✅

- ✅ `Procfile` - สำหรับ Railway (ใช้ railway-start.sh)
- ✅ `nixpacks.toml` - การตั้งค่า build สำหรับ Railway
- ✅ `railway-start.sh` - script เริ่มต้นแอพพลิเคชั่น
- ✅ `.env.production` - ตัวอย่าง environment variables
- ✅ `deploy.sh` - script สำหรับ manual deployment tasks
- ✅ Database configuration รองรับ PostgreSQL

## ขั้นตอนการ Deploy

### 1. สร้างบัญชี Railway
1. ไปที่ [https://railway.app](https://railway.app)
2. สมัครด้วย GitHub account
3. ยืนยัน email

### 2. สร้าง Project ใหม่
1. กดปุ่ม "New Project"
2. เลือก "Deploy from GitHub repo"
3. เชื่อมต่อกับ GitHub repository ของคุณ
4. เลือก repository `food-ordering`

### 3. เพิ่ม Database (PostgreSQL)
1. ใน Railway dashboard กดปุ่ม "+"
2. เลือก "Database" > "PostgreSQL"
3. Railway จะสร้าง database ให้อัตโนมัติ

### 4. ตั้งค่า Environment Variables
ใน Railway dashboard ไปที่ tab "Variables" และเพิ่ม:

```
APP_NAME=Food Ordering App
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-app-name.railway.app

# Railway จะใส่ database variables ให้อัตโนมัติ:
# PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD

DB_CONNECTION=postgresql
DB_HOST=${{PGHOST}}
DB_PORT=${{PGPORT}}
DB_DATABASE=${{PGDATABASE}}
DB_USERNAME=${{PGUSER}}
DB_PASSWORD=${{PGPASSWORD}}

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

LOG_LEVEL=error
```

### 5. Generate APP_KEY
1. ใน Railway terminal รัน: `php artisan key:generate --show`
2. copy ค่าที่ได้ใส่ใน Environment Variable `APP_KEY`

### 6. Deploy!
1. Railway จะ deploy อัตโนมัติเมื่อมีการ push code
2. รอ build process เสร็จ (ประมาณ 3-5 นาที)

### 7. Run Database Migrations
หลังจาก deploy สำเร็จ:
1. ไปที่ Railway dashboard > tab "Deploy"
2. เปิด terminal และรัน:
```bash
php artisan migrate --force
php artisan db:seed --force  # ถ้าต้องการ seed ข้อมูล
```

## URL Access
- Web App: `https://your-app-name.railway.app`
- Railway จะให้ URL อัตโนมัติ

## ข้อจำกัดของ Free Tier
- 500 hours/month execution time
- $5 credit monthly
- Sleep after 30 minutes ไม่มีการใช้งาน

## Alternative Free Options

### 1. Heroku (Limited)
```bash
# Install Heroku CLI
brew tap heroku/brew && brew install heroku

# Login และสร้าง app
heroku login
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Deploy
git push heroku master

# Run migrations
heroku run php artisan migrate --force
```

### 2. Render.com
1. เชื่อมต่อ GitHub repo
2. เลือก "Web Service"
3. Build Command: `composer install && npm ci && npm run build`
4. Start Command: `php artisan serve --host=0.0.0.0 --port=$PORT`

## สำคัญ! 🔥
1. **อย่าลืม commit code ก่อน deploy**
2. **ตั้งค่า APP_KEY ให้ถูกต้อง**
3. **รัน migrations หลัง deploy**
4. **เช็ค logs ถ้ามี error**

## การแก้ไขปัญหา
- ถ้า build fail: เช็ค Railway logs
- ถ้า database error: ตรวจ environment variables
- ถ้า 500 error: เช็ค APP_DEBUG=false และ logs

## คำสั่งที่มีประโยชน์
```bash
# Local development
php artisan serve
npm run dev

# Production commands
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
```

---
💡 **Tips**: Railway มี Discord community ที่ช่วยได้ดีถ้ามีปัญหา!

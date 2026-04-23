# AdVisorAI

## Başlatmak için 3 adım

### 1. Bağımlılıkları yükle
```bash
npm install
```

### 2. API anahtarını ayarla
```bash
# Mac / Linux
export ANTHROPIC_API_KEY=sk-ant-buraya-kendi-anahtarinizi-yazin

# Windows (PowerShell)
$env:ANTHROPIC_API_KEY="sk-ant-buraya-kendi-anahtarinizi-yazin"
```
API anahtarını https://console.anthropic.com adresinden alabilirsiniz.

### 3. Çalıştır
```bash
npm run start
```

Tarayıcınızda otomatik açılır: **http://localhost:5173**

---

## Alternatif (iki ayrı terminal)
```bash
# Terminal 1
npm run dev

# Terminal 2
npm run proxy
```

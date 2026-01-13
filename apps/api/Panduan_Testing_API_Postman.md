# 📋 Panduan Testing API dengan Postman

## ✅ Status: SEMUA TEST BERHASIL (22/22)

| UC | Fitur | Tests | Status |
|----|-------|-------|--------|
| UC-01 | User Management | 5/5 | ✅ PASSED |
| UC-04 | Document Upload | 4/4 | ✅ PASSED |
| UC-08 | Document Verification | 4/4 | ✅ PASSED |
| UC-06 | Document Update | 3/3 | ✅ PASSED |
| UC-07 | Document Delete | 3/3 | ✅ PASSED |
| UC-10 | Document Download | 3/3 | ✅ PASSED |

---

## 🛠️ Setup Awal

### 1. Jalankan Server Laravel
```bash
cd apps/api
php artisan serve
```

### 2. Setup Database
```bash
php artisan migrate:fresh
php artisan db:seed --class=UserSeeder
```

### 3. Akun Testing

| Email | Password | Role |
|-------|----------|------|
| `manager@test.com` | `password` | Manager |
| `uploader@test.com` | `password` | Uploader |
| `qc@test.com` | `password` | QC |
| `sbap@test.com` | `password` | SBAP |

---

## 🔐 STEP 0: Autentikasi

### ✅ 0.1 Get CSRF Cookie
```
GET http://localhost:8000/sanctum/csrf-cookie
```
**Expected:** 204 No Content, Cookie `XSRF-TOKEN` tersimpan

### ✅ 0.2 Login
```
POST http://localhost:8000/api/auth/login

Headers:
Content-Type: application/json
Accept: application/json
X-XSRF-TOKEN: (copy dari cookie XSRF-TOKEN)

Body:
{
  "email": "manager@test.com",
  "password": "password"
}
```
**Expected:** 200 OK dengan data user

### ✅ 0.3 Verifikasi Session
```
GET http://localhost:8000/api/auth/me
```
**Expected:** 200 OK dengan data user yang login

---

## 👥 UC-01: User Management (Login: Manager)

### ✅ 1.1 List Semua User
```
GET http://localhost:8000/api/users
```
**Expected:** 200 OK dengan array users

### ✅ 1.2 Buat User Baru
```
POST http://localhost:8000/api/users

Body:
{
  "name": "Uploader Baru",
  "email": "uploader_baru@test.com",
  "password": "password123",
  "role": "uploader"
}
```
**Expected:** 201 Created

### ✅ 1.3 Update User
```
PUT http://localhost:8000/api/users/{id}

Body:
{
  "name": "Uploader Baru - Updated",
  "role": "qc"
}
```
**Expected:** 200 OK

### ✅ 1.4 Hapus User
```
DELETE http://localhost:8000/api/users/{id}
```
**Expected:** 200 OK

### ✅ 1.5 Test Authorization (Login: Uploader)
```
GET http://localhost:8000/api/users
```
**Expected:** 403 Forbidden

---

## 📤 UC-04: Document Upload (Login: Uploader)

### ✅ 4.1 Upload Dokumen Nilai
```
POST http://localhost:8000/api/documents

Body (form-data):
- document_type: nilai
- prodi: Teknik Informatika
- tahun_ajaran: 2024/2025
- mata_kuliah: Pemrograman Web
- kelas: A
- file: (pilih file PDF)
```
**Expected:** 201 Created, status: `menunggu_verifikasi`

### ✅ 4.2 Upload Dokumen Ijazah
```
POST http://localhost:8000/api/documents

Body (form-data):
- document_type: ijazah
- prodi: Teknik Informatika
- tahun_lulus: 2024
- npm: 1234567890
- file: (pilih file PDF)
```
**Expected:** 201 Created

### ✅ 4.3 Test Duplicate Detection
Upload dengan data yang sama persis seperti 4.1
**Expected:** 409 Conflict

### ✅ 4.4 Test Validation Error
Upload tanpa field required
**Expected:** 422 Unprocessable Entity

---

## ✔️ UC-08: Document Verification (Login: QC)

### ✅ 8.1 Lihat Dokumen Pending
```
GET http://localhost:8000/api/documents/pending
```
**Expected:** 200 OK dengan list dokumen pending

### ✅ 8.2 Verifikasi (Approve) Dokumen
```
PATCH http://localhost:8000/api/documents/{id}/verify

Body:
{
  "status": "terverifikasi"
}
```
**Expected:** 200 OK, status: `terverifikasi`

### ✅ 8.3 Tolak (Reject) Dokumen
```
PATCH http://localhost:8000/api/documents/{id}/verify

Body:
{
  "status": "tidak_terverifikasi",
  "verification_note": "Format dokumen tidak sesuai standar."
}
```
**Expected:** 200 OK, status: `tidak_terverifikasi`

### ✅ 8.4 Test Verifikasi Ulang
Coba verifikasi dokumen yang sudah terverifikasi
**Expected:** 422 Unprocessable Entity
```json
{
  "message": "Dokumen sudah diverifikasi sebelumnya dan tidak dapat diverifikasi ulang.",
  "errors": {
    "document": ["..."]
  }
}
```

---

## 📝 UC-06: Document Update (Login: Uploader)

### ✅ 6.1 Update Dokumen Rejected
```
PUT http://localhost:8000/api/documents/{id}

Body:
{
  "prodi": "Sistem Informasi - Updated",
  "tahun_lulus": "2025"
}
```
**Expected:** 200 OK, status reset ke `menunggu_verifikasi`

### ✅ 6.2 Update dengan File Baru
```
POST http://localhost:8000/api/documents/{id}

Body (form-data):
- _method: PUT
- prodi: Teknik Komputer
- file: (pilih file PDF baru)
```
**Expected:** 200 OK

### ✅ 6.3 Test Update Dokumen Terverifikasi
```
PUT http://localhost:8000/api/documents/{id_terverifikasi}

Body:
{
  "prodi": "Test"
}
```
**Expected:** 422 Unprocessable Entity
```json
{
  "message": "Dokumen yang sudah terverifikasi tidak dapat diperbarui.",
  "errors": {
    "document": ["..."]
  }
}
```

---

## 🗑️ UC-07: Document Delete (Login: Uploader)

> **⚠️ Catatan:** Hanya dokumen dengan status `tidak_terverifikasi` yang bisa dihapus

### ✅ 7.1 Hapus Dokumen Rejected
```
DELETE http://localhost:8000/api/documents/{id_rejected}
```
**Expected:** 200 OK

### ✅ 7.2 Test Hapus Dokumen Terverifikasi
```
DELETE http://localhost:8000/api/documents/{id_terverifikasi}
```
**Expected:** 403 Forbidden

### ✅ 7.3 Test Hapus Dokumen Milik Orang Lain
```
DELETE http://localhost:8000/api/documents/{id_milik_user_lain}
```
**Expected:** 403 Forbidden

---

## 📥 UC-10: Document Download (Login: SBAP atau Manager)

### ✅ 10.1 Download Dokumen Terverifikasi
```
GET http://localhost:8000/api/documents/{id_terverifikasi}/download
```
**Postman:** Klik "Send and Download" untuk simpan file
**Expected:** 200 OK, file PDF ter-download

### ✅ 10.2 Test Download Dokumen Tidak Terverifikasi (Login: SBAP)
```
GET http://localhost:8000/api/documents/{id_pending}/download
```
**Expected:** 403 Forbidden (SBAP hanya bisa download dokumen terverifikasi)

### ✅ 10.3 Test Download sebagai Uploader
Login sebagai Uploader, coba download
**Expected:** 403 Forbidden (Uploader tidak punya akses download)

---

## 📊 Matrix Akses Role

| Fitur | Manager | Uploader | QC | SBAP |
|-------|---------|----------|-----|------|
| User CRUD | ✅ | ❌ | ❌ | ❌ |
| Upload Dokumen | ✅ | ✅ | ❌ | ❌ |
| Update Dokumen (rejected) | ✅ | ✅* | ❌ | ❌ |
| Delete Dokumen (rejected) | ✅ | ✅* | ❌ | ❌ |
| Verifikasi Dokumen | ✅ | ❌ | ✅ | ❌ |
| Download Dokumen | ✅ | ❌ | ❌ | ✅** |

*Uploader hanya bisa update/delete dokumen miliknya sendiri
**SBAP hanya bisa download dokumen terverifikasi

---

## 🐛 Troubleshooting

### Error 401 Unauthenticated
- Pastikan sudah GET `/sanctum/csrf-cookie` dulu
- Pastikan cookie tersimpan di Postman
- Pastikan session masih aktif

### Error 403 Forbidden
- Cek role user yang sedang login
- Cek apakah dokumen milik user tersebut
- Cek status dokumen (terverifikasi/pending/rejected)

### Error 419 CSRF Token Mismatch
- Hapus semua cookies
- Ulangi dari GET `/sanctum/csrf-cookie`
- Pastikan header `X-XSRF-TOKEN` terisi

### Error 422 Unprocessable Entity
- Cek format request body
- Cek field required yang belum diisi
- Cek business logic (dokumen sudah terverifikasi, dll)

---

## ✅ Testing Selesai!

Semua 22 skenario testing telah berhasil diverifikasi pada:
**Tanggal:** 14 Januari 2026
**Waktu:** 01:50 WIB

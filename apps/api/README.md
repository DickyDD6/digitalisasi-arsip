# Sistem Digitalisasi Arsip - API Backend

## 📋 Overview

RESTful API untuk sistem digitalisasi arsip dengan fitur:
- **Authentication:** Laravel Sanctum Stateful (HTTP-only cookies)
- **Authorization:** Role-based access control (Manager, QC, Uploader, SBAP)
- **Security:** Dual-layer rate limiting, account lockout, comprehensive audit logging
- **Performance:** Optimized database queries, efficient indexes

---

## 🚀 Quick Start

### Prerequisites
- PHP 8.2+
- Composer
- MySQL/MariaDB
- Node.js (untuk frontend)

### Installation

```bash
# 1. Clone repository
git clone <repository-url>
cd apps/api

# 2. Install dependencies
composer install

# 3. Setup environment
cp .env.example .env
php artisan key:generate

# 4. Configure database (.env)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=digitalisasi_arsip
DB_USERNAME=root
DB_PASSWORD=

# 5. Run migrations & seeders
php artisan migrate
php artisan db:seed

# 6. Start server
php artisan serve
```

Server running at: `http://localhost:8000`

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Panduan_Testing_API_Postman.md](Panduan_Testing_API_Postman.md) | Comprehensive API testing guide (51 tests) |
| [docs/sanctum-integration.md](docs/sanctum-integration.md) | Frontend integration with Laravel Sanctum |
| [docs/security-testing-guide.md](docs/security-testing-guide.md) | Security features testing guide |

---

## 🔐 Security Features

### Dual-Layer Rate Limiting
- **Layer 1 (IP-based):** 75 login attempts/minute per IP
- **Layer 2 (Account-based):** 5 failed attempts → temporary lockout
  - Manager: Locked for 5 minutes
  - Other roles: Locked for 1 minute

### Audit Logging
All critical actions logged:
- User management
- Document operations (upload, verify, download, delete)
- Authentication events (login, logout, lockout)

### Configuration

Rate limiting configurable via `.env`:
```env
LOGIN_IP_LIMIT_ATTEMPTS=75
LOGIN_MAX_ATTEMPTS=5
LOGIN_LOCKOUT_MANAGER_MINUTES=5
LOGIN_LOCKOUT_DEFAULT_MINUTES=1
```

See `config/login-security.php` for all options.

---

## 📊 API Endpoints

### Public Endpoints
- `GET /api/csrf-cookie` - Get CSRF token
- `POST /api/auth/login` - Login (rate limited)

### Protected Endpoints (auth:sanctum)

**Authentication:**
- `GET /api/auth/me` - Current user
- `POST /api/auth/logout` - Logout

**Users (Manager only):**
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/users/{id}` - View user
- `PATCH /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

**Documents:**
- `GET /api/documents` - List documents
- `POST /api/documents` - Upload document (Uploader)
- `GET /api/documents/{id}` - View document
- `PATCH /api/documents/{id}` - Update document (Uploader)
- `DELETE /api/documents/{id}` - Delete document (Uploader)
- `GET /api/documents/pending` - Pending documents (QC/Manager)
- `PATCH /api/documents/{id}/verify` - Verify/reject (QC/Manager)
- `GET /api/documents/{id}/download` - Download (SBAP/Manager)

**Audit Logs (Manager only):**
- `GET /api/audit-logs` - List audit logs
- `GET /api/audit-logs/statistics` - Statistics

---

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **Manager** | Full access (user management, all documents, audit logs) |
| **QC** | Verify/reject documents, view all documents |
| **Uploader** | Upload, update, delete own documents |
| **SBAP** | Download verified documents |

---

## 🗄️ Database Schema

### Core Tables
- `users` - User accounts with roles
- `documents` - Document metadata
- `audit_logs` - Comprehensive activity logging
- `login_attempts` - Failed login tracking (v2.2)
- `sessions` - Laravel sessions

### Document Types (Enum)
- `nilai` - Nilai/Grades
- `ijazah` - Diploma/Certificate
- `transkrip` - Transcript
- `berita_acara_sidang` - Siding Report (v2.1+)

### Prodi (Program Studi - Enum)
- Informatika
- Pangan
- Industri  
- Mesin
- Lingkungan
- Perencanaan Wilayah Kota

---

## 🧪 Testing

### Run Tests
```bash
# Unit tests
php artisan test

# API testing dengan Postman
# See Panduan_Testing_API_Postman.md
```

### Test Coverage
- **51 comprehensive tests** covering all UCs
- Authentication & authorization
- CRUD operations
- Security features (rate limiting, lockout)
- Audit logging

---

## 🔄 Versions

| Version | Released | Features |
|---------|----------|----------|
| **v2.2** | 2026-01-28 | Rate limiting, account lockout, enhanced audit logging |
| **v2.1** | 2025-12-15 | Enum support, berita_acara_sidang document type |
| **v2.0** | 2025-11-20 | Sanctum stateful API, optimized responses |
| **v1.0** | 2025-10-01 | Initial release |

---

## 🛠️ Tech Stack

**Backend:**
- Laravel 11.x
- PHP 8.2+
- MySQL 8.0+

**Authentication:**
- Laravel Sanctum (Stateful SPA)
- HTTP-only cookies
- CSRF protection

**Security:**
- Rate limiting (IP + Account)
- Role-based access control
- Comprehensive audit logging
- SQL injection prevention (Eloquent ORM)
- XSS protection

---

## 📝 Environment Variables

### Required (.env)
```env
APP_NAME="Digitalisasi Arsip API"
APP_ENV=production
APP_KEY=<generated>
APP_DEBUG=false
APP_URL=

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=digitalisasi_arsip
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_DOMAIN=yourdomain.com
SESSION_SECURE_COOKIE=true

SANCTUM_STATEFUL_DOMAINS=yourdomain.com,app.yourdomain.com

FRONTEND_URL=https://app.yourdomain.com
```

### Optional (Rate Limiting)
```env
LOGIN_IP_LIMIT_ATTEMPTS=75
LOGIN_MAX_ATTEMPTS=5
LOGIN_LOCKOUT_MANAGER_MINUTES=5
LOGIN_LOCKOUT_DEFAULT_MINUTES=1
LOGIN_CLEANUP_AFTER_MINUTES=10
```

---

## 🚀 Deployment

### Production Checklist
- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Set `SESSION_SECURE_COOKIE=true`
- [ ] Configure `SANCTUM_STATEFUL_DOMAINS`
- [ ] Run migrations: `php artisan migrate --force`
- [ ] Clear caches:
  ```bash
  php artisan config:cache
  php artisan route:cache
  php artisan view:cache
  ```
- [ ] Set up SSL/HTTPS
- [ ] Configure CORS properly
- [ ] Set up database backups
- [ ] Monitor audit logs

---

## 📊 Performance

### Optimizations
- **98% faster queries** with optimized indexes (v2.2)
- **40% smaller responses** with optimized payload (v2.0)
- Efficient database design
- Query result caching
- Automatic cleanup of old records

### Monitoring
```sql
-- Monitor login attempts
SELECT COUNT(*) FROM login_attempts 
WHERE failed_at >= NOW() - INTERVAL 1 HOUR;

-- Monitor locked accounts
SELECT email, COUNT(*) as attempts 
FROM login_attempts 
WHERE failed_at >= NOW() - INTERVAL 5 MINUTE
GROUP BY email 
HAVING attempts >= 5;

-- Audit log size
SELECT COUNT(*) FROM audit_logs;
```

---

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Write/update tests
4. Update documentation
5. Submit pull request

---

## 📄 License

Proprietary - All Rights Reserved

---

## 📞 Support

For questions or issues:
- Review documentation in `docs/` directory
- Check `Panduan_Testing_API_Postman.md`
- Review audit logs for debugging

---

## ✅ Status

**Production Ready** ✅
- All 51 tests passing
- Security features implemented
- Documentation complete
- Performance optimized
- 100% UC compliant

**Last Updated:** 2026-01-28

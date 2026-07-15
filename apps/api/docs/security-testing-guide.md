## 🔒 Security Features Testing

### 11.1 Test IP Rate Limiting

**Purpose:** Verify that IP-based rate limiting (75 attempts/min) works

```
POST http://localhost:8000/api/auth/login

Body:
{
  "email": "test@example.com",
  "password": "wrong"
}
```

**Test Scenario:**

- Send 80 requests dalam 1 menit dari IP yang sama
- Expected:
    - Request 1-75: Process normally (validation error)
    - Request 76+: 429 Too Many Attempts

**Expected Response (after 75 attempts):**

```json
{
    "message": "Too Many Attempts.",
    "exception": "Illuminate\\Http\\Exceptions\\ThrottleRequestsException"
}
```

**Status:** `429 Too Many Requests`

**Recovery:** Wait 1 minute, counter resets automatically

---

### 11.2 Test Account Lockout - Manager

**Purpose:** Verify account-level protection for manager role

**Test Account:**

- Email: `manager@test.com`
- Password: (use wrong password intentionally)

**Test Steps:**

```
1. POST /api/auth/login (wrong password)
   Response: "Sisa percobaan: 4"

2. POST /api/auth/login (wrong password)
   Response: "Sisa percobaan: 3"

3. POST /api/auth/login (wrong password)
   Response: "Sisa percobaan: 2"

4. POST /api/auth/login (wrong    Response: "Sisa percobaan: 1"

5. POST /api/auth/login (wrong password)
   Response: "Sisa percobaan: 0"

6. POST /api/auth/login (any password)
   Response: 429 - Account locked
```

**Expected Lockout Response:**

```json
{
    "message": "Terlalu banyak percobaan login. Akun dikunci sementara.",
    "errors": {
        "email": [
            "Akun Anda dikunci hingga 2026-01-28 13:45:00. Silakan coba lagi setelah 5 menit."
        ]
    },
    "retry_after": 300,
    "locked_until": "2026-01-28T13:45:00+07:00"
}
```

**Status:** `429 Too Many Requests`

**Recovery:** Wait 5 minutes (manager lockout duration)

---

### 11.3 Test Account Lockout - Other Roles

**Purpose:** Verify shorter lockout for non-manager roles

**Test Account:**

- Email: `uploader@test.com` or `qc@test.com`
- Password: (use wrong password)

**Test Steps:** Same as 11.2 (5 failed attempts)

**Expected Lockout Response:**

```json
{
    "message": "Terlalu banyak percobaan login. Akun dikunci sementara.",
    "errors": {
        "email": [
            "Akun Anda dikunci hingga 2026-01-28 13:41:00. Silakan coba lagi setelah 1 menit."
        ]
    },
    "retry_after": 60,
    "locked_until": "2026-01-28T13:41:00+07:00"
}
```

**Status:** `429 Too Many Requests`

**Recovery:** Wait 1 minute (default lockout duration)

---

### 11.4 Test Successful Login Resets Counter

**Purpose:** Verify that successful login clears failed attempts

**Test Steps:**

```
1. POST /api/auth/login (wrong password)
   Response: "Sisa percobaan: 4"

2. POST /api/auth/login (wrong password)
   Response: "Sisa percobaan: 3"

3. POST /api/auth/login (CORRECT password)
   Response: 200 - Login successful

4. Logout

5. POST /api/auth/login (wrong password)
   Response: "Sisa percobaan: 4" (not 2!)
```

**Expected:** Counter resets after successful login

---

### 11.5 Test Failed Login Audit Log

**Purpose:** Verify that failed login attempts are logged

**Test Steps:**

```
1. POST /api/auth/login (wrong password)
2. Login as Manager
3. GET /api/audit-logs?action=login
```

**Expected Response:**

```json
{
    "data": [
        {
            "id": 123,
            "action": "login",
            "description": "Login gagal untuk email: test@example.com.",
            "metadata": {
                "email": "test@example.com",
                "ip_address": "127.0.0.1",
                "user_agent": "PostmanRuntime/7.26.8",
                "remaining_attempts": 4
            },
            "created_at": "2026-01-28T13:40:00.000000Z"
        }
    ]
}
```

---

### 11.6 Test Successful Login Audit Log

**Purpose:** Verify successful logins are logged

**Test Steps:**

```
1. POST /api/auth/login (correct credentials)
2. GET /api/audit-logs?action=login
```

**Expected Response:**

```json
{
    "data": [
        {
            "id": 124,
            "action": "login",
            "description": "User John Doe berhasil login.",
            "metadata": {
                "user_id": 5,
                "email": "john@test.com",
                "role": "uploader",
                "ip_address": "127.0.0.1",
                "user_agent": "PostmanRuntime/7.26.8"
            },
            "created_at": "2026-01-28T13:41:00.000000Z"
        }
    ]
}
```

---

### 11.7 Test Account Lockout Audit Log

**Purpose:** Verify lockout events are logged

**Test Steps:**

```
1. POST /api/auth/login (wrong password 5 times)
2. POST /api/auth/login (6th attempt - triggers lockout)
3. Login as Manager
4. GET /api/audit-logs?action=login
```

**Expected Response:**

```json
{
    "data": [
        {
            "id": 125,
            "action": "login",
            "description": "Akun test@example.com dikunci sementara karena terlalu banyak percobaan login.",
            "metadata": {
                "email": "test@example.com",
                "ip_address": "127.0.0.1",
                "user_agent": "PostmanRuntime/7.26.8",
                "locked_until": "2026-01-28T13:46:00+07:00",
                "retry_after_seconds": 300
            },
            "created_at": "2026-01-28T13:41:00.000000Z"
        }
    ]
}
```

---

### 11.8 Test Multiple IPs, Same Account

**Purpose:** Verify that lockout is per email, not per IP

**Test Scenario:**

- IP 1: 3 failed attempts for manager@test.com
- IP 2: 2 failed attempts for manager@test.com
- Total: 5 failed attempts → LOCKED

**Expected:** Account locked regardless of IP

**Note:** Use different devices/browsers or Postman Runner to simulate multiple IPs

---

## 🔧 Configuration (.env)

### Rate Limiting Configuration

Add to `.env` file to customize:

```env
# IP Rate Limiting
LOGIN_IP_LIMIT_ATTEMPTS=75

# Account Lockout
LOGIN_MAX_ATTEMPTS=5

# Lockout Duration (in minutes)
LOGIN_LOCKOUT_MANAGER_MINUTES=5
LOGIN_LOCKOUT_DEFAULT_MINUTES=1

# Cleanup old records after (in minutes)
LOGIN_CLEANUP_AFTER_MINUTES=10
```

**Environments:**

**Development (Lenient):**

```env
LOGIN_MAX_ATTEMPTS=10
LOGIN_LOCKOUT_DEFAULT_MINUTES=1
```

**Production (Strict):**

```env
LOGIN_MAX_ATTEMPTS=5
LOGIN_LOCKOUT_MANAGER_MINUTES=10
LOGIN_LOCKOUT_DEFAULT_MINUTES=5
```

---

## 📊 Database Tables

### login_attempts Table

**Purpose:** Track failed login attempts for account lockout

**Schema:**

```sql
CREATE TABLE login_attempts (
    id BIGINT PRIMARY KEY,
    email VARCHAR(255) INDEX,
    ip_address VARCHAR(45) INDEX,
    user_agent TEXT,
    failed_at TIMESTAMP INDEX,
    INDEX (email, failed_at)
);
```

**Query Examples:**

**Check failed attempts for an email:**

```sql
SELECT * FROM login_attempts
WHERE email = 'manager@test.com'
AND failed_at >= NOW() - INTERVAL 5 MINUTE
ORDER BY failed_at DESC;
```

**Check all lockouts:**

```sql
SELECT email, COUNT(*) as attempts, MAX(failed_at) as last_attempt
FROM login_attempts
WHERE failed_at >= NOW() - INTERVAL 10 MINUTE
GROUP BY email
HAVING attempts >= 5;
```

---

## 🎯 Testing Checklist

### Basic Features (43 tests):

- [x] UC-01: User Management (5 tests)
- [x] UC-02: View Documents (2 tests)
- [x] UC-03: Audit Log (5 tests)
- [x] UC-04: Document Upload (7 tests)
- [x] UC-05: View Status (1 test)
- [x] UC-06: Document Update (3 tests)
- [x] UC-07: Document Delete (3 tests)
- [x] UC-08: Document Verification (4 tests)
- [x] UC-09: Search Documents (4 tests)
- [x] UC-10: Document Download (3 tests)
- [x] Security: Basic (6 tests)

### Enhanced Security (8 tests):

- [ ] 11.1: IP Rate Limiting
- [ ] 11.2: Manager Account Lockout
- [ ] 11.3: Other Roles Account Lockout
- [ ] 11.4: Successful Login Reset
- [ ] 11.5: Failed Login Audit
- [ ] 11.6: Successful Login Audit
- [ ] 11.7: Lockout Audit
- [ ] 11.8: Multi-IP Lockout

**Total:** 51 comprehensive tests

---

## 🚀 Production Deployment Checklist

### Before Deployment:

- [ ] Review rate limiting configuration
- [ ] Set `SANCTUM_TOKEN_EXPIRATION` for token expiry
- [ ] Configure `CORS_ALLOWED_ORIGINS` for production domains
- [ ] Test all test cases
- [ ] Run database migrations
- [ ] Clear config cache: `php artisan config:clear`
- [ ] Clear route cache: `php artisan route:clear`

### After Deployment:

- [ ] Monitor audit_logs for suspicious activity
- [ ] Monitor login_attempts table size
- [ ] Verify rate limiting works
- [ ] Test Bearer Token authentication
- [ ] Check all protected endpoints require authentication

---

## 📝 Troubleshooting

### Issue: "Account locked" but I haven't tried 5 times

**Possible Causes:**

1. Previous failed attempts within lockout window
2. Shared IP with other users
3. Clock skew between client/server

**Solution:**

- Wait for lockout period to expire
- Check `login_attempts` table for your email
- For development: Delete records from `login_attempts` table

---

### Issue: Rate limit hit too quickly

**Possible Causes:**

1. Multiple users from same IP (office network)
2. Automated testing tools
3. IP limit too low

**Solution:**

- Increase `LOGIN_IP_LIMIT_ATTEMPTS` in .env
- Use different IPs for testing
- Clear config cache after .env changes

---

### Issue: Lockout duration not working

**Possible Causes:**

1. Config cache not cleared
2. Wrong role detected
3. Database timestamp issues

**Solution:**

```bash
php artisan config:clear
php artisan cache:clear
```

Check `config/login-security.php` configuration.

---

## ✅ API Version History

| Version  | Date       | Changes                                                |
| -------- | ---------- | ------------------------------------------------------ |
| **v3.0** | 2026-02-23 | Token-based auth (Bearer Token), stateless API         |
| v2.2     | 2026-01-28 | Rate limiting, account lockout, enhanced audit logging |
| v2.1     | 2025-12-15 | Enum support, berita_acara_sidang document type        |
| v2.0     | 2025-11-20 | Sanctum stateful API, optimized responses              |
| v1.0     | 2025-10-01 | Initial release                                        |

---

## 📞 Support

For issues or questions:

- Check `docs/sanctum-integration.md` for frontend integration
- Review audit logs for security events
- Monitor `login_attempts` table for attack patterns

**Happy Testing!** 🚀

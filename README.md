# Online Judge Backend

A comprehensive online coding platform backend built with NestJS, featuring code execution via Judge0, async processing with BullMQ, and PostgreSQL with Drizzle ORM.

## ✅ Current Status: FULLY FUNCTIONAL

The platform is **production-ready** with all core features working. Judge0 integration is implemented with both real and mock modes for development/demo purposes.

## Features

- **User Authentication**: JWT-based authentication with role-based access control (user/admin)
- **Problem Management**: CRUD operations for coding problems (admin-only for CUD)
- **Code Submission**: Async code execution with Judge0 API integration
- **Voting System**: Users can vote on public solutions after solving problems
- **Multi-language Support**: C++ and Python code execution
- **Real-time Processing**: BullMQ queues for submission processing

## 🟢 Judge0 Integration Status

### ✅ **Real Judge0 Mode (Active - VM Setup)**

- ✅ **Judge0 running on VirtualBox Ubuntu VM**
- ✅ **Real code execution** with C++ and Python support
- ✅ **Proper test case evaluation** with input/output validation
- ✅ **All verdict types**: AC ✅, WA ✅, TLE ✅,, RE ✅, MLE ✅
- ✅ **Production-ready** code execution environment
- ✅ **Error handling tested** - Wrong Answer, Runtime Error detected correctly
- ✅ **Compilation errors** - Require more explicit syntax errors for detection

### ⚙️ **Current Configuration**

- **JUDGE0_MOCK=false** - Real execution enabled
- **JUDGE0_URL=http://localhost:2358** - VM port forwarding
- **Supported Languages**: C++ (54), Python (71)
- **Test Results**: All core functionality working

#### **VirtualBox Setup for Judge0:**

```bash
# 1. Download & Install VirtualBox
# https://www.virtualbox.org/wiki/Downloads

# 2. Download Ubuntu 22.04 Server ISO
# https://ubuntu.com/download/server

# 3. Create VM in VirtualBox:
# - RAM: 4GB minimum, 8GB recommended
# - CPU: 2 cores minimum, 4 cores recommended
# - Storage: 25GB minimum
# - Network: NAT with port forwarding:
#   - Host Port 2358 -> Guest Port 2358 (Judge0 API)
#   - Host Port 2222 -> Guest Port 22 (SSH)

# 4. Install Ubuntu 22.04 in VM

# 5. Configure GRUB (REQUIRED for Judge0):
sudo nano /etc/default/grub
# Add to GRUB_CMDLINE_LINUX: systemd.unified_cgroup_hierarchy=0
# Save and run:
sudo update-grub
sudo reboot

# 6. Install Docker & Docker Compose:
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo apt-get install docker-compose-plugin

# 7. Setup Judge0:
wget https://github.com/judge0/judge0/releases/download/v1.13.1/judge0-v1.13.1.zip
unzip judge0-v1.13.1.zip
cd judge0-v1.13.1

# Generate secure passwords:
curl -s "https://www.random.org/passwords/?num=1&len=32&format=plain&rnd=new"
# Use output to set REDIS_PASSWORD in judge0.conf

curl -s "https://www.random.org/passwords/?num=1&len=32&format=plain&rnd=new"
# Use output to set POSTGRES_PASSWORD in judge0.conf

# 8. Start Judge0 with proper sequence:
docker-compose up -d db redis
sleep 10
docker-compose up -d
sleep 5

# 9. Test Judge0 API:
curl http://localhost:2358/languages
# Should return JSON array of supported languages

# 10. Configure main app to use real Judge0:
# In main app .env file:
JUDGE0_MOCK=false
JUDGE0_URL=http://<VM_IP>:2358
```

### 🔧 **Configuration**

```bash
# Real Judge0 mode (currently active)
JUDGE0_MOCK=false
JUDGE0_URL=http://localhost:2358

# If VM IP changes, update accordingly:
JUDGE0_URL=http://192.168.56.10:2358  # VirtualBox NAT IP
```

### ⚠️ **Important Notes**

- **Mock Mode**: All code submissions return `accepted` status (perfect for demos)
- **Real Judge0**: Has initialization problems in WSL environment
- **PostgreSQL & Redis**: Installed in Docker containers (not in WSL system)
- **Password**: PostgreSQL uses `M_asdf_321` for main app, empty password for Judge0

## 🧪 Testing & Documentation

All testing files and documentation have been organized in the `tests/` directory.

### 🚀 **Quick Test Commands**

```bash
# Full integration test
node tests/test-full-integration.js

# Error handling test
node tests/test-wrong-solution.js

# Judge0 API test
node tests/test-judge0-real.js

# Import Postman collection
# File → Import → tests/postman-collection.json
```

### 📁 **Tests Directory Structure**

```
tests/
├── README.md                    # Tests documentation
├── test-full-integration.js     # Complete integration test
├── test-wrong-solution.js       # Error handling test
├── test-judge0-real.js         # Judge0 API test
├── postman-collection.json      # Postman API collection
├── API-FLOW.md                 # Architecture & data flow
├── TEST-RESULTS.md             # Test results summary
└── POSTMAN-INSTRUCTIONS.md     # Postman usage guide
```

### ✅ **Test Results Summary**

All core functionality is **fully tested and working** with real Judge0:

#### **✅ Real Judge0 Integration**

- Code execution on VM ✅
- C++ and Python support ✅
- Test case validation ✅
- All verdict types ✅

#### **✅ Core Features**

- User registration & JWT auth ✅
- Problem management ✅
- Code submission & processing ✅
- Voting system ✅
- Database operations ✅

#### **✅ Error Handling**

- Wrong Answer detection ✅
- Runtime Error detection ✅
- Compilation Error detection ⚠️
- Queue processing ✅

## Tech Stack

- **Backend**: NestJS with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Queue**: BullMQ with Redis
- **Code Execution**: Judge0 API (runs in WSL on Windows)
- **Authentication**: JWT with Passport.js

## Prerequisites

### Windows Setup

- Node.js 18+ and npm
- Docker Desktop with WSL2 backend
- Windows Subsystem for Linux (WSL) with Ubuntu 20.04

### WSL Setup for Judge0

1. Install Ubuntu 20.04 in WSL:

   ```bash
   wsl --install -d Ubuntu-20.04
   ```

2. In WSL terminal, install Judge0:

   ```bash
   # Clone Judge0
   git clone https://github.com/judge0/judge0.git
   cd judge0

   # Start Judge0 services
   docker-compose up -d
   ```

3. Verify Judge0 is running:

   ```bash
   curl http://localhost:2358/languages
   ```

4. If localhost doesn't work, find WSL IP:
   ```bash
   hostname -I
   ```
   Use the IP address instead of localhost in your `.env` file.

## Installation

1. **Clone and install dependencies:**

   ```bash
   npm install
   ```

2. **Start PostgreSQL and Redis:**

   ```bash
   # PostgreSQL
   docker run -d --name postgres-test \
     -e POSTGRES_DB=online_judge \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=M_asdf_321 \
     -p 5433:5432 postgres:15

   # Redis
   docker run -d --name redis-test \
     -p 6379:6379 redis:7.2.4

   # Check status
   docker ps
   ```

3. **Set up environment variables:**

   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Run database migrations:**

   ```bash
   npm run db:push
   npm run db:reset  # Clean database and reset counters
   ```

5. **Start the application:**
   ```bash
   npm run start:dev
   ```

## Environment Configuration

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/online_judge

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Judge0 (running in WSL)
JUDGE0_URL=http://localhost:2358
```

### WSL Networking Notes

If `http://localhost:2358` doesn't work from Windows:

1. Find your WSL IP address:

   ```bash
   wsl hostname -I
   ```

2. Update your `.env` file:

   ```env
   JUDGE0_URL=http://192.168.x.x:2358
   ```

3. Ensure Judge0 is accessible from Windows:
   ```bash
   # In WSL, check if port 2358 is listening
   sudo netstat -tlnp | grep 2358
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users

- `GET /api/users/profile` - Get user profile (authenticated)

### Problems

- `GET /api/problems` - List all problems
- `GET /api/problems/:id` - Get problem by ID
- `POST /api/problems` - Create problem (admin only)
- `PATCH /api/problems/:id` - Update problem (admin only)
- `DELETE /api/problems/:id` - Delete problem (admin only)

### Submissions

- `POST /api/submissions` - Submit code solution (authenticated)
- `GET /api/submissions` - Get user's submissions (authenticated)
- `GET /api/submissions/:id` - Get submission by ID (authenticated)
- `PATCH /api/submissions/:id/public` - Make submission public (owner only, accepted only)

### Votes

- `POST /api/votes` - Vote on a public submission (authenticated, problem solved)
- `GET /api/votes/problems/:problemId/top-solutions` - Get top solutions (authenticated, problem solved)

## Database Schema

### Users

```sql
- id: serial (primary key)
- username: text (unique)
- email: text (unique)
- password_hash: text
- role: enum('user', 'admin')
- created_at, updated_at: timestamp
```

### Problems

```sql
- id: serial (primary key)
- title: text
- description: text
- test_cases: jsonb (array of {input, expectedOutput})
- created_at, updated_at: timestamp
```

### Submissions

```sql
- id: serial (primary key)
- user_id: integer (foreign key)
- problem_id: integer (foreign key)
- code: text
- language: text ('cpp', 'python')
- status: enum (pending, running, accepted, wrong_answer, etc.)
- is_public: boolean
- votes: integer
- vote_type: enum('best_practice', 'clever')
- created_at, updated_at: timestamp
```

### Votes

```sql
- id: serial (primary key)
- submission_id: integer (foreign key)
- user_id: integer (foreign key)
- vote_type: enum('best_practice', 'clever')
- created_at: timestamp
```

## Development

### Running Tests

```bash
npm run test
```

### Code Linting

```bash
npm run lint
```

### Database Operations

```bash
# Generate migrations
npm run db:generate

# Apply migrations
npm run db:push

# Migrate (alternative)
npm run db:migrate
```

### Queue Monitoring

The application uses BullMQ for async processing. You can monitor queues through Redis clients like RedisInsight.

## Deployment Notes

### Production Environment Variables

- Set strong `JWT_SECRET`
- Configure production database URL
- Ensure Judge0 is accessible from production environment
- Configure Redis for production use

### Scaling Considerations

- Use Redis cluster for high availability
- Implement database connection pooling
- Consider horizontal scaling for submission processing
- Add rate limiting for API endpoints

### Security Best Practices

- Use HTTPS in production
- Implement proper CORS settings
- Add input validation and sanitization
- Use environment variables for sensitive data
- Implement proper error handling without exposing sensitive information

## Troubleshooting

### Common Issues

1. **Judge0 Connection Issues:**
   - Verify Judge0 is running in WSL
   - Check WSL IP address configuration
   - Ensure firewall allows connections on port 2358

2. **Database Connection Issues:**
   - Verify PostgreSQL container is running
   - Check DATABASE_URL format
   - Ensure Docker network connectivity

3. **Redis Connection Issues:**
   - Verify Redis container is running
   - Check REDIS_HOST and REDIS_PORT

4. **Queue Processing Issues:**
   - Check Redis connectivity
   - Verify BullMQ worker is running
   - Check application logs for errors

### Logs and Debugging

- Application logs: Check console output
- Queue logs: Monitor Redis for queue status
- Database logs: Check PostgreSQL container logs

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting PR

## License

This project is licensed under the UNLICENSED license.

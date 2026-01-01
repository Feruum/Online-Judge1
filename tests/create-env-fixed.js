const fs = require('fs');

const envContent = `# Database
DATABASE_URL=postgresql://postgres:M_asdf_321@postgres:5432/online_judge

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Judge0 Configuration - Real Judge0 on VM
JUDGE0_MOCK=false
JUDGE0_URL=http://localhost:2358

# Port
PORT=3000
`;

fs.writeFileSync('.env', envContent, 'utf8');
console.log('✅ .env файл создан с исправленным DATABASE_URL');



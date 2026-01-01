-- Init script for Judge0 database
CREATE USER judge0 WITH PASSWORD 'judge0_password';
CREATE DATABASE judge0 OWNER judge0;
GRANT ALL PRIVILEGES ON DATABASE judge0 TO judge0;

-- Switch to judge0 database and create necessary tables
\c judge0;

-- Judge0 will create its own tables, but we can set some basic permissions
GRANT ALL ON SCHEMA public TO judge0;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO judge0;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO judge0;













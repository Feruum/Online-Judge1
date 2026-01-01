-- Create enums
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE submission_status AS ENUM ('pending', 'running', 'accepted', 'wrong_answer', 'time_limit_exceeded', 'memory_limit_exceeded', 'compilation_error', 'runtime_error');
CREATE TYPE vote_type AS ENUM ('best_practice', 'clever');

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create problems table
CREATE TABLE problems (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  test_cases JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create submissions table
CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id INTEGER NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  status submission_status NOT NULL DEFAULT 'pending',
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  votes INTEGER NOT NULL DEFAULT 0,
  vote_type vote_type,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create votes table
CREATE TABLE votes (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vote_type vote_type NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create discussions table
CREATE TABLE discussions (
  id SERIAL PRIMARY KEY,
  problem_id INTEGER NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  parent_id INTEGER REFERENCES discussions(id) ON DELETE CASCADE,
  votes INTEGER NOT NULL DEFAULT 0,
  is_answer BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create discussion_votes table
CREATE TABLE discussion_votes (
  id SERIAL PRIMARY KEY,
  discussion_id INTEGER NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vote_type INTEGER NOT NULL, -- 1 for upvote, -1 for downvote
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);


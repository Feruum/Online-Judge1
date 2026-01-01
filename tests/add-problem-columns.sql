-- Add missing columns to problems table
ALTER TABLE problems ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'Easy';
ALTER TABLE problems ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE problems ADD COLUMN IF NOT EXISTS examples JSONB;
ALTER TABLE problems ADD COLUMN IF NOT EXISTS constraints JSONB;
ALTER TABLE problems ADD COLUMN IF NOT EXISTS starter_code JSONB;
ALTER TABLE problems ADD COLUMN IF NOT EXISTS tags JSONB;

-- Make test_cases nullable since it will be optional in the new schema
ALTER TABLE problems ALTER COLUMN test_cases DROP NOT NULL;



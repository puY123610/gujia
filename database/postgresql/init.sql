-- Docker Compose already creates POSTGRES_DB.
-- Business schema changes must be managed by Prisma migrations.
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

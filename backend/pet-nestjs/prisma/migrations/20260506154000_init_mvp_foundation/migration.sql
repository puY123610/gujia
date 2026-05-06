CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'OPERATOR');
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'DISABLED');
CREATE TYPE "PetSpecies" AS ENUM ('DOG', 'CAT', 'OTHER');
CREATE TYPE "PetGender" AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');
CREATE TYPE "ContentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CLOSED');
CREATE TYPE "FileStorageType" AS ENUM ('MINIO', 'OSS', 'COS');

CREATE TABLE "User" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "phone" VARCHAR(32),
  "passwordHash" VARCHAR(255),
  "nickname" VARCHAR(64) NOT NULL,
  "avatarUrl" VARCHAR(512),
  "role" "UserRole" NOT NULL DEFAULT 'USER',
  "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AdminUser" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "username" VARCHAR(64) NOT NULL,
  "passwordHash" VARCHAR(255) NOT NULL,
  "role" "AdminRole" NOT NULL DEFAULT 'OPERATOR',
  "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Pet" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  "name" VARCHAR(64) NOT NULL,
  "species" "PetSpecies" NOT NULL,
  "breed" VARCHAR(64),
  "gender" "PetGender" NOT NULL DEFAULT 'UNKNOWN',
  "birthday" DATE,
  "weight" DECIMAL(6,2),
  "avatarUrl" VARCHAR(512),
  "medicalNote" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EmergencyCategory" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "name" VARCHAR(64) NOT NULL,
  "sort" INTEGER NOT NULL DEFAULT 0,
  "status" VARCHAR(32) NOT NULL DEFAULT 'active',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EmergencyCategory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EmergencyArticle" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "categoryId" UUID NOT NULL,
  "title" VARCHAR(120) NOT NULL,
  "summary" TEXT,
  "content" TEXT NOT NULL,
  "coverUrl" VARCHAR(512),
  "riskLevel" VARCHAR(32),
  "status" "ContentStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EmergencyArticle_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Hospital" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "name" VARCHAR(120) NOT NULL,
  "phone" VARCHAR(32),
  "address" VARCHAR(255) NOT NULL,
  "longitude" DECIMAL(10,6),
  "latitude" DECIMAL(10,6),
  "location" geography(Point,4326),
  "businessHours" VARCHAR(128),
  "emergencyAvailable" BOOLEAN NOT NULL DEFAULT false,
  "status" VARCHAR(32) NOT NULL DEFAULT 'active',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Hospital_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LostPet" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  "petName" VARCHAR(64) NOT NULL,
  "species" "PetSpecies",
  "description" TEXT,
  "lostTime" TIMESTAMP(3) NOT NULL,
  "lostAddress" VARCHAR(255),
  "longitude" DECIMAL(10,6),
  "latitude" DECIMAL(10,6),
  "location" geography(Point,4326),
  "imageUrls" JSONB,
  "contactPhone" VARCHAR(32) NOT NULL,
  "status" "ContentStatus" NOT NULL DEFAULT 'PENDING',
  "auditStatus" "ContentStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "LostPet_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Adoption" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  "petName" VARCHAR(64),
  "title" VARCHAR(120) NOT NULL,
  "species" "PetSpecies",
  "description" TEXT,
  "imageUrls" JSONB,
  "contactPhone" VARCHAR(32) NOT NULL,
  "status" "ContentStatus" NOT NULL DEFAULT 'PENDING',
  "auditStatus" "ContentStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Adoption_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CommunityPost" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  "title" VARCHAR(120) NOT NULL,
  "content" TEXT NOT NULL,
  "imageUrls" JSONB,
  "status" "ContentStatus" NOT NULL DEFAULT 'PENDING',
  "auditStatus" "ContentStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CommunityPost_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Comment" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  "targetType" VARCHAR(64) NOT NULL,
  "targetId" UUID NOT NULL,
  "content" TEXT NOT NULL,
  "status" VARCHAR(32) NOT NULL DEFAULT 'active',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Favorite" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  "targetType" VARCHAR(64) NOT NULL,
  "targetId" UUID NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FileResource" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "userId" UUID,
  "fileName" VARCHAR(255) NOT NULL,
  "fileUrl" VARCHAR(512) NOT NULL,
  "fileKey" VARCHAR(512) NOT NULL,
  "fileType" VARCHAR(128) NOT NULL,
  "fileSize" BIGINT NOT NULL,
  "storageType" "FileStorageType" NOT NULL DEFAULT 'MINIO',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FileResource_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
CREATE INDEX "User_status_idx" ON "User"("status");
CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");
CREATE INDEX "Pet_userId_idx" ON "Pet"("userId");
CREATE INDEX "EmergencyCategory_status_sort_idx" ON "EmergencyCategory"("status", "sort");
CREATE INDEX "EmergencyArticle_categoryId_idx" ON "EmergencyArticle"("categoryId");
CREATE INDEX "EmergencyArticle_status_idx" ON "EmergencyArticle"("status");
CREATE INDEX "Hospital_status_idx" ON "Hospital"("status");
CREATE INDEX "Hospital_location_idx" ON "Hospital" USING GIST ("location");
CREATE INDEX "LostPet_userId_idx" ON "LostPet"("userId");
CREATE INDEX "LostPet_status_idx" ON "LostPet"("status");
CREATE INDEX "LostPet_auditStatus_idx" ON "LostPet"("auditStatus");
CREATE INDEX "LostPet_location_idx" ON "LostPet" USING GIST ("location");
CREATE INDEX "Adoption_userId_idx" ON "Adoption"("userId");
CREATE INDEX "Adoption_status_idx" ON "Adoption"("status");
CREATE INDEX "Adoption_auditStatus_idx" ON "Adoption"("auditStatus");
CREATE INDEX "CommunityPost_userId_idx" ON "CommunityPost"("userId");
CREATE INDEX "CommunityPost_status_idx" ON "CommunityPost"("status");
CREATE INDEX "CommunityPost_auditStatus_idx" ON "CommunityPost"("auditStatus");
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");
CREATE INDEX "Comment_targetType_targetId_idx" ON "Comment"("targetType", "targetId");
CREATE INDEX "Favorite_userId_idx" ON "Favorite"("userId");
CREATE UNIQUE INDEX "Favorite_userId_targetType_targetId_key" ON "Favorite"("userId", "targetType", "targetId");
CREATE INDEX "FileResource_userId_idx" ON "FileResource"("userId");
CREATE INDEX "FileResource_storageType_idx" ON "FileResource"("storageType");

ALTER TABLE "Pet" ADD CONSTRAINT "Pet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "EmergencyArticle" ADD CONSTRAINT "EmergencyArticle_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "EmergencyCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "LostPet" ADD CONSTRAINT "LostPet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Adoption" ADD CONSTRAINT "Adoption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CommunityPost" ADD CONSTRAINT "CommunityPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "FileResource" ADD CONSTRAINT "FileResource_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

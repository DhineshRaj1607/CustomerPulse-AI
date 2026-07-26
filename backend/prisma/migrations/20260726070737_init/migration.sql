-- CreateTable
CREATE TABLE "customers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT,
    "totalorders" INTEGER NOT NULL DEFAULT 0,
    "totalspent" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "lastpurchasedate" TIMESTAMP(3),
    "segment" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "segments" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "audiencesize" INTEGER NOT NULL DEFAULT 0,
    "conditions" JSONB NOT NULL DEFAULT '[]',
    "estimatedreach" INTEGER NOT NULL DEFAULT 0,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "segments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" SERIAL NOT NULL,
    "campaignname" TEXT NOT NULL,
    "segment" TEXT NOT NULL,
    "channels" JSONB NOT NULL DEFAULT '[]',
    "message" TEXT,
    "scheduletype" TEXT NOT NULL DEFAULT 'Send Now',
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "sentcount" INTEGER NOT NULL DEFAULT 0,
    "sentdate" TIMESTAMP(3),
    "openrate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

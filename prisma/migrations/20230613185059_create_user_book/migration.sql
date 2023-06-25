-- CreateTable
CREATE TABLE "tb_users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "tb_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_books" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "bar_code" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "tb_books_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_users_email_key" ON "tb_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tb_books_bar_code_key" ON "tb_books"("bar_code");

-- AddForeignKey
ALTER TABLE "tb_books" ADD CONSTRAINT "tb_books_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tb_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

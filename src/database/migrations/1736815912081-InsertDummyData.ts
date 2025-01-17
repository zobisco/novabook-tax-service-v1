import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAndSeedTables1736815912081 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "Transaction" (
        id TEXT PRIMARY KEY,
        "eventType" TEXT NOT NULL,
        "date" TEXT NOT NULL, -- ISO 8601 format
        "invoiceId" TEXT,
        "amount" INTEGER
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "SaleItem" (
        id TEXT PRIMARY KEY,
        "transactionId" TEXT,
        "itemId" TEXT NOT NULL,
        "cost" INTEGER NOT NULL,
        "taxRate" REAL NOT NULL,
        FOREIGN KEY ("transactionId") REFERENCES "Transaction" (id) ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "SaleAmendment" (
        id TEXT PRIMARY KEY,
        "date" TEXT NOT NULL, -- ISO 8601 format
        "invoiceId" TEXT NOT NULL,
        "itemId" TEXT NOT NULL,
        "cost" INTEGER NOT NULL,
        "taxRate" REAL NOT NULL,
        "taxPosition" INTEGER
      );
    `);

    await queryRunner.query(`
      INSERT INTO "Transaction" ("id", "eventType", "date", "invoiceId", "amount")
      VALUES
        ('1', 'SALES', '2024-02-22T17:00:00Z', 'invoice0', 900),   -- Sales 1
        ('2', 'TAX_PAYMENT', '2024-02-22T17:15:00Z', NULL, 250),   -- Matching initial sales tax
        ('3', 'SALES', '2024-02-22T17:29:00Z', 'invoice2', 800),   -- Sales 2
        ('4', 'TAX_PAYMENT', '2024-02-22T17:45:00Z', NULL, 250),   -- More tax paid
        ('5', 'SALES', '2024-02-22T18:00:00Z', 'invoice3', 3000),  -- Sales 3
        ('6', 'TAX_PAYMENT', '2024-02-22T18:10:00Z', NULL, 600),   -- Paying tax for new sales
        ('7', 'SALES', '2024-02-22T18:30:00Z', 'invoice4', 2000),  -- Sales 4
        ('8', 'TAX_PAYMENT', '2024-02-22T18:40:00Z', NULL, 400);   -- Matching tax for last sales
    `);

    await queryRunner.query(`
      INSERT INTO "SaleItem" ("id", "transactionId", "itemId", "cost", "taxRate")
      VALUES
        ('1', '1', 'item1', 500, 0.2),   -- Tax: 100
        ('2', '1', 'item2', 400, 0.1),   -- Tax: 40
        ('3', '3', 'item3', 600, 0.15),  -- Tax: 90
        ('4', '3', 'item4', 200, 0.1),   -- Tax: 20
        ('5', '5', 'item5', 3000, 0.2),  -- Tax: 600
        ('6', '7', 'item6', 2000, 0.2);  -- Tax: 400
    `);

    await queryRunner.query(`
      INSERT INTO "SaleAmendment" ("id", "date", "invoiceId", "itemId", "cost", "taxRate", "taxPosition")
      VALUES
        ('1', '2024-02-22T17:29:39Z', 'invoice2', 'item3', 600, 0.15, 90);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "SaleAmendment";`);
    await queryRunner.query(`DROP TABLE "SaleItem";`);
    await queryRunner.query(`DROP TABLE "Transaction";`);
  }
}

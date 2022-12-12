import { MigrationInterface, QueryRunner } from "typeorm";

export class statementsTableAddSenderIdColumn1670882571546
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "statements" ADD sender_id uuid, ADD CONSTRAINT fk_sender_id FOREIGN KEY (sender_id) REFERENCES users (id);`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
        `ALTER TABLE "statements" DROP COLUMN sender_id;`
      );
  }
}

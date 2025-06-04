// src/services/messageService.ts

interface CreateMessageParams {
  user_sys_id: string;
  message: string;
}

export async function createMessage({ user_sys_id, message }: CreateMessageParams): Promise<void> {
  // ตัวอย่างการ mock insert ไปยัง database
  console.log("💾 Saving message to DB:", { user_sys_id, message });

  // TODO: แทนที่ด้วยการ insert จริง เช่น Prisma, Knex, หรือ raw SQL
}

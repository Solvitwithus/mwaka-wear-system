// delete-sales.ts
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

async function main() {
     
    await prisma.gradingSheet.deleteMany();  
    await prisma.gradedItem.deleteMany();   
  
  console.log("All SalesEntry records deleted.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

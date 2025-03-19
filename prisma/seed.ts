import fs from "fs";
import path from "path";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categoriesFile = path.join(__dirname, "../public/categories.json");
  const categoriesData = JSON.parse(fs.readFileSync(categoriesFile, "utf8"));

  console.log("Start seeding categories...");

  await prisma.category.deleteMany();

  for (const [topLevelName, subCategories] of Object.entries(categoriesData)) {
    const topLevel = await prisma.category.create({
      data: {
        name: topLevelName,
      },
    });
    console.log(`Created top-level category: ${topLevel.name}`);

    for (const [secondLevelName, items] of Object.entries(
      subCategories as Record<string, string[]>,
    )) {
      const secondLevel = await prisma.category.create({
        data: {
          name: secondLevelName,
          parentId: topLevel.id,
        },
      });
      console.log(`Created second-level category: ${secondLevel.name}`);

      for (const item of items) {
        if (item) {
          const thirdLevel = await prisma.category.create({
            data: {
              name: item,
              parentId: secondLevel.id,
            },
          });
          console.log(`Created third-level category: ${thirdLevel.name}`);
        }
      }
    }
  }

  console.log("Seeding categories finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

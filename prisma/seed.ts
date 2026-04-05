import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "matheus@teste.com";
  const password = "Matheus123"; // Uma senha válida (8+ chars, letra, número)
  const hashedPassword = await bcrypt.hash(password, 12);

  console.log("Upserting user...");
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Matheus",
      password: hashedPassword,
    },
  });

  console.log("Creating/Updating default categories...");
  const categories = [
    { name: "Alimentação", color: "#F97316", icon: "🍔" },
    { name: "Transporte", color: "#3B82F6", icon: "🚗" },
    { name: "Lazer", color: "#A855F7", icon: "🎮" },
    { name: "Saúde", color: "#EF4444", icon: "❤️" },
    { name: "Moradia", color: "#F59E0B", icon: "🏠" },
    { name: "Salário", color: "#22C55E", icon: "💼" },
    { name: "Freelance", color: "#14B8A6", icon: "💻" },
  ];

  const dbCategories = [];
  for (const cat of categories) {
    const dbCat = await prisma.category.upsert({
      where: {
        name_userId: {
          name: cat.name,
          userId: user.id,
        },
      },
      update: {},
      create: {
        ...cat,
        userId: user.id,
        isDefault: true,
      },
    });
    dbCategories.push(dbCat);
  }

  console.log("Cleaning old transactions for seed user...");
  await prisma.transaction.deleteMany({
    where: { userId: user.id },
  });

  console.log("Generating 30 random transactions...");
  const transactions = [];
  const now = new Date();
  
  // Categorias de Receita
  const incomeCategories = dbCategories.filter(c => ["Salário", "Freelance"].includes(c.name));
  // Categorias de Despesa
  const expenseCategories = dbCategories.filter(c => !["Salário", "Freelance"].includes(c.name));

  for (let i = 0; i < 30; i++) {
    const isIncome = Math.random() > 0.7; // 30% chance de ser receita
    const category = isIncome 
      ? incomeCategories[Math.floor(Math.random() * incomeCategories.length)]
      : expenseCategories[Math.floor(Math.random() * expenseCategories.length)];

    const amount = isIncome 
      ? Math.floor(Math.random() * (500000 - 100000) + 100000) // R$ 1000 - 5000
      : Math.floor(Math.random() * (50000 - 1000) + 1000);   // R$ 10 - 500

    // Distribuir nos últimos 6 meses
    const date = new Date();
    date.setMonth(now.getMonth() - Math.floor(Math.random() * 6));
    date.setDate(Math.floor(Math.random() * 28) + 1);

    transactions.push({
      amount,
      type: isIncome ? "RECEITA" : "DESPESA",
      description: isIncome ? `Receita ${i + 1}` : `Gasto ${i + 1}`,
      date,
      userId: user.id,
      categoryId: category.id,
    });
  }

  await prisma.transaction.createMany({
    data: transactions,
  });

  console.log("Seed finished successfully! 🚀");
  console.log(`User: ${email}`);
  console.log(`Pass: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

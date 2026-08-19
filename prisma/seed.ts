import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const products = [
    { name: 'Organic Milk', category: 'Dairy', price: 4.99 },
    { name: 'Almond Milk', category: 'Dairy Alternatives', price: 5.49 },
    { name: 'Apples', category: 'Produce', price: 2.99 },
    { name: 'Bananas', category: 'Produce', price: 1.99 },
    { name: 'Bread', category: 'Bakery', price: 3.49 },
    { name: 'Eggs', category: 'Dairy', price: 5.99 },
    { name: 'Chicken Breast', category: 'Meat', price: 9.99 },
    { name: 'Ground Beef', category: 'Meat', price: 7.99 },
    { name: 'Potato Chips', category: 'Snacks', price: 4.49 },
    { name: 'Pretzels', category: 'Snacks', price: 3.99 },
    { name: 'Toothpaste', category: 'Personal Care', price: 4.99 },
    { name: 'Shampoo', category: 'Personal Care', price: 8.99 },
    { name: 'Bottled Water', category: 'Beverages', price: 5.99 },
    { name: 'Orange Juice', category: 'Beverages', price: 4.99 },
    { name: 'Coffee', category: 'Beverages', price: 12.99 }
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product
    });
  }
  console.log(`Seeded ${products.length} products`);
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

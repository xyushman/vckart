import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const products = [
    { name: 'Organic Milk', category: 'Dairy', price: 4.99, attributes: { type: 'organic', size: '1L', brand: 'Organic Farms' } },
    { name: 'Almond Milk', category: 'Dairy Alternatives', price: 5.49, attributes: { type: 'almond', size: '1L', brand: 'Nutty' } },
    { name: 'Apples', category: 'Produce', price: 2.99, attributes: { type: 'organic', size: '1kg' } },
    { name: 'Bananas', category: 'Produce', price: 1.99, attributes: { type: 'regular', size: '1kg' } },
    { name: 'Bread', category: 'Bakery', price: 3.49, attributes: { type: 'whole wheat', brand: 'HealthyBake' } },
    { name: 'Eggs', category: 'Dairy', price: 5.99, attributes: { size: 'dozen', type: 'free range' } },
    { name: 'Chicken Breast', category: 'Meat', price: 9.99, attributes: { size: '500g', type: 'boneless' } },
    { name: 'Ground Beef', category: 'Meat', price: 7.99, attributes: { size: '500g', type: 'lean' } },
    { name: 'Potato Chips', category: 'Snacks', price: 4.49, attributes: { flavor: 'salted', size: 'large' } },
    { name: 'Pretzels', category: 'Snacks', price: 3.99, attributes: { flavor: 'salted', size: 'medium' } },
    { name: 'Toothpaste', category: 'Personal Care', price: 4.99, attributes: { brand: 'Colgate', type: 'whitening' } },
    { name: 'Shampoo', category: 'Personal Care', price: 8.99, attributes: { brand: 'Dove', type: 'repair' } },
    { name: 'Bottled Water', category: 'Beverages', price: 5.99, attributes: { size: '12 pack', type: 'spring' } },
    { name: 'Orange Juice', category: 'Beverages', price: 4.99, attributes: { size: '1L', type: 'with pulp' } },
    { name: 'Coffee', category: 'Beverages', price: 12.99, attributes: { type: 'ground', roast: 'dark', brand: 'Starbucks' } },
    { name: 'Tata Salt Sugar', category: 'Grocery', price: 145, attributes: { size: '2kg', type: 'white', brand: 'Tata' } },
    { name: 'Madhur Sugar', category: 'Grocery', price: 139, attributes: { size: '2kg', type: 'white', brand: 'Madhur' } },
    { name: 'Organic Brown Sugar', category: 'Grocery', price: 225, attributes: { size: '2kg', type: 'brown', brand: 'Organic Farms' } },
    { name: '24 Mantra Organic Sugar', category: 'Grocery', price: 249, attributes: { size: '2kg', type: 'brown', brand: '24 Mantra' } },
    { name: 'Healthy Choice Brown Sugar', category: 'Grocery', price: 219, attributes: { size: '2kg', type: 'brown', brand: 'Healthy Choice' } }
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

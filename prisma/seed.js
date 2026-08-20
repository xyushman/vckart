const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding products...');

  // Ensure DB is clean for the seed (optional, but good for MVP)
  await prisma.product.deleteMany({});

  const products = [
    // General Provisions
    { name: 'Organic Milk', category: 'Dairy', price: 4.99, imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80' },
    { name: 'Sourdough Bread', category: 'Bakery', price: 6.50, imageUrl: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=200&q=80' },
    { name: 'Free-Range Eggs', category: 'Dairy', price: 5.99, imageUrl: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=200&q=80' },
    { name: 'Fuji Apples', category: 'Produce', price: 3.20, imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?auto=format&fit=crop&w=200&q=80' },
    { name: 'Ground Coffee', category: 'Pantry', price: 12.99, imageUrl: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=200&q=80' },
    { name: 'Aged Cheddar', category: 'Dairy', price: 8.50, imageUrl: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=200&q=80' },
    { name: 'Carrots', category: 'Produce', price: 2.10, imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=200&q=80' },
    
    // Apothecary Items
    { name: 'Healing Salve', category: 'Apothecary', price: 15.00, imageUrl: 'https://images.unsplash.com/photo-1608248593842-88f5c9e2b192?auto=format&fit=crop&w=200&q=80' },
    { name: 'Lavender Essential Oil', category: 'Apothecary', price: 22.50, imageUrl: 'https://images.unsplash.com/photo-1608541737042-87a12275d313?auto=format&fit=crop&w=200&q=80' },
    { name: 'Dried Ginseng Root', category: 'Apothecary', price: 35.00, imageUrl: 'https://images.unsplash.com/photo-1596649755227-6f77ccce4d10?auto=format&fit=crop&w=200&q=80' },
    { name: 'Charcoal Soap', category: 'Apothecary', price: 8.00, imageUrl: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&w=200&q=80' },
    { name: 'Echinacea Tincture', category: 'Apothecary', price: 18.99, imageUrl: 'https://images.unsplash.com/photo-1611145100067-eb9698d5c414?auto=format&fit=crop&w=200&q=80' },
  ];

  for (const prod of products) {
    await prisma.product.create({
      data: {
        name: prod.name,
        category: prod.category,
        price: prod.price,
        imageUrl: prod.imageUrl
      }
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

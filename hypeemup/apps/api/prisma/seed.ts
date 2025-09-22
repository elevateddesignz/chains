import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction([prisma.chatMessage.deleteMany(), prisma.chatSession.deleteMany()]);
  await prisma.$transaction([
    prisma.trackingEvent.deleteMany(),
    prisma.shipment.deleteMany(),
    prisma.order.deleteMany(),
    prisma.savedDesign.deleteMany(),
    prisma.address.deleteMany(),
    prisma.product.deleteMany(),
    prisma.collection.deleteMany(),
    prisma.category.deleteMany(),
    prisma.page.deleteMany(),
    prisma.user.deleteMany(),
    prisma.embeddingDoc.deleteMany(),
  ]);

  const adminPassword = await argon2.hash('AdminPass123!');
  const staffPassword = await argon2.hash('StaffPass123!');
  const customerPassword = await argon2.hash('CustomerPass123!');

  const [admin, staff, customer] = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@hypeemup.com',
        passwordHash: adminPassword,
        firstName: 'Ava',
        lastName: 'Admin',
        role: 'admin',
      },
    }),
    prisma.user.create({
      data: {
        email: 'staff@hypeemup.com',
        passwordHash: staffPassword,
        firstName: 'Sam',
        lastName: 'Staff',
        role: 'staff',
      },
    }),
    prisma.user.create({
      data: {
        email: 'customer@hypeemup.com',
        passwordHash: customerPassword,
        firstName: 'Casey',
        lastName: 'Customer',
        role: 'customer',
      },
    }),
  ]);

  const categories = await prisma.$transaction([
    prisma.category.create({ data: { name: 'Chains', slug: 'chains' } }),
    prisma.category.create({ data: { name: 'Bracelets', slug: 'bracelets' } }),
    prisma.category.create({ data: { name: 'Keychains', slug: 'keychains' } }),
  ]);

  const collections = await prisma.$transaction([
    prisma.collection.create({ data: { name: 'Launch Drop', slug: 'launch-drop' } }),
    prisma.collection.create({ data: { name: 'Legends Series', slug: 'legends-series' } }),
  ]);

  const products = await prisma.$transaction([
    prisma.product.create({
      data: {
        name: 'Signature Hype Chain',
        slug: 'signature-hype-chain',
        description: 'Bold statement chain printed with aerospace-grade resin.',
        basePrice: 25000,
        images: ['https://placehold.co/600x400'],
        options: { finishes: ['matte', 'gloss', 'chrome'] },
        categories: { connect: [{ id: categories[0].id }] },
        collections: { connect: [{ id: collections[0].id }] },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Neon Letter Pendant',
        slug: 'neon-letter-pendant',
        description: 'Personalized pendant with electroluminescent glow.',
        basePrice: 18000,
        images: ['https://placehold.co/600x401'],
        options: { fonts: ['Orbitron', 'Bebas Neue'] },
        categories: { connect: [{ id: categories[0].id }] },
        collections: { connect: [{ id: collections[0].id }] },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Detroit Skyline Chain',
        slug: 'detroit-skyline-chain',
        description: 'Skyline silhouette chain with enamel fill.',
        basePrice: 32000,
        images: ['https://placehold.co/600x402'],
        options: { colorways: ['Navy', 'Orange'] },
        categories: { connect: [{ id: categories[0].id }] },
        collections: { connect: [{ id: collections[1].id }] },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Hype Wrist Cuff',
        slug: 'hype-wrist-cuff',
        description: 'Adjustable cuff with custom engraving.',
        basePrice: 14000,
        images: ['https://placehold.co/600x403'],
        options: { sizes: ['S', 'M', 'L'] },
        categories: { connect: [{ id: categories[1].id }] },
        collections: { connect: [{ id: collections[0].id }] },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Glow Keychain',
        slug: 'glow-keychain',
        description: 'Mini hype chain for your keys with glow resin.',
        basePrice: 6000,
        images: ['https://placehold.co/600x404'],
        options: { glow: ['blue', 'orange'] },
        categories: { connect: [{ id: categories[2].id }] },
        collections: { connect: [{ id: collections[1].id }] },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Stadium Chain',
        slug: 'stadium-chain',
        description: 'Oversized hype chain designed for game day.',
        basePrice: 42000,
        images: ['https://placehold.co/600x405'],
        options: { attachments: ['foam fingers', 'mini speakers'] },
        categories: { connect: [{ id: categories[0].id }] },
        collections: { connect: [{ id: collections[1].id }] },
      },
    }),
  ]);

  await prisma.page.createMany({
    data: [
      { title: 'About HypeEmUp', slug: 'about', content: '<p>We craft 3D printed hype chains in Detroit.</p>' },
      { title: 'Shipping', slug: 'shipping', content: '<p>Shipping in 7-10 business days.</p>' },
      { title: 'Returns', slug: 'returns', content: '<p>Custom items are final sale.</p>' },
      { title: 'Privacy Policy', slug: 'privacy', content: '<p>We respect your data.</p>' },
      { title: 'Terms of Service', slug: 'terms', content: '<p>Terms apply.</p>' },
    ],
  });

  await prisma.banner.createMany({
    data: [
      {
        title: 'Launch your chain design',
        subtitle: 'Upload artwork or type out your hype mantra to see it in real time.',
        imageUrl: 'https://placehold.co/1200x400',
        ctaLabel: 'Open Builder',
        ctaHref: '/builder',
      },
      {
        title: 'Legends Series drop',
        subtitle: 'Limited-edition chrome finishes inspired by Detroit champions.',
        imageUrl: 'https://placehold.co/1200x401',
        ctaLabel: 'Shop Legends',
        ctaHref: '/collections/legends-series',
      },
    ],
  });

  await prisma.order.create({
    data: {
      userId: customer.id,
      email: customer.email,
      stripeId: 'cs_test_seed',
      items: [{ name: 'Signature Hype Chain', price: 25000, quantity: 1 }],
      subtotal: 25000,
      shipping: 1500,
      tax: 1750,
      total: 28250,
      currency: 'usd',
      status: 'shipped',
      receiptUrl: 'https://stripe.com/receipt/test',
      shipment: {
        create: {
          carrier: 'UPS',
          trackingNumber: '1Z9999999999999999',
          trackingUrl: 'https://ups.com/track?id=1Z9999999999999999',
          status: 'in_transit',
          events: {
            create: [
              { description: 'Label created', occurredAt: new Date(), location: 'Detroit, MI' },
              { description: 'Departed facility', occurredAt: new Date(), location: 'Detroit, MI' },
            ],
          },
        },
      },
    },
  });

  console.log('Seed data created.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

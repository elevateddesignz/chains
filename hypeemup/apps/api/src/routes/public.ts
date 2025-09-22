import { Router } from 'express';
import { z } from 'zod';

import { prisma } from '../lib/prisma';
import { HttpError } from '../lib/errors';

export const publicRouter = Router();

publicRouter.get('/products', async (req, res) => {
  const featured = req.query.featured === 'true';
  const products = await prisma.product.findMany({
    where: featured ? { published: true } : {},
    orderBy: { createdAt: 'desc' },
    take: featured ? 6 : undefined,
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      basePrice: true,
      images: true,
    },
  });
  res.json({ products });
});

publicRouter.get('/products/:slug', async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { slug: req.params.slug },
    include: { categories: true, collections: true },
  });
  if (!product || !product.published) {
    throw new HttpError(404, 'Product not found');
  }
  res.json({ product });
});

publicRouter.get('/collections', async (_req, res) => {
  const collections = await prisma.collection.findMany({
    select: { slug: true, name: true },
    orderBy: { name: 'asc' },
  });
  res.json({ collections });
});

publicRouter.get('/collections/:slug', async (req, res) => {
  const collection = await prisma.collection.findUnique({
    where: { slug: req.params.slug },
    include: {
      products: {
        where: { published: true },
        select: { slug: true, name: true, description: true, basePrice: true, images: true },
      },
    },
  });
  if (!collection) {
    throw new HttpError(404, 'Collection not found');
  }
  res.json({ collection });
});

publicRouter.get('/categories/:slug', async (req, res) => {
  const category = await prisma.category.findUnique({
    where: { slug: req.params.slug },
    include: {
      products: {
        where: { published: true },
        select: { slug: true, name: true, description: true, basePrice: true, images: true },
      },
    },
  });
  if (!category) {
    throw new HttpError(404, 'Category not found');
  }
  res.json({ category });
});

publicRouter.get('/pages/:slug', async (req, res) => {
  const page = await prisma.page.findUnique({ where: { slug: req.params.slug } });
  if (!page || !page.published) {
    throw new HttpError(404, 'Page not found');
  }
  res.json({ page });
});

publicRouter.get('/orders/receipt', async (req, res) => {
  const schema = z.object({ sessionId: z.string() });
  const { sessionId } = schema.parse(req.query);
  const order = await prisma.order.findFirst({ where: { stripeId: sessionId } });
  if (!order) {
    throw new HttpError(404, 'Order not found');
  }
  res.json({ receiptUrl: order.receiptUrl ?? '' });
});

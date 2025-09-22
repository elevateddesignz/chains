import { Router } from 'express';
import { z } from 'zod';

import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/require-auth';

export const cmsRouter = Router();

cmsRouter.use(requireAuth(['admin', 'staff']));

const upsertProductSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  basePrice: z.number(),
  images: z.array(z.string()),
  options: z.record(z.any()),
  published: z.boolean().optional(),
});

cmsRouter.get('/products', async (_req, res) => {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ products });
});

cmsRouter.post('/products', async (req, res) => {
  const payload = upsertProductSchema.parse(req.body);
  const product = await prisma.product.create({ data: payload });
  res.status(201).json({ product });
});

cmsRouter.put('/products/:id', async (req, res) => {
  const payload = upsertProductSchema.partial().parse(req.body);
  const product = await prisma.product.update({ where: { id: req.params.id }, data: payload });
  res.json({ product });
});

cmsRouter.delete('/products/:id', async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

const categorySchema = z.object({ name: z.string(), slug: z.string() });

cmsRouter.get('/categories', async (_req, res) => {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  res.json({ categories });
});

cmsRouter.post('/categories', async (req, res) => {
  const payload = categorySchema.parse(req.body);
  const category = await prisma.category.create({ data: payload });
  res.status(201).json({ category });
});

cmsRouter.put('/categories/:id', async (req, res) => {
  const payload = categorySchema.partial().parse(req.body);
  const category = await prisma.category.update({ where: { id: req.params.id }, data: payload });
  res.json({ category });
});

cmsRouter.delete('/categories/:id', async (req, res) => {
  await prisma.category.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

const collectionSchema = z.object({ name: z.string(), slug: z.string() });

cmsRouter.get('/collections', async (_req, res) => {
  const collections = await prisma.collection.findMany({ orderBy: { name: 'asc' } });
  res.json({ collections });
});

cmsRouter.post('/collections', async (req, res) => {
  const payload = collectionSchema.parse(req.body);
  const collection = await prisma.collection.create({ data: payload });
  res.status(201).json({ collection });
});

cmsRouter.put('/collections/:id', async (req, res) => {
  const payload = collectionSchema.partial().parse(req.body);
  const collection = await prisma.collection.update({ where: { id: req.params.id }, data: payload });
  res.json({ collection });
});

cmsRouter.delete('/collections/:id', async (req, res) => {
  await prisma.collection.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

const pageSchema = z.object({ title: z.string(), slug: z.string(), content: z.string(), published: z.boolean() });

cmsRouter.get('/pages', async (_req, res) => {
  const pages = await prisma.page.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ pages });
});

cmsRouter.post('/pages', async (req, res) => {
  const payload = pageSchema.parse(req.body);
  const page = await prisma.page.create({ data: payload });
  res.status(201).json({ page });
});

cmsRouter.put('/pages/:id', async (req, res) => {
  const payload = pageSchema.partial().parse(req.body);
  const page = await prisma.page.update({ where: { id: req.params.id }, data: payload });
  res.json({ page });
});

cmsRouter.delete('/pages/:id', async (req, res) => {
  await prisma.page.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

cmsRouter.get('/faqs', async (_req, res) => {
  const faqs = await prisma.page.findMany({ where: { slug: { startsWith: 'faq-' } } });
  res.json({ faqs });
});

const bannerSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  imageUrl: z.string().url(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  published: z.boolean().optional(),
});

cmsRouter.get('/banners', async (_req, res) => {
  const banners = await prisma.banner.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ banners });
});

cmsRouter.post('/banners', async (req, res) => {
  const payload = bannerSchema.parse(req.body);
  const banner = await prisma.banner.create({ data: payload });
  res.status(201).json({ banner });
});

cmsRouter.put('/banners/:id', async (req, res) => {
  const payload = bannerSchema.partial().parse(req.body);
  const banner = await prisma.banner.update({ where: { id: req.params.id }, data: payload });
  res.json({ banner });
});

cmsRouter.delete('/banners/:id', async (req, res) => {
  await prisma.banner.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

cmsRouter.get('/media', async (_req, res) => {
  // Media uploads are managed through S3 signed URLs. This endpoint acts as a placeholder for future indexing.
  res.json({ assets: [] });
});

export { cmsRouter };

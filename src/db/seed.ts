import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as seedData from '../lib/content/seed';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set in .env.local');
}

const client = postgres(connectionString, { ssl: 'require' });
const db = drizzle(client, { schema });

async function seed() {
  console.log('Seeding database...');

  // Map to hold old-id -> new-uuid
  const idMap = new Map<string, string>();

  // 1. Roles & Users
  console.log('Inserting users...');
  const adminRoleId = crypto.randomUUID();
  await db.insert(schema.roles).values({
    id: adminRoleId,
    name: 'administrator',
  }).onConflictDoNothing();

  for (const key of Object.keys(seedData.authors)) {
    const author = seedData.authors[key];
    const email = `${author.id}@pti.edu.ng`;
    
    let existingUser = await db.query.users.findFirst({ where: (users, { eq }) => eq(users.email, email) });
    if (!existingUser) {
      const newId = crypto.randomUUID();
      await db.insert(schema.users).values({
        id: newId,
        name: author.name,
        email: email,
        emailVerified: true,
        roleId: adminRoleId,
        jobTitle: author.role,
        bio: author.bio,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      existingUser = { id: newId } as any;
    }
    idMap.set(author.id, existingUser!.id);
  }

  // 2. Categories
  console.log('Inserting categories...');
  for (const cat of seedData.categories) {
    let existingCat = await db.query.categories.findFirst({ where: (categories, { eq }) => eq(categories.slug, cat.slug) });
    if (!existingCat) {
      const newId = crypto.randomUUID();
      await db.insert(schema.categories).values({
        id: newId,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
      });
      existingCat = { id: newId } as any;
    }
    idMap.set(cat.id, existingCat!.id);
  }

  // 3. Departments
  console.log('Inserting departments...');
  for (const dept of seedData.departments) {
    let existingDept = await db.query.departments.findFirst({ where: (departments, { eq }) => eq(departments.slug, dept.slug) });
    if (!existingDept) {
      const newId = crypto.randomUUID();
      await db.insert(schema.departments).values({
        id: newId,
        name: dept.name,
        slug: dept.slug,
        abbreviation: dept.abbreviation,
        description: dept.description,
      });
      existingDept = { id: newId } as any;
    }
    idMap.set(dept.id, existingDept!.id);
  }

  // 4. Articles
  console.log('Inserting articles (skipping tags to keep seed simple)...');
  for (const art of seedData.articles) {
    const departmentId = art.departmentSlug 
      ? seedData.departments.find(d => d.slug === art.departmentSlug)?.id 
      : null;

    const newDeptId = departmentId ? idMap.get(departmentId) : null;
    const authorId = idMap.get(art.author.id);
    const categoryId = idMap.get(art.category.id);
    const newId = crypto.randomUUID();

    if (!authorId || !categoryId) {
       console.log('Skipping article due to missing author/category mapping', art.slug);
       continue;
    }

    await db.insert(schema.articles).values({
      id: newId,
      title: art.title,
      slug: art.slug,
      content: art.content,
      excerpt: art.excerpt,
      authorId: authorId,
      categoryId: categoryId,
      departmentId: newDeptId,
      featuredImage: art.featuredImage,
      isPublished: true,
      isFeatured: art.isFeatured,
      views: art.views,
      readingMinutes: art.readingMinutes,
      publishedAt: new Date(art.publishedAt),
    }).onConflictDoNothing();
  }

  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});

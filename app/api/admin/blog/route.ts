import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { slugify } from "@/lib/utils";

const blogSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().optional(),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(5, "Content is required"),
  coverImage: z.string().optional().nullable(),
  published: z.boolean().default(false),
});

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await db.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = blogSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { title, excerpt, content, coverImage, published } = parsed.data;
    const slug = parsed.data.slug || slugify(title);

    const post = await db.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        published,
        publishedAt: published ? new Date() : null,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  await db.blogPost.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@utsavkc/medium-common";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  try {
    const authHeder = c.req.header("Authorization") || "";
    const user = await verify(authHeder, c.env.JWT_SECRET);
    if (user) {
      c.set("userId", user.id);
      console.log("user exists");

      await next();
    }
  } catch (error) {
    c.status(403);
    return c.json({
      message: "you are not logged in",
    });
  }
});

blogRouter.post("/", async (c) => {
  const body = await c.req.json();
  const { success } = createBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs are not correct",
    });
  }
  const authorId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: authorId,
      },
    });
    return c.json({
      id: blog.id,
    });
  } catch (error) {
    c.status(411);
    c.json({
      message: "Invalid",
    });
  }
});
blogRouter.put("/", async (c) => {
  const body = await c.req.json();

  const { success } = updateBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs are not correct",
    });
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const blog = await prisma.blog.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });
    return c.json({
      id: blog.id,
    });
  } catch (error) {
    c.status(411);
  }
});

blogRouter.get("/bulk", async (c) => {
  console.log("bulk");
  const body = await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const blogs = await prisma.blog.findMany({
      select: {
        content: true,
        title: true,
        id: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    return c.json({
      blogs,
    });
  } catch (error) {
    c.status(411);
    c.json({
      message: "error while fetching all the blog posts",
    });
  }
});

blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.blog.findFirst({
      where: {
        id: Number(id),
      },
    });
    return c.json({
      blog,
    });
  } catch (error) {
    c.status(411);
    return c.json({
      message: "Error while fetching blog post",
    });
  }
});

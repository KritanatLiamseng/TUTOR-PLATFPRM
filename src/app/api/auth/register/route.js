import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const {
      name,
      surname,
      email,
      phone,
      username,
      password,
      role,
      isTutor,
      bio,
      experienceYears,
    } = await request.json();

    const existingUser = await prisma.users.findUnique({
      where: { username },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ error: "ชื่อผู้ใช้นี้มีอยู่แล้ว" }), {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: {
        name,
        surname,
        email,
        phone,
        username,
        password: hashedPassword,
        role,
        status: "Active",
      },
    });

    if (isTutor) {
      await prisma.tutors.create({
        data: {
          user_id: newUser.user_id,
          bio,
          experience_years: experienceYears,
          is_active: true,
        },
      });
    }

    return new Response(JSON.stringify({ success: "User registered successfully" }), {
      status: 201,
    });
  } catch (error) {
    console.error("Server Error:", error);
    return new Response(JSON.stringify({ error: "Server Error" }), {
      status: 500,
    });
  }
}

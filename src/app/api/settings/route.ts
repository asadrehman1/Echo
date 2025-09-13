import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const { name, image } = await req.json();
    if (!currentUser?.email || !currentUser?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const updatedUser = await prisma.user.update({
      where: {
        email: currentUser.email,
      },
      data: {
        name,
        image,
      },
    });
    return NextResponse.json(updatedUser);
  } catch (error: unknown) {
    console.log("ERROR_SETTINGS", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

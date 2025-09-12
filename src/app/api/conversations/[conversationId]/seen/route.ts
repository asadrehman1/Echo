import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

interface IParams {
  conversationId: string;
}

export async function POST(
  req: Request,
  context: { params: Promise<IParams> }
) {
  try {
    const currentUser = await getCurrentUser();
    const { conversationId } = await context.params;

    if (!currentUser?.id || !currentUser?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const lastMessage = conversation.messages[conversation.messages.length - 1];
    if (!lastMessage) return NextResponse.json(conversation);

    const updateMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: {
        user: true,
        seen: true,
      },
    });

    return NextResponse.json(updateMessage);
  } catch (error: unknown) {
    console.log("ERROR_MESSAGE_SEEN", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

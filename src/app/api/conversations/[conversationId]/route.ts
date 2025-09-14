import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

interface IParams {
  conversationId: string;
}
export async function DELETE(
  req: Request,
  context: { params: Promise<IParams> }
) {
  const { conversationId } = await context.params;
  const currentUser = await getCurrentUser();

  if (!currentUser?.id || !currentUser?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!conversationId) {
    return NextResponse.json(
      { error: "Invalid conversation id" },
      { status: 400 }
    );
  }
  try {
    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });
    if (!existingConversation)
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });
    existingConversation.users.forEach((user) => {
      if (user?.email) {
        pusherServer.trigger(user.email!, "conversation:delete", existingConversation);
      }
    });
    return NextResponse.json(deletedConversation);
  } catch (error: unknown) {
    console.error("ERROR_CONVERSATION_DELETE", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

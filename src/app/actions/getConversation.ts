import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversation = async (conversationId: string) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.email) return null;

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    if (!conversation) return null;

    return conversation;
  } catch (error: unknown) {
    console.error(error);
    return null;
  }
};  

export default getConversation;
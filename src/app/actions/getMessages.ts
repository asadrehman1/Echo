import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getMessages = async (conversationId: string) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.email) return [];

    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },
      include: {
        user: true,
        seen: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return messages;
  } catch (error: unknown) {
    console.error(error);
    return [];
  }
};

export default getMessages;
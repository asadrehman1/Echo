"use client";
import useConversation from "@/app/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface ConversationsListProps {
  initialItems: FullConversationType[];
  users: User[];
}

const ConversationsList = ({ users, initialItems }: ConversationsListProps) => {
  const [items, setItems] = useState(initialItems);
  const router = useRouter();
  const session = useSession();
  const { conversationId, isOpen } = useConversation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pusherKey = useMemo(() => {
    return session?.data?.user?.email;
  }, [session?.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) return;
    pusherClient.subscribe(pusherKey);

    const newHandler = (newConversation: FullConversationType) => {
      setItems((current) => {
        // Check if the conversation already exists to avoid duplicates
        if (find(current, { id: newConversation.id })) return current;
        return [newConversation, ...current];
      });
    };

    const updateHandler = (updatedConversation: FullConversationType) => {
      setItems((current) =>
        current.map((c) => {
          if (c.id === updatedConversation.id) {
            return {
              ...c,
              messages: updatedConversation.messages,
            };
          }
          return c;
        })
      );
    };

    const deleteHandler = (deletedConversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter((c) => c.id !== deletedConversation.id)];
      });
      if(deletedConversation.id === conversationId) {
        router.push("/conversations");
      }
    };

    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:delete", deleteHandler);
    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", newHandler);
      pusherClient.unbind("conversation:update", updateHandler);
      pusherClient.unbind("conversation:delete", deleteHandler);
    };
  }, [pusherKey, conversationId, router]);
  return (
    <>
      <GroupChatModal
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <aside
        className={clsx(
          `fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto 
        border-r border-gray-200`,
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-800">Messages</div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="rounded-full text-gray-600 p-2 bg-gray-100 cursor-pointer
                hover:opacity-75 transition"
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>
          {items.map((item) => (
            <ConversationBox
              key={item.id}
              conversation={item}
              selected={item.id === conversationId}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationsList;

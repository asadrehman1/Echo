"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface BodyProps {
  initialMessages: FullMessageType[];
}
interface PusherMessageEvent {
  message: FullMessageType;
}
const Body = ({ initialMessages }: BodyProps) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`, {});
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView({ behavior: "smooth" });

    const messageHandler = (data: PusherMessageEvent) => {
      const message = data.message;
      axios.post(`/api/conversations/${conversationId}/seen`, {});
      setMessages((current) => {
        // Check if the message already exists to avoid duplicates
        if (find(current, { id: message.id })) return current;
        return [...current, message];
      });
      bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
    };

    const updateMessageHandler = (updatedMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((m) => (m.id === updatedMessage.id ? updatedMessage : m))
      );
    };

    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
    };
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages?.map((message, i) => (
        <MessageBox
          key={message?.id || i}
          isLast={i === messages?.length - 1}
          message={message}
        />
      ))}
      <div ref={bottomRef} className="pt-24" />
    </div>
  );
};

export default Body;

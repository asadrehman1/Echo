import { Channel, Members } from "pusher-js";
import useActiveList from "./useActiveList";
import { useEffect, useState } from "react";
import { pusherClient } from "../libs/pusher";

const useActiveChannel = () => {
  const { add, remove, set } = useActiveList();
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  useEffect(() => {
    let channel = activeChannel;
    if (!channel) {
      channel = pusherClient.subscribe("presence-echo");
      setActiveChannel(channel);
    }
    channel.bind("pusher:subscription_succeeded", (members: Members) => {
      const initalMembers: string[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      members.each((member: Record<string, any>) => {
        initalMembers.push(member.id);
      });
      set(initalMembers);
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    channel.bind("pusher:member_added", (member: Record<string, any>) => {
      add(member.id);
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    channel.bind("pusher:member_removed", (member: Record<string, any>) => {
      remove(member.id);
    });
    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe("presence-echo");
        setActiveChannel(null);
      }
    };
  }, [add, remove, set, activeChannel]);
};

export default useActiveChannel;

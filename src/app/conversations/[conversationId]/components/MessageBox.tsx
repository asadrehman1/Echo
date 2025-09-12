import Avatar from "@/app/components/Avatar";
import { FullMessageType } from "@/app/types";
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface MessageBoxProps {
  isLast?: boolean;
  message: FullMessageType;
}
const MessageBox = ({ isLast, message }: MessageBoxProps) => {
  const session = useSession();
  const isOwn = session?.data?.user?.email === message?.user?.email;
  const seenList = (message?.seen || [])
    .filter((user) => user?.email !== message?.user?.email)
    .map((user) => user?.name)
    .join(", ");
  const container = clsx("flex gap-3 p-4", isOwn && "justify-end");

  const avatar = clsx(isOwn && "order-2");

  const body = clsx("flex flex-col gap-2", isOwn && "items-end");

  const msg = clsx(
    "text-sm w-fit overflow-hidden",
    isOwn ? "text-white bg-sky-500" : "bg-gray-100",
    message?.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
  );
  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={message?.user} />
      </div>
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{message?.user?.name}</div>
          <div className="text-xs text-gray-400">
            {format(new Date(message?.createdAt), "p")}
          </div>
        </div>
        <div className={msg}>
          {message?.image ? (
            <Image
              src={message?.image}
              alt="Message"
              height={288}
              width={288}
              className="object-cover cursor-pointer hover:scale-10 transition translate"
            />
          ) : (
            <div className="whitespace-pre-wrap">{message?.body}</div>
          )}
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div className="text-xs font-light text-gray-500">{`Seen by ${seenList}`}</div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;

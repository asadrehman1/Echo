"use client";

import useConversation from "@/app/hooks/useConversation";
import useRoutes from "@/app/hooks/useRoutes";
import clsx from "clsx";
import Link from "next/link";

const MobileFooter = () => {
  const routes = useRoutes();
  const { isOpen } = useConversation();

  if (isOpen) return null;

  return (
    <div
      className="fixed justify-between w-full bottom-0 z-40 flex items-center bg-white
  border-t-[1px] border-gray-200 lg:hidden"
    >
      {routes.map((route) => (
        <Link
          onClick={() => route.onClick?.()}
          href={route.href}
          key={route.label}
          className={clsx(
            `group mt-1 flex gap-x-3 rounded-md p-4 text-sm leading-6 font-semibold justify-center 
            text-gray-500 hover:text-black hover:bg-gray-100 w-full`,
            route.active && "bg-gray-100 text-black"
          )}
        >
          <route.icon
            className={clsx(
              "shrink-0 h-6 w-6",
              route.active
                ? "text-black"
                : "text-gray-500 group-hover:text-black"
            )}
          />
          <span className="sr-only">{route.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default MobileFooter;

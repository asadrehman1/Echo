import clsx from "clsx";
import Link from "next/link";
import { IconType } from "react-icons";

interface DesktopItemProps {
  href: string;
  icon: IconType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const DesktopItem: React.FC<DesktopItemProps> = ({
  href,
  icon: Icon,
  label,
  active,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  return (
    <li onClick={handleClick}>
      <Link
        href={href}
        className={clsx(
          `
          group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-medium 
          text-gray-500 hover:text-black hover:bg-gray-100
          `,
          active && "bg-gray-100 text-black"
        )}
      >
        <Icon
          className={clsx(
            "shrink-0 h-6 w-6",
            active ? "text-black" : "text-gray-500 group-hover:text-black"
          )}
        />
        <span className="sr-only">{label}</span>
      </Link>
    </li>
  );
};

export default DesktopItem;

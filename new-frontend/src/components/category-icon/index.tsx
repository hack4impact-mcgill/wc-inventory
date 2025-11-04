import React from "react";
import { getCategoryIconPath } from "@/lib/iconLoader";

interface CategoryIconProps {
  name?: string | null;
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  name,
  className,
  size = 20,
}) => {
  const path = getCategoryIconPath(name!);

  return (
    <img
      src={path}
      alt={name ?? "icon"}
      className={className}
      width={size}
      height={size}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = "/icons/Box.svg";
      }}
    />
  );
};

import { DynamicIcon } from "lucide-react/dynamic";

import React from "react";

interface LucideIconProps {
  icon: string;
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const LucideIcon: React.FC<LucideIconProps> = ({
  icon,
  size = 24,
  style,
  className,
  color,
  strokeWidth = 1.5,
  absoluteStrokeWidth,
}) => {
  return (
    <DynamicIcon
      name={icon}
      size={size}
      style={style}
      className={className}
      color={color}
      strokeWidth={strokeWidth}
      absoluteStrokeWidth={absoluteStrokeWidth}
    />
  );
};

export default LucideIcon;

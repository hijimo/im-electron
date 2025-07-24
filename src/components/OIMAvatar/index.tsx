import * as React from "react";
import { useMemo } from "react";
import { Avatar as AntdAvatar, AvatarProps } from "antd";
import clsx from "clsx";
import LucideIcon from "@/components/LucideIcon";
import default_group from "@/assets/images/contact/group.png";
import { avatarList, getDefaultAvatar } from "@/utils/avatar";

const default_avatars = avatarList.map((item) => item.name);

interface IOIMAvatarProps extends AvatarProps {
  text?: string;
  color?: string;
  bgColor?: string;
  isgroup?: boolean;
  isnotification?: boolean;
  size?: number;
}

const OIMAvatar: React.FC<IOIMAvatarProps> = (props) => {
  const {
    src,
    text,
    size = 42,
    color = "#fff",
    bgColor = "var(--color-primary)",
    isgroup = false,
    isnotification,
  } = props;
  const [errorHolder, setErrorHolder] = React.useState<string>();

  const getAvatarUrl = useMemo(() => {
    if (src) {
      if (default_avatars.includes(src as string))
        return getDefaultAvatar(src as string);

      return src;
    }
    // 群组默认头像不再返回图片
    return undefined;
  }, [src, isgroup, isnotification]);

  const avatarProps = { ...props, isgroup: undefined, isnotification: undefined };

  React.useEffect(() => {
    if (!isgroup) {
      setErrorHolder(undefined);
    }
  }, [isgroup]);

  const errorHandler = () => {
    if (isgroup) {
      setErrorHolder(undefined); // 不再设置为图片
    }
  };

  return (
    <AntdAvatar
      style={{
        backgroundColor: bgColor,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        lineHeight: `${size - 2}px`,
        color,
      }}
      shape="square"
      {...avatarProps}
      className={clsx(
        {
          "cursor-pointer": Boolean(props.onClick),
        },
        props.className,
      )}
      src={errorHolder ?? getAvatarUrl}
      onError={errorHandler as any}
    >
      {/* 如果是群组且没有头像，则显示LucideIcon */}
      {!src && isgroup ? (
        <div
          style={{
            width: size,
            height: size,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LucideIcon icon="users" size={size * 0.7} color={color} />
        </div>
      ) : (
        text
      )}
    </AntdAvatar>
  );
};

export default OIMAvatar;

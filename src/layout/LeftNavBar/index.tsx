import React, { memo, useRef, useState } from "react";
import { Badge, Divider, Layout, Popover, Upload, List, Button } from "antd";
import clsx from "clsx";
import i18n, { t } from "i18next";
import ImageResizer from "react-image-file-resizer";
import { UNSAFE_NavigationContext, useResolvedPath } from "react-router-dom";

import { modal } from "@/AntdGlobalComp";
import { updateBusinessUserInfo } from "@/api/login";
import OIMAvatar from "@/components/OIMAvatar";
import LucideIcon from "@/components/LucideIcon";
import { useContactStore, useConversationStore, useUserStore } from "@/store";
import { feedbackToast } from "@/utils/common";
import { emit } from "@/utils/events";
import { uploadFile } from "@/utils/imCommon";

import { OverlayVisibleHandle } from "../../hooks/useOverlayVisible";
import About from "./About";
import styles from "./left-nav-bar.module.scss";
import PersonalSettings from "./PersonalSettings";

const { Sider } = Layout;

const NavList = [
  {
    icon: "messages-square",
    title: t("placeholder.chat"),
    path: "/chat",
  },
  {
    icon: "contact",
    title: t("placeholder.contact"),
    path: "/contact",
  },
];

i18n.on("languageChanged", () => {
  NavList[0].title = t("placeholder.chat");
  NavList[1].title = t("placeholder.contact");
});

const resizeFile = (file: File): Promise<File> =>
  new Promise((resolve) => {
    ImageResizer.imageFileResizer(
      file,
      400,
      400,
      "webp",
      90,
      0,
      (uri) => {
        resolve(uri as File);
      },
      "file",
    );
  });

type NavItemType = (typeof NavList)[0];

const NavItem = ({ nav: { icon, title, path } }: { nav: NavItemType }) => {
  const resolvedPath = useResolvedPath(path);
  const { navigator } = React.useContext(UNSAFE_NavigationContext);
  const toPathname = navigator.encodeLocation
    ? navigator.encodeLocation(path).pathname
    : resolvedPath.pathname;
  const locationPathname = location.pathname;
  const isActive =
    locationPathname === toPathname ||
    (locationPathname.startsWith(toPathname) &&
      locationPathname.charAt(toPathname.length) === "/") ||
    location.hash.startsWith(`#${toPathname}`);

  const [showConversationMenu, setShowConversationMenu] = useState(false);

  const unReadCount = useConversationStore((state) => state.unReadCount);
  const unHandleFriendApplicationCount = useContactStore(
    (state) => state.unHandleFriendApplicationCount,
  );
  const unHandleGroupApplicationCount = useContactStore(
    (state) => state.unHandleGroupApplicationCount,
  );

  const tryNavigate = () => {
    if (isActive) {
      return;
    }

    // TODO Keep answering when jumping back to chat from another page (if there is one)
    navigator.push(path);
  };

  const closeConversationMenu = () => {
    setShowConversationMenu(false);
  };

  const getBadge = () => {
    if (path === "/chat") {
      return unReadCount;
    }
    if (path === "/contact") {
      return unHandleFriendApplicationCount + unHandleGroupApplicationCount;
    }
    return 0;
  };

  return (
    <Badge size="small" count={getBadge()}>
      <div
        className={clsx(
          "mb-3 flex h-[52px] w-12 cursor-pointer flex-col items-center justify-center rounded-md",
          { "bg-[#e9e9eb]": isActive },
        )}
        onClick={tryNavigate}
      >
        <LucideIcon
          icon={icon}
          size={24}
          color={isActive ? "var(--color-primary)" : undefined}
        />
        <div className="mt-1 text-xs text-gray-500">{title}</div>
      </div>
    </Badge>
  );
};

const profileMenuList = [
  {
    title: t("placeholder.myInfo"),
    gap: true,
    idx: 0,
  },
  {
    title: t("placeholder.accountSetting"),
    gap: true,
    idx: 1,
  },
  // {
  //   title: t("placeholder.about"),
  //   gap: false,
  //   idx: 2,
  // },
  {
    title: t("placeholder.logOut"),
    gap: false,
    idx: 3,
  },
];

i18n.on("languageChanged", () => {
  profileMenuList[0].title = t("placeholder.myInfo");
  profileMenuList[1].title = t("placeholder.accountSetting");
  profileMenuList[2].title = t("placeholder.about");
  profileMenuList[3].title = t("placeholder.logOut");
});

const LeftNavBar = memo(() => {
  const aboutRef = useRef<OverlayVisibleHandle>(null);
  const personalSettingsRef = useRef<OverlayVisibleHandle>(null);
  const [showProfile, setShowProfile] = useState(false);
  const selfInfo = useUserStore((state) => state.selfInfo);
  const userLogout = useUserStore((state) => state.userLogout);
  const updateSelfInfo = useUserStore((state) => state.updateSelfInfo);

  const profileMenuClick = (idx: number) => {
    switch (idx) {
      case 0:
        emit("OPEN_USER_CARD", {
          isSelf: true,
          userID: useUserStore.getState().selfInfo.userID,
        });
        break;
      case 1:
        personalSettingsRef.current?.openOverlay();
        break;
      case 2:
        aboutRef.current?.openOverlay();
        break;
      case 3:
        tryLogout();
        break;
      default:
        break;
    }
    setShowProfile(false);
  };

  const tryLogout = () => {
    modal.confirm({
      title: t("placeholder.logOut"),
      content: t("toast.confirmlogOut"),
      onOk: async () => {
        try {
          await userLogout();
        } catch (error) {
          feedbackToast({ error });
        }
      },
    });
  };

  const customUpload = async ({ file }: { file: File }) => {
    const resizedFile = await resizeFile(file);
    const filePath = await window.electronAPI?.saveFileToDisk({
      sync: true,
      file,
    });

    try {
      const {
        data: { url },
      } = await uploadFile(resizedFile, filePath);
      const newInfo = {
        faceURL: url,
      };
      await updateBusinessUserInfo(newInfo);
      updateSelfInfo(newInfo);
    } catch (error) {
      feedbackToast({ error: t("toast.updateAvatarFailed") });
    }
  };

  const ProfileContent = (
    <div className="w-60 px-2.5 pb-3 pt-5.5">
      <div className="mb-4.5 ml-3 flex items-center">
        <Upload
          accept=".jpeg,.png,.webp"
          showUploadList={false}
          customRequest={customUpload as any}
        >
          <div className={styles["avatar-wrapper"]}>
            <OIMAvatar src={selfInfo.faceURL} text={selfInfo.nickname} />
            <div className={styles["mask"]}>
              <LucideIcon icon="camera" size={19} />
            </div>
          </div>
        </Upload>
        <div className="flex-1 overflow-hidden">
          <div className="mb-1 truncate text-base font-medium">{selfInfo.nickname}</div>
        </div>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={profileMenuList}
        renderItem={(menu, idx) => (
          <List.Item
            key={idx}
            onClick={() => profileMenuClick(menu.idx)}
            className={
              "flex cursor-pointer items-center justify-between rounded-md hover:bg-[var(--primary-active)]"
            }
          >
            {menu.idx === 3 ? (
              <Button size="small" type="text" className="w-full py-0" danger>
                {menu.title}
              </Button>
            ) : (
              <>
                <div className="pl-3">{menu.title}</div>
                <LucideIcon icon="chevron-right" className="text-gray-300" size={22} />
              </>
            )}
          </List.Item>
        )}
      />
    </div>
  );

  return (
    <Sider
      className="no-mobile border-r border-gray-200 !bg-[#F4F4F4] dark:border-gray-800 dark:!bg-[#141414]"
      width={70}
      theme="light"
    >
      <div className="mt-6 flex flex-col items-center">
        <Popover
          content={ProfileContent}
          trigger="click"
          placement="rightBottom"
          overlayClassName="profile-popover"
          title={null}
          arrow={false}
          open={showProfile}
          onOpenChange={(vis) => setShowProfile(vis)}
        >
          <OIMAvatar
            className="mb-6 cursor-pointer"
            src={selfInfo.faceURL}
            text={selfInfo.nickname}
          />
        </Popover>

        {NavList.map((nav) => (
          <NavItem nav={nav} key={nav.path} />
        ))}
      </div>
      <PersonalSettings ref={personalSettingsRef} />
      <About ref={aboutRef} />
    </Sider>
  );
});

export default LeftNavBar;

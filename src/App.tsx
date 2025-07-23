import { App as AntdApp, ConfigProvider, theme } from "antd";
import useTheme, { ThemeProvider } from "@/hooks/useTheme";
import enUS from "antd/locale/en_US";
import zhCN from "antd/locale/zh_CN";
import { Suspense, useEffect } from "react";
import { getThemeConfig } from "@/theme";
import { updateThemeCssVariables } from "@/theme/tailwind-bridge";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { RouterProvider } from "react-router-dom";

import AntdGlobalComp from "./AntdGlobalComp";
import router from "./routes";
import { useUserStore } from "./store";

function App() {
  const locale = useUserStore((state) => state.appSettings.locale);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
  const { themeMode, colorName } = useTheme();
  useEffect(() => {
    updateThemeCssVariables(themeMode, colorName);
  }, [themeMode, colorName]);

  return (
    <ThemeProvider>
    <ConfigProvider
      autoInsertSpaceInButton={false}
      locale={locale === "zh-CN" ? zhCN : enUS}
      theme={getThemeConfig(themeMode, colorName)}
    >
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div>loading...</div>}>
          <AntdApp>
            <AntdGlobalComp />
            <RouterProvider router={router} />
          </AntdApp>
        </Suspense>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ConfigProvider>
    </ThemeProvider>
  );
}

export default App;

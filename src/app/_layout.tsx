import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SplashScreen } from "expo-router";
import { RecoilRoot } from "recoil";
import InitApp from "../components/molecules/InitApp";
import MainTabs from "../components/organisms/MainTabs";

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <RecoilRoot>
     <QueryClientProvider client={queryClient}>
        <InitApp>
          <MainTabs />
        </InitApp>
      </QueryClientProvider>
    </RecoilRoot>
  );
}

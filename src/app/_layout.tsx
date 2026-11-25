import "@/global.css";
import { queryClient } from "@/lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Home",
          }}
        />
        <Stack.Screen
          name="details"
          options={{
            title: "Details",
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
};

export default RootLayout;

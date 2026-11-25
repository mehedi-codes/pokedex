import type { ReactNode } from "react";
import { View } from "react-native";

export const CenteredMessage = ({ children }: { children: ReactNode }) => (
    <View className="flex-1 items-center justify-center gap-3 bg-white p-6">
        {children}
    </View>
);

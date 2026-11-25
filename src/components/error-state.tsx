import { Pressable, Text } from "react-native";

import { CenteredMessage } from "@/components/centered-message";

type Props = {
    title: string;
    message: string;
    onRetry: () => void;
};

export const ErrorState = ({ title, message, onRetry }: Props) => (
    <CenteredMessage>
        <Text className="text-center text-xl font-bold">{title}</Text>
        <Text className="text-center text-base text-gray-500" selectable>
            {message}
        </Text>
        <Pressable
            accessibilityRole="button"
            accessibilityLabel="Try loading again"
            onPress={onRetry}
            className="mt-1 rounded-full bg-[#208AEF] px-5 py-2.5 active:opacity-70"
        >
            <Text className="text-base font-semibold text-white">Try again</Text>
        </Pressable>
    </CenteredMessage>
);

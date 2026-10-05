import { ActivityIndicator, Text } from 'react-native';

export const Loader = () => <ActivityIndicator className="flex-1" />;

export const Notice = ({ text }: { text: string }) => (
  <Text className="mt-20 text-center text-gray-500">{text}</Text>
);

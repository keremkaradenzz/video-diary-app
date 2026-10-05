import { Text } from 'react-native';

export function Notice({ text }: { text: string }) {
  return <Text className="mt-20 text-center text-gray-500">{text}</Text>;
}

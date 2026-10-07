import { Text } from 'react-native';

export function Notice({ text }: { text: string }) {
  return <Text className={styles.text}>{text}</Text>;
}

const styles = {
  text: 'mt-20 text-center text-gray-500',
};

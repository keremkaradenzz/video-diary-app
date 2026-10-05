import { Text } from 'react-native';

import { styles } from './notice.styles';

export function Notice({ text }: { text: string }) {
  return <Text className={styles.text}>{text}</Text>;
}

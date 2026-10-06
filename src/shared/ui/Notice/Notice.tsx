import { Text } from 'react-native';

import { styles } from './Notice.styles';

export function Notice({ text }: { text: string }) {
  return <Text className={styles.text}>{text}</Text>;
}

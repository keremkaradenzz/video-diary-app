import { ActivityIndicator } from 'react-native';

import { styles } from './loader.styles';

export function Loader() {
  return <ActivityIndicator className={styles.container} />;
}

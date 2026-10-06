import { ActivityIndicator } from 'react-native';

import { styles } from './Loader.styles';

export function Loader() {
  return <ActivityIndicator className={styles.container} />;
}

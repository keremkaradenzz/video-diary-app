import { ActivityIndicator } from 'react-native';

export function Loader() {
  return <ActivityIndicator className={styles.container} />;
}

const styles = {
  container: 'flex-1',
};

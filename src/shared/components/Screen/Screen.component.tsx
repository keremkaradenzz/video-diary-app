import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { styles } from './screen.styles';

type Edge = 'top' | 'bottom';

type Props = {
  children: ReactNode;
  /** Extra NativeWind classes for the container. */
  className?: string;
  /** Sides that get safe-area padding. Both by default. */
  edges?: Edge[];
};

/**
 * The only place that applies safe-area padding to a screen.
 * It reads the insets of the root SafeAreaProvider (stable, device-level values) instead of using
 * the native `SafeAreaView`, which measures itself per view and can report a zero top inset after
 * a full-screen modal is dismissed, leaving the screen shifted under the status bar.
 */
export function Screen({ children, className, edges = ['top', 'bottom'] }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className={className ? `${styles.container} ${className}` : styles.container}
      style={{
        paddingTop: edges.includes('top') ? insets.top : 0,
        paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
      }}
    >
      {children}
    </View>
  );
}

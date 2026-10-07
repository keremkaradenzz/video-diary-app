import { useLocalSearchParams } from 'expo-router';

import { EditVideo } from '@/screens/edit-video';

export default function EditVideoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <EditVideo id={Number(id)} />;
}

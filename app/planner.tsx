import { Stack } from 'expo-router';

import { PlannerContent } from '@/components/PlannerContent';

export default function PlannerScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <PlannerContent />
    </>
  );
}

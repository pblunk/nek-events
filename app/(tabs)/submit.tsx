import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/Colors';

export default function SubmitEventScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Submit Event</Text>
      <Text style={styles.body}>A simple submission form will live here in a later step.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.cream,
    padding: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  title: {
    color: theme.colors.slate,
    fontSize: 32,
    fontWeight: '800',
  },
  body: {
    color: theme.colors.muted,
    fontSize: 16,
    lineHeight: 22,
    marginTop: theme.spacing.sm,
  },
});

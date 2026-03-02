// Source: design.md screen: S002 -- Detail + Start CTA
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DialoguePreview } from '../components/DialoguePreview';
import { scenarioService } from '../services/scenarioService';
import { ScenarioDetail } from '../../../types/api';

interface Props {
  route: { params: { scenarioId: string } };
  navigation: any;
}

export function ScenarioDetailScreen({ route, navigation }: Props) {
  const { scenarioId } = route.params;
  const [scenario, setScenario] = useState<ScenarioDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    // TODO: Fetch scenario detail
    scenarioService
      .getScenarioDetail(scenarioId)
      .then(setScenario)
      .finally(() => setIsLoading(false));
  }, [scenarioId]);

  const handleStart = async () => {
    setIsStarting(true);
    try {
      // TODO: POST /api/v1/conversations { scenario_id }
      // On 429 -> open Paywall modal
      // On success -> navigate to Conversation screen
    } catch (err: any) {
      if (err?.response?.status === 429) {
        // TODO: Open Paywall modal
      }
    } finally {
      setIsStarting(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={styles.loader} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{scenario?.title ?? 'Scenario'}</Text>
        <Text style={styles.difficulty}>{scenario?.difficulty ?? ''}</Text>
        <Text style={styles.description}>{scenario?.description ?? ''}</Text>
        <DialoguePreview nodes={scenario?.dialogue_nodes ?? []} />
      </ScrollView>
      <TouchableOpacity
        style={[styles.cta, isStarting && styles.ctaDisabled]}
        onPress={handleStart}
        disabled={isStarting}
      >
        <Text style={styles.ctaText}>
          {isStarting ? 'Starting...' : 'Start Practice'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loader: { marginTop: 48 },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  difficulty: { fontSize: 14, color: '#6B7280', marginBottom: 16 },
  description: { fontSize: 16, lineHeight: 24, color: '#374151', marginBottom: 24 },
  cta: {
    backgroundColor: '#4F46E5',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  ctaDisabled: { opacity: 0.6 },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default ScenarioDetailScreen;

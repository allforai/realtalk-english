// Source: design.md screen: S004 -- Score + grammar + suggestions
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScoreBar } from '../components/ScoreBar';
import { conversationService } from '../services/conversationService';
import { ConversationReport } from '../../../types/api';

interface Props {
  route: { params: { conversationId: string } };
  navigation: any;
}

export function ConversationReportScreen({ route, navigation }: Props) {
  const { conversationId } = route.params;
  const [report, setReport] = useState<ConversationReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    conversationService
      .getReport(conversationId)
      .then(setReport)
      .catch(() => {
        // TODO: Show cached report or fallback UI
      })
      .finally(() => setIsLoading(false));
  }, [conversationId]);

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
        <Text style={styles.title}>Conversation Report</Text>

        {/* Overall Score */}
        <View style={styles.scoreSection}>
          <Text style={styles.overallScore}>
            {report?.overall_score ?? '--'}
          </Text>
          <Text style={styles.scoreLabel}>Overall Score</Text>
        </View>

        {/* Score Breakdown */}
        <ScoreBar label="Grammar" score={0} />
        <ScoreBar label="Expression" score={0} />
        <ScoreBar label="Pronunciation" score={0} />

        {/* Grammar Errors */}
        <Text style={styles.sectionTitle}>Grammar Errors</Text>
        {report?.grammar_errors?.map((err, idx) => (
          <View key={idx} style={styles.errorItem}>
            <Text style={styles.errorOriginal}>{err.original}</Text>
            <Text style={styles.errorCorrection}>{err.correction}</Text>
            <Text style={styles.errorExplanation}>{err.explanation}</Text>
          </View>
        )) ?? <Text style={styles.emptyText}>No grammar errors found</Text>}

        {/* Expression Suggestions */}
        <Text style={styles.sectionTitle}>Expression Suggestions</Text>
        {report?.expression_suggestions?.map((sug, idx) => (
          <View key={idx} style={styles.errorItem}>
            <Text style={styles.errorOriginal}>{sug.original}</Text>
            <Text style={styles.errorCorrection}>{sug.suggested}</Text>
            <Text style={styles.errorExplanation}>{sug.reason}</Text>
          </View>
        )) ?? <Text style={styles.emptyText}>No suggestions</Text>}

        {/* Basic Stats */}
        <View style={styles.stats}>
          <Text style={styles.stat}>Duration: {report?.duration_seconds ?? 0}s</Text>
          <Text style={styles.stat}>Messages: {report?.message_count ?? 0}</Text>
          <Text style={styles.stat}>Words: {report?.word_count ?? 0}</Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Practice Again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.buttonText, styles.secondaryText]}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loader: { marginTop: 48 },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  scoreSection: { alignItems: 'center', marginBottom: 32 },
  overallScore: { fontSize: 56, fontWeight: 'bold', color: '#4F46E5' },
  scoreLabel: { fontSize: 14, color: '#6B7280' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 24, marginBottom: 12 },
  errorItem: { backgroundColor: '#F9FAFB', padding: 12, borderRadius: 8, marginBottom: 8 },
  errorOriginal: { fontSize: 14, color: '#EF4444', textDecorationLine: 'line-through' },
  errorCorrection: { fontSize: 14, color: '#10B981', marginTop: 4 },
  errorExplanation: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  emptyText: { color: '#9CA3AF', fontSize: 14 },
  stats: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 24, marginBottom: 24 },
  stat: { fontSize: 14, color: '#6B7280' },
  button: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButton: { backgroundColor: '#F3F4F6' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  secondaryText: { color: '#374151' },
});

export default ConversationReportScreen;

// Source: design.md screen: S002 -- Chat preview (first 3 dialogue nodes)
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DialogueNode {
  role: string;
  content: string;
}

interface Props {
  nodes: DialogueNode[];
}

export function DialoguePreview({ nodes }: Props) {
  const previewNodes = nodes.slice(0, 3);

  if (previewNodes.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dialogue Preview</Text>
      {previewNodes.map((node, idx) => (
        <View key={idx} style={styles.node}>
          <Text style={styles.role}>{node.role}</Text>
          <Text style={styles.content}>{node.content}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 16 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  node: { marginBottom: 12, paddingLeft: 12, borderLeftWidth: 2, borderLeftColor: '#E5E7EB' },
  role: { fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 2, textTransform: 'capitalize' },
  content: { fontSize: 14, color: '#374151', lineHeight: 20 },
});

export default DialoguePreview;

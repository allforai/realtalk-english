// Source: design.md screen: S003 -- Press-to-record mic button
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
  onPress: () => void;
  isRecording: boolean;
  disabled: boolean;
}

export function MicrophoneButton({ onPress, isRecording, disabled }: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isRecording && styles.recording,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.icon}>{isRecording ? '||' : 'Mic'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  recording: { backgroundColor: '#FEE2E2' },
  disabled: { opacity: 0.4 },
  icon: { fontSize: 14, fontWeight: '600', color: '#4F46E5' },
});

export default MicrophoneButton;

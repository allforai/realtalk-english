// Source: design.md Section 8.2 -- Audio recording hook
import { useState, useCallback, useRef } from 'react';
import { AudioService } from '../../../services/audioService';

interface UseAudioRecorderReturn {
  isRecording: boolean;
  hasPermission: boolean | null;
  startRecording: () => Promise<boolean>;
  stopRecording: () => Promise<string | null>;
}

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const audioService = useRef(new AudioService()).current;

  const checkPermission = useCallback(async () => {
    const granted = await audioService.requestPermission();
    setHasPermission(granted);
    return granted;
  }, [audioService]);

  const startRecording = useCallback(async () => {
    if (!hasPermission) {
      const granted = await checkPermission();
      if (!granted) return false;
    }
    await audioService.startRecording();
    setIsRecording(true);
    return true;
  }, [hasPermission, checkPermission, audioService]);

  const stopRecording = useCallback(async () => {
    setIsRecording(false);
    return audioService.stopRecording();
  }, [audioService]);

  return { isRecording, hasPermission, startRecording, stopRecording };
}

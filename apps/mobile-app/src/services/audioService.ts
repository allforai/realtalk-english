// Source: design.md Section 8.1 -- expo-av recording wrapper
import { Audio } from 'expo-av';
import { apiClient } from './apiClient';

/**
 * AudioService wraps expo-av for recording and uploading audio.
 *
 * Usage:
 *   const audio = new AudioService();
 *   await audio.requestPermission();
 *   await audio.startRecording();
 *   const uri = await audio.stopRecording();
 *   await audio.uploadAudio(conversationId, uri);
 */
export class AudioService {
  private recording: Audio.Recording | null = null;

  /**
   * Request microphone permission.
   * @returns true if granted
   */
  async requestPermission(): Promise<boolean> {
    const { granted } = await Audio.requestPermissionsAsync();
    return granted;
  }

  /**
   * Start audio recording with high quality preset.
   * Sets audio mode for iOS compatibility.
   */
  async startRecording(): Promise<void> {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY,
    );
    this.recording = recording;
  }

  /**
   * Stop recording and return the local file URI.
   * @returns Local file URI of the recording, or null if no recording active
   */
  async stopRecording(): Promise<string | null> {
    if (!this.recording) return null;
    await this.recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    const uri = this.recording.getURI();
    this.recording = null;
    return uri;
  }

  /**
   * Upload recorded audio to the backend.
   * The backend processes STT + pronunciation + AI response via SSE.
   *
   * @param conversationId - Active conversation ID
   * @param audioUri       - Local file URI from stopRecording()
   */
  async uploadAudio(conversationId: string, audioUri: string): Promise<void> {
    const formData = new FormData();
    formData.append('audio', {
      uri: audioUri,
      type: 'audio/wav',
      name: 'recording.wav',
    } as any);

    // This triggers SSE response -- handled by sseClient
    await apiClient.post(
      `/conversations/${conversationId}/messages/audio`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
  }
}

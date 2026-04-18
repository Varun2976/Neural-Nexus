/**
 * Audio encoding utilities for voice enrollment
 */

export async function getAudioStream() {
  return navigator.mediaDevices.getUserMedia({ audio: true });
}

export function encodeAudioBuffer(buffer, sampleRate = 16000) {
  // TODO: Implement PCM / WAV encoding
  return new Uint8Array(buffer);
}

export function createAudioContext(sampleRate = 16000) {
  return new (window.AudioContext || window.webkitAudioContext)({ sampleRate });
}

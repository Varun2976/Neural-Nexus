import React, { useState } from 'react';

const VoiceEnroll = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  const handleRecord = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording and enrollment
  };

  return (
    <div className="voice-enroll">
      <h2>Voice Enrollment</h2>
      <p>Enroll your voice for biometric authentication.</p>
      {enrolled ? (
        <div className="voice-enroll__success">✅ Voice enrolled successfully</div>
      ) : (
        <button
          className={`voice-enroll__btn ${isRecording ? 'voice-enroll__btn--recording' : ''}`}
          onClick={handleRecord}
        >
          {isRecording ? '⏹ Stop Recording' : '🎙 Start Recording'}
        </button>
      )}
    </div>
  );
};

export default VoiceEnroll;

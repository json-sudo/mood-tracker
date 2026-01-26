import { useState } from 'react';
import type { MoodLevel, MoodEntryCreate } from '../../types';
import { getMoodIcon, getMoodLabel } from '../../utils';
import { entriesApi } from '../../services/api';
import styles from './MoodLoggerModal.module.scss';

interface MoodLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = 1 | 2 | 3 | 4;

const MOOD_OPTIONS: MoodLevel[] = [2, 1, 0, -1, -2];

const FEELING_OPTIONS = [
  'Joyful', 'Down', 'Anxious', 'Calm',
  'Excited', 'Frustrated', 'Lonely',
  'Grateful', 'Overwhelmed', 'Motivated',
  'Irritable', 'Peaceful', 'Tired', 'Hopeful',
  'Confident', 'Stressed', 'Content',
  'Disappointed', 'Optimistic', 'Restless',
];

const SLEEP_OPTIONS = [
  { value: 9, label: '9+ hours' },
  { value: 7.5, label: '7-8 hours' },
  { value: 5.5, label: '5-6 hours' },
  { value: 3.5, label: '3-4 hours' },
  { value: 1, label: '0-2 hours' },
];

const MAX_REFLECTION_LENGTH = 500;
const MAX_FEELINGS = 3;

export function MoodLoggerModal({ isOpen, onClose, onSuccess }: MoodLoggerModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [mood, setMood] = useState<MoodLevel | null>(null);
  const [feelings, setFeelings] = useState<string[]>([]);
  const [reflection, setReflection] = useState('');
  const [sleepHours, setSleepHours] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setStep(1);
    setMood(null);
    setFeelings([]);
    setReflection('');
    setSleepHours(null);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFeelingToggle = (feeling: string) => {
    if (feelings.includes(feeling)) {
      setFeelings(feelings.filter((f) => f !== feeling));
    } else if (feelings.length < MAX_FEELINGS) {
      setFeelings([...feelings, feeling]);
    }
  };

  const handleContinue = () => {
    if (step < 4) {
      setStep((step + 1) as Step);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
    }
  };

  const handleSubmit = async () => {
    if (mood === null || sleepHours === null) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const entry: MoodEntryCreate = {
        mood,
        feelings,
        reflection: reflection.trim() || undefined,
        sleep_hours: sleepHours,
      };

      await entriesApi.createEntry(entry);
      resetForm();
      onSuccess();
    } catch (err) {
      setError('Failed to save your mood. Please try again.');
      console.error('Failed to create entry:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canContinue = () => {
    switch (step) {
      case 1:
        return mood !== null;
      case 2:
        return true;
      case 3:
        return true;
      case 4:
        return sleepHours !== null;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Log your mood</h2>
          <button className={styles.closeButton} onClick={handleClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <div className={styles.content}>
          {step === 1 && (
            <StepMood 
              selectedMood={mood} 
              onSelect={setMood} 
            />
          )}

          {step === 2 && (
            <StepFeelings
              selectedFeelings={feelings}
              onToggle={handleFeelingToggle}
              maxFeelings={MAX_FEELINGS}
            />
          )}

          {step === 3 && (
            <StepReflection
              reflection={reflection}
              onChange={setReflection}
              maxLength={MAX_REFLECTION_LENGTH}
            />
          )}

          {step === 4 && (
            <StepSleep
              selectedSleep={sleepHours}
              onSelect={setSleepHours}
            />
          )}

          {error && <p className={styles.error}>{error}</p>}
        </div>

        <div className={styles.footer}>
          {step > 1 && (
            <button 
              className={styles.backButton} 
              onClick={handleBack}
              disabled={isSubmitting}
            >
              Back
            </button>
          )}
          
          {step < 4 ? (
            <button
              className={styles.continueButton}
              onClick={handleContinue}
              disabled={!canContinue()}
            >
              Continue
            </button>
          ) : (
            <button
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={!canContinue() || isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Submit'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface StepMoodProps {
  selectedMood: MoodLevel | null;
  onSelect: (mood: MoodLevel) => void;
}

function StepMood({ selectedMood, onSelect }: StepMoodProps) {
  return (
    <div className={styles.stepContent}>
      <h3 className={styles.question}>How was your mood today?</h3>
      <div className={styles.moodOptions}>
        {MOOD_OPTIONS.map((mood) => (
          <label 
            key={mood} 
            className={`${styles.moodOption} ${selectedMood === mood ? styles.selected : ''}`}
          >
            <input
              type="radio"
              name="mood"
              value={mood}
              checked={selectedMood === mood}
              onChange={() => onSelect(mood)}
              className={styles.radioInput}
            />
            <span className={styles.moodLabel}>{getMoodLabel(mood)}</span>
            <img 
              src={getMoodIcon(mood)} 
              alt={getMoodLabel(mood)}
              className={styles.moodIcon}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

interface StepFeelingsProps {
  selectedFeelings: string[];
  onToggle: (feeling: string) => void;
  maxFeelings: number;
}

function StepFeelings({ selectedFeelings, onToggle, maxFeelings }: StepFeelingsProps) {
  return (
    <div className={styles.stepContent}>
      <h3 className={styles.question}>How did you feel?</h3>
      <p className={styles.subtitle}>Select up to {maxFeelings} tags:</p>
      <div className={styles.feelingTags}>
        {FEELING_OPTIONS.map((feeling) => {
          const isSelected = selectedFeelings.includes(feeling);
          const isDisabled = !isSelected && selectedFeelings.length >= maxFeelings;
          
          return (
            <button
              key={feeling}
              type="button"
              className={`${styles.feelingTag} ${isSelected ? styles.selected : ''}`}
              onClick={() => onToggle(feeling)}
              disabled={isDisabled}
            >
              {feeling}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface StepReflectionProps {
  reflection: string;
  onChange: (value: string) => void;
  maxLength: number;
}

function StepReflection({ reflection, onChange, maxLength }: StepReflectionProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      onChange(value);
    }
  };

  return (
    <div className={styles.stepContent}>
      <h3 className={styles.question}>Write about your day...</h3>
      <textarea
        className={styles.reflectionInput}
        placeholder="Today, I felt..."
        value={reflection}
        onChange={handleChange}
        rows={5}
      />
      <span className={styles.charCount}>
        {reflection.length}/{maxLength}
      </span>
    </div>
  );
}

interface StepSleepProps {
  selectedSleep: number | null;
  onSelect: (hours: number) => void;
}

function StepSleep({ selectedSleep, onSelect }: StepSleepProps) {
  return (
    <div className={styles.stepContent}>
      <h3 className={styles.question}>How many hours did you sleep last night?</h3>
      <div className={styles.sleepOptions}>
        {SLEEP_OPTIONS.map((option) => (
          <label 
            key={option.value} 
            className={`${styles.sleepOption} ${selectedSleep === option.value ? styles.selected : ''}`}
          >
            <input
              type="radio"
              name="sleep"
              value={option.value}
              checked={selectedSleep === option.value}
              onChange={() => onSelect(option.value)}
              className={styles.radioInput}
            />
            <span className={styles.sleepLabel}>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

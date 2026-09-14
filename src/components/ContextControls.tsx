import type { Relationship, Tone, DetailLevel, DesiredOutcome, Severity } from '@/types';

interface OptionGroup<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}

function ChipRow<T extends string>({ label, value, options, onChange }: OptionGroup<T>) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-300">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`chip ${value === opt.value ? 'chip-active' : 'chip-inactive'}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const relationshipOptions: { value: Relationship; label: string }[] = [
  { value: 'boss', label: 'Boss' },
  { value: 'coworker', label: 'Coworker' },
  { value: 'partner', label: 'Partner' },
  { value: 'friend', label: 'Friend' },
  { value: 'parent', label: 'Parent' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'client', label: 'Client' },
  { value: 'other', label: 'Other' },
];

const toneOptions: { value: Tone; label: string }[] = [
  { value: 'casual', label: 'Casual' },
  { value: 'professional', label: 'Professional' },
  { value: 'polite', label: 'Polite' },
  { value: 'direct', label: 'Direct' },
  { value: 'apologetic', label: 'Apologetic' },
];

const detailOptions: { value: DetailLevel; label: string }[] = [
  { value: 'short', label: 'Short' },
  { value: 'natural', label: 'Natural' },
  { value: 'detailed', label: 'Detailed' },
];

const outcomeOptions: { value: DesiredOutcome; label: string }[] = [
  { value: 'explain', label: 'Explain' },
  { value: 'postpone', label: 'Postpone' },
  { value: 'cancel', label: 'Cancel' },
  { value: 'get_out', label: 'Get out of it' },
  { value: 'soften', label: 'Soften' },
];

const severityOptions: { value: Severity; label: string }[] = [
  { value: 'mild', label: 'Mild' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'critical', label: 'Critical' },
];

interface ContextControlsProps {
  relationship: Relationship;
  tone: Tone;
  detail: DetailLevel;
  outcome: DesiredOutcome;
  severity: Severity;
  onRelationshipChange: (v: Relationship) => void;
  onToneChange: (v: Tone) => void;
  onDetailChange: (v: DetailLevel) => void;
  onOutcomeChange: (v: DesiredOutcome) => void;
  onSeverityChange: (v: Severity) => void;
}

export function ContextControls({
  relationship,
  tone,
  detail,
  outcome,
  severity,
  onRelationshipChange,
  onToneChange,
  onDetailChange,
  onOutcomeChange,
  onSeverityChange,
}: ContextControlsProps) {
  return (
    <div className="grid gap-5 rounded-2xl border border-ink-100/80 bg-white/60 p-5 backdrop-blur-sm sm:grid-cols-2">
      <ChipRow label="Who's asking?" value={relationship} options={relationshipOptions} onChange={onRelationshipChange} />
      <ChipRow label="Desired outcome" value={outcome} options={outcomeOptions} onChange={onOutcomeChange} />
      <ChipRow label="Severity" value={severity} options={severityOptions} onChange={onSeverityChange} />
      <ChipRow label="Tone" value={tone} options={toneOptions} onChange={onToneChange} />
      <ChipRow label="Detail" value={detail} options={detailOptions} onChange={onDetailChange} />
    </div>
  );
}

interface ExpectedProgressProps {
  scanned: number;
  expected: number;
}

export function ExpectedProgress({ scanned, expected }: ExpectedProgressProps) {
  const percent = expected > 0 ? Math.min(100, Math.round((scanned / expected) * 100)) : 0;
  const remaining = expected - scanned;

  return (
    <div className="stack" style={{ gap: 6 }}>
      <div className="progress-bar">
        <div className="progress-bar__fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="text-muted">
        {remaining > 0
          ? `${remaining} of ${expected} expected products remaining`
          : `✓ All ${expected} expected products scanned`}
      </span>
    </div>
  );
}

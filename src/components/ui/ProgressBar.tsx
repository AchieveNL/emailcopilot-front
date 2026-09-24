interface ProgressBarProps {
  /** 0–100; values outside the range are clamped. */
  percent: number;
  className?: string;
  barClassName?: string;
}

/** Thin track + fill used for usage meters. */
export default function ProgressBar({
  percent,
  className = "",
  barClassName = "bg-primary",
}: ProgressBarProps) {
  const safePercent = Math.min(100, Math.max(0, Number.isFinite(percent) ? percent : 0));

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(safePercent)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`h-2 w-full overflow-hidden rounded-full bg-gray-100 ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all ${barClassName}`}
        style={{ width: `${safePercent}%` }}
      />
    </div>
  );
}

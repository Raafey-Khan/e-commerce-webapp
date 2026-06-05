import styles from './QuantityPicker.module.scss';

interface Props {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export function QuantityPicker({ value, min = 1, max = 10, onChange }: Props) {
  return (
    <div className={styles.root}>
      <button
        className={styles.btn}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className={styles.value} aria-live="polite" aria-label={`Quantity: ${value}`}>
        {value}
      </span>
      <button
        className={styles.btn}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

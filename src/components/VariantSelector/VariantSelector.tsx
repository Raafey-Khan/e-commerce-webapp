import type { ColorOption, SizeOption, SelectedVariant } from '../../types';
import styles from './VariantSelector.module.scss';

interface Props {
  colors: ColorOption[];
  sizes: SizeOption[];
  selected: SelectedVariant;
  onChange: (variant: Partial<SelectedVariant>) => void;
}

export function VariantSelector({ colors, sizes, selected, onChange }: Props) {
  const selectedSize = sizes.find((s) => s.label === selected.size);
  const isLowStock = selectedSize?.status === 'low-stock';

  return (
    <div>
      <div className={styles.section}>
        <p className={styles.label}>
          Color: <span>{selected.color}</span>
        </p>
        <div className={styles.colorList} role="listbox" aria-label="Select color">
          {colors.map((color) => (
            <button
              key={color.name}
              className={`${styles.colorSwatch} ${selected.color === color.name ? styles.selected : ''}`}
              style={{ backgroundColor: color.hex }}
              onClick={() => onChange({ color: color.name })}
              aria-label={color.name}
              aria-selected={selected.color === color.name}
              role="option"
              title={color.name}
            />
          ))}
        </div>
      </div>

      <div className={styles.section} style={{ marginTop: '1.25rem' }}>
        <p className={styles.label}>
          Size: <span>{selected.size}</span>
        </p>
        <div className={styles.sizeList} role="listbox" aria-label="Select size">
          {sizes.map((size) => (
            <button
              key={size.label}
              className={[
                styles.sizeBtn,
                selected.size === size.label ? styles.selected : '',
                size.status === 'low-stock' ? styles.lowStock : '',
                size.status === 'sold-out' ? styles.soldOut : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => size.status !== 'sold-out' && onChange({ size: size.label })}
              disabled={size.status === 'sold-out'}
              aria-selected={selected.size === size.label}
              aria-disabled={size.status === 'sold-out'}
              role="option"
            >
              {size.label}
            </button>
          ))}
        </div>
        {isLowStock && <p className={styles.stockHint}>Only a few left!</p>}
      </div>
    </div>
  );
}

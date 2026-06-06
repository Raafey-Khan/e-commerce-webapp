import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { useCart } from '../../stores/CartContext';
import { getVariantsForProduct } from '../../data/variants';
import styles from './ProductCard.module.scss';

interface Props {

  product: Product;
}

export function ProductCard({ product }: Props) {

  const { addItem, openCart } = useCart();
  const [adding, setAdding] = useState(false);

  const variants = getVariantsForProduct(product);

  const displayPrice = variants.salePrice ?? product.price;

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (adding) return;

    const firstAvailableSize = variants.sizes.find((s) => s.status !== 'sold-out');
    if (!firstAvailableSize) return;

    setAdding(true);
    setTimeout(() => {
      addItem({
        productId: product.id,
        title: product.title,
        image: product.image,
        price: displayPrice,
        color: variants.colors[0].name,
        size: firstAvailableSize.label,

        quantity: 1,
      });
      openCart();
      setAdding(false);
    }, 400);
  }

  return (
    <article className={styles.card}>
      <Link to={`/product/${product.id}`} className={styles.imageLink} aria-label={product.title}>

        <img src={product.image} alt={product.title} className={styles.image} loading="lazy" />
      </Link>

      <div className={styles.body}>
        <p className={styles.category}>{product.category}</p>
        <Link to={`/product/${product.id}`} className={styles.name}>
          {product.title}

        </Link>
      </div>

      <div className={styles.footer}>

        <span className={styles.price}>${displayPrice.toFixed(2)}</span>
        
        <button
          className={`${styles.addBtn} ${adding ? styles.adding : ''}`}
          onClick={handleQuickAdd}

          disabled={adding}
        >
          {adding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </article>
  );
}

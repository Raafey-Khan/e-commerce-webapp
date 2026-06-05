import { useFetch } from '../../hooks/useFetch';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import type { Product } from '../../types';
import styles from './ProductList.module.scss';

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonImg} />
      <div className={styles.skeletonBody}>
        <div className={`${styles.skeletonLine} ${styles.short}`} />
        <div className={`${styles.skeletonLine} ${styles.medium}`} />
        <div className={`${styles.skeletonLine} ${styles.short}`} />
      </div>
    </div>
  );
}

export function ProductList() {
  const { data: products, loading, error } = useFetch<Product[]>('https://fakestoreapi.com/products');

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>All Products</h1>
        {!loading && !error && (
          <p className={styles.subheading}>{products?.length} items</p>
        )}
      </div>

      {error ? (
        <div className={styles.error}>
          <p>Failed to load products. Please check your connection.</p>
          <button className={styles.retryBtn} onClick={() => window.location.reload()}>
            Try again
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : (products ?? []).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      )}
    </main>
  );
}

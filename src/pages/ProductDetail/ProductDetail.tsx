import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { getVariantsForProduct } from '../../data/variants';
import { VariantSelector } from '../../components/VariantSelector/VariantSelector';
import { QuantityPicker } from '../../components/QuantityPicker/QuantityPicker';
import { useCart } from '../../stores/CartContext';
import type { SelectedVariant, Product } from '../../types';
import styles from './ProductDetail.module.scss';

function StarRating({ rate }: { rate: number }) {
  return (
    <div className={styles.stars} aria-label={`Rating: ${rate} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
          <svg
            key={i}
            className={`${styles.star} ${i <= Math.round(rate) ? '' : styles.starEmpty}`}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function SkeletonDetail() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonSquare} />
      <div className={styles.skeletonLines}>
        {['w30', 'w70', 'w50', 'w100', 'w100', 'w100', 'w50', 'tall'].map((w, i) => (
          <div key={i} className={`${styles.skeletonLine} ${styles[w as keyof typeof styles]}`} />
        ))}
      </div>
    </div>
  );
}

export function ProductDetail() {


  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const url = id ? `https://fakestoreapi.com/products/${id}` : null;
  const { data: product, loading, error } = useFetch<Product>(url);
  const { addItem, openCart } = useCart();

  const [quantity, setQuantity] = useState(1);

  const [activeImage, setActiveImage] = useState(0);

  const [addStatus, setAddStatus] = useState<'idle' | 'adding' | 'added'>('idle');

  const [selected, setSelected] = useState<SelectedVariant>({
      color: searchParams.get('color') ?? '',
      size: searchParams.get('size') ?? '',
  });

  useEffect(() => {

    if (!product) return;

    const variants = getVariantsForProduct(product);

    const defaultColor = searchParams.get('color') ?? variants.colors[0].name;

    const defaultSize =
        searchParams.get('size') ??
        (variants.sizes.find((s) => s.status !== 'sold-out')?.label ?? variants.sizes[0].label);
    setSelected({ color: defaultColor, size: defaultSize });
  }, [product]);

  useEffect(() => {

    if (!selected.color && !selected.size) return;

    const next = new URLSearchParams(searchParams);

    if (selected.color) next.set('color', selected.color);
    if (selected.size) next.set('size', selected.size);
    setSearchParams(next, { replace: true });

  }, [selected.color, selected.size]);

  if (loading) return <main className={styles.page}><SkeletonDetail /></main>;

  if (error || !product) {
    return (
      <main className={styles.page}>
        <div className={styles.errorState}>
          <h2>Product not found</h2>
          <p>We couldn't load this product. It may have been removed.</p>
          <Link to="/">← Back to all products</Link>
        </div>
      </main>
    );
  }

  const variants = getVariantsForProduct(product);

  const selectedSizeObj = variants.sizes.find((s) => s.label === selected.size);

  const isSoldOut = selectedSizeObj?.status === 'sold-out';

  const thumbnails = [product.image, product.image, product.image];

  function handleVariantChange(partial: Partial<SelectedVariant>) {

    setSelected((prev) => ({ ...prev, ...partial }));

  }

  async function handleAddToCart() {

    if (!product || isSoldOut || addStatus !== 'idle') return;

    setAddStatus('adding');

    await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() < 0.1) {
            reject(new Error('Network error'));
          } else {
            resolve();
          }
        }, 500);
    }).catch(() => {
      // simulated failure, still add locally for now
    });

    addItem({
        productId: product.id,
        title: product.title,

        image: product.image,

        price: variants.salePrice ?? product.price,

        color: selected.color,
        
        size: selected.size,
        quantity,
    });

    setAddStatus('added');
    openCart();
    setTimeout(() => setAddStatus('idle'), 2000);
  }

  return (

    <main className={styles.page}>

      <div className={styles.inner}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/">All Products</Link>
          <span aria-hidden="true">›</span>
          <span>{product.title}</span>
        </nav>

        <div className={styles.layout}>
          <div className={styles.gallery}>

            <div className={styles.mainImage}>
              <img
                src={thumbnails[activeImage]}
                alt={product.title}
                key={activeImage}
              />
            </div>
            <div className={styles.thumbnails} role="list" aria-label="Product images">
              {thumbnails.map((src, i) => (
                <button
                  key={i}
                  className={`${styles.thumb} ${activeImage === i ? styles.active : ''}`}
                  onClick={() => setActiveImage(i)}
                  aria-label={`View image ${i + 1}`}
                  role="listitem"
                >
                  <img src={src} alt={`${product.title} view ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>

          <div className={styles.info}>
            <p className={styles.category}>{product.category}</p>
            <h1 className={styles.title}>{product.title}</h1>

            <div className={styles.priceRow}>
              {variants.salePrice ? (
                <>
                  <span className={styles.salePrice}>${variants.salePrice.toFixed(2)}</span>
                  <span className={styles.originalPrice}>${product.price.toFixed(2)}</span>
                </>
              ) : (
                  <span className={styles.price}>${product.price.toFixed(2)}</span>
              )}
            </div>

            <div className={styles.rating}>
              
              <StarRating rate={product.rating.rate} />

              <span>{product.rating.rate} ({product.rating.count} reviews)</span>
            </div>

            <div className={styles.divider} />

            <div className={styles.variants}>

              <VariantSelector

                colors={variants.colors}

                sizes={variants.sizes}

                selected={selected}

                onChange={handleVariantChange}

              />
            </div>

            <div className={styles.qtyRow}>

              <p className={styles.qtyLabel}>Quantity</p>

              <QuantityPicker value={quantity} onChange={setQuantity} />

            </div>

            <div className={styles.ctaRow}>
              <button
                className={`${styles.addToCartBtn} ${addStatus === 'adding' ? styles.loading : ''}`}

                onClick={handleAddToCart}

                disabled={isSoldOut || addStatus === 'adding'}

              >
                {isSoldOut
                  ? 'Sold Out'
                  : addStatus === 'adding'
                    ? 'Adding...'
                    : 'Add to Cart'}
              </button>
              {isSoldOut && <p className={styles.soldOutMsg}>This size is currently unavailable</p>}

              {addStatus === 'added' && <p className={styles.addedFeedback}>Added to cart!</p>}
            </div>

            <div className={styles.divider} />

            <p className={styles.description}>{product.description}</p>

          </div>

        </div>
      </div>
    </main>
  );
}

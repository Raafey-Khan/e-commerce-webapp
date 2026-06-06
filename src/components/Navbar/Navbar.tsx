import { Link } from 'react-router-dom';
import { useCart } from '../../stores/CartContext';
import styles from './Navbar.module.scss';

export function Navbar() {
  const { totalItems, openCart } = useCart();

  return (
    <header className={styles.navbar}>

      <div className={styles.inner}>

        <Link to="/" className={styles.logo}>
          Shop

        </Link>

        <button className={styles.cartBtn} onClick={openCart} aria-label={`Cart, ${totalItems} items`}>

          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>

          
          {totalItems > 0 && (
            <span className={styles.badge}>{totalItems > 99 ? '99+' : totalItems}</span>
          )}
        </button>
      </div>
    </header>
  );
}

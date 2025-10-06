import styles from './Footer.module.scss';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} BookLog. All rights reserved.</p>
    </footer>
  );
}

import styles from './Info.module.scss';

export default function Info({ setInfo, children }) {
  return (
    <div className={styles.info} onAnimationEnd={() => setInfo((state) => ({ ...state, show: false }))}>
      {children}
    </div>
  );
}

import { useLocale } from '../../../i18n/useLocale';
import { ArrowIcon } from '../../primitives/ArrowIcon/ArrowIcon';
import { Container } from '../../primitives/Container/Container';
import styles from './Footer.module.css';

export function Footer() {
  const { content } = useLocale();
  const year = new Date().getFullYear();
  const name = `${content.hero.titleFirst} ${content.hero.titleSecond.replace(/\.$/, '')}`;

  return (
    <footer className={styles.footer} data-chapter="footer" data-tone="dark">
      <Container className={styles.inner}>
        <div className={styles.brand}>
          <strong>{name}</strong>
          <span>{content.ui.footerRole}</span>
        </div>

        <div className={styles.links}>
          <a
            href={content.contacts.telegram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={content.ui.telegramAria}
          >
            Telegram <ArrowIcon />
          </a>
          <a href={`mailto:${content.contacts.email}`} aria-label={content.ui.emailAria}>
            Email <ArrowIcon />
          </a>
          <a href={content.contacts.cv} target="_blank" rel="noopener noreferrer" aria-label={content.ui.cvAria}>
            CV <ArrowIcon />
          </a>
        </div>

        <div className={styles.meta}>
          <span>{content.ui.footerCity}</span>
          <span>© {year}</span>
        </div>
      </Container>
    </footer>
  );
}

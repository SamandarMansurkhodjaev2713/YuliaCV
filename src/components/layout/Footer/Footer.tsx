import { siteContent } from '../../../content/site';
import { ArrowIcon } from '../../primitives/ArrowIcon/ArrowIcon';
import { Container } from '../../primitives/Container/Container';
import styles from './Footer.module.css';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container className={styles.inner}>
        <div className={styles.brand}>
          <strong>ЮЛИЯ БРЫНСКИХ</strong>
          <span>SMM / MARKETING</span>
        </div>

        <div className={styles.links}>
          <a
            href={siteContent.contacts.telegram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram Юлии, откроется в новой вкладке"
          >
            Telegram <ArrowIcon />
          </a>
          {siteContent.contacts.instagram ? (
            <a
              href={siteContent.contacts.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Юлии, откроется в новой вкладке"
            >
              Instagram <ArrowIcon />
            </a>
          ) : null}
          <a href={siteContent.contacts.cv} target="_blank" rel="noopener noreferrer">
            CV <ArrowIcon />
          </a>
        </div>

        <div className={styles.meta}>
          <span>Ташкент</span>
          <span>© {year}</span>
        </div>
      </Container>
    </footer>
  );
}

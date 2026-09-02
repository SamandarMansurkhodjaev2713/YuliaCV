import { useEffect, useRef } from 'react';
import { useLocale } from '../../../i18n/useLocale';
import { chapterLabel } from '../../../lib/sections';
import { ArrowIcon } from '../../primitives/ArrowIcon/ArrowIcon';
import { LocaleSwitch } from '../LocaleSwitch/LocaleSwitch';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  readonly isOpen: boolean;
  readonly onClose: (restoreFocus?: boolean) => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { content } = useLocale();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const restoreFocusRef = useRef(true);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
      document.body.dataset.menuOpen = 'true';
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }

    return () => {
      delete document.body.dataset.menuOpen;
    };
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    const handleClose = () => {
      delete document.body.dataset.menuOpen;
      onClose(restoreFocusRef.current);
      restoreFocusRef.current = true;
    };
    const handleCancel = (event: Event) => {
      event.preventDefault();
      dialog.close();
    };

    dialog.addEventListener('close', handleClose);
    dialog.addEventListener('cancel', handleCancel);
    return () => {
      dialog.removeEventListener('close', handleClose);
      dialog.removeEventListener('cancel', handleCancel);
    };
  }, [onClose]);

  const closeFromLink = () => {
    restoreFocusRef.current = false;
    dialogRef.current?.close();
  };

  return (
    <dialog
      id="mobile-menu"
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="mobile-menu-title"
      onClick={(event) => {
        if (event.currentTarget === event.target) event.currentTarget.close();
      }}
    >
      <div className={styles.panel}>
        <div className={styles.topline}>
          <p id="mobile-menu-title" className={styles.wordmark}>
            {content.hero.titleFirst} <span>/ {content.ui.menu}</span>
          </p>
          <button className={styles.close} type="button" onClick={() => dialogRef.current?.close()}>
            <span>{content.ui.close}</span>
            <span className={styles.closeMark} aria-hidden="true" />
          </button>
        </div>

        <nav className={styles.navigation} aria-label={content.ui.mobileNavAria}>
          {content.navigation.map((item, index) => (
            <a
              key={item.section}
              className={styles.navLink}
              href={`#${item.section}`}
              onClick={closeFromLink}
              style={{ animationDelay: `${index * 50 + 120}ms` }}
            >
              <span>{chapterLabel(item.section)}</span>
              <strong>{item.label}</strong>
              <ArrowIcon />
            </a>
          ))}
        </nav>

        <div className={styles.bottom}>
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
            <p>
              {content.ui.footerCity} · {new Date().getFullYear()}
            </p>
            <LocaleSwitch tone="paper" />
          </div>
        </div>
      </div>
    </dialog>
  );
}

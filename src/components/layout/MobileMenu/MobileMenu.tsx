import { useEffect, useRef } from 'react';
import { siteContent } from '../../../content/site';
import { ArrowIcon } from '../../primitives/ArrowIcon/ArrowIcon';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

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
      onClose();
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

  const closeFromLink = () => dialogRef.current?.close();

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
            ЮЛИЯ <span>/ MENU</span>
          </p>
          <button className={styles.close} type="button" onClick={() => dialogRef.current?.close()}>
            <span>Закрыть</span>
            <span className={styles.closeMark} aria-hidden="true" />
          </button>
        </div>

        <nav className={styles.navigation} aria-label="Мобильная навигация">
          {siteContent.navigation.map((item, index) => (
            <a
              key={item.href}
              className={styles.navLink}
              href={item.href}
              onClick={closeFromLink}
              style={{ animationDelay: `${index * 55 + 130}ms` }}
            >
              <span>{item.index}</span>
              <strong>{item.label}</strong>
              <ArrowIcon />
            </a>
          ))}
        </nav>

        <div className={styles.bottom}>
          <a
            href={siteContent.contacts.telegram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Написать Юлии в Telegram, откроется в новой вкладке"
          >
            Telegram <ArrowIcon />
          </a>
          {siteContent.contacts.instagram ? (
            <a
              href={siteContent.contacts.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Открыть Instagram Юлии, откроется в новой вкладке"
            >
              Instagram <ArrowIcon />
            </a>
          ) : null}
          <p>Ташкент · 2026</p>
        </div>
      </div>
    </dialog>
  );
}

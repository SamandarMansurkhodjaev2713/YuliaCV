import { useCallback, useEffect, useRef, useState } from 'react';
import { useActiveSection } from '../../../hooks/useActiveSection';
import { useLocale } from '../../../i18n/useLocale';
import { chapterLabel } from '../../../lib/sections';
import { Button } from '../../primitives/Button/Button';
import { LocaleSwitch } from '../LocaleSwitch/LocaleSwitch';
import { MobileMenu } from '../MobileMenu/MobileMenu';
import styles from './Header.module.css';

export function Header() {
  const { content } = useLocale();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const activeSection = useActiveSection();

  useEffect(() => {
    let frameId = 0;
    const update = () => {
      frameId = 0;
      setIsScrolled(window.scrollY > 24);
    };
    const handleScroll = () => {
      if (frameId === 0) frameId = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameId !== 0) window.cancelAnimationFrame(frameId);
    };
  }, []);

  const closeMenu = useCallback((restoreFocus = true) => {
    setIsMenuOpen(false);
    if (restoreFocus) window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  }, []);

  return (
    <>
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          <a className={styles.brand} href="#hero" aria-label={content.ui.brandAria}>
            <strong aria-hidden="true">YB</strong>
            <span>{content.ui.brandLine}</span>
          </a>

          <nav className={styles.navigation} aria-label={content.ui.mainNavAria}>
            {content.navigation.map((item) => {
              const isActive = activeSection === item.section;
              return (
                <a
                  key={item.section}
                  href={`#${item.section}`}
                  className={isActive ? styles.active : undefined}
                  aria-current={isActive ? 'location' : undefined}
                >
                  <small>{chapterLabel(item.section)}</small>
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          <div className={styles.tools}>
            <LocaleSwitch className={styles.locale} />
            <Button
              className={styles.contact}
              variant="outline"
              size="sm"
              href={content.contacts.telegram}
              external
              aria-label={content.ui.telegramAria}
            >
              {content.ui.headerCta}
            </Button>
          </div>

          <button
            ref={menuButtonRef}
            className={styles.menuButton}
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen(true)}
          >
            <span>{content.ui.menu}</span>
            <small aria-hidden="true">{activeSection ? chapterLabel(activeSection) : '00'}</small>
            <span className={styles.menuIcon} aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>
      <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </>
  );
}

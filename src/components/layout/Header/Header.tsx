import { useCallback, useEffect, useRef, useState } from 'react';
import { siteContent } from '../../../content/site';
import { useActiveSection } from '../../../hooks/useActiveSection';
import { ArrowIcon } from '../../primitives/ArrowIcon/ArrowIcon';
import { Container } from '../../primitives/Container/Container';
import { MobileMenu } from '../MobileMenu/MobileMenu';
import styles from './Header.module.css';

export function Header() {
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
        <Container className={styles.inner}>
          <a className={styles.brand} href="#hero" aria-label="Юлия Брынских. На начало страницы">
            <strong aria-hidden="true">YB</strong>
            <span>ЮЛИЯ БРЫНСКИХ · SMM-СТРАТЕГ</span>
          </a>

          <nav className={styles.navigation} aria-label="Основная навигация">
            {siteContent.navigation.map((item) => {
              const sectionId = item.href.slice(1);
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={isActive ? styles.active : undefined}
                  aria-current={isActive ? 'location' : undefined}
                >
                  <small>{item.index}</small>
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          <a
            className={styles.contact}
            href={siteContent.contacts.telegram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Написать в Telegram Юлии, откроется в новой вкладке"
          >
            Написать <ArrowIcon />
          </a>

          <button
            ref={menuButtonRef}
            className={styles.menuButton}
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen(true)}
          >
            <span>Меню</span>
            <small aria-hidden="true">
              {siteContent.navigation.find((item) => item.href.slice(1) === activeSection)?.index ?? '00'}
            </small>
            <span className={styles.menuIcon} aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </Container>
      </header>
      <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </>
  );
}

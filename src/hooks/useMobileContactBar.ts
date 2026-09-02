import { useEffect, useState } from 'react';

/** Shows the floating Telegram bar between the hero and the contact block. */
export function useMobileContactBar(): boolean {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('hero');
    const contact = document.getElementById('contact');
    if (!hero || !contact || typeof IntersectionObserver === 'undefined') return undefined;

    let heroVisible = true;
    let contactVisible = false;

    const update = () => setIsVisible(!heroVisible && !contactVisible);

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        heroVisible = entry.isIntersecting;
        update();
      },
      { threshold: 0.05 },
    );

    const contactObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        contactVisible = entry.isIntersecting;
        update();
      },
      { rootMargin: '0px 0px 120px 0px', threshold: 0.01 },
    );

    heroObserver.observe(hero);
    contactObserver.observe(contact);

    return () => {
      heroObserver.disconnect();
      contactObserver.disconnect();
    };
  }, []);

  return isVisible;
}

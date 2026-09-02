import { LOCALES } from '../../../i18n/locale';
import { useLocale } from '../../../i18n/useLocale';
import styles from './LocaleSwitch.module.css';

interface LocaleSwitchProps {
  readonly className?: string;
  readonly tone?: 'ink' | 'paper';
}

export function LocaleSwitch({ className, tone = 'ink' }: LocaleSwitchProps) {
  const { locale, content, setLocale } = useLocale();
  const classes = [styles.switch, tone === 'paper' ? styles.paper : '', className ?? ''].filter(Boolean).join(' ');

  return (
    <div className={classes} role="group" aria-label={content.ui.languageAria}>
      {LOCALES.map((option) => (
        <button
          key={option}
          type="button"
          className={option === locale ? styles.active : undefined}
          aria-pressed={option === locale}
          lang={option}
          onClick={() => setLocale(option)}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

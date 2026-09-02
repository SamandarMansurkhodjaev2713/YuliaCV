import { useLocale } from '../../../i18n/useLocale';
import { pad } from '../../../lib/sections';
import { Reveal } from '../../motion/Reveal/Reveal';
import { Button } from '../../primitives/Button/Button';
import { Container } from '../../primitives/Container/Container';
import { SectionHeading } from '../../primitives/SectionHeading/SectionHeading';
import styles from './About.module.css';

export function About() {
  const { content } = useLocale();

  return (
    <section
      id="about"
      className={styles.section}
      aria-labelledby="about-title"
      data-chapter="about"
      data-tone="light"
    >
      <Container>
        <SectionHeading
          section="about"
          eyebrow={content.about.eyebrow}
          title={content.about.title}
          titleId="about-title"
        />

        <div className={styles.grid}>
          <Reveal className={styles.quote} delay={0.08}>
            <blockquote>{content.about.quote}</blockquote>
          </Reveal>

          <div className={styles.story}>
            {content.about.paragraphs.map((paragraph, index) => (
              <Reveal key={paragraph} delay={index * 0.06}>
                <p>{paragraph}</p>
              </Reveal>
            ))}

            <Reveal className={styles.facts} delay={0.12}>
              {content.about.facts.map((fact, index) => (
                <div key={fact}>
                  <span>{pad(index + 1)}</span>
                  <strong>{fact}</strong>
                </div>
              ))}
            </Reveal>

            <Reveal className={styles.cvAction} delay={0.16}>
              <Button href={content.contacts.cv} variant="outline" external aria-label={content.ui.cvAria}>
                {content.ui.cvLabel}
              </Button>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

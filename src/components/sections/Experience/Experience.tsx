import { motion, useReducedMotion } from 'motion/react';
import type { ExperienceItem } from '../../../content/types';
import { useLocale } from '../../../i18n/useLocale';
import { pad } from '../../../lib/sections';
import { Button } from '../../primitives/Button/Button';
import { Container } from '../../primitives/Container/Container';
import { SectionHeading } from '../../primitives/SectionHeading/SectionHeading';
import styles from './Experience.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

interface RoleProps {
  readonly item: ExperienceItem;
  readonly index: number;
  readonly currentTag: string;
  readonly caseLink: string;
  readonly compact?: boolean;
}

function Role({ item, index, currentTag, caseLink, compact = false }: RoleProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.article
      className={`${styles.role} ${compact ? styles.compact : ''} ${item.current ? styles.current : ''}`}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: EASE }}
    >
      <div className={styles.period}>
        <span>{item.period}</span>
        {item.current ? <em>{currentTag}</em> : null}
      </div>
      <div className={styles.heading}>
        <h3>{item.company}</h3>
        <p>
          {item.role}
          {item.location ? <span> · {item.location}</span> : null}
        </p>
      </div>
      <div className={styles.body}>
        <p>{item.summary}</p>
        {item.highlights.length > 0 ? (
          <ul>
            {item.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        ) : null}
        {item.result ? <p className={styles.result}>{item.result}</p> : null}
        {item.linkToCase ? (
          <Button href="#case" variant="link" className={styles.caseLink}>
            {caseLink}
          </Button>
        ) : null}
      </div>
    </motion.article>
  );
}

export function Experience() {
  const { content } = useLocale();
  const { experience } = content;
  const reduceMotion = useReducedMotion();
  const marketing = experience.items.filter((item) => item.track === 'marketing');
  const people = experience.items.filter((item) => item.track === 'people');

  return (
    <section
      id="experience"
      className={styles.section}
      aria-labelledby="experience-title"
      data-chapter="experience"
      data-tone="light"
    >
      <Container>
        <SectionHeading
          section="experience"
          eyebrow={experience.eyebrow}
          title={experience.title}
          description={experience.description}
          titleId="experience-title"
        />

        <div className={styles.layout}>
          <motion.aside
            className={styles.total}
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <strong>{experience.totalValue}</strong>
            <span>{experience.totalLabel}</span>
            <dl className={styles.tracks}>
              <div>
                <dt>SMM</dt>
                <dd>{pad(marketing.length)}</dd>
              </div>
              <div>
                <dt>{experience.beforeMarketing}</dt>
                <dd>{pad(people.length)}</dd>
              </div>
            </dl>
          </motion.aside>

          <div className={styles.list}>
            {marketing.map((item, index) => (
              <Role
                key={item.id}
                item={item}
                index={index}
                currentTag={experience.currentTag}
                caseLink={experience.caseLink}
              />
            ))}

            <div className={styles.divider}>
              <span>{experience.beforeMarketing}</span>
              <i />
              <small>{experience.beforeMarketingNote}</small>
            </div>

            {people.map((item, index) => (
              <Role
                key={item.id}
                item={item}
                index={index}
                currentTag={experience.currentTag}
                caseLink={experience.caseLink}
                compact
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

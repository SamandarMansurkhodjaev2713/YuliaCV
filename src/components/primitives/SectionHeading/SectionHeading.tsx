import { MaskText } from '../../motion/MaskText/MaskText';
import { Reveal } from '../../motion/Reveal/Reveal';
import styles from './SectionHeading.module.css';

interface SectionHeadingProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly description?: string;
  readonly inverse?: boolean;
  readonly id?: string;
}

export function SectionHeading({ eyebrow, title, description, inverse = false, id }: SectionHeadingProps) {
  const classes = inverse ? `${styles.root} ${styles.inverse}` : styles.root;
  return (
    <div className={classes}>
      <Reveal className={styles.eyebrow} y={10}>
        {eyebrow}
      </Reveal>
      <MaskText as="h2" className={styles.title} id={id}>
        {title}
      </MaskText>
      {description ? (
        <Reveal className={styles.description} delay={0.12}>
          <p>{description}</p>
        </Reveal>
      ) : null}
    </div>
  );
}

import { Footer } from '../components/layout/Footer/Footer';
import { Header } from '../components/layout/Header/Header';
import { PageAtmosphere } from '../components/motion/PageAtmosphere/PageAtmosphere';
import { About } from '../components/sections/About/About';
import { CaseStudy } from '../components/sections/CaseStudy/CaseStudy';
import { Contact, MobileContactBar } from '../components/sections/Contact/Contact';
import { Education } from '../components/sections/Education/Education';
import { Hero } from '../components/sections/Hero/Hero';
import { Intro } from '../components/sections/Intro/Intro';
import { Method } from '../components/sections/Method/Method';
import { Process } from '../components/sections/Process/Process';
import { Services } from '../components/sections/Services/Services';

export function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Перейти к основному содержанию
      </a>
      <Intro />
      <div id="app-shell">
        <PageAtmosphere />
        <Header />
        <main id="main-content">
          <Hero />
          <Method />
          <CaseStudy />
          <Services />
          <Process />
          <About />
          <Education />
          <Contact />
        </main>
        <Footer />
        <MobileContactBar />
      </div>
    </>
  );
}

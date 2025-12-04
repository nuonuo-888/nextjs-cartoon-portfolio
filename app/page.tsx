import Navigation from '../src/components/Navigation'
import HeroSection from '../src/components/HeroSection'
import AboutSection from '../src/components/AboutSection'
import ProjectsSection from '../src/components/ProjectsSection'
import ProficiencySection from '../src/components/ProficiencySection'
import Footer from '../src/components/Footer'

export default function Home() {
  return (
    <>
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ProficiencySection />
      <Footer />
    </>
  )
}


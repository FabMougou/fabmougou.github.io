import { useState, useEffect, useMemo } from 'react'
import { ASCIIWave, LoadingSplash, CardDeck } from './components'
import ContentRenderer from './components/ContentRenderer'
import './App.scss'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [activeSection, setActiveSection] = useState(null) // null means showing all decks
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  // Define the sections and their corresponding card designs
  const sections = [
    { id: 'about', imageSrc: 'src/assets/card-back-about.png' },
    { id: 'experience', imageSrc: 'src/assets/card-back-experience.png' },
    { id: 'education', imageSrc: 'src/assets/card-back-education.png' },
    { id: 'projects', imageSrc: 'src/assets/card-back-projects.png' },
    { id: 'skills', imageSrc: 'src/assets/card-back-skills.png' }
  ]

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLoadingComplete = () => {
    setIsLoading(false)
    setTimeout(() => {
      setShowContent(true)
    }, 500)
  }

  const handleDeckClick = (section) => {
    if (activeSection == null || activeSection == section) {
      setActiveSection(section)
    } else {
      setActiveSection(null)
    }
  }

  // Memoize the ASCIIWave component
  const memoizedASCIIWave = useMemo(() => (
    <ASCIIWave 
      key="persistent-water-background"
      numCells={800}
      cellSize={10}
      canvasWidth={windowDimensions.width}
      canvasHeight={windowDimensions.height}
      springForce={0.15}
      damping={0.6}
      waveSpread={20}
      minIntensity={0.05}
      maxWaveHeight={0.8}
      waterColor={[166,98,53]}
      backgroundColor={255}
      gravity={0.03}
      turbulence={0.5}
      mouseInfluence={true}
      clickRedistribution={true}
      showMouseIndicator={false}
      colorVariation={0}
      hueShift={0}
      saturationVariation={0}
      brightnessVariation={0}
      colorNoise={0}
    />
  ), [])

  return (
    <>
      {isLoading && <LoadingSplash onLoadingComplete={handleLoadingComplete} duration={100} />}
      
      <div className={`app-container ${!showContent ? 'hidden' : 'fade-in'}`}>
        {/* Background water layer */}
        {showContent && (
          <div className="water-background">
            {/* {memoizedASCIIWave} */}
          </div>
        )}

        {/* Card Deck Navigation */}
        {showContent && (
          <>
            {sections.map((section, index) => {
              let position = 'initial';
              
              if (activeSection === section.id) {
                position = 'active';
              } else if (activeSection && activeSection !== section.id) {
                position = 'messy';
              }

              return (
                <CardDeck
                  key={section.id}
                  numCards={10}
                  numDecks={sections.length}
                  imageSrc={section.imageSrc}
                  position={position}
                  index={index}
                  section={section.id}
                  isActive={activeSection === section.id}
                  onClick={handleDeckClick}
                />
              );
            })}
          </>
        )}

        {/* Main content area */}
        <main className="main-content">
          {/* {activeSection && <ContentRenderer activeSection={activeSection} />} */}
        </main>
      </div>
    </>
  )
}

export default App;

import { useState, useEffect, useMemo } from 'react'
import { ASCIIWave, LoadingSplash } from './components'
import ContentRenderer from './components/ContentRenderer'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false) // New state for content visibility
  const [activeSection, setActiveSection] = useState('resume')
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

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
      setShowContent(true) // Show everything together
    }, 500)
  }

  const handleNavClick = (section) => {
    setActiveSection(section)
  }

  // Memoize the ASCIIWave component with NO dependencies so it never recreates
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
      waterColor={[0,0,0]}
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
  ), []) // Empty dependency array - component never recreates

  return (
    <>
      {isLoading && <LoadingSplash onLoadingComplete={handleLoadingComplete} />}
      
      <div className={`app-container ${!showContent ? 'hidden' : 'fade-in'}`}>
        {/* Background water layer - This persists across all navigation */}
        {showContent && (
          <div className="water-background">
            {memoizedASCIIWave}
          </div>
        )}

        {/* Navigation */}
        <nav className="main-nav">
          <button 
            className={`nav-button ${activeSection === 'about' ? 'active' : ''}`}
            onClick={() => handleNavClick('about')}
          >
            <h1>About</h1>
          </button>

          <button 
            className={`nav-button ${activeSection === 'resume' ? 'active' : ''}`}
            onClick={() => handleNavClick('resume')}
          >
            <h1>Resume</h1>
          </button>
          
          <button 
            className={`nav-button ${activeSection === 'projects' ? 'active' : ''}`}
            onClick={() => handleNavClick('projects')}
          >
            <h1>Projects</h1>
          </button>
          
          <button 
            className={`nav-button ${activeSection === 'art' ? 'active' : ''}`}
            onClick={() => handleNavClick('art')}
          >
            <h1>Art</h1>
          </button>
        </nav>

        {/* Main content area - Content changes but water background persists */}
        <main className="main-content">
          <ContentRenderer activeSection={activeSection} />
        </main>
      </div>
    </>
  )
}

export default App
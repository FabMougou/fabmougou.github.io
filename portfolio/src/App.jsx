import { useState, useEffect } from 'react'
import { ASCIIText, ColourGrid, LoadingSplash } from './components'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [showGrid, setShowGrid] = useState(false)
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
      setShowGrid(true)
    }, 500)
  }

  return (
    <>
      {isLoading && <LoadingSplash onLoadingComplete={handleLoadingComplete} />}
      
      <div className={`app-container ${isLoading ? 'hidden' : 'fade-in'}`}>
        {/* Background water layer */}
        {showGrid && (
          <div className="water-background">
            <ColourGrid 
              key="main-color-grid"
              numCells={800}
              cellSize={10}
              canvasWidth={windowDimensions.width}
              canvasHeight={windowDimensions.height}
              springForce={0.15}
              damping={0.6}
              waveSpread={20}
              minIntensity={0.05}
              maxWaveHeight={0.8}
              waterColor={[100, 200, 255]}
              backgroundColor={0}
              gravity={0.03}
              turbulence={0.5}
              mouseInfluence={true}
              clickRedistribution={true}
              showMouseIndicator={false}
              colorVariation={0.4}
              hueShift={0.15}
              saturationVariation={0.25}
              brightnessVariation={0.2}
              colorNoise={0.18}
            />
          </div>
        )}

        {/* Grid sections with ASCII text - removed size constraints */}
        <div className="top-left">
          <div className="component-container">
            <ASCIIText 
              text="Resume"
              asciiFontSize={10}
              textFontSize={20}
              textColor="#fdf9f3"
              planeBaseHeight={8}
              enableWaves={true}
              waveIntensity={0.7}
              waveSpeed={1.5}
            />
          </div>
        </div>

        <div className="top-center">
          <div className="component-container">
            <ASCIIText 
              text="Projects"
              asciiFontSize={10}
              textFontSize={20}
              textColor="#fdf9f3"
              planeBaseHeight={8}
              enableWaves={true}
              waveIntensity={0.7}
              waveSpeed={1.5}
            />
          </div>
        </div>

        <div className="top-right">
          <div className="component-container">
            <ASCIIText 
              text="Art"
              asciiFontSize={10}
              textFontSize={20}
              textColor="#fdf9f3"
              planeBaseHeight={8}
              enableWaves={true}
              waveIntensity={0.7}
              waveSpeed={1.5}
            />
          </div>
        </div>
        <div className="middle-left"></div>
        <div className="middle-center"></div>
        <div className="middle-right"></div>
        <div className="bottom-left"></div>
        <div className="bottom-center"></div>
        <div className="bottom-right"></div>
      </div>
    </>
  )
}

export default App
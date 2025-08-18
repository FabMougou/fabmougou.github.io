import { useState, useEffect, useMemo } from 'react'
import { ASCIIWave, LoadingSplash, CardDeck } from './components'
import LayedOutCards from './components/LayedOutCards'
import ContentRenderer from './components/ContentRenderer'
import './App.scss'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [activeSection, setActiveSection] = useState(null)
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  // Define the sections and their corresponding card designs
  const sections = {
    about: {
      imageSrc: 'src/assets/card-back-about.png',
      cards: [
        { name: 'Card 1', backImage: 'src/assets/card-back-about.png', frontImage: 'src/assets/cards/card-back-red.png' },
        { name: 'Card 2', backImage: 'src/assets/card-back-about.png', frontImage: 'src/assets/cards/card-back-red.png' },
        { name: 'Card 3', backImage: 'src/assets/card-back-about.png', frontImage: 'src/assets/cards/card-back-red.png' }
      ]
    },
    experience: { 
      imageSrc: 'src/assets/card-back-experience.png',
      cards: [
        { name: 'Card 1', backImage: 'src/assets/card-back-about.png', frontImage: 'src/assets/cards/card-back-red.png' },
        { name: 'Card 2', backImage: 'src/assets/card-back-about.png', frontImage: 'src/assets/cards/card-back-red.png' },
        { name: 'Card 3', backImage: 'src/assets/card-back-about.png', frontImage: 'src/assets/cards/card-back-red' }
      ]
    },
    education: {
      imageSrc: 'src/assets/card-back-education.png', 
      cards: [
        { name: 'Card 1', backImage: 'src/assets/card-back-about.png', frontImage: 'src/assets/cards/card-back-red.png' },
        { name: 'Card 2', backImage: 'src/assets/card-back-about.png', frontImage: 'src/assets/cards/card-back-red.png' },
        { name: 'Card 3', backImage: 'src/assets/card-back-about.png', frontImage: 'src/assets/cards/card-back-red' }
      ]
    },
    projects: {
      imageSrc: 'src/assets/card-back-projects.png',
      cards: [
        { name: 'Card 1', backImage: 'src/assets/card-back-about.png', frontImage: 'src/assets/cards/card-back-red.png' },
        { name: 'Card 2', backImage: 'src/assets/card-back-about.png', frontImage: 'src/assets/cards/card-back-red.png' },
        { name: 'Card 3', backImage: 'src/assets/card-back-about.png', frontImage: 'src/assets/cards/card-back-red' }
      ]
    },
    skills: {
      imageSrc: 'src/assets/card-back-skills.png',
      cards: [
        { name: 'Card 1', backImage: 'src/assets/card-back-about.png', frontImage: 'src/assets/cards/card-back-red.png' },
        { name: 'Card 2', backImage: 'src/assets/card-back-about.png', frontImage: 'src/assets/cards/card-back-red.png' },
        { name: 'Card 3', backImage: 'src/assets/card-back-about.png', frontImage: 'src/assets/cards/card-back-red' }
      ]
    }
  }

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
            {Object.keys(sections).map((section, index) => {
              console.log(sections[section].imageSrc)
              let position = 'initial';
              
              if (activeSection === section) {
                position = 'active';
              } else if (activeSection && activeSection !== section) {
                position = 'messy';
              }

              return (
                <CardDeck
                  key={index}
                  numCards={10}
                  numDecks={Object.keys(sections).length}
                  imageSrc={sections[section].imageSrc}
                  position={position}
                  index={index}
                  section={section}
                  isActive={activeSection === section}
                  onClick={handleDeckClick}
                />
              );
            })}
            {/* {sections.map((section, index) => {
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
            })} */}

            <LayedOutCards 
              section={activeSection}
              isActive={!!activeSection}
              cards={activeSection ? sections[activeSection].cards : []}
            />
          </>
        )}
      </div>
    </>
  )
}

export default App;

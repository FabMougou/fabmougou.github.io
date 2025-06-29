import { useState, useEffect } from 'react'
import DecryptedText from './DecryptedText'
import './styles/LoadingSplash.css'

const LoadingSplash = ({ onLoadingComplete }) => {
  const [showWelcome, setShowWelcome] = useState(false)
  const [hideWelcome, setHideWelcome] = useState(false)
  const [showRestOfText, setShowRestOfText] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Start with welcome text
    const welcomeTimer = setTimeout(() => {
      setShowWelcome(true)
    }, 500)

    // Start hiding welcome text
    const hideWelcomeTimer = setTimeout(() => {
      setHideWelcome(true)
    }, 2400) //2400

    // Show the rest after welcome is hidden
    const restTimer = setTimeout(() => {
      setShowRestOfText(true)
    }, 2900) //2900

    // Complete loading after all animations
    const completeTimer = setTimeout(() => {
      setIsComplete(true)
      setTimeout(() => onLoadingComplete(), 500)
    }, 6000) //6000

    return () => {
      clearTimeout(welcomeTimer)
      clearTimeout(hideWelcomeTimer)
      clearTimeout(restTimer)
      clearTimeout(completeTimer)
    }
  }, [onLoadingComplete])

  return (
    <div className={`loading-splash ${isComplete ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <div className="loading-text-container">
          {showWelcome && !hideWelcome && (
            <DecryptedText
              text="Welcome"
              speed={60}
              maxIterations={12}
              sequential={true}
              revealDirection="start"
              animateOn="view"
              className="loading-line-decrypted"
              parentClassName="loading-line welcome-text"
              encryptedClassName="loading-line-encrypted"
            />
          )}
          {hideWelcome && !showRestOfText && (
            <DecryptedText
              text="Welcome"
              speed={40}
              maxIterations={8}
              sequential={true}
              revealDirection="end"
              animateOn="view"
              className="loading-line-encrypted"
              parentClassName="loading-line welcome-text"
              encryptedClassName="loading-line-decrypted"
            />
          )}
          {showRestOfText && (
            <>
              <DecryptedText
                text="Fabricio Mougou"
                speed={60}
                maxIterations={12}
                sequential={true}
                revealDirection="start"
                animateOn="view"
                className="loading-line-decrypted"
                parentClassName="loading-line name-text"
                encryptedClassName="loading-line-encrypted"
              />
              <DecryptedText
                text="Portfolio"
                speed={60}
                maxIterations={12}
                sequential={true}
                revealDirection="start"
                animateOn="view"
                className="loading-line-decrypted"
                parentClassName="loading-line portfolio-text"
                encryptedClassName="loading-line-encrypted"
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoadingSplash
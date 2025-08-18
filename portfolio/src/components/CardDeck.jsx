import { useMemo } from 'react'
import './styles/CardDeck.scss'

const CardDeck = ({
  numCards = 4,
  numDecks = 5,
  imageSrc = "src/assets/card-back-red.png",
  position = 'initial', // 'initial', 'active', 'messy'
  index = 0,
  onClick,
  section,
  isActive = false
}) => {

  const rootStyles = getComputedStyle(document.documentElement);
  const cardWidth = parseFloat(rootStyles.getPropertyValue('--card-width')); // Get --card-width
  const cardHeight = cardWidth * 1.5; // Get --card-height

  const messyPosition = useMemo(() => {
    const offset = Math.random() * 30 - 15;
    const rotation = Math.random() * 40 - 20;
    const zIndex = Math.floor(Math.random() * 20) + 50;
    return { offset, rotation, zIndex };
  }, [section, position]);

  // Add this: Random initial position for each deck (scattered on table)
  const initialPosition = useMemo(() => {
    const margin = 20; // Margin from screen edges
    const randomX = margin + Math.random() * (window.innerWidth - cardWidth - (margin * 2));
    const randomY = margin + Math.random() * (window.innerHeight - cardHeight - (margin * 2));
    const randomRotation = Math.random() * 30 - 15; // Random rotation between -30 and 30 degrees
    
    return { x: randomX, y: randomY, rotation: randomRotation };
  }, [section, position]); // Only recalculate when section changes

  const getPositionStyles = () => {
    switch (position) {
      case 'active':
        return {
          position: 'fixed',
          top: '50px',
          left: `${Math.min(60, window.innerWidth - cardWidth - 20)}px`,
          zIndex: 100
        }
      case 'messy':
        return {
          position: 'fixed',
          top: `${50 + messyPosition.offset}px`,
          left: `${Math.max(window.innerWidth - cardWidth - 100 + messyPosition.offset, 100)}px`,
          transform: `rotate(${messyPosition.rotation}deg)`,
          zIndex: messyPosition.zIndex
        }
      case 'initial':
      default:
        // Use the random initial position instead of the old centered logic
        return {
          position: 'fixed',
          top: `${initialPosition.y}px`,
          left: `${initialPosition.x}px`,
          transform: `rotate(${initialPosition.rotation}deg)`,
          zIndex: 10 + index
        }
    }
  }

  return (
    <div 
      className={`deck ${position} ${isActive ? 'active' : ''}`}
      style={getPositionStyles()}
      onClick={() => onClick && onClick(section)}
    >
      {Array.from({ length: numCards }, (_, cardIndex) => {
        const cardOffsetTop = (cardIndex * Math.random() * 3);
        const cardOffsetLeft = (cardIndex * Math.random() * 3);
        const cardRotation = Math.random() * 20 - 10;
        return (
          <div 
            className="deck-card"
            key={cardIndex}
            style={{
              top: `${cardOffsetTop}px`,
              left: `${cardOffsetLeft}px`,
              transform: `rotate(${cardRotation}deg)`,
              zIndex: cardIndex + 1
            }}
          >
            <img 
              className="deck-card-img"
              src={imageSrc}
              alt={`Card ${cardIndex + 1}`}
            />
          </div>
        );
      })}
    </div>
  )
}

export default CardDeck;
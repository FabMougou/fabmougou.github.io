
import { useState, useEffect } from 'react';
import './styles/LayedOutCards.scss';

const LayedOutCards = ({ section, isActive, cards }) => {
  const [layedOutCards, setLayedOutCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);

  useEffect(() => {
    if (isActive && cards && cards.length > 0) {
      // Reset states
      setLayedOutCards([]);
      setFlippedCards([]);

      // Lay out cards one by one
      cards.forEach((_, index) => {
        setTimeout(() => {
          setLayedOutCards(prev => [...prev, index]);
        }, index * 300); // 300ms delay between each card
      });

      // Flip cards one by one after all are laid out
      const totalLayOutTime = cards.length * 300;
      cards.forEach((_, index) => {
        setTimeout(() => {
          setFlippedCards(prev => [...prev, index]);
        }, totalLayOutTime + (index * 400)); // 400ms delay between each flip
      });
    } else {
      // Reset when not active
      setLayedOutCards([]);
      setFlippedCards([]);
    }
  }, [isActive, cards]);

  if (!isActive || !cards || cards.length === 0) {
    return null;
  }

  return (
    <div className="layed-out-cards">
      {cards.map((card, index) => (
        <div
          key={`${section}-card-${index}`}
          className={`card-container ${layedOutCards.includes(index) ? 'laid-out' : ''} ${
            flippedCards.includes(index) ? 'flipped' : ''
          }`}
          style={{
            left: `${200 + index * 120}px`, // Position cards horizontally
            animationDelay: `${index * 300}ms`
          }}
        >
          <div className="card">
            <div className="card-front">
              <img src={card.frontImage} alt={card.name} />
              <div className="card-name">{card.name}</div>
            </div>
            <div className="card-back">
              <img src={card.backImage} alt={`${card.name} back`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LayedOutCards;

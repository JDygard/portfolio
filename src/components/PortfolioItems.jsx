import React, { useEffect, useState } from 'react';
import Button from './Button';
import './PortfolioItems.css';

function PortfolioItems({ items }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    if (!isModalOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const handleItemClick = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <section className="portfolio" data-tween-id="projects" aria-labelledby="projects-heading">
      <div className="portfolioItems">
        <h3 id="projects-heading">Projects</h3>
        <ul>
          {items.map((item) => (
            <li key={item.name}>
              <Button onClick={() => handleItemClick(item)}>
                {item.name}
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && currentItem && (
        <div className="modal" onClick={closeModal} role="presentation">
          <div
            className="modalContent"
            role="dialog"
            aria-modal="true"
            aria-label={currentItem.name}
            onClick={(event) => event.stopPropagation()}
          >
            <button className="closeButton" type="button" onClick={closeModal} aria-label="Close project">
              X
            </button>
            <currentItem.Content />
          </div>
        </div>
      )}
    </section>
  );
}

export default PortfolioItems;

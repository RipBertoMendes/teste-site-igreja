import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Carousel.module.css';

function Carousel() {
  const slides = [
    { src: '/assets/carousel-img1.png', alt: 'Imagem 1', title: 'Bem-vindo ao Nosso Site!', text: 'Explore nossos ministérios e princípios.', link: '/' },
    { src: '/assets/carousel-img2.png', alt: 'Imagem 2', title: 'Conheça Nossos Princípios', text: 'Um lugar de acolhimento e fé.', link: '/principios' },
    { src: '/assets/carousel-img3.png', alt: 'Imagem 3', title: 'Participe de Nossos Eventos', text: 'Fique por dentro da nossa agenda.', link: '/eventos' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  };
  
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };
  
  useEffect(() => {
    const timer = setTimeout(goToNext, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const sliderStyles = {
    transform: `translateX(-${currentIndex * 100}%)`
  };

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.slider} style={sliderStyles}>
        {slides.map((slide, index) => (
          <div className={styles.slide} key={index}>
            <Link to={slide.link}>
              <img src={slide.src} alt={slide.alt} className={styles.carouselImage} />
              <div className={styles.carouselText}>
                <h2>{slide.title}</h2>
                <p>{slide.text}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
      
      <button onClick={goToPrevious} className={`${styles.arrow} ${styles.leftArrow}`}>&#10094;</button>
      <button onClick={goToNext} className={`${styles.arrow} ${styles.rightArrow}`}>&#10095;</button>
      
      <div className={styles.dotsContainer}>
        {slides.map((_, index) => (
          <div 
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
            onClick={() => setCurrentIndex(index)}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Carousel;
import React from 'react';
import styles from './Eventos.module.css';

function Eventos() {
  const events = [
    {
      imgSrc: '/assets/evento-conferencia.jpg',
      title: 'Conferência Anual',
      date: '15-17 de Outubro',
      description: 'Nossa conferência anual com preletores convidados, workshops e momentos de comunhão.'
    },
    {
      imgSrc: '/assets/evento-social.jpg',
      title: 'Ação Social Comunitária',
      date: '25 de Novembro',
      description: 'Um dia dedicado a servir nossa comunidade local com doações, serviços e apoio.'
    },
    {
      imgSrc: '/assets/evento-jovens.jpg',
      title: 'Acampamento de Jovens',
      date: '05-08 de Dezembro',
      description: 'Um tempo de diversão, amizade e crescimento espiritual para a nossa juventude.'
    }
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Nossos Eventos</h1>
      <div className={styles.eventGrid}>
        {events.map((event, index) => (
          <div key={index} className={styles.eventCard}>
            <img src={event.imgSrc} alt={event.title} />
            <h3>{event.title}</h3>
            <p className={styles.eventDate}>{event.date}</p>
            <p>{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Eventos;
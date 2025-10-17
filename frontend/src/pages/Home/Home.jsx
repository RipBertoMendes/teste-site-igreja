import React from 'react';
import styles from './Home.module.css';
import Carousel from '../../components/Carousel/Carousel';

function Home() {
  return (
    <div className={styles.homeContainer}>
      <Carousel />

      <section className={styles.sectionGrid}>
        <div className={`${styles.gridItem} ${styles.textRight}`}>
          <div className={styles.imageWrapper}>
            <img src="/assets/quem-somos.png" alt="Quem Somos" />
          </div>
          <div className={styles.contentWrapper}>
            <h2>Quem Somos</h2>
            <p>Somos uma comunidade dedicada a...</p>
            <p>Nossa missão é promover valores de solidariedade, fé e esperança. Através de diversas iniciativas, buscamos impactar positivamente a vida das pessoas e da sociedade em geral.</p>
          </div>
        </div>

        <div className={`${styles.gridItem} ${styles.textRight}`}>
          <div className={styles.contentWrapper}>
            <h2>Nossa História</h2>
            <p>Fundada em 1960, nossa instituição tem uma rica história de serviço e crescimento. Começamos com um pequeno grupo e, ao longo dos anos, expandimos nossas atividades e alcance.</p>
            <p>Cada passo de nossa jornada foi marcado pela dedicação de voluntários e membros, construindo um legado de impacto e transformação.</p>
          </div>
          <div className={styles.imageWrapper}>
            <img src="/assets/nossa-historia.png" alt="Nossa História" />
          </div>
        </div>

        <div className={`${styles.gridItem} ${styles.textRight}`}>
          <div className={styles.imageWrapper}>
            <img src="/assets/localizacao.png" alt="Nossa Localização" />
          </div>
          <div className={styles.contentWrapper}>
            <h2>Nossa Localização</h2>
            <p>Estamos localizados no coração da cidade, em um espaço acolhedor e acessível para todos.</p>
            <p>Venha nos visitar e conhecer de perto o trabalho que realizamos. Nosso endereço é: Av. Barão de Mauá, 718 - Vila Bocaina, Mauá - SP, 09310-000</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
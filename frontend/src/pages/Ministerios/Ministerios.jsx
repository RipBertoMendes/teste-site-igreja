import React from 'react';
import styles from './Ministerios.module.css';

function Ministerios() {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Nossos Ministérios</h1>
      <div className={styles.ministryGrid}>
        <div className={styles.ministryCard}>
          <img src="/assets/ministerio01.png" alt="Ministério de Educação" />
          <h3>Ministério de Educação</h3>
          <p>Oferecemos programas de formação e capacitação para todas as idades, focando no desenvolvimento integral.</p>
        </div>
        <div className={styles.ministryCard}>
          <img src="/assets/ministerio02.png" alt="Ministério Social" />
          <h3>Ministério Social</h3>
          <p>Trabalhamos com ações sociais, apoio a comunidades carentes e projetos de voluntariado.</p>
        </div>
        <div className={styles.ministryCard}>
          <img src="/assets/ministerio03.png" alt="Ministério de Música" />
          <h3>Ministério de Música</h3>
          <p>Através da música, promovemos a cultura e a expressão artística, enriquecendo a experiência comunitária.</p>
        </div>
      </div>
    </div>
  );
}

export default Ministerios;
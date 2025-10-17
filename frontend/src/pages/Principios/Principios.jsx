import React from 'react';
import styles from './Principios.module.css';

function Principios() {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Nossos Princípios</h1>
      <div className={styles.principlesList}>
        <div className={styles.principleItem}>
          <h2 className={styles.principleTitle}>1. Integridade</h2>
          <p>Agimos com honestidade e transparência em todas as nossas relações e atividades, buscando a retidão em cada passo.</p>
        </div>
        <div className={styles.principleItem}>
          <h2 className={styles.principleTitle}>2. Respeito</h2>
          <p>Valorizamos a diversidade e tratamos a todos com dignidade, reconhecendo a singularidade de cada indivíduo.</p>
        </div>
        <div className={styles.principleItem}>
          <h2 className={styles.principleTitle}>3. Serviço</h2>
          <p>Estamos comprometidos em servir a comunidade com dedicação e empatia, buscando o bem-estar coletivo.</p>
        </div>
        <div className={styles.principleItem}>
          <h2 className={styles.principleTitle}>4. Crescimento</h2>
          <p>Buscamos o constante aprendizado e desenvolvimento, tanto individual quanto coletivo, para superar desafios e inovar.</p>
        </div>
      </div>
    </div>
  );
}

export default Principios;
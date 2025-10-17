import React from 'react';
import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <h3>Fale Conosco</h3>
        <p>Email: PIBmaua@gmail.com  |  Telefone: (11) 4514-7215</p>
        <p></p>
        <p>Endereço: Av. Barão de Mauá, 718 - Vila Bocaina, Mauá - SP</p>
      </div>
      <div className={styles.copy}>
        <p>&copy; {new Date().getFullYear()} Meu Projeto. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './NavBar.module.css';

function NavBar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">
          <img src="/assets/logo.png" alt="Logo" className={styles.logoImg} />
        </Link>
      </div>

      <div 
        className={`${styles.hamburger} ${menuOpen ? styles.active : ''}`} 
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </div>

      <ul className={`${styles.navMenu} ${menuOpen ? styles.active : ''}`}>
        <li><Link to="/ministerios" className={styles.navLink} onClick={() => setMenuOpen(false)}>Nossos Ministérios</Link></li>
        <li><Link to="/principios" className={styles.navLink} onClick={() => setMenuOpen(false)}>Nossos Princípios</Link></li>
        <li><Link to="/eventos" className={styles.navLink} onClick={() => setMenuOpen(false)}>Eventos</Link></li>
        {user ? (
          <>
            <li><Link to="/perfil" className={styles.navLink} onClick={() => setMenuOpen(false)}>Perfil</Link></li>
            <li><button onClick={() => { logout(); setMenuOpen(false); }} className={`${styles.navLink} ${styles.logoutButton}`}>Sair</button></li>
          </>
        ) : (
          <li><Link to="/login" className={styles.navLink} onClick={() => setMenuOpen(false)}>Login</Link></li>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
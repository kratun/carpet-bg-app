import { useState } from "react";
import { Link } from "react-router-dom";

import logo from "../../assets/logo.png";
import styles from "./Header.module.css";

export default function Header({ isLoggedIn, onLogin, onLogout }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={logo}></img>
      </div>

      <nav className={styles.nav}>
        <Link to="/" className={styles.navLink}>
          Начало
        </Link>
        <Link to="/orders" className={styles.navLink}>
          Поръчки
        </Link>
        <Link to="/orders/steps/logistic-orders" className={styles.navLink}>
          Logistic
        </Link>
        <Link to="/orders/steps/arrange-pickup" className={styles.navLink}>
          Arrange pick up
        </Link>
        <Link to="/orders/steps/process-washing" className={styles.navLink}>
          Process washing
        </Link>
        <Link to="/orders/steps/setup-delivery" className={styles.navLink}>
          Setup delivery
        </Link>
        <Link to="/about" className={styles.navLink}>
          За нас
        </Link>
      </nav>

      <div className={styles.auth}>
        {isLoggedIn ? (
          <div className={styles.profile}>
            <button
              className={styles.profileButton}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              👤 Профил
            </button>
            {showProfileMenu && (
              <div className={styles.dropdown}>
                <button onClick={onLogout}>Изход</button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={onLogin} className={styles.loginButton}>
            Вход
          </button>
        )}
      </div>
    </header>
  );
}

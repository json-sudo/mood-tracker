import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SettingsModal } from '../settings';
import styles from './Header.module.scss';
import logo from '../../assets/images/logo.svg';
import avatarPlaceholder from '../../assets/images/avatar-placeholder.svg';
import iconSettings from '../../assets/images/icon-settings.svg';
import iconLogout from '../../assets/images/icon-logout.svg';
import iconDropdownArrow from '../../assets/images/icon-dropdown-arrow.svg';

export function Header() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleSettingsClick = () => {
    setIsDropdownOpen(false);
    setIsSettingsOpen(true);
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
  };

  return (
    <>
      <header className={styles.header}>
        <a href="/" className={styles.logoLink}>
          <img src={logo} alt="Mood Tracker" className={styles.logoIcon} />
        </a>

        <div className={styles.userMenu} ref={dropdownRef}>
          <button
            className={styles.avatarButton}
            onClick={toggleDropdown}
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            <img
              src={user?.avatar_url || avatarPlaceholder}
              alt={user?.name || 'User'}
              className={styles.avatar}
            />
            <img
              src={iconDropdownArrow}
              alt=""
              className={`${styles.dropdownArrow} ${isDropdownOpen ? styles.open : ''}`}
            />
          </button>

          {isDropdownOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <img
                  src={user?.avatar_url || avatarPlaceholder}
                  alt=""
                  className={styles.dropdownAvatar}
                />
                <span className={styles.dropdownName}>{user?.name}</span>
              </div>

              <div className={styles.dropdownDivider} />

              <button className={styles.dropdownItem} onClick={handleSettingsClick}>
                <img src={iconSettings} alt="" className={styles.dropdownItemIcon} />
                <span>Settings</span>
              </button>

              <button className={styles.dropdownItem} onClick={handleLogout}>
                <img src={iconLogout} alt="" className={styles.dropdownItemIcon} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
}

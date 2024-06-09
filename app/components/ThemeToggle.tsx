import { useTheme } from '../../app/context/ThemeContext';
import LogoutButton from './LogoutButton';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <button
        onClick={toggleTheme}
        style={{ padding: '10px', backgroundColor: '#333', color: '#fff', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}
      >
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
      <LogoutButton />
    </div>
  );
};

export default ThemeToggle;

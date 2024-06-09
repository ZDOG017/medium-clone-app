import { useAuth } from '../../app/context/AuthContext';

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();

  return (
    <button onClick={logout} className="p-2 bg-red-600 text-white rounded">
      Logout
    </button>
  );
};

export default LogoutButton;

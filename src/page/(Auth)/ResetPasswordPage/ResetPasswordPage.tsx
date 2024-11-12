import { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ResetPasswordForm: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/reset-password',
        {
          email,
          password,
        }
      );

      console.log(response);
      setMessage('Contraseña actualizada con éxito');
    } catch (error) {
      console.error(error);
      setMessage('Error al actualizar la contraseña');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Restablecer Contraseña</h2>
      {message && <p>{message}</p>}
      <div>
        <label>Nueva Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Confirmar Contraseña:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Restablecer Contraseña</button>
    </form>
  );
};

export default ResetPasswordForm;

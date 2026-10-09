import { Eye, EyeOff } from 'lucide-react';
import { useState, type InputHTMLAttributes } from 'react';

/** Campo de contraseña con botón para mostrarla. El botón indica su estado con aria-pressed. */
export function PasswordInput({ className, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  const [visible, setVisible] = useState(false);
  return (
    <span className="password-input">
      <input type={visible ? 'text' : 'password'} className={['control', 'password-input__control', className].filter(Boolean).join(' ')} {...props} />
      <button
        type="button"
        className="icon-button password-input__toggle"
        aria-label="Mostrar contraseña"
        aria-pressed={visible}
        onClick={() => setVisible((v) => !v)}
      >
        {visible ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
      </button>
    </span>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Mail, Lock, AlertCircle, Info } from 'lucide-react';
import { Button, Input, Card } from '../../components/ui';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      // Todos los usuarios van al Dashboard después del login
      navigate('/app/dashboard', { replace: true });
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Logo y Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Shield className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            SIRECOVIP
          </h1>
          <p className="mt-2 text-base text-gray-600">
            Sistema de Registro y Control de Viviendas Prioritarias
          </p>
        </div>

        {/* Privacy Notice */}
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-md p-4">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-amber-900">Aviso de Privacidad</h3>
              <p className="text-xs text-amber-800 mt-1">
                Este sistema es de uso exclusivo para personal autorizado.
                Toda actividad es registrada y monitoreada.
              </p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <Card variant="elevated">
          <Card.Content className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 rounded-md p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-sm text-red-800">{error}</span>
                  </div>
                </div>
              )}

              <Input
                id="email"
                name="email"
                type="email"
                label="Correo electrónico"
                icon={Mail}
                iconPosition="left"
                placeholder="usuario@sirecovip.gob.pe"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />

              <Input
                id="password"
                name="password"
                type="password"
                label="Contraseña"
                icon={Lock}
                iconPosition="left"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />

              <Button
                type="submit"
                variant="default"
                size="lg"
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  'Iniciar sesión'
                )}
              </Button>
            </form>
          </Card.Content>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-600">
            Gobierno del Perú - Ministerio de Vivienda, Construcción y Saneamiento
          </p>
          <p className="text-xs text-gray-500 mt-1">
            v1.0.0 - Sistema Seguro
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

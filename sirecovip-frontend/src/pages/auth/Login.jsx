import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Mail, Lock, AlertCircle, Info } from 'lucide-react';
import { Button, Input, Card } from '../../components/ui';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!acceptedPrivacy) {
      setError('Debes aceptar el Aviso de Privacidad para continuar');
      return;
    }

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
            Sistema de Registro de Comerciantes
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Dirección de Inspección en Comercio y Espectáculos
          </p>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-md p-4">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-900">Información Importante</h3>
              <p className="text-xs text-blue-800 mt-1">
                Sistema de uso exclusivo para personal autorizado de la Dirección de Inspección en Comercio y Espectáculos del Municipio de Querétaro.
              </p>
              <p className="text-xs text-blue-700 mt-2">
                Toda actividad es registrada y monitoreada conforme a la normativa vigente.
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
                placeholder="correo@queretaro.gob.mx"
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

              {/* Checkbox de Aviso de Privacidad */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="privacy"
                    name="privacy"
                    type="checkbox"
                    checked={acceptedPrivacy}
                    onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="privacy" className="text-sm text-gray-700 cursor-pointer">
                    Acepto el{' '}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Aviso de Privacidad:\n\nLos datos personales recabados a través de este sistema serán utilizados exclusivamente para el registro y control de comerciantes por parte de la Dirección de Inspección en Comercio y Espectáculos del Municipio de Querétaro.\n\nSistema desarrollado por KODOMA para uso interno de la dependencia.\n\nLos datos serán tratados de manera confidencial conforme a la Ley de Protección de Datos Personales en Posesión de Sujetos Obligados del Estado de Querétaro.');
                      }}
                      className="font-medium text-blue-600 hover:text-blue-500 underline"
                    >
                      Aviso de Privacidad
                    </a>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                variant="default"
                size="lg"
                disabled={loading || !acceptedPrivacy}
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
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-700 font-medium">
            Municipio de Querétaro
          </p>
          <p className="text-xs text-gray-600">
            Dirección de Inspección en Comercio y Espectáculos
          </p>
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Sistema desarrollado por{' '}
              <span className="font-semibold text-blue-600">KODOMA</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              v1.0.0 - Sistema Seguro y Cifrado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

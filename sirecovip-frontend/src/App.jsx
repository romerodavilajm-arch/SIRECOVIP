import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedLayout from './layouts/ProtectedLayout';
import Login from './pages/auth/Login';
import MapView from './pages/inspector/MapView';
import Dashboard from './pages/coordinator/Dashboard';
import MerchantDetail from './pages/inspector/MerchantDetail';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/app" element={<ProtectedLayout />}>
            {/* Ruta por defecto: redirigir a dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />

            {/* Rutas accesibles para ambos roles */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="map" element={<MapView />} />

            {/* Rutas de comerciantes */}
            <Route path="merchants/new" element={<MerchantDetail />} />
            <Route path="merchants/:id" element={<MerchantDetail />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

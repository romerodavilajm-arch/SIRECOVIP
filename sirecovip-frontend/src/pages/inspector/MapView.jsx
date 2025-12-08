import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Plus, Filter, Search, MapPin, Store, Eye, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, Button, Input, Select, Badge } from '../../components/ui';
import SidebarLayout from '../../components/layouts/SidebarLayout';

const MapView = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Opciones de filtro
  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'sin-foco', label: 'Sin Foco' },
    { value: 'en-observacion', label: 'En Observación' },
    { value: 'foco-detectado', label: 'Foco Detectado' },
  ];

  // Comerciantes recientes (dummy data para el panel lateral)
  const recentMerchants = [
    {
      id: 1,
      name: 'Bodega El Sol',
      address: 'Av. Principal 123',
      status: 'sin-foco',
      lastInspection: '2024-12-05',
    },
    {
      id: 2,
      name: 'Restaurant La Mar',
      address: 'Jr. Los Pinos 456',
      status: 'en-observacion',
      lastInspection: '2024-12-04',
    },
    {
      id: 3,
      name: 'Pollería El Sabroso',
      address: 'Calle Real 789',
      status: 'rechazado',
      lastInspection: '2024-12-03',
    },
  ];

  // Estadísticas rápidas
  const quickStats = [
    { label: 'Sin Foco', value: 45, color: 'text-green-600', icon: CheckCircle },
    { label: 'En Observación', value: 12, color: 'text-amber-600', icon: Eye },
    { label: 'Focos', value: 8, color: 'text-red-600', icon: AlertTriangle },
  ];

  return (
    <SidebarLayout>
      <div className="flex h-full">
        {/* Map Container - Main Area */}
        <div className="flex-1 flex flex-col">
          {/* Header con controles */}
          <div className="bg-white border-b border-gray-200 p-4 space-y-4">
            <div>
              <h1 className="text-h2 text-gray-900">Mapa de Comerciantes</h1>
              <p className="text-body-sm text-gray-600 mt-1">
                Vista geográfica de comerciantes en tu zona
              </p>
            </div>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  icon={Search}
                  iconPosition="left"
                  placeholder="Buscar por nombre o dirección..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="sm:w-64">
                <Select
                  icon={Filter}
                  options={statusOptions}
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-6">
              {quickStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="flex items-center gap-2">
                    <Icon size={18} className={stat.color} />
                    <span className="text-body-sm text-gray-700">
                      <span className="font-semibold">{stat.value}</span> {stat.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="flex-1 bg-gray-100 relative">
            {/* Placeholder del mapa */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-h3 text-gray-900 mb-2">Mapa Interactivo</h3>
                <p className="text-body text-gray-600 mb-4 max-w-md">
                  Aquí se mostrará el mapa interactivo con los comerciantes geolocalizados
                </p>
                <div className="flex items-center justify-center gap-2 text-body-sm text-gray-500">
                  <Map size={16} />
                  <span>Integración con Google Maps / Leaflet pendiente</span>
                </div>
              </div>
            </div>

            {/* Botón flotante de agregar (alternativo) */}
            <div className="absolute bottom-6 right-6">
              <Button
                variant="default"
                size="lg"
                className="rounded-full shadow-xl hover:shadow-2xl gap-2"
                onClick={() => navigate('/app/merchants/new')}
              >
                <Plus size={24} />
                <span className="hidden sm:inline">Nuevo Comerciante</span>
              </Button>
            </div>

            {/* Leyenda del mapa */}
            <Card className="absolute top-4 right-4 w-64">
              <Card.Header className="pb-3">
                <Card.Title as="h4">Leyenda</Card.Title>
              </Card.Header>
              <Card.Content className="space-y-2 pt-0">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-body-sm text-gray-700">Sin Foco</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                  <span className="text-body-sm text-gray-700">En Observación</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span className="text-body-sm text-gray-700">Foco Detectado</span>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>

        {/* Panel Lateral - Lista de Comerciantes */}
        <div className="hidden lg:block w-96 border-l border-gray-200 bg-white overflow-y-auto scrollbar-thin">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-h4 text-gray-900">Comerciantes Cercanos</h2>
            <p className="text-caption text-gray-600 mt-1">
              {recentMerchants.length} en tu área
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {recentMerchants.map((merchant) => (
              <div
                key={merchant.id}
                className="p-4 hover:bg-blue-50 cursor-pointer transition-colors duration-150"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Store className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-body-sm font-semibold text-gray-900 truncate">
                        {merchant.name}
                      </h3>
                      <p className="text-caption text-gray-600 mt-0.5">
                        {merchant.address}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between ml-13">
                  <Badge variant={merchant.status} size="sm">
                    {merchant.status === 'sin-foco' && 'Sin Foco'}
                    {merchant.status === 'en-observacion' && 'En Observación'}
                    {merchant.status === 'rechazado' && 'Foco'}
                  </Badge>
                  <span className="text-caption text-gray-500">
                    {new Date(merchant.lastInspection).toLocaleDateString('es-PE', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Ver todos */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => navigate('/app/merchants')}
            >
              Ver todos los comerciantes
            </Button>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default MapView;

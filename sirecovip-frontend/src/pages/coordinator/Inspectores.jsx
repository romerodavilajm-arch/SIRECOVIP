import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Users, User, MapPin, Store, Mail, Phone, Calendar, TrendingUp,
  Eye, Search, Filter
} from 'lucide-react';
import { Card, Badge, Input, Select } from '../../components/ui';
import SidebarLayout from '../../components/layouts/SidebarLayout';
import userService from '../../services/userService';
import merchantService from '../../services/merchantService';

const Inspectores = () => {
  const { user } = useAuth();
  const [inspectors, setInspectors] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterZone, setFilterZone] = useState('all');

  // Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersData, merchantsData] = await Promise.all([
          userService.getUsers(),
          merchantService.getMerchants(),
        ]);

        // Filtrar solo inspectores
        const inspectorsOnly = usersData.filter(u => u.role === 'inspector');
        setInspectors(inspectorsOnly);
        setMerchants(merchantsData);
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Error al cargar los datos de inspectores');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Obtener zonas únicas
  const zones = [...new Set(inspectors.map(i => i.assigned_zone).filter(Boolean))].sort();

  // Filtrar inspectores
  const filteredInspectors = inspectors.filter(inspector => {
    const matchesSearch = searchTerm === '' ||
      inspector.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspector.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesZone = filterZone === 'all' || inspector.assigned_zone === filterZone;

    return matchesSearch && matchesZone;
  });

  // Calcular métricas por inspector
  const getInspectorStats = (inspectorId) => {
    const inspectorMerchants = merchants.filter(m => m.registered_by === inspectorId);
    const total = inspectorMerchants.length;
    const sinFoco = inspectorMerchants.filter(m => m.status === 'sin-foco').length;
    const enObservacion = inspectorMerchants.filter(m => m.status === 'en-observacion').length;
    const prioritarios = inspectorMerchants.filter(m => m.status === 'prioritario').length;

    return { total, sinFoco, enObservacion, prioritarios };
  };

  // Calcular estadísticas generales
  const generalStats = {
    totalInspectors: inspectors.length,
    activeInspectors: inspectors.filter(i => {
      const stats = getInspectorStats(i.id);
      return stats.total > 0;
    }).length,
    totalMerchants: merchants.length,
    averageMerchantsPerInspector: inspectors.length > 0
      ? Math.round(merchants.length / inspectors.length)
      : 0,
  };

  if (loading) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando inspectores...</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Gestión de Inspectores</h1>
              <p className="text-blue-100 mt-1">
                Monitorea el desempeño y actividad de los inspectores de campo
              </p>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="p-4 bg-red-50 border-red-200">
            <p className="text-red-600">{error}</p>
          </Card>
        )}

        {/* Estadísticas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Total Inspectores</p>
                <p className="text-2xl font-bold text-gray-900">{generalStats.totalInspectors}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Inspectores Activos</p>
                <p className="text-2xl font-bold text-gray-900">{generalStats.activeInspectors}</p>
                <p className="text-xs text-gray-500">Con registros</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Store className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Total Registros</p>
                <p className="text-2xl font-bold text-gray-900">{generalStats.totalMerchants}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Promedio por Inspector</p>
                <p className="text-2xl font-bold text-gray-900">{generalStats.averageMerchantsPerInspector}</p>
                <p className="text-xs text-gray-500">registros</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nombre o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={filterZone}
              onChange={(e) => setFilterZone(e.target.value)}
            >
              <option value="all">Todas las zonas</option>
              {zones.map(zone => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </Select>
          </div>

          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <Filter className="h-4 w-4" />
            <span>
              Mostrando {filteredInspectors.length} de {inspectors.length} inspectores
            </span>
          </div>
        </Card>

        {/* Lista de Inspectores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredInspectors.length === 0 ? (
            <Card className="p-8 col-span-2">
              <div className="text-center text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="text-lg font-medium">No se encontraron inspectores</p>
                <p className="text-sm mt-1">
                  {searchTerm || filterZone !== 'all'
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Aún no hay inspectores registrados'}
                </p>
              </div>
            </Card>
          ) : (
            filteredInspectors.map((inspector) => {
              const stats = getInspectorStats(inspector.id);
              const isActive = stats.total > 0;

              return (
                <Card key={inspector.id} className="p-6 hover:shadow-lg transition-shadow">
                  {/* Header del Inspector */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                      {inspector.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'IN'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {inspector.name || 'Sin nombre'}
                        </h3>
                        {isActive && (
                          <Badge variant="success" size="sm">Activo</Badge>
                        )}
                      </div>
                      {inspector.assigned_zone && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                          <MapPin className="h-4 w-4" />
                          <span>{inspector.assigned_zone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{inspector.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Estadísticas del Inspector */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                      <p className="text-xs text-gray-600">Total</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{stats.sinFoco}</p>
                      <p className="text-xs text-gray-600">Sin Foco</p>
                    </div>
                    <div className="text-center p-3 bg-amber-50 rounded-lg">
                      <p className="text-2xl font-bold text-amber-600">{stats.enObservacion}</p>
                      <p className="text-xs text-gray-600">Observación</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{stats.prioritarios}</p>
                      <p className="text-xs text-gray-600">Prioritarios</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Desde {new Date(inspector.created_at).toLocaleDateString('es-MX', {
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    {isActive && (
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-medium">Activo</span>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Inspectores;

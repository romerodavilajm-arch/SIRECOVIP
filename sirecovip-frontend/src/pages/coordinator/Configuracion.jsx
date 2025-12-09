import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Building2, Users, Store, MapPin, Calendar, TrendingUp,
  Search, Filter, Info, CheckCircle, AlertCircle, Eye
} from 'lucide-react';
import { Card, Badge, Input } from '../../components/ui';
import SidebarLayout from '../../components/layouts/SidebarLayout';
import merchantService from '../../services/merchantService';

const Configuracion = () => {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [orgsData, merchantsData] = await Promise.all([
          merchantService.getOrganizations(),
          merchantService.getMerchants(),
        ]);

        setOrganizations(orgsData);
        setMerchants(merchantsData);
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Error al cargar los datos de organizaciones');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar organizaciones
  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = searchTerm === '' ||
      org.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.leader_name?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Calcular estadísticas por organización
  const getOrganizationStats = (orgId) => {
    const orgMerchants = merchants.filter(m => m.organization_id === orgId);
    const total = orgMerchants.length;
    const sinFoco = orgMerchants.filter(m => m.status === 'sin-foco').length;
    const enObservacion = orgMerchants.filter(m => m.status === 'en-observacion').length;
    const prioritarios = orgMerchants.filter(m => m.status === 'prioritario').length;

    return { total, sinFoco, enObservacion, prioritarios };
  };

  // Calcular estadísticas generales
  const generalStats = {
    totalOrganizations: organizations.length,
    activeOrganizations: organizations.filter(org => {
      const stats = getOrganizationStats(org.id);
      return stats.total > 0;
    }).length,
    totalMembers: organizations.reduce((sum, org) => sum + (org.member_count || 0), 0),
    totalMerchants: merchants.length,
  };

  if (loading) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando organizaciones...</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Gestión de Organizaciones</h1>
              <p className="text-purple-100 mt-1">
                Consulta y monitoreo de organizaciones registradas en el sistema
              </p>
            </div>
          </div>
        </div>

        {/* Info Alert - Modo Solo Lectura */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 mb-1">Modo Observación</h3>
              <p className="text-sm text-blue-700">
                Esta página muestra información de solo lectura sobre las organizaciones registradas en el sistema.
                Para editar, agregar o eliminar organizaciones, contacta al administrador del sistema.
              </p>
            </div>
          </div>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-600">{error}</p>
            </div>
          </Card>
        )}

        {/* Estadísticas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Total Organizaciones</p>
                <p className="text-2xl font-bold text-gray-900">{generalStats.totalOrganizations}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Organizaciones Activas</p>
                <p className="text-2xl font-bold text-gray-900">{generalStats.activeOrganizations}</p>
                <p className="text-xs text-gray-500">Con comerciantes</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Total Miembros</p>
                <p className="text-2xl font-bold text-gray-900">{generalStats.totalMembers}</p>
                <p className="text-xs text-gray-500">En organizaciones</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Store className="h-6 w-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Total Comerciantes</p>
                <p className="text-2xl font-bold text-gray-900">{generalStats.totalMerchants}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filtro de Búsqueda */}
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre de organización o líder..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <Filter className="h-4 w-4" />
            <span>
              Mostrando {filteredOrganizations.length} de {organizations.length} organizaciones
            </span>
          </div>
        </Card>

        {/* Lista de Organizaciones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredOrganizations.length === 0 ? (
            <Card className="p-8 col-span-2">
              <div className="text-center text-gray-500">
                <Building2 className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="text-lg font-medium">No se encontraron organizaciones</p>
                <p className="text-sm mt-1">
                  {searchTerm
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Aún no hay organizaciones registradas en el sistema'}
                </p>
              </div>
            </Card>
          ) : (
            filteredOrganizations.map((org) => {
              const stats = getOrganizationStats(org.id);
              const isActive = stats.total > 0;

              return (
                <Card key={org.id} className="p-6 hover:shadow-lg transition-shadow">
                  {/* Header de la Organización */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                      <Building2 className="h-8 w-8" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {org.name || 'Sin nombre'}
                        </h3>
                        {isActive && (
                          <Badge variant="success" size="sm">Activa</Badge>
                        )}
                      </div>
                      {org.leader_name && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                          <Users className="h-4 w-4" />
                          <span>Líder: {org.leader_name}</span>
                        </div>
                      )}
                      {org.address && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{org.address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Información Adicional */}
                  <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Miembros</p>
                      <p className="text-lg font-bold text-gray-900">{org.member_count || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Tipo</p>
                      <Badge variant="default" size="sm">
                        {org.organization_type || 'No especificado'}
                      </Badge>
                    </div>
                  </div>

                  {/* Estadísticas de Comerciantes */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Comerciantes Registrados</p>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                        <p className="text-xs text-gray-600">Total</p>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded-lg">
                        <p className="text-xl font-bold text-green-600">{stats.sinFoco}</p>
                        <p className="text-xs text-gray-600">Sin Foco</p>
                      </div>
                      <div className="text-center p-2 bg-amber-50 rounded-lg">
                        <p className="text-xl font-bold text-amber-600">{stats.enObservacion}</p>
                        <p className="text-xs text-gray-600">Observ.</p>
                      </div>
                      <div className="text-center p-2 bg-red-50 rounded-lg">
                        <p className="text-xl font-bold text-red-600">{stats.prioritarios}</p>
                        <p className="text-xs text-gray-600">Priorit.</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Desde {new Date(org.created_at).toLocaleDateString('es-MX', {
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Eye className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">Solo lectura</span>
                    </div>
                  </div>

                  {/* Contacto (si existe) */}
                  {(org.contact_phone || org.contact_email) && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Contacto</p>
                      <div className="space-y-1">
                        {org.contact_phone && (
                          <p className="text-sm text-gray-600">📞 {org.contact_phone}</p>
                        )}
                        {org.contact_email && (
                          <p className="text-sm text-gray-600 truncate">✉️ {org.contact_email}</p>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Configuracion;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Plus, Eye, Filter, Store
} from 'lucide-react';
import { Button, Input, Select, Card, Badge } from '../../components/ui';
import SidebarLayout from '../../components/layouts/SidebarLayout';
import merchantService from '../../services/merchantService';

const MerchantList = () => {
  const navigate = useNavigate();

  // Estados principales
  const [merchants, setMerchants] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Opciones de status
  const statusOptions = [
    { value: '', label: 'Todos los estatus' },
    { value: 'sin-foco', label: 'Sin Foco' },
    { value: 'en-observacion', label: 'En Observación' },
    { value: 'prioritario', label: 'Prioritario' },
  ];

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Cargar comerciantes y organizaciones en paralelo
        const [merchantsData, organizationsData] = await Promise.all([
          merchantService.getMerchants(),
          merchantService.getOrganizations()
        ]);

        setMerchants(merchantsData);
        setOrganizations([
          { value: '', label: 'Todas las organizaciones' },
          ...organizationsData.map(org => ({
            value: org.id,
            label: org.name
          }))
        ]);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Error al cargar los datos. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar comerciantes
  const filteredMerchants = merchants.filter(merchant => {
    // Filtro por búsqueda de texto (nombre o giro)
    const matchesSearch = searchTerm === '' ||
      merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.business.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro por organización
    const matchesOrganization = selectedOrganization === '' ||
      merchant.organization_id === selectedOrganization;

    // Filtro por status
    const matchesStatus = selectedStatus === '' ||
      merchant.status === selectedStatus;

    return matchesSearch && matchesOrganization && matchesStatus;
  });

  // Mapear status a variantes de Badge
  const getStatusBadgeVariant = (status) => {
    const variants = {
      'sin-foco': 'sin-foco',
      'en-observacion': 'en-observacion',
      'prioritario': 'danger',
    };
    return variants[status] || 'default';
  };

  // Mapear status a labels legibles
  const getStatusLabel = (status) => {
    const labels = {
      'sin-foco': 'Sin Foco',
      'en-observacion': 'En Observación',
      'prioritario': 'Prioritario',
    };
    return labels[status] || status;
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedOrganization('');
    setSelectedStatus('');
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = searchTerm !== '' || selectedOrganization !== '' || selectedStatus !== '';

  return (
    <SidebarLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold text-gray-900">
              Tabla de Comerciantes
            </h1>
            <p className="text-base text-gray-600 mt-2">
              Listado completo de comerciantes registrados
            </p>
          </div>
          <Button
            onClick={() => navigate('/app/merchants/new')}
            variant="default"
            size="md"
          >
            <Plus size={20} />
            Agregar Comerciante
          </Button>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-md p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Card de filtros */}
        <Card variant="default" className="mb-6">
          <Card.Content className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Búsqueda */}
              <div className="md:col-span-2">
                <Input
                  id="search"
                  placeholder="Buscar por nombre o giro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  iconLeft={<Search size={18} />}
                />
              </div>

              {/* Filtro por Organización */}
              <Select
                id="organization"
                placeholder="Filtrar por organización"
                options={organizations}
                value={selectedOrganization}
                onChange={(e) => setSelectedOrganization(e.target.value)}
              />

              {/* Filtro por Status */}
              <Select
                id="status"
                placeholder="Filtrar por estatus"
                options={statusOptions}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              />
            </div>

            {/* Botón para limpiar filtros */}
            {hasActiveFilters && (
              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  <Filter size={16} />
                  Limpiar filtros
                </Button>
              </div>
            )}
          </Card.Content>
        </Card>

        {/* Tabla */}
        <Card variant="default">
          <Card.Content className="p-0">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Cargando comerciantes...</p>
              </div>
            ) : filteredMerchants.length === 0 ? (
              <div className="p-8 text-center">
                <Store className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {hasActiveFilters ? 'No se encontraron comerciantes' : 'No hay comerciantes registrados'}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {hasActiveFilters
                    ? 'Intenta ajustar los filtros para ver más resultados.'
                    : 'Comienza agregando tu primer comerciante.'
                  }
                </p>
                {!hasActiveFilters && (
                  <div className="mt-6">
                    <Button
                      onClick={() => navigate('/app/merchants/new')}
                      variant="default"
                      size="md"
                    >
                      <Plus size={20} />
                      Agregar Comerciante
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giro
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Organización
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estatus
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delegación
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha Registro
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMerchants.map((merchant) => (
                      <tr key={merchant.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {merchant.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {merchant.business}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {merchant.organizations?.name || 'Sin organización'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={getStatusBadgeVariant(merchant.status)}
                            size="sm"
                          >
                            {getStatusLabel(merchant.status)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {merchant.delegation}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {formatDate(merchant.registration_date || merchant.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/app/merchants/${merchant.id}`)}
                            title="Ver Detalles"
                          >
                            <Eye size={18} />
                            <span className="ml-1">Ver Detalles</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card.Content>

          {/* Footer con contadores */}
          {!loading && filteredMerchants.length > 0 && (
            <Card.Footer className="border-t border-gray-200 bg-gray-50 px-6 py-3">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  Mostrando <span className="font-medium text-gray-900">{filteredMerchants.length}</span> de{' '}
                  <span className="font-medium text-gray-900">{merchants.length}</span> comerciantes
                </span>
                {hasActiveFilters && (
                  <span className="text-blue-600">
                    Filtros activos
                  </span>
                )}
              </div>
            </Card.Footer>
          )}
        </Card>
      </div>
    </SidebarLayout>
  );
};

export default MerchantList;

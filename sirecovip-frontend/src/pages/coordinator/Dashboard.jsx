import { useAuth } from '../../context/AuthContext';
import {
  Users, Store, Eye, CheckCircle, AlertTriangle, Clock, TrendingUp,
  MapPin, Calendar, User, FileText, Target
} from 'lucide-react';
import { Card, Badge } from '../../components/ui';
import SidebarLayout from '../../components/layouts/SidebarLayout';

const Dashboard = () => {
  const { user } = useAuth();
  const isInspector = user?.role === 'inspector';
  const isCoordinator = user?.role === 'coordinator';

  // Métricas para Inspector
  const inspectorMetrics = [
    {
      title: 'Mis Registros',
      value: '45',
      subtitle: 'Total de comerciantes',
      icon: Store,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Sin Foco',
      value: '32',
      subtitle: '71% del total',
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'En Observación',
      value: '9',
      subtitle: '20% del total',
      icon: Eye,
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      title: 'Focos Detectados',
      value: '4',
      subtitle: '9% del total',
      icon: AlertTriangle,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
    },
  ];

  // Métricas para Coordinador
  const coordinatorMetrics = [
    {
      title: 'Total Comerciantes',
      value: '1,234',
      subtitle: '+12% vs mes anterior',
      icon: Store,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      trend: 'up',
    },
    {
      title: 'Sin Foco',
      value: '856',
      subtitle: '69% del total',
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      trend: 'up',
    },
    {
      title: 'En Observación',
      value: '247',
      subtitle: '20% del total',
      icon: Eye,
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      trend: 'neutral',
    },
    {
      title: 'Focos Detectados',
      value: '131',
      subtitle: '11% del total',
      icon: AlertTriangle,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      trend: 'down',
    },
  ];

  // Datos personales del inspector (dummy data)
  const inspectorProfile = {
    name: user?.name || 'Juan Pérez',
    email: user?.email || 'juan.perez@sirecovip.gob.pe',
    zone: 'Centro',
    phone: '+51 987 654 321',
    dni: '12345678',
    startDate: '2024-01-15',
  };

  // Actividad reciente del inspector
  const inspectorActivity = [
    {
      id: 1,
      merchant: 'Bodega El Sol',
      action: 'Registré nuevo comerciante',
      status: 'sin-foco',
      time: 'Hace 2 horas',
    },
    {
      id: 2,
      merchant: 'Restaurant La Mar',
      action: 'Actualicé estado',
      status: 'en-observacion',
      time: 'Ayer',
    },
    {
      id: 3,
      merchant: 'Panadería San José',
      action: 'Completé inspección',
      status: 'aprobado',
      time: 'Hace 2 días',
    },
  ];

  // Actividad reciente del coordinador (dummy data)
  const coordinatorActivity = [
    {
      id: 1,
      inspector: 'Juan Pérez',
      action: 'Registró nuevo comerciante',
      merchant: 'Bodega El Sol',
      status: 'sin-foco',
      time: 'Hace 15 minutos',
    },
    {
      id: 2,
      inspector: 'María García',
      action: 'Actualizó estado',
      merchant: 'Restaurant La Mar',
      status: 'en-observacion',
      time: 'Hace 1 hora',
    },
    {
      id: 3,
      inspector: 'Carlos López',
      action: 'Detectó foco',
      merchant: 'Pollería El Sabroso',
      status: 'rechazado',
      time: 'Hace 2 horas',
    },
    {
      id: 4,
      inspector: 'Ana Torres',
      action: 'Completó inspección',
      merchant: 'Panadería San José',
      status: 'aprobado',
      time: 'Hace 3 horas',
    },
  ];

  // Inspectores activos (solo para coordinador)
  const activeInspectors = [
    { id: 1, name: 'Juan Pérez', zone: 'Centro', merchants: 45, status: 'active' },
    { id: 2, name: 'María García', zone: 'Norte', merchants: 38, status: 'active' },
    { id: 3, name: 'Carlos López', zone: 'Sur', merchants: 52, status: 'active' },
    { id: 4, name: 'Ana Torres', zone: 'Este', merchants: 41, status: 'offline' },
  ];

  const metrics = isInspector ? inspectorMetrics : coordinatorMetrics;
  const recentActivity = isInspector ? inspectorActivity : coordinatorActivity;

  return (
    <SidebarLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-semibold text-gray-900">
            {isInspector ? 'Mi Perfil' : 'Dashboard'}
          </h1>
          <p className="text-base text-gray-600 mt-2">
            {isInspector
              ? 'Información personal y estadísticas de tu trabajo'
              : 'Resumen general del sistema de monitoreo'
            }
          </p>
        </div>

        {/* Métricas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} variant="elevated" className="hover:shadow-lg transition-shadow duration-200">
                <Card.Content className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 font-medium mb-2">
                        {metric.title}
                      </p>
                      <p className="text-3xl font-semibold text-gray-900 mb-1">
                        {metric.value}
                      </p>
                      <div className="flex items-center gap-1">
                        {metric.trend === 'up' && (
                          <TrendingUp size={14} className="text-green-600" />
                        )}
                        <p className="text-xs text-gray-500">
                          {metric.subtitle}
                        </p>
                      </div>
                    </div>
                    <div className={`${metric.bgColor} p-3 rounded-xl`}>
                      <Icon className={`h-6 w-6 ${metric.iconColor}`} />
                    </div>
                  </div>
                </Card.Content>
              </Card>
            );
          })}
        </div>

        {/* Layout específico por rol */}
        {isInspector ? (
          // Vista de Inspector
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Datos Personales - 1/3 width */}
            <div className="xl:col-span-1">
              <Card variant="default">
                <Card.Header>
                  <div className="flex items-center justify-between">
                    <div>
                      <Card.Title>Datos Personales</Card.Title>
                      <Card.Description>
                        Información del inspector
                      </Card.Description>
                    </div>
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                </Card.Header>
                <Card.Content className="space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                    <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                      {inspectorProfile.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {inspectorProfile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Inspector de Campo
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Zona Asignada</p>
                        <p className="text-sm font-medium text-gray-900">
                          {inspectorProfile.zone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FileText size={16} className="text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">DNI</p>
                        <p className="text-sm font-medium text-gray-900">
                          {inspectorProfile.dni}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar size={16} className="text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Fecha de Inicio</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(inspectorProfile.startDate).toLocaleDateString('es-PE', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </div>

            {/* Mi Actividad Reciente - 2/3 width */}
            <div className="xl:col-span-2">
              <Card variant="default">
                <Card.Header>
                  <div className="flex items-center justify-between">
                    <div>
                      <Card.Title>Mi Actividad Reciente</Card.Title>
                      <Card.Description>
                        Últimas acciones realizadas
                      </Card.Description>
                    </div>
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                </Card.Header>
                <Card.Content className="p-0">
                  <div className="divide-y divide-gray-200">
                    {inspectorActivity.map((activity) => (
                      <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                              {activity.merchant}
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                              {activity.action}
                            </p>
                            <p className="text-xs text-gray-500">
                              {activity.time}
                            </p>
                          </div>
                          <Badge variant={activity.status} size="sm">
                            {activity.status === 'sin-foco' && 'Sin Foco'}
                            {activity.status === 'en-observacion' && 'En Observación'}
                            {activity.status === 'aprobado' && 'Aprobado'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Content>
              </Card>
            </div>
          </div>
        ) : (
          // Vista de Coordinador
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Actividad Reciente - 2/3 width */}
            <div className="xl:col-span-2">
              <Card variant="default">
                <Card.Header>
                  <div className="flex items-center justify-between">
                    <div>
                      <Card.Title>Actividad Reciente</Card.Title>
                      <Card.Description>
                        Últimas acciones de los inspectores
                      </Card.Description>
                    </div>
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                </Card.Header>
                <Card.Content className="p-0">
                  <div className="divide-y divide-gray-200">
                    {coordinatorActivity.map((activity) => (
                      <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-semibold text-gray-900">
                                {activity.inspector}
                              </p>
                              <span className="text-sm text-gray-500">·</span>
                              <p className="text-sm text-gray-600">
                                {activity.action}
                              </p>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">
                              {activity.merchant}
                            </p>
                            <p className="text-xs text-gray-500">
                              {activity.time}
                            </p>
                          </div>
                          <Badge variant={activity.status} size="sm">
                            {activity.status === 'sin-foco' && 'Sin Foco'}
                            {activity.status === 'en-observacion' && 'En Observación'}
                            {activity.status === 'rechazado' && 'Foco Detectado'}
                            {activity.status === 'aprobado' && 'Aprobado'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Content>
              </Card>
            </div>

            {/* Inspectores Activos - 1/3 width */}
            <div className="xl:col-span-1">
              <Card variant="default">
                <Card.Header>
                  <div className="flex items-center justify-between">
                    <div>
                      <Card.Title>Inspectores</Card.Title>
                      <Card.Description>
                        Estado actual del equipo
                      </Card.Description>
                    </div>
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                </Card.Header>
                <Card.Content className="p-0">
                  <div className="divide-y divide-gray-200">
                    {activeInspectors.map((inspector) => (
                      <div key={inspector.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                              {inspector.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {inspector.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Zona {inspector.zone}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${
                              inspector.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                            }`} />
                          </div>
                        </div>
                        <div className="ml-13">
                          <p className="text-xs text-gray-600">
                            {inspector.merchants} comerciantes asignados
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Content>
              </Card>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default Dashboard;

import { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download, TrendingUp, AlertTriangle, Users, Calendar, FileText } from 'lucide-react';
import { Card, Button, Input } from '../../components/ui';
import SidebarLayout from '../../components/layouts/SidebarLayout';
import merchantService from '../../services/merchantService';

const Reports = () => {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });

  // Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await merchantService.getMerchants();
        setMerchants(data);
      } catch (err) {
        console.error('Error loading merchants:', err);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar comerciantes por rango de fechas
  const filteredMerchants = useMemo(() => {
    if (!dateRange.start && !dateRange.end) return merchants;

    return merchants.filter((merchant) => {
      const createdDate = new Date(merchant.created_at);
      const startDate = dateRange.start ? new Date(dateRange.start) : null;
      const endDate = dateRange.end ? new Date(dateRange.end) : null;

      if (startDate && createdDate < startDate) return false;
      if (endDate && createdDate > endDate) return false;

      return true;
    });
  }, [merchants, dateRange]);

  // KPIs calculados
  const kpis = useMemo(() => {
    const total = filteredMerchants.length;
    const irregulares = filteredMerchants.filter(
      (m) => m.status === 'prioritario'
    ).length;

    const percentIrregulares = total > 0 ? ((irregulares / total) * 100).toFixed(1) : 0;

    // Comerciantes creados este mes
    const now = new Date();
    const thisMonth = filteredMerchants.filter((m) => {
      const createdDate = new Date(m.created_at);
      return (
        createdDate.getMonth() === now.getMonth() &&
        createdDate.getFullYear() === now.getFullYear()
      );
    }).length;

    return {
      total,
      irregulares,
      percentIrregulares,
      nuevosEsteMes: thisMonth,
    };
  }, [filteredMerchants]);

  // Datos para gráfica de barras (por delegación)
  const delegationData = useMemo(() => {
    const grouped = filteredMerchants.reduce((acc, merchant) => {
      const delegation = merchant.delegation || 'Sin Delegación';
      if (!acc[delegation]) {
        acc[delegation] = 0;
      }
      acc[delegation]++;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, cantidad: value }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }, [filteredMerchants]);

  // Datos para gráfica de pastel (por estatus)
  const statusData = useMemo(() => {
    const grouped = filteredMerchants.reduce((acc, merchant) => {
      const status = merchant.status || 'sin-foco';
      if (!acc[status]) {
        acc[status] = 0;
      }
      acc[status]++;
      return acc;
    }, {});

    const statusLabels = {
      'sin-foco': 'Sin Foco',
      'en-observacion': 'En Observación',
      'prioritario': 'Prioritario',
    };

    return Object.entries(grouped).map(([status, value]) => ({
      name: statusLabels[status] || status,
      value,
      status,
    }));
  }, [filteredMerchants]);

  // Colores para el pie chart (alineado con el schema de BD)
  const STATUS_COLORS = {
    'sin-foco': '#10B981', // Verde (green-500)
    'en-observacion': '#F59E0B', // Ámbar (amber-500)
    'prioritario': '#EF4444', // Rojo (red-500)
  };

  // Generar PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Reporte de Comerciantes - SIRECOVIP', 14, 20);

    // Fecha del reporte
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const today = new Date().toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    doc.text(`Fecha del Reporte: ${today}`, 14, 28);

    // Rango de fechas si aplica
    if (dateRange.start || dateRange.end) {
      let rangeText = 'Período: ';
      if (dateRange.start) {
        rangeText += `Desde ${new Date(dateRange.start).toLocaleDateString('es-MX')}`;
      }
      if (dateRange.end) {
        rangeText += ` Hasta ${new Date(dateRange.end).toLocaleDateString('es-MX')}`;
      }
      doc.text(rangeText, 14, 34);
    }

    // KPIs
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen Ejecutivo', 14, 45);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    let yPos = 53;
    doc.text(`Total de Comerciantes: ${kpis.total}`, 14, yPos);
    yPos += 7;
    doc.text(`Comerciantes Irregulares: ${kpis.irregulares} (${kpis.percentIrregulares}%)`, 14, yPos);
    yPos += 7;
    doc.text(`Nuevos Este Mes: ${kpis.nuevosEsteMes}`, 14, yPos);
    yPos += 12;

    // Tabla de delegaciones
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Distribución por Delegación', 14, yPos);
    yPos += 8;

    const tableData = delegationData.map((item) => [
      item.name,
      item.cantidad,
      `${((item.cantidad / kpis.total) * 100).toFixed(1)}%`,
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['Delegación', 'Cantidad', 'Porcentaje']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246], // Azul
        textColor: 255,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 10,
      },
    });

    // Tabla de estatus
    yPos = doc.lastAutoTable.finalY + 12;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Distribución por Estatus', 14, yPos);
    yPos += 8;

    const statusTableData = statusData.map((item) => [
      item.name,
      item.value,
      `${((item.value / kpis.total) * 100).toFixed(1)}%`,
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['Estatus', 'Cantidad', 'Porcentaje']],
      body: statusTableData,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 10,
      },
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Página ${i} de ${pageCount} - SIRECOVIP ${new Date().getFullYear()}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

    // Descargar
    const filename = `reporte-comerciantes-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
  };

  if (loading) {
    return (
      <SidebarLayout currentScreen="reports">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-body text-gray-600">Cargando reportes...</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (error) {
    return (
      <SidebarLayout currentScreen="reports">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-h3 text-gray-900 mb-2">Error al Cargar Datos</h2>
            <p className="text-body text-gray-600">{error}</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout currentScreen="reports">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h2 text-gray-900">Reportes y Análisis</h1>
            <p className="text-body-sm text-gray-600 mt-1">
              Visualiza y exporta estadísticas de comerciantes
            </p>
          </div>
          <Button
            variant="default"
            size="md"
            onClick={generatePDF}
            className="gap-2"
          >
            <Download size={20} />
            Descargar PDF
          </Button>
        </div>

        {/* Filtros */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Calendar size={20} />
              Filtros
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Inicio
                </label>
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Fin
                </label>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                />
              </div>
            </div>
            {(dateRange.start || dateRange.end) && (
              <div className="mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDateRange({ start: '', end: '' })}
                >
                  Limpiar Filtros
                </Button>
              </div>
            )}
          </Card.Content>
        </Card>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Comerciantes */}
          <Card>
            <Card.Content className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Comerciantes
                  </p>
                  <p className="text-4xl font-bold text-gray-900">{kpis.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* % Irregulares */}
          <Card>
            <Card.Content className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Irregulares
                  </p>
                  <p className="text-4xl font-bold text-red-600">
                    {kpis.percentIrregulares}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {kpis.irregulares} comerciantes
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Nuevos Este Mes */}
          <Card>
            <Card.Content className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Nuevos Este Mes
                  </p>
                  <p className="text-4xl font-bold text-green-600">
                    {kpis.nuevosEsteMes}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Gráficas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfica de Barras - Por Delegación */}
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <FileText size={20} />
                Comerciantes por Delegación
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={delegationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cantidad" fill="#3B82F6" name="Cantidad" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Content>
          </Card>

          {/* Gráfica de Pastel - Por Estatus */}
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <FileText size={20} />
                Distribución por Estatus
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={STATUS_COLORS[entry.status] || '#6B7280'}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card.Content>
          </Card>
        </div>

        {/* Tabla Resumen */}
        <Card>
          <Card.Header>
            <Card.Title>Resumen Detallado por Delegación</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delegación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cantidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Porcentaje
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {delegationData.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.cantidad}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {((item.cantidad / kpis.total) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Content>
        </Card>
      </div>
    </SidebarLayout>
  );
};

export default Reports;

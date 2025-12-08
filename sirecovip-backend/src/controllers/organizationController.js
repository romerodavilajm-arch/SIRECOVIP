const supabase = require('../config/supabase');

// GET: Obtener todas las organizaciones
const getOrganizations = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('id, name, status')
      .eq('status', 'activa')
      .order('name', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error en getOrganizations:', error);
    res.status(500).json({ error: error.message });
  }
};

// GET: Obtener una organización por ID
const getOrganizationById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'Organización no encontrada' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error en getOrganizationById:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getOrganizations, getOrganizationById };

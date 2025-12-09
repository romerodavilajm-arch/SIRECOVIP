const supabase = require('../config/supabase');

/**
 * Obtener todos los usuarios
 */
const getUsers = async (req, res) => {
    try {
        const { zone } = req.query;

        let query = supabase
            .from('users')
            .select('id, name, email, role, assigned_zone, total_registrations, created_at');

        // Filtrar por zona si se especifica
        if (zone) {
            query = query.eq('assigned_zone', zone);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
            return res.status(500).json({
                error: 'Error al obtener usuarios',
                details: error.message
            });
        }

        res.json(data);
    } catch (error) {
        console.error('Error en getUsers:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message
        });
    }
};

/**
 * Obtener un usuario por ID
 */
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('users')
            .select('id, name, email, role, assigned_zone, total_registrations, created_at')
            .eq('id', id)
            .single();

        if (error) {
            return res.status(404).json({
                error: 'Usuario no encontrado',
                details: error.message
            });
        }

        res.json(data);
    } catch (error) {
        console.error('Error en getUserById:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message
        });
    }
};

module.exports = {
    getUsers,
    getUserById
};

import axiosInstance from '../api/axios';

/**
 * Servicio para operaciones relacionadas con usuarios/inspectores
 */
const userService = {
  /**
   * Obtiene todos los usuarios
   * @returns {Promise} Lista de usuarios
   */
  getUsers: async () => {
    try {
      const response = await axiosInstance.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  /**
   * Obtiene usuarios por zona
   * @param {string} zone - Zona a filtrar (ej: 'Zona 1', 'Zona 2', etc.)
   * @returns {Promise} Lista de usuarios de esa zona
   */
  getUsersByZone: async (zone) => {
    try {
      const response = await axiosInstance.get(`/users?zone=${encodeURIComponent(zone)}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching users for zone ${zone}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene un usuario por ID
   * @param {string} id - ID del usuario
   * @returns {Promise} Datos del usuario
   */
  getUserById: async (id) => {
    try {
      const response = await axiosInstance.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },
};

export default userService;

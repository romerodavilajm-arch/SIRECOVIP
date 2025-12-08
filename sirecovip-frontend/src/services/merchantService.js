import axiosInstance from '../api/axios';

/**
 * Servicio para operaciones relacionadas con comerciantes
 */
const merchantService = {
  /**
   * Obtiene todas las organizaciones para el catálogo
   * @returns {Promise} Lista de organizaciones
   */
  getOrganizations: async () => {
    try {
      const response = await axiosInstance.get('/organizations');
      return response.data;
    } catch (error) {
      console.error('Error fetching organizations:', error);
      throw error;
    }
  },

  /**
   * Obtiene todos los comerciantes
   * @returns {Promise} Lista de comerciantes
   */
  getMerchants: async () => {
    try {
      const response = await axiosInstance.get('/merchants');
      return response.data;
    } catch (error) {
      console.error('Error fetching merchants:', error);
      throw error;
    }
  },

  /**
   * Obtiene un comerciante por ID
   * @param {string} id - ID del comerciante
   * @returns {Promise} Datos del comerciante
   */
  getMerchantById: async (id) => {
    try {
      const response = await axiosInstance.get(`/merchants/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching merchant ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crea un nuevo comerciante con soporte para FormData (archivos)
   * @param {FormData|Object} merchantData - Datos del comerciante o FormData con archivos
   * @returns {Promise} Comerciante creado
   */
  createMerchant: async (merchantData) => {
    try {
      // Si es FormData, axios automáticamente establece el Content-Type correcto
      const config = merchantData instanceof FormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {};

      const response = await axiosInstance.post('/merchants', merchantData, config);
      return response.data;
    } catch (error) {
      console.error('Error creating merchant:', error);
      throw error;
    }
  },

  /**
   * Actualiza un comerciante existente con soporte para FormData (archivos)
   * @param {string} id - ID del comerciante
   * @param {FormData|Object} merchantData - Datos actualizados o FormData con archivos
   * @returns {Promise} Comerciante actualizado
   */
  updateMerchant: async (id, merchantData) => {
    try {
      // Si es FormData, axios automáticamente establece el Content-Type correcto
      const config = merchantData instanceof FormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {};

      const response = await axiosInstance.put(`/merchants/${id}`, merchantData, config);
      return response.data;
    } catch (error) {
      console.error(`Error updating merchant ${id}:`, error);
      throw error;
    }
  },

  /**
   * Elimina un comerciante
   * @param {string} id - ID del comerciante
   * @returns {Promise} Confirmación de eliminación
   */
  deleteMerchant: async (id) => {
    try {
      const response = await axiosInstance.delete(`/merchants/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting merchant ${id}:`, error);
      throw error;
    }
  },
};

export default merchantService;

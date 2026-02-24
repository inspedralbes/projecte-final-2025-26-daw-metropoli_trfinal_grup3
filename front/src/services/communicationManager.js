const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const communicationManager = {
  // POIs
  getPois: async () => {
    try {
      const response = await fetch(`${API_URL}/api/pois`);
      if (!response.ok) throw new Error("Failed to fetch POIs");
      return await response.json();
    } catch (error) {
      console.error("Error in getPois:", error);
      throw error;
    }
  },

  // Ruta Dijkstra
  getRoute: async (origenId, destinoId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/calculo-ruta?origen=${origenId}&destino=${destinoId}`
      );
      if (!response.ok) throw new Error("Failed to fetch Route");
      return await response.json();
    } catch (error) {
      console.error("Error in getRoute:", error);
      throw error;
    }
  },

  // Añadirás más métodos aquí para el resto de la aplicación (ej. getIncidencias, getWeahter, etc.)
};

export default communicationManager;

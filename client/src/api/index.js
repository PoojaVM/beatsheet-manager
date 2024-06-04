import axiosInstance from "./axiosInstance";

const beatSheetApi = {
  async getBeatSheets({ search }) {
    try {
      const response = await axiosInstance.get("beatsheets", {
        params: { search: search?.length ? search : undefined },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching beat sheets: ", error);
      throw error;
    }
  },
  async getBeatSheet(id) {
    try {
      const response = await axiosInstance.get(`/beatsheets/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching beat sheet: ", error);
      throw error;
    }
  },
  async createBeatSheet(data) {
    try {
      const response = await axiosInstance.post("/beatsheets", data);
      return response.data;
    } catch (error) {
      console.error("Error creating beat sheet: ", error);
      throw error;
    }
  },
  async updateBeatSheet(id, data) {
    try {
      const response = await axiosInstance.put(`/beatsheets/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating beat sheet: ", error);
      throw error;
    }
  },
  async reorderBeat(beatId, actId, newPosition, newActId) {
    try {
      const response = await axiosInstance.put(
        `acts/${actId}/beats/${beatId}/reorder`,
        { newPosition, newActId }
      );
      return response.data;
    } catch (error) {
      console.error("Error reordering beat: ", error);
      throw error;
    }
  },
  async reorderAct(beatSheetId, actId, newPosition) {
    try {
      const response = await axiosInstance.put(
        `beatsheets/${beatSheetId}/acts/${actId}/reorder`,
        { newPosition }
      );
      return response.data;
    } catch (error) {
      console.error("Error reordering act: ", error);
      throw error;
    }
  },
  async createAct(beatSheetId, data) {
    try {
      const response = await axiosInstance.post(`/beatsheets/${beatSheetId}/acts`, data);
      return response.data;
    } catch (error) {
      console.error("Error creating act: ", error);
      throw error;
    }
  },
  async updateAct(beatSheetId, actId, {title, description}) {
    try {
      const response = await axiosInstance.put(`/beatSheets/${beatSheetId}/acts/${actId}`, {title, description});
      return response.data;
    } catch (error) {
      console.error("Error updating act: ", error);
      throw error;
    }
  },
  async deleteAct(beatSheetId, actId) {
    try {
      const response = await axiosInstance.delete(`/beatSheets/${beatSheetId}/acts/${actId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting act: ", error);
      throw error;
    }
  },
  async createBeat(actId, data) {
    try {
      const response = await axiosInstance.post(`acts/${actId}/beats`, data);
      return response.data;
    } catch (error) {
      console.error("Error creating beat: ", error);
      throw error;
    }
  },
  async updateBeat(actId, beatId, data) {
    try {
      const response = await axiosInstance.put(`acts/${actId}/beats/${beatId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating beat: ", error);
      throw error;
    }
  },
  async deleteBeat(actId, beatId) {
    try {
      const response = await axiosInstance.delete(`acts/${actId}/beats/${beatId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting beat: ", error);
      throw error;
    }
  },
  async deleteBeatSheet(id) {
    try {
      const response = await axiosInstance.delete(`/beatsheets/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting beat sheet: ", error);
      throw error;
    }
  },
};

export default beatSheetApi;

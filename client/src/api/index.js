import axiosInstance from "./axiosInstance";

const beatSheetApi = {
  async getBeatSheets({ search }) {
      try {
        const response = await axiosInstance.get("beatsheets", {
          params: { search: search?.length ? search : undefined },
        });
        return response.data;  
      } catch (error) {
        console.error('Error fetching beat sheets: ', error);
        throw error;
      }
  },
  async getBeatSheet(id) {
    try {
      const response = await axiosInstance.get(`/beatsheets/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching beat sheet: ', error);
      throw error;
    }
  },
  async createBeatSheet(data) {
    try {
      const response = await axiosInstance.post("/beatsheets", data);
      return response.data;
    } catch (error) {
      console.error('Error creating beat sheet: ', error);
      throw error;
    }
  },
  async updateBeatSheet(id, data) {
    try {
      const response = await axiosInstance.put(`/beatsheets/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating beat sheet: ', error);
      throw error;
    }
  },
};

export default beatSheetApi;
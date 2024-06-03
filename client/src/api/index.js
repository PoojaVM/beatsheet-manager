import axiosInstance from "./axiosInstance";

const beatSheetApi = {
  async getBeatSheets() {
      try {
        const response = await axiosInstance.get("beatsheets");
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
  }
};

export default beatSheetApi;
import axios from 'axios';

const axiosInstance = axios.create({
//   baseURL: 'http://beatsheet-app-server-dev.us-east-1.elasticbeanstalk.com/api/',
  baseURL: 'https://d2htlgwc4sstzt.cloudfront.net/api/',
});

export const addRequestInterceptors = (token) => {
    return axiosInstance.interceptors.request.use(
      (config) => {
    
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          config.headers["X-Beatsheet-Manager-Secret"] = "MySecretValue";
        }
    
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
}

export const clearRequestInterceptors = (interceptorId) => {
    axiosInstance.interceptors.request.eject(interceptorId);
}

export default axiosInstance;

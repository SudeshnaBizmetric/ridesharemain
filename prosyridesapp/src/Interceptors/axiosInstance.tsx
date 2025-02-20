import axios from "axios";

const axiosInstance =axios.create({
    baseURL:"http://127.0.0.1:8000/v1",
    timeout: 5000
})

axiosInstance.interceptors.request.use(
    (config)=>{
     
        const token=localStorage.getItem('authToken')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
          }
          return config;
    },

)

axiosInstance.interceptors.request.use(
    (response)=>{
        return response
    }

    ,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axiosInstance.post('/auth/refresh', { refresh_token: refreshToken });

        localStorage.setItem('token', response.data.token);
       
        originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        window.location.href='/login'
        console.error('Error refreshing token:', refreshError);

      }
    }

    return Promise.reject(error); 
  }
);

export default axiosInstance;
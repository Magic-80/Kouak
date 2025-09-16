import axios from "axios";

const AxiosInstance = () => {
    const api = axios.create({
        baseURL: import.meta.env.VITE_SERVER_URL + "/api",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    api.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response) {
                const { status } = error.response;
                if (status === 401) {
                    console.log("Session expirée ou token invalide.");
                } else if (status === 404) {
                    console.error("Ressource non trouvée");
                } else if (status === 500) {
                    console.error("Erreur serveur");
                }
            }
            return Promise.reject(error);
        }
    );

    return api;
};

export default AxiosInstance;

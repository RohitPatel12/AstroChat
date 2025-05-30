// export const baseURL = 'http://localhost:5000'
export const baseURL = import.meta.env.VITE_API_BASE_URL;
// process.env.VITE_API_BASE_URL; // using env properly

const SummaryApi = {
    register : {
        url : '/auth/register',
        method : 'post'
    },
    login : {
        url : '/auth/login',
        method : 'post'
    }
}

export default SummaryApi
export const baseURL = "http://localhost:5173/"

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
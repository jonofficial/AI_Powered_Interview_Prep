// export const BASE_URL = 'http://localhost:8000';
export const BASE_URL = import.meta.env.VITE_API_URL;

export const API_PATHS = {
    AUTH: {
        LOGIN: "api/auth/login",
        REGISTER: "api/auth/register",
        GET_PROFILE: "api/auth/profile",
    },

    IMAGE:{
        UPLOAD_IMAGE: "/api/auth/upload-image",
    },

    AI:{
        GENERATE_QUESTIONS: "/api/ai/generate-questions",
        GENERATE_EXPLANATION: "/api/ai/generate-explanation"
    },

    SESSION: {
        CREATE: "api/sessions/create",
        GET_ALL: "api/sessions/my-sessions",
        GET_ONE: (id) => `api/sessions/${id}`,
        DELETE: (id) => `api/sessions/${id}`,
    },

    QUESTION: {
        ADD_TO_SESSION: "api/questions/add-to-session",
        PIN: (id) => `api/questions/toggle-pin/${id}`, 
        UPDATE_NOTE: (id) => `api/questions/${id}/note`,
    },
};
import { API_CONFIG, postForm } from "./api-core";

export const uploadApi = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return postForm(`${API_CONFIG.API_BASE}/api/common/upload`, formData);
  },
};

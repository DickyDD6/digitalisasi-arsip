import { http } from "./http";

export const getCsrfToken = async (): Promise<void> => {
  try {
    await http.get("/sanctum/csrf-cookie");
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error(error);
  }
};

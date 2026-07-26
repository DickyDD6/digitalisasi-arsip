import { http } from "@/shared/lib/http";

export const userService = {
  async getUsers(params?: UserParams): Promise<ApiResponse<User[]>> {
    const { data } = await http.get<ApiResponse<User[]>>("/api/users", {
      params,
    });
    return data;
  },

  async getUserById(id: number): Promise<ApiResponse<User>> {
    const { data } = await http.get<ApiResponse<User>>(`/api/users/${id}`);
    return data;
  },

  async createUser(payload: UserSchema): Promise<ApiResponse<User>> {
    const { data } = await http.post<ApiResponse<User>>("/api/users", payload);
    return data;
  },

  async updateUser(
    id: number,
    payload: Partial<UserSchema>,
  ): Promise<ApiResponse<User>> {
    const { data } = await http.patch<ApiResponse<User>>(
      `/api/users/${id}`,
      payload,
    );
    return data;
  },

  async deleteUser(id: number): Promise<ApiResponse<User>> {
    const { data } = await http.delete<ApiResponse<User>>(`/api/users/${id}`);
    return data;
  },

  async deleteUserMultiple(ids: number[]): Promise<ApiResponse<User[]>> {
    const { data } = await http.post<ApiResponse<User[]>>(
      "/api/users/delete-multiple",
      { ids },
    );
    return data;
  },

  async getUsersStatistic(): Promise<ApiResponse<UserStatistic>> {
    const { data } = await http.get<ApiResponse<UserStatistic>>(
      "/api/users/statistics",
    );
    return data;
  },
};

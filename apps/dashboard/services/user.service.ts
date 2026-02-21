import { http } from "@/lib/http";

const getUsers = async (params?: UserParams): Promise<ApiResponse<User[]>> => {
  const { data } = await http.get<ApiResponse<User[]>>("/api/users", {
    params,
  });

  return data;
};

const getUserById = async (id: number): Promise<ApiResponse<User>> => {
  const { data } = await http.get<ApiResponse<User>>(`/api/users/${id}`);
  return data;
};

const createUser = async (payload: UserSchema): Promise<ApiResponse<User>> => {
  const { data } = await http.post<ApiResponse<User>>("/api/users", payload);
  return data;
};

const updateUser = async (
  id: number,
  payload: Partial<UserSchema>,
): Promise<ApiResponse<User>> => {
  const { data } = await http.patch<ApiResponse<User>>(
    `/api/users/${id}`,
    payload,
  );
  return data;
};

const deleteUser = async (id: number): Promise<ApiResponse<User>> => {
  const { data } = await http.delete<ApiResponse<User>>(`/api/users/${id}`);
  return data;
};

const deleteUserMultiple = async (
  ids: number[],
): Promise<ApiResponse<User[]>> => {
  const { data } = await http.post<ApiResponse<User[]>>(
    `/api/users/delete-multiple`,
    { ids },
  );
  return data;
};

export const USER_SERVICE = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  deleteUserMultiple,
};

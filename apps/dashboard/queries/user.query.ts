import { ROLE } from "@/constants/role";
import { toSentenceCase } from "@/lib/sentence-case";
import { USER_SERVICE } from "@/services/user.service";
import { queryOptions } from "@tanstack/react-query";

const usersQuery = (params?: UserParams) =>
  queryOptions({
    queryKey: ["users", params],
    queryFn: async () => await USER_SERVICE.getUsers(params),
  });

const userUpdateQuery = (id: number) =>
  queryOptions({
    queryKey: ["user", "update", id],
    queryFn: async () => await USER_SERVICE.getUserById(id),
    enabled: !!id,
    select: (res) => ({
      name: res.data.name,
      email: res.data.email,
      role: res.data.role,
      nip: res.data.nip || "",
      password: "",
    }),
  });

const userDeleteQuery = (id: number) =>
  queryOptions({
    queryKey: ["user", "delete", id],
    queryFn: async () => await USER_SERVICE.getUserById(id),
    enabled: !!id,
  });

const userDeleteMultipleQuery = (ids: number[]) =>
  queryOptions({
    queryKey: ["user", "delete", "multiple", ids],
    queryFn: async () => {
      const responses = await Promise.all(
        ids.map(async (id) => await USER_SERVICE.getUserById(id)),
      );

      return responses.map((res) => res.data);
    },
    enabled: Array.isArray(ids) && ids.length > 0,
    select: (data) =>
      data.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        nip: item.nip,
        role: item.role,
      })),
  });

const usersTableQuery = (params?: UserParams) =>
  queryOptions({
    queryKey: ["users", "table", params],
    queryFn: async () => await USER_SERVICE.getUsers(params),
    select: (res) => {
      return {
        users: Object.values(res.data).filter((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          nip: user.nip,
        })),
        meta: res.meta,
      };
    },
    placeholderData: (prev) => prev,
  });

const usersStatisticQuery = (params?: UserParams) =>
  queryOptions({
    queryKey: ["users", "statistic"],
    queryFn: async () => await USER_SERVICE.getUsers(params),
    select: (res) => {
      return {
        user_statistic: {
          all: {
            label: "Semua Pengguna",
            value: res.data.length,
          },
          ...Object.values(ROLE)
            .filter((role) => role !== "MANAGER")
            .reduce(
              (acc, role) => {
                const count = res.data.filter(
                  (user) => user.role === role,
                ).length;
                acc[role] = {
                  label: `Tim ${role === "UPLOADER" ? toSentenceCase(role) : role.toUpperCase()}`,
                  value: count,
                };
                return acc;
              },
              {} as Record<string, { label: string; value: number }>,
            ),
        },
      };
    },
  });

export const USER_QUERY = {
  usersQuery,
  userUpdateQuery,
  usersTableQuery,
  userDeleteQuery,
  userDeleteMultipleQuery,
  usersStatisticQuery,
};

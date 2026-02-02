import { useQuery } from "@tanstack/react-query";
import { getProfileMe } from ".";

export const useMe = () =>
	useQuery({
		queryFn: async () => await getProfileMe(),
		queryKey: ["current-user"],
	});

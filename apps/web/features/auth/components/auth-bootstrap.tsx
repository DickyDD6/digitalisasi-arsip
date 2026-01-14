import { useUserAuthenticated } from "../hooks/use-auth";

export const AuthBootstrap = () => {
	useUserAuthenticated();

	return null;
};

import { LoginCard } from "@/features/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "LogIn",
};

const LoginPage = () => {
	return (
		<div className="px-4 place-content-center place-items-center h-screen w-screen">
			<LoginCard />;
		</div>
	);
};

export default LoginPage;

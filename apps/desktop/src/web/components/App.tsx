import { useEffect } from "react";
import { Outlet, useNavigate, useOutlet } from "react-router-dom";
import "../styles/tailwind.css";

export const App: React.FC = () => {
	const outlet = useOutlet();
	const navigate = useNavigate();

	useEffect(() => {
		if (outlet === null) {
			navigate("/discover");
		}
	}, [outlet, navigate]);

	return <Outlet />;
};

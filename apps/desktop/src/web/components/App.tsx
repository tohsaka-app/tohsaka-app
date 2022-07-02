import { useEffect } from "react";
import { Outlet, useLocation, useNavigate, useOutlet } from "react-router-dom";
import "../styles/tailwind.css";

export const App: React.FC = () => {
	const outlet = useOutlet();
	const navigate = useNavigate();

	useEffect(() => {
		if (outlet === null) {
			navigate("/discover");
		}
	}, []);

	return <Outlet />
};

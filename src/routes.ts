import { createBrowserRouter, redirect } from "react-router";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ClientRegister from "./pages/ClientRegister";
import QuestionnaireFlow from "./pages/QuestionnaireFlow";
import ResultPage from "./pages/ResultPage";
import Dashboard from "./pages/Dashboard";
import OrdersKanban from "./pages/OrdersKanban";
import OrdersProfissionalKanban from "./pages/OrdersProfissionalKanban";
import ProfessionalLogin from "./pages/ProfessionalLogin";
import ProfessionalDashboard from "./pages/ProfessionalDashboard";
import ProfessionalRegister from "./pages/ProfessionalRegister";
import AdminDashboard from "./admin/AdminDashboard";

export const router = createBrowserRouter([
  { path: "/", Component: HomePage },
  { path: "/login", Component: LoginPage },
  { path: "/client-register", Component: ClientRegister },
  { path: "/professional-login", Component: ProfessionalLogin },
  { path: "/professional-register", Component: ProfessionalRegister },
  { path: "/dashboard", Component: Dashboard },
  { path: "/professional-dashboard", Component: ProfessionalDashboard },
  { path: "/orders", Component: OrdersKanban },
  { path: "/orders-profissional", Component: OrdersProfissionalKanban },
  { path: "/questionnaire/:serviceType", Component: QuestionnaireFlow },
  { path: "/result", Component: ResultPage },
  { path: "/admin", loader: () => redirect("/admin/avaliar") },
  { path: "/admin/avaliar", Component: AdminDashboard },
]);

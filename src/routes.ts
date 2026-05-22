import { createBrowserRouter } from "react-router";
import HomePage from "src/pages/HomePage.tsx";
import LoginPage from "./app/pages/LoginPage";
import ClientRegister from "./app/pages/ClientRegister";
import QuestionnaireFlow from "./app/pages/QuestionnaireFlow";
import ResultPage from "./app/pages/ResultPage";
import Dashboard from "./app/pages/Dashboard";
import OrdersKanban from "./app/pages/OrdersKanban";
import OrdersProfissionalKanban from "./app/pages/OrdersProfissionalKanban";
import ProfessionalLogin from "./app/pages/ProfessionalLogin";
import ProfessionalDashboard from "./app/pages/ProfessionalDashboard";
import ProfessionalRegister from "./app/pages/ProfessionalRegister";
// 1. Importe o novo componente (ajuste o caminho se necessário)
import AdminDashboard from "./admin/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/client-register",
    Component: ClientRegister,
  },
  {
    path: "/professional-login",
    Component: ProfessionalLogin,
  },
  {
    path: "/professional-register",
    Component: ProfessionalRegister,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/professional-dashboard",
    Component: ProfessionalDashboard,
  },
  {
    path: "/orders",
    Component: OrdersKanban,
  },
  {
    path: "/orders-profissional",
    Component: OrdersProfissionalKanban,
  },
  {
    path: "/questionnaire/:serviceType",
    Component: QuestionnaireFlow,
  },
  {
    path: "/result",
    Component: ResultPage,
  },
  // 2. Adicione a rota de administração aqui
  {
    path: "/admin/avaliar",
    Component: AdminDashboard,
  },
]);
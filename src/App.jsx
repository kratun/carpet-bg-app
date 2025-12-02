import { useState } from "react";
import { useRoutes } from "react-router-dom";
import { routesConfig } from "./routes";
import Header from "./components/Header/Header";
import Layout from "./components/Layout/Layout";
import LayoutContent from "./components/Layout/LayoutContent";
import { ToastProvider } from "./stores/ToastContext";
import Toaster from "./components/UI/Toaster/Toaster";
import "./App.css";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const element = useRoutes(routesConfig);

  return (
    <ToastProvider>
      <Layout>
        <Header
          isLoggedIn={isLoggedIn}
          onLogin={() => setIsLoggedIn(true)}
          onLogout={() => setIsLoggedIn(false)}
        />

        <LayoutContent>{element}</LayoutContent>
      </Layout>
      <Toaster />
    </ToastProvider>
  );
}

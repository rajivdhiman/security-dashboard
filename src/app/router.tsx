import {lazy} from "react";
import {createBrowserRouter} from "react-router-dom";
import AppShell from "../components/layout/AppShell.tsx";

const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const VulnerabilitiesPage = lazy(() => import("../pages/VulnerabilitiesPage"));
const VulnerabilityDetailPage = lazy(() => import("../pages/VulnerabilityDetailPage"));
const ComparePage = lazy(() => import("../pages/ComparePage"));


export const router = createBrowserRouter([
    {
        element: <AppShell />,
        children: [
            { path: "/", element: <DashboardPage /> },
            { path: "/vulnerabilities", element: <VulnerabilitiesPage /> },
            { path: "/vulnerabilities/:id", element: <VulnerabilityDetailPage /> },
            { path: "/compare", element: <ComparePage /> },
        ],
    },
]);
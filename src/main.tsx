import React, {Suspense} from "react";
import ReactDOM from "react-dom/client";
import {RouterProvider} from "react-router-dom";
import {Provider} from "react-redux";
import {QueryClientProvider} from "@tanstack/react-query";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {router} from "./app/router";
import {store} from "./store/store";
import {queryClient} from "./data/queryClient";
import {PageLoader} from "./components/layout/pageLoader.tsx";

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Suspense fallback={<PageLoader />}>
                        <RouterProvider router={router} />
                    </Suspense>
                </ThemeProvider>
            </QueryClientProvider>
        </Provider>
    </React.StrictMode>
);
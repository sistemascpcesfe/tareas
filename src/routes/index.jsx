import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "../components/login"
import { NotFound } from "../components/404"
import Home from "../components/home"
import TaskDetails from "../components/home/Card/taskDetails"
import { LoadingFileProvider } from "../provider/loadingFileProvider"
import { LoadingStatusProvider } from "../provider/loadingStatusProvider"

const RoutesApp = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/agenda-comunicacion"
                    element={<Home />}
                />
                <Route
                    path="/agenda-comunicacion/:taskId"
                    element={
                        <LoadingStatusProvider>
                            <LoadingFileProvider>
                                <TaskDetails />
                            </LoadingFileProvider>
                        </LoadingStatusProvider>
                    }
                />
                <Route
                    path="/"
                    element={<Login />}
                />
                <Route
                    path="*"
                    element={<NotFound />}
                />
            </Routes>
        </BrowserRouter>
    )
}

export default RoutesApp;
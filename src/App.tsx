import {Routes, Route} from "react-router-dom";

import DefaultLayout from "@/layouts/DefaultLayout.jsx"
import PrivateRoute from "@components/PrivateRoute.jsx";
import NotFoundPage from "@views/ErrorPages/NotFoundPage.jsx";
import "@/App.scss";
import PersistLogin from "@components/PersistLogin.jsx";
import LoginPage from "@views/Login/LoginPage.tsx";


function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage/>}/>
            <Route element={<PersistLogin/>}>
                <Route element={<PrivateRoute/>}>
                    <Route path="/*" element={<DefaultLayout/>}/>
                </Route>
            </Route>
            <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
    );
}

export default App;

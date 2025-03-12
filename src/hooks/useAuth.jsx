import {useContext} from "react";
import AuthContext from "@contexts/AuthProvider.jsx";

const useAuth = () => {
    return useContext(AuthContext);
}
export default useAuth;
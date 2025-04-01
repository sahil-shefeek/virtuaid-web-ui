import ResidentSearch from '@components/ResidentSearch';
import {Route, Routes} from 'react-router-dom';
import AccessReportsView from "@components/AccessReports/AccessReportsView.jsx";
import useTopBar from "@hooks/useTopBar.jsx";

const AccessReportsPage = () => {
    const {setTitle} = useTopBar()
    setTitle("View Activity Reports");
    return (
        <Routes>
            <Route path="/" element={<ResidentSearch/>}/>
            <Route path="/:residentName" element={<AccessReportsView/>}/>
        </Routes>
    );
};

export default AccessReportsPage;

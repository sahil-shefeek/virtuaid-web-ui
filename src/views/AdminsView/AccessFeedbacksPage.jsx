import {Route, Routes} from "react-router-dom";
import FeedbackView from "@components/Feedbacks/FeedbackView.jsx";
import ResidentSearch from "@components/ResidentSearch.jsx";
import useTopBar from "@hooks/useTopBar.jsx";


const AccessFeedbacksPage = () => {
    const {setTitle} = useTopBar()
    setTitle("View Feedback");
    return (
        <Routes>
            <Route path="/" element={<ResidentSearch/>}/>
            <Route path="/:residentName" element={<FeedbackView/>}/>
        </Routes>
    );
};

export default AccessFeedbacksPage;

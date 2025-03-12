import "./SearchResultsList.css";
import {useNavigate} from "react-router-dom";
import {Alert, Container, Spinner} from "react-bootstrap";

const SearchResult = ({result}) => {
    const navigate = useNavigate();
    return (
        <div
            className="searchResult"
            onClick={() => {
                navigate('/reports/add/upload', {state: {id: result.id, url: result.url, name: result.name}});
            }}
        >
            {result.name}
        </div>
    );
}


export const SearchResultsList = ({results, loading}) => {
    return (
        loading ? <div className="resultsList p-4 m-5">
            <Container>
                <Spinner animation="border" className=""/>
                <h3 className="mx-3 mt-2">Please wait loading residents...</h3>
            </Container>
            </div> :
            results?.length ?
                <div className="resultsList">
                    {results.map((result, id) => (
                        <SearchResult result={result} key={id}/>
                    ))}
                </div>
                :
                <Alert variant="info" className="rounded-4 border shadow-sm p-3 mt-5">
                    <h2 className="p-3 text-center">No residents found. <span
                        className="material-symbols-rounded align-text-top">person_off</span></h2>
                </Alert>
    );
}

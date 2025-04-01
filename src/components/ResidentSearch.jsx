import {useEffect, useState} from 'react';
import {Alert, Button, Card, CardGroup, Container, Form, FormControl, ListGroup, Spinner} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import useAxiosPrivate from "@hooks/useAxiosPrivate.jsx";
import {useQuery} from '@tanstack/react-query';

const ResidentSearch = () => {
    const [search, setSearch] = useState('');
    const [residents, setResidents] = useState([]);
    const [filteredResidents, setFilteredResidents] = useState([]);
    const [selectedResident, setSelectedResident] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const fetchResidents = async () => {
        let allResults = [];
        let nextUrl = "/residents/";
        try {
            while (nextUrl) {
                const {data} = await axiosPrivate.get(nextUrl);
                nextUrl = data.next;
                allResults = [...allResults, ...data.results];
            }
        } catch (error) {
            console.log(error);
        }
        return allResults;
    };

    const residentQuery = useQuery({
        queryKey: ["residents"], queryFn: fetchResidents, enabled: false
    });

    useEffect(() => {
        setIsLoading(true);
        residentQuery.refetch()
            .then((result) => {
                setResidents(result.data || []);
            })
            .catch((error) => console.log(error))
            .finally(() => setIsLoading(false));
    }, []);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    useEffect(() => {
        setFilteredResidents(residents.filter(resident => resident.name.toLowerCase().includes(search.toLowerCase())));
    }, [search, residents]);

    const handleSelect = (resident) => {
        setSelectedResident(resident);
        onselect(resident);
        navigate(`/reports/${resident.name}`);
    };

    const handleClearSelection = () => {
        setSelectedResident(null);
    };

    const handleProceed = () => {
        if (selectedResident) {
            const basePath = location.pathname.startsWith('/reports') ? '/reports' : '/feedbacks';
            const action = location.pathname.includes('/add') ? 'add' : 'view';
            navigate(`${basePath}/${action}/${selectedResident.name}`, {
                state: {
                    residentId: selectedResident.id, residentName: selectedResident.name
                }
            });
        } else {
            alert('Please select an resident.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (<Container fluid className="mx-3 p-5 border rounded-4 text-center">
        <h1 className="mt-3 mb-5">Choose a Resident</h1>
        <Form className="my-5 mb-3" onSubmit={handleSubmit}>
            <FormControl
                type="text"
                placeholder="Search"
                value={search}
                onChange={handleSearch}
                className="mr-sm-2 mx-3"
            />
        </Form>
        <section className="m-5 p-2">
            {isLoading ?
                (<Container fluid className="text-center m-5 p-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <h2 className="m-3">Loading...</h2>
                </Container>)
                :
                residents?.length ?
                    (selectedResident ?
                        (<>
                            <Card className="mb-3">
                                <Card.Body className="d-flex justify-content-between align-items-center">
                                    <div className="fw-bold">
                                        {selectedResident.name}
                                    </div>
                                    <Button variant="danger" onClick={handleClearSelection}>Clear Selection</Button>
                                </Card.Body>
                            </Card>
                            <div className="text-center mt-3">
                                <Button variant="primary" onClick={handleProceed}>Continue</Button>
                            </div>
                        </>)
                        :
                        (<ListGroup
                            as={CardGroup}
                            variant="flush"
                        >
                            {filteredResidents.map(resident => (<ListGroup.Item
                                className="d-flex justify-content-between align-items-start"
                                as={Card}
                                action
                                key={resident.id}
                                onClick={() => handleSelect(resident)}
                            >
                                <Card.Body className="fw-bold">
                                    <Container
                                        className="text-center align-bottom"
                                    >
                                        <span className="material-symbols-rounded">person</span>

                                        <h3 className="mx-3 pt-2">{resident.name}</h3>
                                    </Container>
                                </Card.Body>
                            </ListGroup.Item>))}
                        </ListGroup>))
                    :
                    (
                        <Alert variant="info" className="rounded-4 border shadow-sm p-3 mt-5">
                            <h2 className="p-3 text-center">No residents found. <span
                                className="material-symbols-rounded align-text-top">person_off</span></h2>
                        </Alert>
                    )}
            {residentQuery.isError && (
                <Alert variant="danger" className="mb-3">{residentQuery.error.message}</Alert>)}
        </section>
    </Container>);
};

export default ResidentSearch;

import { useState, useEffect } from 'react';
import {
    Button,
    Container,
    Form,
    Spinner,
    Toast,
    ToastContainer,
    InputGroup,
    Card,
    Row,
    Col,
    Alert
} from 'react-bootstrap';
import useAxiosPrivate from '@hooks/useAxiosPrivate';
import useTopBar from '@hooks/useTopBar.jsx';

interface Resident {
    id: string;
    name: string;
    date_of_birth: string;
    care_home: {
        name: string;
    };
}

interface ResidentsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Resident[];
}

function AddSessionsPage() {
    const [residents, setResidents] = useState<Resident[]>([]);
    const [selectedResident, setSelectedResident] = useState<string>('');
    const [scheduledDate, setScheduledDate] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [fetchingResidents, setFetchingResidents] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    const axiosPrivate = useAxiosPrivate();
    const { setTitle } = useTopBar();
    setTitle("Schedule New Session");

    useEffect(() => {
        setFetchingResidents(true);
        fetchResidents().finally(() => setFetchingResidents(false));
    }, []);

    const fetchResidents = async () => {
        try {
            const response = await axiosPrivate.get<ResidentsResponse>('/residents/');
            setResidents(response.data.results);
        } catch (error) {
            console.error('Error fetching residents:', error);
            setErrorMessage('Failed to load residents. Please try again later.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset messages
        setSuccessMessage('');
        setErrorMessage('');

        if (!selectedResident || !scheduledDate) {
            setErrorMessage('Please select both a resident and a date.');
            return;
        }

        setLoading(true);

        try {
            await axiosPrivate.post('/sessions/', {
                scheduled_date: scheduledDate,
                resident: selectedResident
            });

            setSuccessMessage('Session scheduled successfully!');
            // Reset form
            setSelectedResident('');
            setScheduledDate('');

        } catch (error: any) {
            console.error('Error scheduling session:', error);

            if (error.response?.data) {
                const errorData = error.response.data;
                // Format error messages if available
                const errorMessages = Object.entries(errorData)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ');

                setErrorMessage(`Failed to schedule session: ${errorMessages || 'Unknown error'}`);
            } else {
                setErrorMessage('Failed to schedule session. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Calculate minimum date (today) for date picker
    const today = new Date();
    const minDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    return (
        <>
            {fetchingResidents ? (
                <Container fluid className="text-center rounded-4 border m-3 p-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <h2 className="m-3">Loading residents...</h2>
                </Container>
            ) : (
                <Container fluid className="m-3">
                    <Card className="shadow-sm mb-4 border rounded-4">
                        <Card.Header as="h4" className="p-3">Schedule a New Session</Card.Header>
                        <Card.Body className="p-4">
                            {residents.length === 0 ? (
                                <Alert variant="info" className="rounded-4 border shadow-sm p-3">
                                    <h2 className="p-3 text-center">
                                        No residents available for scheduling sessions.
                                        <span className="material-symbols-rounded align-text-top">person_off</span>
                                    </h2>
                                </Alert>
                            ) : (
                                <p>Select a resident and schedule a date for their session using the form below.</p>
                            )}
                        </Card.Body>
                    </Card>

                    {residents.length > 0 && (
                        <Card className="shadow-sm border rounded-4">
                            <Card.Body className="p-4">
                                <Form onSubmit={handleSubmit}>
                                    <Row className="mb-4">
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Select Resident</Form.Label>
                                                <InputGroup>
                                                    <Form.Select
                                                        value={selectedResident}
                                                        onChange={(e) => setSelectedResident(e.target.value)}
                                                        disabled={loading}
                                                        required
                                                    >
                                                        <option value="">Choose a resident...</option>
                                                        {residents.map((resident) => (
                                                            <option key={resident.id} value={resident.id}>
                                                                {resident.name} ({resident.care_home.name})
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Session Date</Form.Label>
                                                <InputGroup>
                                                    <Form.Control
                                                        type="date"
                                                        value={scheduledDate}
                                                        onChange={(e) => setScheduledDate(e.target.value)}
                                                        min={minDate}
                                                        disabled={loading}
                                                        required
                                                    />
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                        <Button
                                            variant={!selectedResident || !scheduledDate ? "outline-danger" : "primary"}
                                            type="submit"
                                            disabled={loading || !selectedResident || !scheduledDate}
                                            className="px-4"
                                        >
                                            {loading ? (
                                                <>
                                                    <Spinner
                                                        as="span"
                                                        animation="border"
                                                        size="sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                        className="me-2"
                                                    />
                                                    Scheduling...
                                                </>
                                            ) : (
                                                'Schedule Session'
                                            )}
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    )}

                    <ToastContainer
                        className="p-3"
                        position="bottom-end"
                        style={{ zIndex: 1 }}
                    >
                        <Toast
                            show={!!errorMessage}
                            bg="danger"
                            className="shadow"
                            onClose={() => setErrorMessage("")}
                        >
                            <Toast.Header>
                                <h1 className="me-auto">Error!</h1>
                            </Toast.Header>
                            <Toast.Body
                                className="text-light p-3"
                            >
                                <h2>
                                    {errorMessage}
                                </h2>
                            </Toast.Body>
                        </Toast>

                        <Toast
                            show={!!successMessage}
                            bg="primary"
                            className="shadow"
                            onClose={() => setSuccessMessage("")}
                        >
                            <Toast.Header>
                                <h1 className="me-auto">Success!</h1>
                            </Toast.Header>
                            <Toast.Body
                                className="text-light p-3"
                            >
                                <h2>
                                    {successMessage}
                                </h2>
                            </Toast.Body>
                        </Toast>
                    </ToastContainer>
                </Container>
            )}
        </>
    );
}

export default AddSessionsPage;
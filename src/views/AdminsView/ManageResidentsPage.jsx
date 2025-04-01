import {useState, useEffect} from "react";
import {
    Button,
    Modal,
    Form,
    Table,
    Container,
    Spinner,
    Toast,
    ToastContainer,
    InputGroup,
    Alert
} from "react-bootstrap";
import styles from "./ManageResidentsPage.module.css";
import useAxiosPrivate from "@hooks/useAxiosPrivate";
import useTopBar from "@hooks/useTopBar.jsx";
import {NAME_REGEX} from "@utils/validations/regex.js";

function ManageResidentsPage() {
    const [residents, setResidents] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedResident, setSelectedResident] = useState(null);
    const [residentForRemoval, setResidentForRemoval] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [editLoading, setEditLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isValidName, setIsValidName] = useState(false);
    const [showConfirmRemoveModal, setShowConfirmRemoveModal] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const {setTitle} = useTopBar();
    setTitle("Manage residents");

    useEffect(() => {
        setLoading(true);
        fetchResidents().finally(() => setLoading(false))
    }, []);

    useEffect(() => {
        console.log(selectedResident);
        if (selectedResident?.name) {
            setIsValidName(NAME_REGEX.test(selectedResident?.name));
        }
    }, [selectedResident]);

    const fetchResidents = async () => {
        try {
            const residentData = await fetchAllResidents();
            setResidents(residentData);
        } catch (error) {
            setErrorMessage("Failed to fetch residents. Please try again later.")
        }
    };

    const fetchAllResidents = async (url = `/residents`) => {
        let allResidents = [];
        try {
            const response = await axiosPrivate.get(url);
            //console.log(response);
            const filteredResidents = response?.data?.results
            allResidents = [...filteredResidents];

            if (response?.data?.next) {
                const nextPageResidents = await fetchAllResidents(response?.data?.next);
                allResidents = [...allResidents, ...nextPageResidents];
            }
        } catch (error) {
            setErrorMessage("Failed to fetch residents. Please try again later.")
        }
        return allResidents;
    };

    const handleShowEditModal = (resident) => {
        setSelectedResident(resident);
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setEditLoading(true);
        try {
            // Replace PUT with PATCH
            await axiosPrivate.patch(selectedResident.url, {
                name: selectedResident.name,
                //date_of_birth: selectedResident.date_of_birth,
            });
            setResidents((prevResidents) =>
                prevResidents.map((resident) =>
                    resident.id === selectedResident.id ? selectedResident : resident
                )
            );
            setSuccessMessage("Successfully updated resident details.");
        } catch (error) {
            setErrorMessage("Failed to update resident details.");
        } finally {
            setEditLoading(false);
            setShowEditModal(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");
        setDeleteLoading(true);
        try {
            if (residentForRemoval === null) {
                setErrorMessage("Please select a resident to delete!");
                return;
            }
            await axiosPrivate.delete(`/residents/${residentForRemoval}/`);
            setResidents((prevResidents) =>
                prevResidents.filter((resident) => resident.id !== residentForRemoval)
            );
            setSuccessMessage("Successfully deleted resident details.");
        } catch (error) {
            if (error.response.status === 500) {
                setErrorMessage(
                    "Cannot remove resident. Resident has existing feedback records."
                );
            } else if (error.request) {
                console.error("Error request:", error.request);
            } else {
                console.error("Error message:", error.message);
            }
        } finally {
            setLoading(false);
            setDeleteLoading(false);
            toggleConfirmRemoveModal();
        }
    };

    const toggleConfirmRemoveModal = () => {
        if (showConfirmRemoveModal) {
            setResidentForRemoval(null);
        }
        setShowConfirmRemoveModal(!showConfirmRemoveModal);
    };


    return <>
        {loading ?
            (<Container fluid className="text-center rounded-4 border m-3 p-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <h2 className="m-3">Loading...</h2>
            </Container>)
            :
            <Container fluid className="m-3 border rounded-4 p-4">
                {residents?.length ?
                    <Table responsive hover className={styles.carehomeItem}>
                        <thead className="p-3">
                        <tr>
                            <th>Name</th>
                            <th>Date of Birth</th>
                            <th>CareHome</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {residents.map((resident, index) => (
                            <tr key={index}>
                                <td>{resident.name}</td>
                                <td>{resident.date_of_birth}</td>
                                <td>{resident.care_home.name}</td>
                                <td>
                                    <Button
                                        className={styles.fixButton}
                                        variant="success"
                                        onClick={() => handleShowEditModal(resident)}
                                        disabled={deleteLoading}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        className={styles.fixButton}
                                        variant="danger"
                                        onClick={() => {
                                            setResidentForRemoval(resident.id);
                                            toggleConfirmRemoveModal();
                                        }}
                                        disabled={deleteLoading}
                                    >
                                        {deleteLoading ? (
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                        ) : "Delete"}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table> :
                    <Alert variant="info" className="rounded-4 border shadow-sm p-3">
                        <h2 className="p-3 text-center">No resident data has been registered.<span
                            className="material-symbols-rounded align-text-top">person_off</span></h2>
                    </Alert>
                }

                <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Resident</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleEditSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <InputGroup hasValidation>
                                    <Form.Control
                                        type="text"
                                        value={selectedResident?.name || ""}
                                        onChange={(e) =>
                                            setSelectedResident({
                                                ...selectedResident,
                                                name: e.target.value,
                                            })
                                        }
                                        isValid={selectedResident?.name && isValidName}
                                        isInvalid={selectedResident?.name && !isValidName}
                                        required
                                    />
                                    <Form.Control.Feedback type="valid">
                                        Looks good!
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        Please enter a valid name.
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                            <Button
                                variant={!isValidName ? "outline-danger" : "primary"}
                                type="submit"
                                disabled={editLoading || !isValidName}
                            >
                                {editLoading ? (
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                ) : "Save Changes"}
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Modal
                    show={showConfirmRemoveModal}
                    onHide={toggleConfirmRemoveModal}
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Warning</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete the resident? This action is permanent and cannot be undone.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {
                            toggleConfirmRemoveModal();
                            setResidentForRemoval(null);
                        }}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Confirm Removal
                        </Button>
                    </Modal.Footer>
                </Modal>
                <ToastContainer
                    className="p-3"
                    position="bottom-end"
                    style={{zIndex: 1}}
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
        }
    </>
}

export default ManageResidentsPage;

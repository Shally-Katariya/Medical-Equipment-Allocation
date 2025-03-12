import React, { useState, useEffect } from "react";
import axios from "axios";  // Import axios
import { Container, Card, Badge, InputGroup, FormControl, Row, Col } from "react-bootstrap";
import Sidebar from "./Sidebar";
import Map from "./Map";

const Dashboard = () => {
    const [search, setSearch] = useState(""); // Search input
    const [equipmentList, setEquipmentList] = useState([]); // Store API data

    // Fetch data from backend API
    useEffect(() => {
        axios.get("http://localhost:5000/equipment") // Change to your backend URL
            .then((response) => {
                setEquipmentList(response.data); // Store response in state
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    // Filter search results
    const filteredEquipment = equipmentList.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Container fluid>
            <Sidebar />
            <h2 className="mt-3">Medical Equipment Dashboard</h2>
            
            {/* Search Bar */}
            <InputGroup className="mb-3">
                <FormControl
                    placeholder="Search Equipment..."
                    onChange={(e) => setSearch(e.target.value)}
                />
            </InputGroup>

            {/* Equipment Cards */}
            <Row>
                {filteredEquipment.map((item) => (
                    <Col key={item.id} md={4}>
                        <Card className="mb-3 shadow-sm">
                            <Card.Body>
                                <Card.Title>{item.name}</Card.Title>
                                <Card.Text>
                                    <strong>Category:</strong> {item.category || "N/A"} <br />
                                    <strong>Quantity:</strong> {item.quantity} <br />
                                    <strong>Status:</strong>{" "}
                                    <Badge bg={item.quantity > 0 ? "success" : "danger"}>
                                        {item.quantity > 0 ? "Available" : "Not Available"}
                                    </Badge>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Map />
        </Container>
    );
};

export default Dashboard;

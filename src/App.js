import React, { useState, useEffect } from "react";
import {
  Table,
  Container,
  Row,
  Col,
  Button,
  ButtonGroup,
  Form,
  Navbar,
} from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
const intialstate = {
  name: "",
  email: "",
  contact: "",
  address: "",
};

function App() {
  const [state, setState] = useState(intialstate);
  const [data, setData] = useState([]);
  const [userID, setUserId] = useState(null);
  const [editMode, seteditMode] = useState(false);

  const { name, email, contact, address } = state;
  // console.log(data)
  // Console.log("Da")

  useEffect(() => {
    loadUSer();
  }, []);

  const loadUSer = () => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setData(res);
      });
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you wanted to delete that user ?")) {
      axios.delete(`${"http://localhost:5000/users"}/${id}`);
      toast.success("Deleted Successfully");
      setTimeout(() => loadUSer(), 500);
    }
  };

  const handleUpdate = (id) => {
    const singleUser = data.find((item) => item.id == id);
    setState({ ...singleUser });
    setUserId(id);
    seteditMode(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !address || !email || !contact) {
      toast.error("Please fill all input field");
    } else {
      if (!editMode) {
        axios.post("http://localhost:5000/users", state);
        toast.success("Added Successfully");
        setState({ name: "", email: "", contact: "", address: "" });
        // loadUSer();

        setTimeout(() => loadUSer(), 500);
      } else {
        axios.put(`${"http://localhost:5000/users"}/${userID}`, state);
        toast.success("Updated Successfully");
        setState({ name: "", email: "", contact: "", address: "" });
        setTimeout(() => loadUSer(), 500);
        setUserId(null);
        seteditMode(false);
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <Navbar bg="primary" variant="dark" className="justify-content-center">
        <Navbar.Brand>Admin Portel</Navbar.Brand>
      </Navbar>
      <Container style={{ marginTop: "70px" }}>
        <Row>
          <Col md={4}>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label style={{ textAlign: "left" }}>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Name"
                  name="name"
                  value={name}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label style={{ textAlign: "left" }}>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter Email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label style={{ textAlign: "left" }}>Contact</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Contact"
                  name="contact"
                  value={contact}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label style={{ textAlign: "left" }}>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Address"
                  name="address"
                  value={address}
                  onChange={handleChange}
                />
              </Form.Group>
              <div className="d-grid gap-2 mt-2">
                <Button type="submit" variant="primary" size="lg">
                  {editMode ? "Update" : "Submit"}
                </Button>
              </div>
            </Form>
          </Col>
          <Col md={8}>
            <Table bordered hover>
              <thead>
                <tr>
                  <th>No.1</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Address</th>
                  <th>Action</th>
                </tr>
              </thead>
              {data &&
                data.map((item, index) => (
                  <tbody key={index}>
                    <tr>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.contact}</td>
                      <td>{item.address}</td>
                      <td>
                        <ButtonGroup>
                          <Button
                            style={{ marginRight: "5px" }}
                            variant="secondary"
                            onClick={() => handleUpdate(item.id)}
                          >
                            Update
                          </Button>
                          <Button
                            style={{ marginRight: "5px" }}
                            variant="danger"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </Button>
                        </ButtonGroup>
                      </td>
                    </tr>
                  </tbody>
                ))}
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;

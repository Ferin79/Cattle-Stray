import React from 'react'
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function MyVerticallyCenteredModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {props.data.type === "rejected" ? "Why was this report rejected ?" : "How was this report resolved ?"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            e.preventDefault();
            const uid = props.data.uid
            const type = props.data.type
            const rid = props.data.rid
            const description = e.target.description.value
            props.handleReportReject(uid, type, rid, description);
          }}>
            <Form.Group controlId="description">
              <Form.Control as="textarea" rows="3" type="description" placeholder="Enter description" />
            </Form.Group>
  
            {props.loading ?
              <Spinner animation="border" variant="primary" /> :
              <Button variant="primary" type="submit">
                {props.data.type === "rejected" ? "Reject" : "Resolve"}
              </Button>
            }
            <Button variant="danger" onClick={props.onHide} style={{ marginLeft: 5 }}>Close</Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
  
import React, { useEffect, useContext } from "react";
import firebase from "../../data/firebase";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Table from "react-bootstrap/Table";
import { NavLink } from "react-router-dom";
import { Context } from "../../data/context";

export default function Reports() {
  const { reports, setReports } = useContext(Context);

  const sendNotification = async (token, title, description) => {
    const message = {
      to: [token],
      sound: "default",
      title: title,
      body: description,
    };
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      body: JSON.stringify(message),
    });
  };

  const handleReportReject = (id, type) => {
    firebase
      .firestore()
      .collection("notificationTokens")
      .where("uid", "==", id)
      .get()
      .then((docs) => {
        if (!docs.empty) {
          let token = "";
          docs.forEach((doc) => {
            token = doc.data().token;
          });

          let notificationDesc = "";
          if (type === "rejected") {
            notificationDesc = "Your report has been rejected";
          } else if (type === "resolved") {
            notificationDesc = "Your report has been approved";
          } else if (type === "underProcess") {
            notificationDesc = "Your report is in under process";
          }

          if (notificationDesc.trim() !== "") {
            sendNotification(token, "Report Status", notificationDesc);
          }
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    // fetch(
    //     "https://us-central1-cattle-stray.cloudfunctions.net/api/getReports",
    //     {
    //       method: "GET",
    //       headers: {
    //         "content-type": "application/json",
    //         accept: "application/json",
    //       },
    //     }
    //   ).then((response) => {
    //       let reports = [];
    //       let docs;
    //       response.json().then((data) => {
    //         console.log(data.data)
    //         // data.data.forEach((doc) => {
    //         //   console.log("object")
    //         //   reports.push(doc.data());
    //         // })
    //         // console.log(reports);
    //       });

    //   });
    firebase
      .firestore()
      .collection("reports")
      .orderBy("createdAt", "desc")
      .onSnapshot((docs) => {
        let reports = [];
        docs.forEach((doc) => {
          reports.push({ ...doc.data(), id: doc.id });
        });
        setReports(reports);
      });
  }, [setReports]);

  return (
    <Container fluid>
      <Row className="d-flex justify-content-center align-items-center mt-5 mb-5">
        <Col lg={true}>
          <h1>Admin Reports</h1>
          <Table striped bordered hover responsive variant="dark">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Time</th>
                <th>Condition</th>
                <th>Count</th>
                <th>Moving</th>
                <th>Description</th>
                <th>Up Votes</th>
                <th>Down Votes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.length &&
                reports.map((report, index) => {
                  let injuredStyle = {};
                  if (
                    report.animalCondition === "injured" ||
                    report.animalCondition === "death" ||
                    report.animalCondition === "Injured" ||
                    report.animalCondition === "Death"
                  ) {
                    injuredStyle = { color: "red" };
                  }
                  return (
                    <tr>
                      <td>{++index}</td>
                      <td>
                        <Image
                          height="150px"
                          width="150px"
                          src={report.animalImageUrl}
                          rounded
                        />
                      </td>
                      <td>{report.createdAt.toDate().toLocaleString()}</td>
                      <td style={injuredStyle}>{report.animalCondition}</td>
                      <td>{report.animalCount}</td>
                      <td>{report.animalIsMoving}</td>
                      <td>{report.description}</td>
                      <td>{report.upvotes.length}</td>
                      <td>{report.downvotes.length}</td>
                      <td className="d-flex flex-row flex-wrap justify-content-space-evenly align-items-center">
                        <Row style={{ margin: 4 }}>
                          <Button variant="outline-info">
                            <NavLink
                              to={`/admin/report/${report.id}`}
                              className="changeNavColor"
                            >
                              View
                            </NavLink>
                          </Button>
                        </Row>
                        <Row style={{ margin: 4 }}>
                          <Button
                            variant="outline-success"
                            onClick={() =>
                              handleReportReject(report.uid, "underProcess")
                            }
                          >
                            Process request
                          </Button>
                        </Row>
                        <Row style={{ margin: 4 }}>
                          <Button
                            variant="outline-danger"
                            onClick={() =>
                              handleReportReject(report.uid, "rejected")
                            }
                          >
                            Reject
                          </Button>
                        </Row>
                        <Row style={{ margin: 4 }}>
                          <Button
                            variant="outline-primary"
                            onClick={() =>
                              handleReportReject(report.uid, "resolved")
                            }
                          >
                            Resolve
                          </Button>
                        </Row>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

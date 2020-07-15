import React, { useEffect, useState } from "react";
import firebase from "../../data/firebase";
import { Image, Table, Col, Container, Button } from "react-bootstrap";

export default function Reports() {
  const [reports, setReports] = useState([]);

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
    firebase.firestore().collection("reports").orderBy("createdAt", "desc").get()
      .then((snapshot) => {
        let reports = [];
        snapshot.docs.forEach((doc) => {
          let d = doc.data().createdAt.toDate();
          const time =
            [d.getDate(), d.getMonth() + 1, d.getFullYear()].join("/") +
            " " +
            [d.getHours(), d.getMinutes(), d.getSeconds()].join(":");
          reports.push({ ...doc.data(), id: doc.id, time });
        });
        setReports(reports);
      });
  }, [setReports]);

  let tableRows;
  if (reports.length > 0) {
    let count = 1;
    tableRows = reports.map((report) => {
      let injuredStyle = {};
      if (report.animalCondition === "injured" || report.animalCondition === "death") {
        injuredStyle = { color: "red" };
      }
      return (
        <tr>
          <td>{count++}</td>
          <td>
            <Image
              height="100px"
              width="100px"
              src={report.animalImageUrl}
              rounded
            />
          </td>
          <td>{report.time}</td>
          <td style={injuredStyle}>{report.animalCondition}</td>
          <td>{report.animalCount}</td>
          <td>{report.animalIsMoving}</td>
          <td>{report.description}</td>
          <td>{report.upvotes}</td>
          <td>{report.downvotes}</td>
          <td>
            <Button variant="info" style={{ margin: 4 }}>
              View
            </Button>
            <Button variant="danger">Delete</Button>
          </td>
        </tr>
      );
    });
  }

  return (
    <Container className="col-12">
      <h1>Admin Reports</h1>
      <Table striped bordered hover variant="dark">
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
        <tbody>{tableRows}</tbody>
      </Table>
    </Container>
  );
}

import React, { Component } from 'react';
import { Button, Card, CardTitle, CardBody, Col, Row, Form, FormGroup, Label, Input } from 'reactstrap';

class Profile extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardBody>
                <CardTitle className="h3">Edit Profile</CardTitle>
                <br></br>
                <Form>
                  <FormGroup>
                    <Label for="username">Username</Label>
                    <Input type="username" name="username" id="username" defaultValue="username_placeholder" />
                  </FormGroup>
                  <FormGroup>
                    <Label for="email">Email</Label>
                    <Input type="email" name="email" id="email" defaultValue="email@example.com" />
                  </FormGroup>
                  <FormGroup>
                    <Label for="password">Password</Label>
                    <Input type="password" name="password" id="password" placeholder="Type in new password" />
                  </FormGroup>
                  <FormGroup>
                    <Label for="confirmPassword">Confirm Password</Label>
                    <Input type="password" name="password" id="confirmPassword" placeholder="Repeat the same password" />
                  </FormGroup>
                  <br></br>
                  <Button variant="primary" type="submit">
                    Update Information
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Profile;


import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
  Container,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";
//import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: [],
      edit: false
    };
  }

  componentDidMount() {
    console.log(this.props.auth.user.id);

    axios.get("/users/" + this.props.auth.user.id).then(res => {
      this.setState({ user: res.data });
      console.log(this.state.user);
    });
  }

  editProfile() {
    this.setState({
      edit: !this.state.edit
    });
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Row>
                  <Col>
                    <Row>
                      <Col>
                        <CardTitle className="h3" style={{ paddingTop: 10 }}>
                          View Profile
                        </CardTitle>
                      </Col>
                      <Col sm="1.2" style={{ marginRight: 20 }}>
                        <button
                          type="button"
                          className="start_button orange"
                          onClick={this.editProfile.bind(this)}
                        >
                          {this.state.edit
                            ? "Stop Editing Profile"
                            : "Edit Profile"}
                        </button>
                      </Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col>
                        <Card>
                          <CardBody>
                            <Form>
                              <FormGroup>
                                <Label for="username">
                                  <h6>Username</h6>
                                </Label>
                                <Input
                                  type="username"
                                  name="username"
                                  id="username"
                                  defaultValue={this.state.user.name}
                                  disabled={!this.state.edit}
                                />
                              </FormGroup>
                              <FormGroup>
                                <Label for="email">
                                  <h6>Email</h6>
                                </Label>
                                <Input
                                  type="email"
                                  name="email"
                                  id="email"
                                  defaultValue={this.state.user.email}
                                  disabled={!this.state.edit}
                                />
                              </FormGroup>
                              <FormGroup>
                                <Label for="password">
                                  <h6>Password</h6>
                                </Label>
                                <Input
                                  type="password"
                                  name="password"
                                  id="password"
                                  placeholder={
                                    this.state.edit
                                      ? "Type in a new password"
                                      : "******"
                                  }
                                  disabled={!this.state.edit}
                                />
                              </FormGroup>
                              <FormGroup
                                style={
                                  this.state.edit ? {} : { display: "none" }
                                }
                              >
                                <Label for="confirmPassword">
                                  <h6>Confirm Password</h6>
                                </Label>
                                <Input
                                  type="password"
                                  name="password"
                                  id="confirmPassword"
                                  placeholder="Repeat the same password"
                                />
                              </FormGroup>                              
                              <FormGroup>
                                <Label for="gender">
                                  <h6>Gender</h6>
                                </Label>
                                <Input
                                  type="gender"
                                  name="gender"
                                  id="gender"
                                  placeholder={this.state.user.gender}
                                  disabled
                                />
                              </FormGroup>
                              <FormGroup>
                                <Label for="gender">
                                  <h6>Age</h6>
                                </Label>
                                <Input
                                  type="password"
                                  name="password"
                                  id="password"
                                  placeholder={this.state.user.age}
                                  disabled
                                />
                              </FormGroup>
                              <br></br>
                              <button
                                type="button"
                                className="start_button orange"
                                style={
                                  this.state.edit ? {} : { display: "none" }
                                }
                              >
                                Update Information
                              </button>
                            </Form>
                            {/* <Row>
                              <Col>
                                <h5>Username</h5>
                              </Col>
                            </Row>
                            <Row>
                                {this.state.user.name}
                              </Row>
                            <br/>
                            <Row>
                              <Col>
                                <h5>Email</h5>
                              </Col>
                              <Col>
                              {this.state.user.email}
                              </Col>
                            </Row>
                            <br/>
                            <Row>
                              <Col>
                                <h5>Gender</h5>
                              </Col>
                              <Col>
                              {this.state.user.gender}
                              </Col>
                            </Row>
                            <br/>
                            <Row>
                              <Col>
                                <h5>Age</h5>
                              </Col>
                              <Col>
                              </Col>
                            </Row> */}
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <h4>History</h4>
                        <hr />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Profile);

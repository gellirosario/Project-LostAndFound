import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback
} from "reactstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import { editUser } from "../../actions/authActions";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: [],
      edit: false,
      name: "",
      email: "",
      password: "",
      password2: "",
      age: "",
      errors: {},
      success: false,
      tabledata: [],
      games:{}
    };
  }

  componentDidMount() {

    console.log(this.props.auth.user.id);

    axios.get("/users/" + this.props.auth.user.id).then(res => {
      this.setState({ user: res.data });
      //console.log(this.state.user);

      this.setState({
        name: this.state.user.name,
        email: this.state.user.email,
        age: this.calculateAge(this.state.user.dateOfBirth)
      });
    });

    axios.get("/record/" + this.props.auth.user.id).then(res => {
      this.setState({ tabledata: res.data });
      console.log(this.state.tabledata);


      // this.state.tabledata.forEach(arrayItem => {
      //   // this.state.gameNames.push(arrayItem.gameId)
      //   console.log(arrayItem.gameId);
      //   this.getGameNames(arrayItem.gameId);
      // })
    });
    this.getGameId("WhackAMole");
    this.getGameId("CardMatch");
    this.getGameId("SimonSays");
  }

  getGameId(gameName) {
    axios.get('/game/find/' + gameName).then(res => {
      let gameid = res.data._id.toString();
      Object.assign(this.state.games, { [gameName] : gameid})

      this.setState({ games : this.state.games });
    })
  }

  calculateAge(dateOfBirth){
    var today = new Date();
    var formattedDob = new Date(dateOfBirth);
    var diff = today.getTime() - formattedDob.getTime();
    var age = Math.floor(diff/31557600000);

    return age;
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)

    if (this.props.success !== nextProps.success){
      this.setState({
        success: nextProps.success,
      })
    }

    if (nextProps.success === true && (Object.keys(nextProps.errors).length === 0)) {
      this.setState({
        password: "",
        password2: ""
      })
    }

    if (this.props.errors !== nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }

  onInput = e => {
    this.setState({ [e.target.id]: e.target.value });
  }

  onSubmit = e => {
    e.preventDefault();
    const editedData = {
      id: this.props.auth.user.id,
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    }
    console.log(editedData);
    this.props.editUser(editedData);
  }

  editProfile() {
    this.setState({
      edit: !this.state.edit,
      errors: false,
      success: false,
      password: "",
      password2: ""
    });
  }

  render() {

    const { errors } = this.state;

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
                            <Form onSubmit={this.onSubmit}>
                              <FormGroup>
                                <Label for="name">
                                  <h6>Name</h6>
                                </Label>
                                <Input
                                  onInput={this.onInput}
                                  type="name"
                                  name="name"
                                  id="name"
                                  value={this.state.name}
                                  invalid={!!errors.name}
                                  disabled={!this.state.edit}
                                />
                                <FormFeedback>{errors.name}</FormFeedback>
                              </FormGroup>
                              <FormGroup>
                                <Label for="email">
                                  <h6>Email</h6>
                                </Label>
                                <Input
                                  onInput={this.onInput}
                                  type="email"
                                  name="email"
                                  id="email"
                                  value={this.state.email}
                                  invalid={!!errors.email}
                                  disabled={!this.state.edit}
                                />
                                <FormFeedback>{errors.email}</FormFeedback>
                              </FormGroup>
                              <FormGroup>
                                <Label for="password">
                                  <h6>Password</h6>
                                </Label>
                                <Input
                                  onInput={this.onInput}
                                  type="password"
                                  name="password"
                                  id="password"
                                  value={this.state.password}
                                  placeholder={
                                    this.state.edit
                                      ? "Type in a new password"
                                      : "******"
                                  }
                                  invalid={!!errors.password}
                                  disabled={!this.state.edit}
                                />
                                <FormFeedback>{errors.password}</FormFeedback>
                              </FormGroup>
                              <FormGroup
                                style={
                                  this.state.edit ? {} : { display: "none" }
                                }
                              >
                                <Label for="password2">
                                  <h6>Confirm Password</h6>
                                </Label>
                                <Input
                                  onInput={this.onInput}
                                  type="password"
                                  name="password2"
                                  id="password2"
                                  value={this.state.password2}
                                  placeholder="Repeat the same password"
                                  invalid={!!errors.password2}
                                />
                                <FormFeedback>{errors.password2}</FormFeedback>
                              </FormGroup>
                              <FormGroup>
                                <Label for="gender">
                                  <h6>Gender</h6>
                                </Label>
                                <Input
                                  type="gender"
                                  name="gender"
                                  id="gender"
                                  value={this.state.user.gender}
                                  disabled
                                />
                              </FormGroup>
                              <FormGroup>
                                <Label for="age">
                                  <h6>Age</h6>
                                </Label>
                                <Input
                                  type="age"
                                  name="age"
                                  id="age"
                                  value={this.state.age}
                                  disabled
                                />
                              </FormGroup>
                              <br></br>
                              <Button
                                type="submit"
                                color="primary"
                                style={
                                  this.state.edit ? {} : { display: "none" }
                                }
                              >
                                Update Information
                              </Button>
                            </Form>
                            <h6
                              style={
                                this.state.success &&
                                Object.keys(this.state.errors).length === 0
                                  ? {}
                                  : { display: "none" }
                              }
                            >
                              <br />
                              Profile successfully updated!
                            </h6>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <h4>History</h4>
                        <br/>
                        <h5>Whack A Mole</h5>
                        <table id="moleTable" class="history_table">
                          <tbody>
                            <tr class="history_table-tr">
                              <th class="history_table-th">Score</th>
                              <th class="history_table-th">Reaction Time (seconds)</th>
                              <th class="history_table-th">Date</th>
                            </tr>
                            {this.state.tabledata.map(item => {

                              if (item.gameId === this.state.games["WhackAMole"]) {
                              let recordDate = new Date(item.date);

                                return (
                                  <tr class="history_table-tr">
                                    <td class="history_table-td">{item.score}</td>
                                    <td class="history_table-td">{item.reactionTime}</td>
                                    <td class="history_table-td">{recordDate.toString()}</td>
                                  </tr>
                                );
                              }
                              else return false;
                            })}
                          </tbody>
                        </table>
                        <br/>
                        <h5>Card Match</h5>
                        <table id="matchTable" class="history_table">
                          <tbody>
                            <tr class="history_table-tr">
                              <th class="history_table-th">Flips</th>
                              <th class="history_table-th">Total Time (seconds)</th>
                              <th class="history_table-th">Date</th>
                            </tr>
                            {this.state.tabledata.map(item => {

                              if (item.gameId === this.state.games["CardMatch"]) {
                              
                                let recordDate = new Date(item.date);

                                return (
                                  <tr class="history_table-tr">
                                    <td class="history_table-td">{item.flips}</td>
                                    <td class="history_table-td">{item.totalTime}</td>
                                    <td class="history_table-td">{recordDate.toString()}</td>
                                  </tr>
                                );
                              }
                              else return false;
                            })}
                          </tbody>
                        </table>
                        <br/>
                        <h5>Simon Says</h5>                        
                        <table id="simonTable" class="history_table">
                          <tbody>
                            <tr class="history_table-tr">
                              <th class="history_table-th">Score</th>
                              <th class="history_table-th">Date</th>
                            </tr>
                            {this.state.tabledata.map(item => {

                              if (item.gameId === this.state.games["SimonSays"]) {
                              
                                let recordDate = new Date(item.date);

                                return (
                                  <tr class="history_table-tr">
                                    <td class="history_table-td">{item.score}</td>
                                    <td class="history_table-td">{recordDate.toString()}</td>
                                  </tr>
                                );
                              } else return false;
                            })}
                          </tbody>
                        </table>
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

Profile.propTypes = {
  editUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  success: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  success: state.success
});

export default connect(
  mapStateToProps,
  { editUser }
)(Profile);

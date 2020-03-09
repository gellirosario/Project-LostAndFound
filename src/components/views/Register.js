import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, FormFeedback } from 'reactstrap';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import moment from 'moment';
import Swal from 'sweetalert2'

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

class Register extends Component {

  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      age: "",
      gender: "m",
      errors: {}
    };

  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/home");
    }
  }

  componentWillReceiveProps(nextProps) {
    
    if (nextProps.errors) {

      Toast.fire({
        icon: 'error',
        title: 'Registered fail'
      })

      this.setState({
        errors: nextProps.errors
      });
    }
  }


  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      gender: this.state.gender,
      dateOfBirth: this.state.dateOfBirth,
      password: this.state.password,
      password2: this.state.password2
    };
    console.log(newUser);
    this.props.registerUser(newUser, this.props.history);
    
  };

  render() {

    const { errors } = this.state;

    return (
      <div className="animated fadeIn app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form className="form" onSubmit={this.onSubmit}>
                    <h1>Register</h1>
                    <p className="text-muted">Create your account</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input onChange={this.onChange}
                        value={this.state.name}
                        id="name"
                        type="text"
                        invalid={!!(errors.name)}
                        placeholder="Name"
                        autoComplete="Name" required/>
                      <FormFeedback>{errors.name}</FormFeedback>
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText><i className="icon-envelope"></i></InputGroupText>
                      </InputGroupAddon>
                      <Input onChange={this.onChange}
                        value={this.state.email}
                        id="email"
                        type="text"
                        invalid={!!(errors.email)}
                        placeholder="Email"
                        autoComplete="email" required/>
                      <FormFeedback>{errors.email}</FormFeedback>
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText><i className="icon-people"></i></InputGroupText>
                      </InputGroupAddon>
                      <Input
                        onChange={this.onChange}
                        id="gender"
                        type="select" name="gender">
                        <option value="m" default>Male</option>
                        <option value="f">Female</option>
                      </Input>
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText><i className="icon-present"></i></InputGroupText>
                      </InputGroupAddon>
                      <Input
                        onChange={this.onChange}
                        value={this.state.dateOfBirth}
                        invalid={!!(errors.dateOfBirth)}
                        id="dateOfBirth"
                        placeholder="dateOfBirth"
                        max={moment().format("YYYY-MM-DD")}
                        type="date" name="dateOfBirth" required
                      />
                      <FormFeedback>{errors.age}</FormFeedback>
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        onChange={this.onChange}
                        value={this.state.password}
                        id="password"
                        type="password"
                        invalid={!!(errors.password)}
                        placeholder="Password"
                        autoComplete="new-password" required/>
                      <FormFeedback>{errors.password}</FormFeedback>
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input onChange={this.onChange}
                        value={this.state.password2}
                        id="password2"
                        type="password"
                        invalid={!!(errors.password2)}
                        placeholder="Confirm password"
                        autoComplete="new-password" required/>
                      <FormFeedback>{errors.password2}</FormFeedback>
                    </InputGroup>
                    <Button type="submit" color="primary" block>Create Account</Button>
                  </Form>
                </CardBody>
                <CardFooter className="p-4">
                  <Row>
                    <Col xs="12" sm="12">
                      <Link to="/login">
                        <Button color="secondary" block><span>Log In</span></Button>
                      </Link>
                    </Col>
                  </Row>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};


const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
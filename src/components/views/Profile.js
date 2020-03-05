import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
} from 'reactstrap';
//import PropTypes from "prop-types";
import { connect } from "react-redux";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
    }
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
                        <CardTitle className="h3" style={{ paddingTop: 10 }}>View Profile</CardTitle>
                      </Col>
                      <Col sm="1.2" style={{ marginRight: 20 }}>
                        <button type="button" className="start_button orange">Edit Profile</button>
                      </Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col>
                        <Card>
                          <CardBody>
                            <h4> PROFILE DATA here <br /><br /><br /><br /><br /><br /><br /><br /></h4>
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

export default connect(
  mapStateToProps
)(Profile);

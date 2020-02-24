import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardBody, Container, Row, CardHeader } from 'reactstrap';

class Landing extends Component {
    render() {
        return (
            <div className="animated fadeIn app flex-row align-items-center">
                <Container>
                    <Row className="justify-content-center" style={{ textAlign:'center'}}>
                        <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '100%',height:'100%' }}>
                            <CardBody className="text-center">
                                <div>
                                <img style={{height:"450px"}} src="https://www.lumosity.com/static/playing_koi_2-5b383fb3d14273ad4dcdec5f33170193.svg"></img>
                                    <h2 style={{fontSize:'52px'}}>Welcome to Lost&Found</h2>
                                    <p style={{fontSize:'30px'}}>Discover what your mind can do</p>
                                    <p style={{fontSize:'20px'}}>Challenge and Improve your mind</p>
                                    <br/>
                                    <div className="justify-content-center">
                                    <Link to="/login">
                                        <Button color="light" className="start_button" active tabIndex={-1} style={{width:"125px", color:"#e67e22", marginRight:'20px', fontSize:'20px', fontWeight:'bold'}}>LOG IN</Button>
                                    </Link>
                                    <Link to="/register">
                                        <Button color="light" className="start_button" active tabIndex={-1} style={{width:"125px", color:"#e67e22",fontSize:'20px', fontWeight:'bold'}}>REGISTER</Button>
                                    </Link>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Row>
                </Container>
            </div>
        );
    }
}
export default Landing;
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem } from 'reactstrap';
import PropTypes from 'prop-types';
import logo from '../../assets/images/logo.png'
import logo1 from '../../assets/images/logo_1.png'
import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
        <React.Fragment>
        <AppSidebarToggler style={{backgroundColor: "#f0f3f5"}}  className="d-lg-none" display="md" mobile />
        <NavLink to="/">
        <AppNavbarBrand 
          full={{ src: logo1, width: 140, height: 40, alt: 'Lost&Found Logo' }}
          minimized={{ src: logo, width: 35, height: 35, alt: 'Lost&Found Logo' }}
        />
        </NavLink>
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="ml-auto" navbar>
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              <img src='https://www.searchpng.com/wp-content/uploads/2019/02/Deafult-Profile-Pitcher.png' className="img-avatar" alt="user" />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>
              <DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>
              <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-lock"></i> Logout</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;

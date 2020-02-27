import { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import * as authActionCreators from '../../actions/authActions'

class Logout extends Component {

  componentWillMount() {
    this.props.dispatch(authActionCreators.logoutUser());
  }

  render() {
    return null
  }
}
Logout.propTypes = {
  dispatch: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired
}

export default withRouter(connect()(Logout))
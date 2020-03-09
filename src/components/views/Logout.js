import { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import * as authActionCreators from '../../actions/authActions'
import Swal from 'sweetalert2'

const Toast = Swal.mixin({
  toast: true,
  position: 'center',
  padding:'50px',
  showConfirmButton: false,
  timer: 1000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

class Logout extends Component {

  componentWillMount() {
    Toast.fire({
      icon: 'success',
      title: 'Signed out successfully'
    })
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
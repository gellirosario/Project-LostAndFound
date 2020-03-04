import React from 'react';
import {Link} from 'react-router-dom';
//import PropTypes from "prop-types";
import { connect } from "react-redux";

function MainPage() {
  return (

    <div>
      <div>
        <img src="https://cdn.psychologytoday.com/sites/default/files/field_blog_entry_images/2017-12/dementia_istock_000029744938_large.jpg" class="img-fluid" alt="Header"></img>
      </div>
      <br></br>
      <p className="h1">Featured Games</p>
      <div className="card-deck" style={{ marginTop: "20px", marginBottom: "20px" }}>
        <div className="card">
          <img className="card-img-top" style={{ height: "53%" }} src="https://store-images.s-microsoft.com/image/apps.54588.14444766800945903.ce1add5c-079a-4ada-ad7e-3edf619f02e2.e0d588f2-ce79-41f6-abd6-a00672d9952f?mode=scale&q=90&h=1080&w=1920" alt="Card Match"></img>
          <div className="card-body">
            <h5 className="card-title">Card Match</h5>
            <p className="card-text">This is a wider card It's a broader card with text below as a natural lead-in to extra content. This content is a little longer. This card has even longer content than the first to show that equal height action.</p>
            <Link to="/game/matchgame">
              <button type="button" className="start_button orange" href="">Play Now</button>
            </Link>
          </div>
        </div>
        <div className="card">
          <img className="card-img-top" style={{ height: "53%" }} src="https://www.skincancer.org/wp-content/uploads/whackamole-900px.jpg" alt="Whack A Mole"></img>
          <div className="card-body">
            <h5 className="card-title">Whack A Mole</h5>
            <p className="card-text">This is a wider card It's a broader card with text below as a natural lead-in to extra content. This content is a little longer. This card has even longer content than the first to show that equal height action.</p>
            <Link to="/game/molegame">
            <button type="button" className="start_button orange">Play Now</button>
            </Link>
          </div>
        </div>
        <div className="card">
          <img className="card-img-top" style={{ height: "53%" }} src="https://www.teachstarter.com/wp-content/uploads/2019/04/preview-2732014-534438-0-landscape-1200x628.png" alt="Simon Says"></img>
          <div className="card-body">
            <h5 className="card-title">Simon Says</h5>
            <p className="card-text">This is a wider card It's a broader card with text below as a natural lead-in to extra content. This content is a little longer. This card has even longer content than the first to show that equal height action.</p>
            <Link to="/game/simongame">
            <button type="button" className="start_button orange">Play Now</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps
)(MainPage);
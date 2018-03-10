import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { authorize } from '../stores'

const SignInButton = ({isSigningIn, authorize}) => (
  isSigningIn ?
    <button>Authorizing...</button>
  :
    <button onClick={() => authorize()}>Sign In</button>
)

export default connect(
  (state) => ({ // mapStateToPropsContainer
    gapiAuth: state.gapiAuth
  }),
  (dispatch) => ({ // mapDispatchToProps
    authorize: bindActionCreators(authorize, dispatch),
  })
)(({gapiAuth, authorize}) => (
  <div>
    <h1>Welcome to Resource Timetable for Google Calendar</h1>
    <SignInButton isSigningIn={gapiAuth == 'authorizing'} authorize={authorize}/>
    { gapiAuth }
  </div>
));
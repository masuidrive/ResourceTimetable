import React from 'react'
import { bindActionCreators } from 'redux'
import { initStore, initialize, authorize, unauthorize } from '../store'
import withRedux from 'next-redux-wrapper'

import SignInContainer from '../containers/SignInContainer'
import CalendarContainer from '../containers/CalendarContainer'

class Main extends React.Component {
  componentDidMount() {
    if(!this.props.isServer) {
      this.props.initialize();
    }
  }

  loadingPage() {
    return <div>Loading...</div>
  }

  render() {
    if(this.props.isServer) {
      return this.loadingPage()
    }

    switch (this.props.gapiAuth) {
      case 'unauthorized':
      case 'authorizing':
        return <SignInContainer/>
    
      case 'authorized':
        return <CalendarContainer/>
    
      default:
        return this.loadingPage()
    }
  }
}

const mapStateToProps = (state, ownProps) => ({
  gapiAuth: state.gapiAuth
})

const mapDispatchToProps = (dispatch) => ({
  initialize: bindActionCreators(initialize, dispatch)
})

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Main)
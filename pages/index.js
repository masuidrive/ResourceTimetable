import React from 'react'
import { bindActionCreators } from 'redux'
import { initStore, initialize } from '../store'
import withRedux from 'next-redux-wrapper'
import { Header, Modal, Icon, Button } from 'semantic-ui-react'

import SignInContainer from '../containers/SignInContainer'
import CalendarContainer from '../containers/CalendarContainer'
import SettingsModalContainer from '../containers/SettingsModalContainer'

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

    var main = undefined;
    switch (this.props.gapiAuth) {
      case 'unauthorized':
      case 'authorizing':
        main = <SignInContainer/>
    
      case 'authorized':
        main = <CalendarContainer/>
    
      default:
        main = this.loadingPage()
    }

    var modal = undefined
    modal = <SettingsModalContainer/>

    return <div>
      {main}
      {modal}
    </div>
  }
}

const mapStateToProps = (state, ownProps) => ({
  gapiAuth: state.gapiAuth
})

const mapDispatchToProps = (dispatch) => ({
  initialize: bindActionCreators(initialize, dispatch)
})

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Main)
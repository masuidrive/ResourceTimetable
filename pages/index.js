import React from 'react'
import { bindActionCreators } from 'redux'
import { initStore, initialize, showSettingsModal } from '../store'
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
    console.log(this.props)

    var main = undefined;
    switch (this.props.gapiAuth) {
      case 'unauthorized':
      case 'authorizing':
        main = <SignInContainer/>
        break
      case 'authorized':
        main = <div>
          <CalendarContainer/>
          <Button content="Settings" onClick={() => this.props.showSettingsModal()}/>
        </div>
        break
      default:
        main = this.loadingPage()
    }
    return <div>
      { main }
      <SettingsModalContainer/>
    </div>
  }
}

const mapStateToProps = (state, ownProps) => ({
  gapiAuth: state.gapiAuth
})

const mapDispatchToProps = (dispatch) => ({
  initialize: bindActionCreators(initialize, dispatch),
  showSettingsModal: bindActionCreators(showSettingsModal, dispatch),
})

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Main)
import React from 'react'
import { bindActionCreators } from 'redux'
import { initStore, initialize, showSettingsModal, unauthorize } from '../store'
import withRedux from 'next-redux-wrapper'
import { Header, Modal, Icon, Button, Container, Menu, Image } from 'semantic-ui-react'

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

  header() {
    return (
      <Menu fixed='top' size="tiny" inverted>
        <Container>
          <Menu.Item as='a' header>
            Meeting rooms on Google Calendar.
          </Menu.Item>
        </Container>
        <Menu.Menu position='right'>
        <Menu.Item name='Settings' onClick={() => this.props.showSettingsModal()} />
        <Menu.Item name='Logout' onClick={() => this.props.unauthorize()} />
        </Menu.Menu>
      </Menu>
    )
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
        break
      case 'authorized':
        main = <div>
          <CalendarContainer style={{marginTop: 34, position: 'relative'}}/>
        </div>
        break
      default:
        main = this.loadingPage()
    }
    return <div>
      { this.header() }
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
  unauthorize: bindActionCreators(unauthorize, dispatch),
})

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Main)
import React from 'react'
import { bindActionCreators } from 'redux'
import { initStore, initialize, showSettingsModal, prevDate, nextDate } from '../store'
import withRedux from 'next-redux-wrapper'
import { Header, Modal, Icon, Button, Container, Menu, Image } from 'semantic-ui-react'

import SignInContainer from '../containers/SignInContainer'
import CalendarContainer from '../containers/CalendarContainer'
import SettingsModalContainer from '../containers/SettingsModalContainer'
import "../styles.scss"

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
      <Menu fixed='top' size="tiny">{/*inverted*/}
        <Container>
          <Menu.Item header>
            Meetie.
          </Menu.Item>

          <Menu.Item icon="chevron left" onClick={() => this.props.prevDate()} />
          <Menu.Item>
            { this.props.date === undefined ? '' : `${this.props.date.getMonth()+1} / ${ this.props.date.getDate() }` }
          </Menu.Item>
          <Menu.Item icon="chevron right" onClick={() => this.props.nextDate()} />
          
        </Container>
        <Menu.Menu position='right'>
          <Menu.Item name='Settings' onClick={() => this.props.showSettingsModal()} />
        </Menu.Menu>
      </Menu>
    )
  }

  render() {
    if(this.props.isServer) {
      return this.loadingPage()
    }

    var main = undefined;
    console.log(`gapiAuth: ${this.props.gapiAuth}`)
    switch (this.props.gapiAuth) {
      case 'unauthorized':
      case 'authorizing':
        main = <SignInContainer/>
        break
      case 'authorized':
        main = <div>
          <CalendarContainer />
          <SettingsModalContainer/>
        </div>
        break
      default:
        main = this.loadingPage()
    }
    return <div>
      { this.header() }
      { main }
    </div>
  }
}

const mapStateToProps = (state, ownProps) => ({
  gapiAuth: state.gapiAuth,
  date: state.date
})

const mapDispatchToProps = (dispatch) => ({
  initialize: bindActionCreators(initialize, dispatch),
  showSettingsModal: bindActionCreators(showSettingsModal, dispatch),
  nextDate: bindActionCreators(nextDate, dispatch),
  prevDate: bindActionCreators(prevDate, dispatch),
})

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Main)
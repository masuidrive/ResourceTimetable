import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'

import { hideSettingsModal, resetResourceSettings, unauthorize } from '../store'
import SettingsContainer from '../containers/SettingsContainer'

export default connect(
  (state) => ({ // mapStateToPropsContainer
    shownSettingsModal: state.shownSettingsModal
  }),
  (dispatch) => ({ // mapDispatchToProps
    resetResourceSettings: bindActionCreators(resetResourceSettings, dispatch),
    hideSettingsModal: bindActionCreators(hideSettingsModal, dispatch),
    unauthorize: bindActionCreators(unauthorize, dispatch),
  })
)(({shownSettingsModal, hideSettingsModal, resetResourceSettings, unauthorize}) => {
  if(!shownSettingsModal) { return <div></div> }

  return <div>
    <Modal open={true} size="tiny" >
      <Header icon="settings" content="Settings" />
      <Modal.Content >
        <SettingsContainer />
      </Modal.Content>
      <Modal.Actions>
      <Button onClick={() => unauthorize()}>Sign out</Button>
      <Button onClick={() => resetResourceSettings()}>All reset</Button>
        <Button primary onClick={() => hideSettingsModal()}>
          <Icon name='checkmark' /> Close
        </Button>
      </Modal.Actions>
    </Modal>
  </div>
})
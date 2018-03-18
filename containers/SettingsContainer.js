import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updateResourceName, clearResourceSettings } from '../store'
import { Button, Input } from 'semantic-ui-react'

export default connect(
  (state) => ({ // mapStateToPropsContainer
    gapiAuth: state.gapiAuth,
    settings: state.resourceSettings
  }),
  (dispatch) => ({ // mapDispatchToProps
    //clearResourceSettings: bindActionCreators(clearResourceSettings, dispatch),
    //updateResourceName: bindActionCreators(updateResourceName, dispatch),
  })
)(({settings, updateResourceName, clearResourceSettings}) => (
  <div>
    <h1>Settings</h1>
    {
      settings === undefined ?
        <div>loading</div> :
        settings.map(r => 
          <div key={r.calendarId}>
            <Input value={r.name} onChange={(e) => updateResourceName(r.calendarId, e.target.value)}/>
            { r.hidden ? "HIDDEN" : "SHOW"}
          </div>
        )
    }
    <Button primary onClick={() => ResourceSettings()}>Reset</Button>
  </div>
));
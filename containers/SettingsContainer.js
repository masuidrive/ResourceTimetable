import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updateResourceName, clearResourceSettings } from '../store'
import { Button, Input } from 'semantic-ui-react'

export default connect(
  (state) => ({ // mapStateToPropsContainer
    gapiAuth: state.gapiAuth,
    resources: state.resources
  }),
  (dispatch) => ({ // mapDispatchToProps
    clearResourceSettings: bindActionCreators(clearResourceSettings, dispatch),
    updateResourceName: bindActionCreators(updateResourceName, dispatch),
  })
)(({resources, updateResourceName, clearResourceSettings}) => (
  <div>
    <h1>Settings</h1>
    {
      resources === undefined ?
        <div>loading</div> :
        resources.map(r => <div><Input value={r.name} onChange={(e) => updateResourceName(r.calendarId, e.target.value)}/></div>)
    }
    <Button primary onClick={() => ResourceSettings()}>Reset</Button>
  </div>
));
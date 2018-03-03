import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { saveResourceSettings } from '../store'

export default connect(
  (state) => ({ // mapStateToPropsContainer
    resourceSettings: state.resourceSettings
  }),
  (dispatch) => ({ // mapDispatchToProps
    saveResourceSettings: bindActionCreators(saveResourceSettings, dispatch),
  })
)(({resourceSettings, saveResourceSettings}) => (
  <div>
    <h1>Settings</h1>
    <button onClick={() => saveResourceSettings()}>Save</button>
  </div>
));

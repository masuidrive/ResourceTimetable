import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { unauthorize } from '../store'

export default connect(
  (state) => ({ // mapStateToPropsContainer
    resources: state.resources
  }),
  (dispatch) => ({ // mapDispatchToProps
    unauthorize: bindActionCreators(unauthorize, dispatch),
  })
)(({resources, unauthorize}) => (
  <div>
    <h1>Goggle Calendar Resource Viewer</h1>
    {
      resources === undefined ? 'waiting...' : 
      resources.map((resource) => (
        <div>{resource.calendar.summary}</div>
      ))
    }
    <button onClick={() => unauthorize()}>Sign Out</button>
  </div>
));

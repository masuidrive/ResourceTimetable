import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { unauthorize } from '../store'

import Timetable from '../components/Timetable'

const hourHeight = 40
const lineWidth = 100
const headerHeight = 50

export default connect(
  (state) => ({ // mapStateToPropsContainer
    resources: state.resources,
    settings: state.resourceSettings
  }),
  (dispatch) => ({ // mapDispatchToProps
  })
)(({resources, settings, unauthorize, style}) => {
  if(resources === undefined || settings === undefined) {
    return (<div>waiting...</div>)
  }
  return (
    <div style={style}>
      <Timetable resources={resources} settings={settings} width="100%" height="90vh" />
    </div>
  )
});

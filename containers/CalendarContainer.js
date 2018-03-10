import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { unauthorize } from '../stores'

import Timetable from '../components/Timetable'

const hourHeight = 40
const lineWidth = 100
const headerHeight = 50

export default connect(
  (state) => ({ // mapStateToPropsContainer
    resources: state.resources
  }),
  (dispatch) => ({ // mapDispatchToProps
    unauthorize: bindActionCreators(unauthorize, dispatch),
  })
)(({resources, unauthorize}) => {
  if(resources === undefined) {
    return (<div>waiting...</div>)
  }
  return (
    <div>
      <Timetable resources={resources} width="100%" height="90vh" />
      <button onClick={() => unauthorize()}>Sign Out</button>
    </div>
  )
});

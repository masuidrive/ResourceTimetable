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
    settings: state.resourceSettings,
    date: state.date,
  }),
  (dispatch) => ({ // mapDispatchToProps
  })
)(({resources, settings, unauthorize, date}) => {
  return (
    <div style={{overflow:"hidden"}}>
      <Timetable resources={resources} settings={settings} date={date}/>
    </div>
  )
});

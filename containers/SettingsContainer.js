import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { saveResourceSettings } from '../store'
import { Button, Input, Icon } from 'semantic-ui-react'
import Sortable from 'react-sortablejs'

export default connect(
  (state) => ({ // mapStateToPropsContainer
    gapiAuth: state.gapiAuth,
    settings: state.resourceSettings
  }),
  (dispatch) => ({ // mapDispatchToProps
    saveResourceSettings: bindActionCreators(saveResourceSettings, dispatch),
  })
)(({settings, saveResourceSettings}) => {
  const onSortEnd = (order) => {
    saveResourceSettings(order.map((calendarId) => settings.find((s) => s.calendarId === calendarId)))
  }

  const toggleVisibility = (calendarId) => () => {
    const newSettings = settings.map((s) => {
      if(s.calendarId == calendarId) {
        s.hidden = !s.hidden
      }
      return s
    })
    saveResourceSettings(newSettings)
  }

  const changeName = (calendarId) => (event) => {
    const newSettings = settings.map((s) => {
      if(s.calendarId == calendarId) {
        s.name = event.target.value
      }
      return s
    })
    saveResourceSettings(newSettings)
  }

  const els = settings.map((value) =>
    <div key={value.calendarId} data-id={value.calendarId}>
      <Icon name="content" color="grey" link={true}/>
      <Input value={ value.name } onChange={ changeName(value.calendarId) } style={{margin: "0.1em 0.5em"}} />
      <Button content={ value.hidden ? "Hidden" : "Shown" } active={ !value.hidden } toggle={ true } onClick={ toggleVisibility(value.calendarId) }/>
    </div>
  )
  
  if(settings === undefined) {
    return <div>Loading...</div>
  }
  return(
    <Sortable onChange={(order, sortable, evt) => { onSortEnd(order) }}>
    {els}
    </Sortable>
  )
})

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { saveResourceSettings } from '../store'
import { Button, Input, Icon } from 'semantic-ui-react'
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';

export default connect(
  (state) => ({ // mapStateToPropsContainer
    gapiAuth: state.gapiAuth,
    settings: state.resourceSettings
  }),
  (dispatch) => ({ // mapDispatchToProps
    saveResourceSettings: bindActionCreators(saveResourceSettings, dispatch),
  })
)(({settings, saveResourceSettings}) => {
  const onSortEnd = ({ oldIndex, newIndex }) => {
    saveResourceSettings(arrayMove(settings, oldIndex, newIndex))
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

  const SortableItem = SortableElement(({value}) => {
    return <div>
      <Icon name="content" color="grey" link={true} style={{marginRight: "0.5em"}}/>
      <Input value={ value.name } icon={{ name: "remove", color: "grey" }} onChange={ changeName(value.calendarId) } />
      <Button content={ value.hidden ? "Hidden" : "Shown" } active={ !value.hidden } toggle={ true } onClick={ toggleVisibility(value.calendarId) }/>
      { }
    </div>
  })
  
  const SortableList = SortableContainer(({items}) => {
    return (
      <ul>
        {items.map((value, index) => (
          <SortableItem key={`item-${value.calendarId}`} index={index} value={value} />
        ))}
      </ul>
    );
  })
  

  return <div>
    {
      settings === undefined ?
        <div>loading</div> :
        <SortableList items={settings} onSortEnd={onSortEnd}/>
      }
  </div>
})
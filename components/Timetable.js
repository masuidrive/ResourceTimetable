import React from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import moment from 'moment-timezone'

const applySettingsToResources = (resources, settings) => {
  // sort by resource name
  resources = resources.sort((a, b) => {
    const aa = a.name.toUpperCase(), bb = b.name.toUpperCase()
    if(aa < bb) return -1
    if(aa > bb) return 1
    return 0
  })

  // array settings
  var result = settings.map((rs) => {
    var resource = resources.find((r2) => r2.calendarId === rs.calendarId)
    if(resource == undefined) {
      return undefined
    }
    resource.name = rs.name
    return rs.hidden ? undefined : resource
  })

  resources = resources.filter((r) => {
    return !settings.find((r2) => r.calendarId === r2.calendarId)
  })

  return result.concat(resources).filter((r) => r !== undefined)
}

export default class TimeTable extends React.Component {
  static propTypes = {
    hourWidth: PropTypes.number,
    resourceHeight: PropTypes.number,
    labelWidth: PropTypes.number,
    labelHeight: PropTypes.number,
    settings: PropTypes.array,
  }

  static defaultProps = {
    hourWidth: 160,
    resourceHeight: 40,
    labelHeight: 40,
    labelWidth: 160,
    settings: {}
  }

  componentDidMount() {
    const now = moment()
    const pos = (now.hour() + now.minute() / 60) * this.props.hourWidth - this.props.hourWidth
    const dom = findDOMNode(this.refs.wrapper)
    dom.scrollBy(pos, 0)
  }

  render() {
    const { hourWidth, resourceHeight, labelWidth, labelHeight } = this.props
    const resources = applySettingsToResources(this.props.resources, this.props.settings)
    return (
      <div>
              <div style={{width: labelWidth, height: resourceHeight, zIndex:4, left:0, top:0, position: 'absolute', display: 'block', backgroundColor: '#689090'}}></div>

      <div ref="wrapper" style={{position: 'relative', width: this.props.width, height: this.props.height, overflow: "auto", margin:0,padding:0}} ref="wrapper">
      {/*
         */} 
        <div style={{width: labelWidth + hourWidth * 24, height: resourceHeight * resources.length + labelHeight, position: 'relative', margin:0,padding:0}}>
          <div style={{width: hourWidth * 24, height: resourceHeight, zIndex:1,left:labelWidth,top:0,position: '-webkit-sticky',position: 'sticky', "-webkit-overflow-scrolling": "touch"}}>
            { Array(24).fill(0).map((x, i) => (
              <div style={{backgroundColor: '#C8D4CB', width:hourWidth, height: resourceHeight, left:hourWidth*i,top:0,position:'absolute'}} key={`hour-${i}`}>{i}:00</div>
            )) }
          </div>
          <div style={{width: labelWidth, height: resourceHeight * resources.length, left: 0, top:0,zIndex:2,position: '-webkit-sticky',  position: 'sticky', "-webkit-overflow-scrolling": "touch", backgroundColor: 'gray'}}>
            { resources.map((resource, resourceIndex) => (
              <div style={{backgroundColor: '#C8D4CB', width:labelWidth, height: resourceHeight, left:0,top:resourceIndex*resourceHeight,position:'absolute'}} key={`label-${resource.calendarId}`}>{resource.name}</div>
            )) }
          </div>
          { resources.map((resource, resourceIndex) => (
            resource.events.map((event) => {
              const start = moment(event.start).hour() * 60 + moment(event.start).minute()
              const end = moment(event.end).hour() * 60 + moment(event.end).minute()
              const y = resourceHeight * resourceIndex + resourceHeight
              const x = start * hourWidth / 60 + labelWidth
              const width = (end - start) * hourWidth / 60
              return(
                <div style={{backgroundColor: "#2796CB",color: "white", fontSize: 10, padding: "1px 4px", border: "1px solid white", borderRadius: 6, overflow: 'hidden', position: 'absolute', height: `${resourceHeight}px`, width: `${width}px`, top: `${y}px`, left: `${x}px`}} key={`event-${event.id}`}>
                  {event.title}
                </div>
              )
            })
          )) }
        </div>
        </div>
        </div>
    )
  }
}

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
    headerHeight: 34,
    settings: {}
  }

  componentDidMount() {
    const now = moment()
    const pos = (now.hour() + now.minute() / 60) * this.props.hourWidth - this.props.hourWidth
    const dom = findDOMNode(this.refs.wrapper)
    dom.scrollBy(pos, 0)
  }

  render() {
    const { hourWidth, resourceHeight, labelWidth, labelHeight, headerHeight } = this.props
    const resources = applySettingsToResources(this.props.resources, this.props.settings)
    return (
      <div>
        <div style={{width: labelWidth, height: resourceHeight, zIndex:4, left:"5vw", marginTop: '5vh', top:headerHeight, position: 'absolute', display: 'block', backgroundColor: '#ECECEB',borderRight: "1px solid #888", borderBottom: "1px solid #888"}}>&lt; 3/15 &gt;</div>

      <div ref="wrapper" style={{position: 'absolute',top:"5vh",left:"5vw", width:'90vw', height: '90vh', overflow: "auto", padding:0 ,margin:0, borderTop: "34px solid transparent",WebkitOverflowScrolling: "touch"}}>
        <div style={{width: labelWidth + hourWidth * 24, height: resourceHeight * resources.length + labelHeight, position: 'relative', margin:0,padding:0,backgroundColor: 'white'}}>
          <div style={{width: hourWidth * 24, height: resourceHeight, zIndex:1,left:labelWidth,top:0,position: '-webkit-sticky',position: 'sticky'}}>
            { Array(24).fill(0).map((x, i) => (
              <div style={{backgroundColor: '#ECECEB', borderRight: "1px dashed #ddd", borderBottom: "1px solid #888", padding: "2px", width:hourWidth, height: resourceHeight, left:hourWidth*i,top:0,position:'absolute'}} key={`hour-${i}`}>{i}:00</div>
            )) }
          </div>
          <div style={{width: labelWidth, height: resourceHeight * resources.length, left: 0, top:0,zIndex:2,position: '-webkit-sticky',  position: 'sticky'}}>
            { resources.map((resource, resourceIndex) => (
              <div style={{width:labelWidth, height: resourceHeight, left:0,top:resourceIndex*resourceHeight,position:'absolute',borderBottom:"1px solid #ddd",borderRight:"1px solid #888",backgroundColor:'#ECECEB'}} key={`label-${resource.calendarId}`}>{resource.name}</div>
            )) }
          </div>
          { Array(resources.length+1).fill(0).map((x, i) => (
            <div style={{borderBottom: '1px solid #ddd', width:hourWidth*24+labelWidth, height: 1, left:0,top:i*resourceHeight+resourceHeight-1,position:'absolute'}} key={`resourcec-line-${i}`}></div>
          ))}
          { Array(24).fill(0).map((x, i) => (
            <div style={{borderRight: '1px dashed #ddd', width:1, height: resourceHeight*(resources.length+1), left:hourWidth*(i+1)-1,top:0,position:'absolute'}} key={`hour-k-${i}`}></div>
          )) }

          
          { resources.map((resource, resourceIndex) => (
            resource.events.map((event) => {
              const start = moment(event.start).hour() * 60 + moment(event.start).minute()
              const end = moment(event.end).hour() * 60 + moment(event.end).minute()
              const y = resourceHeight * resourceIndex + resourceHeight
              const x = start * hourWidth / 60 + labelWidth
              const width = (end - start) * hourWidth / 60
              return(
                <a href={event.href} style={{backgroundColor: "#2796CB",color: "white", fontSize: 10, padding: "2px 4px", borderRadius: 6, overflow: 'hidden', position: 'absolute', height: `${resourceHeight-1}px`, lineHeight:"1.2em", width: `${width-1}px`, top: `${y}px`, left: `${x}px`}} key={`event-${event.id}`}>
                  {event.title}
                </a>
              )
            })
          )) }
        </div>
        </div>
        </div>
    )
  }
}

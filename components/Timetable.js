import React from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import moment from 'moment-timezone'

export default class TimeTable extends React.Component {
  static propTypes = {
    hourHeight: PropTypes.number,
    resourceWidth: PropTypes.number,
    labelWidth: PropTypes.number,
    labelHeight: PropTypes.number,
  }

  static defaultProps = {
    hourWidth: 160,
    resourceHeight: 40,
    labelHeight: 40,
    labelWidth: 160,
  }

  render() {
    const { hourWidth, resourceHeight, resources, labelWidth, labelHeight } = this.props
    return (
      <div ref="wrapper" style={{width: this.props.width, height: this.props.height, overflow: "auto", margin:0,padding:0}}>
          <div style={{width: labelWidth, height: resourceHeight, zIndex:4, left:0, top:0, position: 'absolute',display: 'block', backgroundColor: 'blue'}}>
            123
          </div>
        <div style={{width: labelWidth + hourWidth * 24, height: resourceHeight * resources.length + labelHeight, position: 'relative', margin:0,padding:0}}>
          <div style={{width: hourWidth * 24, height: resourceHeight, zIndex:1,left:labelWidth,top:0,position: 'sticky'}}>
            { Array(24).fill(0).map((x, i) => (
              <div style={{backgroundColor: 'red', width:hourWidth, height: resourceHeight, left:hourWidth*i,top:0,position:'absolute'}}>{i}:00</div>
            )) }
          </div>
          <div style={{width: labelWidth, height: resourceHeight * resources.length, left: 0, top:0,zIndex:2,position: 'sticky', backgroundColor: 'gray'}}>
            { resources.map((resource, resourceIndex) => (
              <div style={{backgroundColor: 'red', width:labelWidth, height: resourceHeight, left:0,top:resourceIndex*resourceHeight,position:'absolute'}}>{resource.name}</div>
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
                <div style={{border: "1px solid blue", overflow: 'hidden', position: 'absolute', height: `${resourceHeight}px`, width: `${width}px`, top: `${y}px`, left: `${x}px`}}>
                  {event.title}
                </div>
              )
            })
          )) }
        </div>
      </div>
    )
  }
}

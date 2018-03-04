import React from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import moment from 'moment-timezone'

export default class TimeTable extends React.Component {
  static propTypes = {
    hourHeight: PropTypes.number,
    resourceWidth: PropTypes.number,
    labelHeight: PropTypes.number,
    timeWidth: PropTypes.number,
  }

  static defaultProps = {
    hourHeight: 40,
    resourceWidth: 100,
    labelHeight: 60,
    timeWidth: 60,
    width: 400,
    height: 400,
  }

  componentDidMount() {
    findDOMNode(this.refs.wrapper).addEventListener('scroll', this.handleScrollEvent)
  }

  componentWillUnmount() {
    findDOMNode(this.refs.wrapper).removeEventListener('scroll', this.handleScrollEvent)
  }

  handleScrollEvent(e) {
    console.log(e)
  }

  render() {
    const { hourHeight, resourceWidth, resources, timeWidth, labelHeight } = this.props
    return (
      <div ref="wrapper" style={{border: "1px solid gray", width: this.props.width, height: this.props.height, overflow: "auto"}}>
        <div style={{width: resourceWidth * resources.length, height: hourHeight * 24, position: 'relative'}}>
        { Array(24).fill(0).map((x, i) => (
          <div style={{backgroundColor: 'red', width:timeWidth, height: hourHeight, top:labelHeight+hourHeight*i,left:0,position:'absolute'}}>{i}:00</div>
  )) }

        { this.props.resources.map((resource, resourceIndex) => (
          resource.events.map((event) => {
            const start = moment(event.start).hour() * 60 + moment(event.start).minute()
            const end = moment(event.end).hour() * 60 + moment(event.end).minute()
            const x = resourceWidth * resourceIndex + timeWidth
            const y = start * hourHeight / 60 + labelHeight
            const height = (end - start) * hourHeight / 60
            return(
              <div style={{border: "1px solid blue", overflow: 'hidden', position: 'absolute', width: `${resourceWidth}px`, height: `${height}px`, top: `${y}px`, left: `${x}px`}}>
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

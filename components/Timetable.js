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

  state = {
    scrollTop: 0,
    scrollLeft: 0
	};

  componentDidMount() {
    findDOMNode(this.refs.wrapper).addEventListener('scroll', (e) => this.handleScrollEvent(e))
  }

  componentWillUnmount() {
    findDOMNode(this.refs.wrapper).removeEventListener('scroll', (e) => this.handleScrollEvent(e))
  }

  handleScrollEvent(e) {
    const { scrollTop, scrollLeft } = e.target
    this.setState({
      scrollTop, scrollLeft
    })
  }

  render() {
    const { hourHeight, resourceWidth, resources, timeWidth, labelHeight } = this.props
    return (
      <div ref="wrapper" style={{border: "1px solid gray", width: this.props.width, height: this.props.height, overflow: "auto"}}>
        <div style={{width: resourceWidth * resources.length, height: hourHeight * 24, position: 'relative'}}>
          <div style={{width: timeWidth, height: hourHeight * 24, left:this.state.scrollLeft,top:labelHeight,zIndex:1,position: 'absolute'}}>
            { Array(24).fill(0).map((x, i) => (
              <div style={{backgroundColor: 'red', width:timeWidth, height: hourHeight, top:hourHeight*i,left:0,position:'absolute'}}>{i}:00</div>
            )) }
          </div>
          <div style={{width: resourceWidth * resources.length, height: labelHeight, left: 0, top: this.state.scrollTop,zIndex:2,position: 'absolute', backgroundColor: 'gray'}}>
            { resources.map((resource, resourceIndex) => (
              <div style={{backgroundColor: 'red', width:resourceWidth, height: labelHeight, top:0,left:resourceIndex*resourceWidth+timeWidth,position:'absolute'}}>{resource.name}</div>
            )) }
          </div>
          { resources.map((resource, resourceIndex) => (
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

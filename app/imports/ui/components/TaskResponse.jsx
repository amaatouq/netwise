import React from "react";
import Slider from 'react-rangeslider'

export default class TaskResponse extends React.Component {
    constructor (props, context) {
      super(props, context);
      this.state = {
        value: 50
      }
    }
  
    handleChangeStart = () => {
      console.log('Change event started')
    };
  
    handleChange = value => {
      this.setState({
        value: value
      })
    };
  
    handleChangeComplete = () => {
      console.log('Change event completed')
      //here log the data to the database
    };
  
    render () {
      const { value } = this.state;
      return (
        <div className='slider'>
          <Slider
            min={0}
            max={100}
            value={value}
            onChangeStart={this.handleChangeStart}
            onChange={this.handleChange}
            onChangeComplete={this.handleChangeComplete}
          />
          <div className='value'>{value}</div>
        </div>
      )
    }
  }
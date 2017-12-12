import React from "react";

//TODO: this is not a good component as is for the following reasons
//    It should have a 'null' default value while this can't be done with the default HTML <input> .. having a default value would lead to anchoring bias for the participant
//    once a player chose a value, it should be sticky (i.e., saved and retrieved in the next stages)
//    we might want to store to seperate values (last value as an answer and also intermediate values)
export default class TaskResponse extends React.Component {
    constructor (props, context) {
      super(props, context);
      this.state = {
        value: ""
      }
    }
  
    handleChangeStart = () => {
      console.log('Change event started')
    };
  
    handleChange = event => {
      this.setState({value: event.target.value});
    };
  
    handleChangeComplete = () => {
      console.log('Change event completed')
      //here log the data to the database
    };
  
    render () {
      const { value } = this.state;
      return (
        <div className='slider'>
          <input
            id="typeinp"
            type="range"
            min="0" max="1"
            value={this.state.value}
            onChange={this.handleChange}
            step="0.01"/>
          <div className='value'>{value}</div>
        </div>
      )
    }
  }
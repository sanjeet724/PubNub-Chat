import React, { Component } from 'react';

class AutoScroll extends Component {
  componentDidMount = () => {
    this.scrollToBottom();
  };

  componentDidUpdate = () => {
    this.scrollToBottom();
  };

  scrollToBottom = () => {
    this.el.scrollIntoView({ behavior: 'smooth' });
  };

  render() {
    return (
      <div
        ref={el => {
          this.el = el;
        }}
      />
    );
  }
}

export default AutoScroll;

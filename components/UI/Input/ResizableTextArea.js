import React, { Component } from 'react';
import raf from 'raf';
import {
  TextArea,
} from 'grommet';

/**
 *
 */
class ResizableTextArea extends Component {
  constructor(props) {
    super(props);
    this.textArea = null;
    this.shouldResize = false;
  }

  componentDidMount() {
    const { value } = this.props;
    if (value) {
      this.resize();
    }

    window.addEventListener('resize', this.onWindowResize);
  }

  componentWillReceiveProps(nextProps) {
    const { value } = this.props;
    this.shouldResize = value !== nextProps.value;
  }

  componentDidUpdate() {
    if (this.shouldResize) {
      this.shouldResize = false;
      this.resize();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
  }

  resize = () => {
    if (this.textArea == null) {
      return;
    }

    this.textArea.style.height = 'auto';
    this.textArea.style.height = `${this.textArea.scrollHeight}px`;
  }

  onWindowResize = () => {
    raf(() => {
      this.resize();
    });
  }

  render() {
    return (
      <TextArea
        fill
        ref={(el) => { this.textArea = el; }}
        style={{
          maxWidth: '100%',
          overflow: 'hidden',
          resize: 'none',
        }}
        onInput={this.resize}
        {...this.props}
      />
    );
  }
}

export { ResizableTextArea };

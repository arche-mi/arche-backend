import React from 'react';
import Popover from 'react-popover';

class PopoverComponent extends React.Component {
  state = {
    isPopoverOpen: false,
  };

  togglePopover = () => {
    this.setState({ isPopoverOpen: !this.state.isPopoverOpen });
  };

  render() {
    return (
      <Popover
        isOpen={this.state.isPopoverOpen}
        body={<div>This is the popover body</div>}
        place="below"
        onOuterAction={this.togglePopover}
      >
        <button onClick={this.togglePopover}>Open Popover</button>
      </Popover>
    );
  }
}

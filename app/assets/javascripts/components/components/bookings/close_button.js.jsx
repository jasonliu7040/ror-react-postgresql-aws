const React = require('react');
const CloseButton = React.createClass({

  handleCloseButton: function() {
    window.location='/events';
  },

  render: function() {
    return (
      <button
        ref="button"
        onClick={this.handleCloseButton}
        type="button"
        className="btn btn-danger"
        style={{marginLeft: '5px'}}>Close</button>
    );
  }
});

module.exports=CloseButton;

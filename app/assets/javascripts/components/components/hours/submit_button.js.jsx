let React = require('react');
let SubmitButton = React.createClass({

  propTypes: {
    shopId: React.PropTypes.number.isRequired,
    enforced: React.PropTypes.bool.isRequired,
    seasons: React.PropTypes.arrayOf(React.PropTypes.shape({
      name:  React.PropTypes.string.isRequired,
      start: React.PropTypes.string.isRequired,
      id:    React.PropTypes.string.isRequired,
      days:  React.PropTypes.arrayOf(React.PropTypes.shape({
        day:    React.PropTypes.number.isRequired,
        hours:  React.PropTypes.arrayOf(React.PropTypes.shape({
          from: React.PropTypes.shape({
            hour:   React.PropTypes.string.isRequired,
            minute: React.PropTypes.string.isRequired,
          }).isRequired,
          to: React.PropTypes.shape({
            hour:   React.PropTypes.string.isRequired,
            minute: React.PropTypes.string.isRequired,
          }).isRequired,
        }))
      })).isRequired,
    })).isRequired
  },

  handleFormSubmit: function(e) {
    e.preventDefault();

    let shopId = this.props.shopId;
    let hours  = this._stringifyHours();
    let errors = [];

    this._validateSeasons(errors)

    if (errors.length > 0) {
      toastr.error(errors[0]); // show the first one
      return;
    }

    $.ajax({
      type: "POST",
      url: "/admin/settings/update_hours.js",
      data: {shop: {id: shopId, opening_hours: hours}},
      success: function(resp) {
        toastr.success(resp.notice)
      }.bind(this),
      error: function(jqXHR, textStatus, errorThrown) {
        toastr.error("Faild to save!");
      },
      dataType: "json"
    });
  },

  _stringifyHours: function() {
    return JSON.stringify({
      seasons:  this.props.seasons,
      enforced: this.props.enforced
    });
  },

  _validateSeasons: function(errors) {
    // Validate each season has a name
    for (let i = 0; i < this.props.seasons.length; i++) {
      if (this.props.seasons[i].name === "") {
        errors.push("Season name can't be blank!");
      }
    }

    // Validate each season has unique name
    let names = [];
    for (let i = 0; i < this.props.seasons.length; i++) {
      names.push(this.props.seasons[i].name)
    }

    let unique = names.filter(function(item, i, ar){ return ar.indexOf(item) === i; });

    if (names.length !== unique.length) {
      errors.push("Season name has to be unique!");
    }
  },

  render: function() {
    return (
      <div className="row">
        <div className="col-sm-12">
          <button className="btn btn-primary btn-save" onClick={this.handleFormSubmit}>Save Changes</button>
        </div>
      </div>
    );
  }
});

module.exports=SubmitButton

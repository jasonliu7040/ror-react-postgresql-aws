
import React from 'react';

const ModalDeleteForm = React.createClass({
    propTypes: {
        onItemDelete: React.PropTypes.func.isRequired
    },
    onItemDelete: function() {
      this.props.onItemDelete();
    },
    onOpen: function() {
        $('#deleteModal').modal({
            keyboard: false,   // don't close modal on ESC
            backdrop: 'static' // don't close modal on click outside of it
        });
    },
    render: function() {

        return (
            <div>
                <div className="modal scheduler-modal fade" id="deleteModal" ref='deleteModal' tabIndex="-1" role="dialog" aria-hidden="true">

                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Delete Item</h4>
                            </div>
                            <div className="modal-body">
                                Are you sure?
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-white" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.onItemDelete}>Yes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        )
    }
});

export default ModalDeleteForm;
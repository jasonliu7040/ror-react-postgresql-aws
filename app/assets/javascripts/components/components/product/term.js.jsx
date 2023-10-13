import React from 'react';

const Term = React.createClass({
    onDelete: function() {
        let item = this.props.item;
        item._destroy = true;
        this.props.onChange(item);
    },
    onEdit: function() {
        let editUrl = '/admin/products/' + this.props.item.product_id + '/terms/' + this.props.item.id + '/edit';
        swal({
            title: "Are you sure?",
            text: "All unsaved data will be lost. Save data before leaving this page.",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Go without saving!",
            closeOnConfirm: false
        }, function () {
            window.location.href = editUrl;
        });
    },
    render: function() {
        return (
            <tr className="item-row">
                <td>{this.props.item.name}</td>
                <td>{this.props.item.start_date}</td>
                <td>{this.props.item.finish_date}</td>
                <td>
                    { (this.props.item.id ?
                        <button
                            style={{marginLeft: '5px'}}
                            onClick={this.onEdit}
                            type="button"
                            className="btn btn-xs btn-info pull-right edit-item">
                            <i className="fa fa-edit"></i>
                        </button>
                        : null )}
                    <button
                        type="button"
                        onClick={this.onDelete}
                        className="btn btn-xs btn-danger pull-right delete-item">
                        <i className="fa fa-trash-o"></i>
                    </button>
                </td>
            </tr>
        );
    }
});

export default Term;
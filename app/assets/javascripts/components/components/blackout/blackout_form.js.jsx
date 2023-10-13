import React from 'react';
import FormSelect from '../common/form_select.js.jsx';
import FormInput from '../common/form_input.js.jsx';
import FormCheckbox from '../common/form_checkbox.js.jsx';
import ModalDeleteForm from '../common/modal_delete_form.js.jsx';
let DateTimeField = require('react-bootstrap-datetimepicker-noicon');



const BlackoutForm = React.createClass({
    _validate: function(item) {
        let errors = [];

        if(!item.finish) {
            errors.push("Finish date can't be blank.");
        }
        if(!item.start) {
            errors.push("Start date can't be blank.");
        }
        if(!!item.start && !!item.finish && moment(item.start) > moment(item.finish)) {
            errors.push("Start date should be smaller than Finish date.");
        }
        return errors;
    },
    onSubmit: function() {

        var errors = this._validate(this.props.blackout);

        let self = this;
        if(errors.length == 0) {
            self.disableButton();
            this.props.blackoutActions.onBlackoutSubmit(this.props.blackout, function(successMessage) {
                self.enableButton();
                self.onSuccessShow(successMessage);
            }, function(errorMessage) {
                self.enableButton();
                self.onErrorShow(errorMessage);
            });
        } else {
            this.onErrorShow(errors);
        }
    },
    onDeleteFormOpen: function() {
        this.refs.delete_form.onOpen();
    },
    onDelete: function() {
        let self = this;
        self.disableButton();
        this.props.blackoutActions.onBlackoutDelete(this.props.blackout, function(successMessage) {
            self.enableButton();
            self.onSuccessShow(successMessage);
            window.location = '/admin/events';
        }, function(errorMessage) {
            self.enableButton();
            self.onErrorShow(errorMessage);
        });
    },
    onErrorShow: function(message) {
        toastr.clear();
        if (Array.isArray(message)) {
            message.forEach(function(msg) {
                toastr.error(msg);
            });
        } else {
            toastr.error(message);
        }
    },
    onSuccessShow: function(message) {
        toastr.success(message);
    },
    enableButton: function() {
        this.props.blackoutActions.onBlackoutLoadingSet(false);
    },
    disableButton: function() {
        this.props.blackoutActions.onBlackoutLoadingSet(true);
    },
    onProductChange: function(value) {

        this.refs.variant.refs.select.disabled = true;
        this.props.blackoutActions.onBlackoutProductSet(value);
        var self = this;
        this.props.productActions.onVariantsLoad(value, function () {
            self.refs.variant.refs.select.disabled = (value == '');
        });
    },
    onVariantChange: function(value) {
        this.props.blackoutActions.onBlackoutVariantSet(value);
    },
    onAllDayChange: function(value) {
        this.props.blackoutActions.onBlackoutAllDaySet(value);
        if(value) {
            var start = moment(this.props.blackout.start).set({
                hours: '00',
                minutes: '00' });
            var finish = moment(this.props.blackout.finish).set({
                hours: '23',
                minutes: '59' });
            this.onStartDateChange(start);
            this.onFinishDateChange(finish);
        }
    },
    onStartDateChange: function(value) {
        this.props.blackoutActions.onBlackoutStartDateSet(this._stringifyDate(value));
    },
    onFinishDateChange: function(value) {
        this.props.blackoutActions.onBlackoutFinishDateSet(this._stringifyDate(value));
    },
    _stringifyDate: function(dateObject) {
        return moment(dateObject).format("YYYY-MM-DD HH:mm");
    },
    dateFormat: function() {
        if(this.props.blackout.all_day)
            return "YYYY-MM-DD";
        else
            return "YYYY-MM-DD HH:mm";
    },
    isNew: function() {
      return (this.props.blackout.id == null);
    },
    setInitDate: function(date) {
        if (date)
            return this._stringifyDate(date);
        else
            return this._stringifyDate(new Date());
    },
    getProducts: function() {
        return this.props.products.map(function(product) {
            return [product.product_title, product.id];
        })
    },
    getVariants: function() {
        return this.props.variants.map(function(variant) {
            return [variant.title, variant.id];
        })
    },
    componentDidMount: function() {
        if (this.props.blackout.product_id == null && this.props.blackout.variant_id == null) {
            this.refs.variant.refs.select.disabled = true;
        }
    },
    render: function () {
        var products = this.getProducts();
        var variants = this.getVariants();

        return (
            <div className="form-horizontal m-b-xl">


                <div className="form-group">
                    <label className='col-lg-2 control-label'>Product <br/>
                        <em style={{fontWeight:'normal'}}>Leave unselected to create a global blackout</em>
                    </label>
                    <div className="col-lg-10">
                        <FormSelect name='product'
                            value={this.props.blackout.product_id || ''}
                            options={products}
                            includeBlank={true}
                            blankText='Select Product'
                            onChange={this.onProductChange} />
                    </div>
                </div>

                <div className="form-group">
                    <label className='col-lg-2 control-label'>Variant <br/>
                    </label>
                    <div className="col-lg-10">
                        <FormSelect name='variant'
                            value={this.props.blackout.variant_id || ''}
                            options={variants}
                            includeBlank={true}
                            ref='variant'
                            blankText='Select Variant'
                            onChange={this.onVariantChange} />
                    </div>
                </div>

                <div className="form-group">
                    <label className='col-lg-2 control-label'>Date/Time</label>
                    <div className="col-lg-10" style={{marginLeft:'-15px'}}>
                        <div className="col-md-12 m-b-sm">
                            <FormCheckbox name='all_day'
                                value={this.props.blackout.all_day}
                                onChange={this.onAllDayChange} />
                            <span className='m-l-xs'>All day</span>
                        </div>
                        <div className="col-md-4">
                            <DateTimeField
                                format="YYYY-MM-DD HH:mm"
                                dateTime={this.setInitDate(this.props.blackout.start)}
                                inputFormat={this.dateFormat()}
                                direction="onTop"
                                ref='start_date'
                                onChange={this.onStartDateChange}
                                required={true} />
                        </div>
                        <div className="col-md-4">
                            <DateTimeField
                                format="YYYY-MM-DD HH:mm"
                                dateTime={this.setInitDate(this.props.blackout.finish)}
                                inputFormat={this.dateFormat()}
                                direction="onTop"
                                ref='finish_date'
                                onChange={this.onFinishDateChange}
                                required={true} />
                        </div>
                    </div>
                </div>

                <div className='form-group' style={{marginTop: '20px'}}>
                    <div className="col-lg-6">
                        <button className="btn btn-primary" type="submit" ref='saveButton' onClick={this.onSubmit} disabled={this.props.blackoutIsLoading} style={{marginRight: '10px'}}>Save changes</button>
                        <button className="btn btn-danger"  ref='deleteButton' onClick={this.onDeleteFormOpen} disabled={this.props.blackoutIsLoading || this.isNew()} style={{marginRight: '10px'}}>Delete</button>
                        <a href='/admin/events' className="btn btn-default">Cancel</a>
                    </div>
                </div>
                <ModalDeleteForm  ref='delete_form' onItemDelete={this.onDelete}/>
            </div>
        );
    }
});


export default BlackoutForm;
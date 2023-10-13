import FormSelect from '../common/form_select.js.jsx';
import FormInput from '../common/form_input.js.jsx';
import FormInputWithTime from './form_input_with_time.js.jsx';
import FormNested from './form_nested.js.jsx';
import ProductVariantsForm from './product_variants_form.js.jsx';
import FormCheckbox from '../common/form_checkbox.js.jsx';
import ProductCapacitiesForm from './product_capacities_form.js.jsx';
import ScheduleForm from '../common/schedule_form.js.jsx';
import Tooltip from './tooltip.js.jsx';
import ProductTerms from './product_terms.js.jsx';
import React from 'react';

export const PRODUCT_PROFILE = 'product';
export const ACTIVITY_PROFILE = 'activity';
export const COURSE_PROFILE = 'course';
export const CLASS_PROFILE = 'class';
export const APPT_PROFILE = 'appt';
export const GENERAL_PROFILE = '';

const ProductForm = React.createClass({
    displayForProfiles: function(profiles) {
        return profiles.includes(this.props.product.profile);
    },
    showProductHadnleInput: function() {
        $('#product_handle').show();
    },
    onProfileChange: function(data) {
        this.props.actions.onProfileSet(data);
        $('a[href="#common"]').tab('show');
    },
    onSubmit: function() {
        let self = this;
        this.disableButton();
        this.props.actions.onProductSubmit(this.props.product, function(){
            self.enableButton();
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
        this.props.actions.onProductLoadingSet(false);
    },
    disableButton: function() {
        this.props.actions.onProductLoadingSet(true);
    },
    render: function () {
        return (
            <div className="form-horizontal m-b-xl">

                <div className="ibox">

                    <div className="ibox-content">
                        <div className='form-group'>
                            <label className='col-sm-2 control-label'>Profile</label>
                            <div className='col-sm-10'>
                                <FormSelect name='profile'
                                    value={this.props.product.profile}
                                    options={this.props.profileOptions}
                                    onChange={this.onProfileChange} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="tabs-container">
                    <ul className="nav nav-tabs" id='product_tabs'>
                        <li className="active"><a data-toggle="tab" href="#common">General</a></li>
                        <li className=""><a data-toggle="tab" href="#capacity">Capacity</a></li>
                        <li className=""><a data-toggle="tab" href="#variants">Variants</a></li>
                        <li className=""><a data-toggle="tab" href="#times">Time Settings</a></li>
                        {(this.displayForProfiles([ACTIVITY_PROFILE, CLASS_PROFILE]) ||  this.displayForProfiles([GENERAL_PROFILE]) && this.props.product.scheduled
                            ? <li className=""><a data-toggle="tab" href="#schedules">Schedule</a></li>
                            : null
                        )}
                        {(this.displayForProfiles([COURSE_PROFILE])
                            ? <li className=""><a data-toggle="tab" href="#course">Terms</a></li>
                            : null
                        )}
                        <li className=""><a data-toggle="tab" href="#calendar_colors">Calendar Colors</a></li>
                    </ul>
                    <div className="tab-content">
                        <div id="common" className="tab-pane active">
                            <div className="panel-body">
                                <div className='form-group' id='product_title'>
                                    <label className='col-sm-2 control-label'>Product Title <br></br>
                                        <a onClick={this.showProductHadnleInput}>Edit Handle</a> | <a href={this.props.product.shopify_url}>View</a>
                                    </label>
                                    <div className='col-sm-10'>
                                        <FormInput type='text'
                                            name='product_title'
                                            value={this.props.product.product_title}
                                            onChange={this.props.actions.onTitleSet} />
                                    </div>
                                </div>
                                <div className='form-group' id='product_handle' style={{display: 'none'}}>
                                    <label className='col-sm-2 control-label'>Handle
                                        <Tooltip title="This should match the Shopify product handle. You should not need to change this. Changing this value does not change the product handle in Shopify."/>
                                    </label>
                                    <div className='col-sm-10'>
                                        <FormInput type='text'
                                            name='product_handle'
                                            value={this.props.product.product_handle}
                                            onChange={this.props.actions.onHandleSet} />
                                    </div>
                                </div>
                                <hr/>
                                <div className='form-group'>
                                    <label className='col-sm-2 control-label'>Resources</label>
                                    <div className='col-sm-10'>
                                        <FormNested
                                            name='resource_constraints_attributes'
                                            values={this.props.product.resource_constraints_attributes}
                                            onChange={this.props.actions.onResourcesSet}
                                            options={this.props.resourceOptions}
                                            nestedName='resource_id'/>
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label className='col-sm-2 control-label'>Location
                                        <Tooltip title="Choose the locations this product applies to. Location information (address, map & email) can be used in reminders. Locations are created via the settings menu."/>
                                    </label>
                                    <div className='col-sm-10'>
                                        <FormNested
                                            name='product_locations_attributes'
                                            values={this.props.product.product_locations_attributes}
                                            onChange={this.props.actions.onLocationsSet}
                                            options={this.props.locationOptions}
                                            nestedName='location_id'/>
                                    </div>
                                </div>
                                {(this.displayForProfiles([GENERAL_PROFILE])
                                    ?
                                    <div className='form-group'>
                                        <label className='col-sm-2 control-label'>Scheduled?
                                            <Tooltip title="Select if this product is a one-off or recurring event (e.g. class) that should appear in your store's calendar."/>
                                        </label>
                                        <div className='col-sm-10'>
                                            <FormCheckbox name='scheduled'
                                                value={this.props.product.scheduled}
                                                onChange={this.props.actions.onScheduledSet} />
                                        </div>
                                    </div>

                                    :
                                    null
                                )}
                            </div>
                        </div>
                        <div id="capacity" className="tab-pane">
                            <div className="panel-body">
                                <div className='form-group' id='capacity'>
                                    <ProductCapacitiesForm
                                        capacities={this.props.product.option_capacities_attributes}
                                        capacity={this.props.product.capacity}
                                        capacity_option1={this.props.product.capacity_option1}
                                        capacity_option2={this.props.product.capacity_option2}
                                        capacity_option3={this.props.product.capacity_option3}
                                        capacity_type={this.props.product.capacity_type}
                                        variantOptions={this.props.variant_options}
                                        capacityType={this.props.product.capacity_type}
                                        onCapacityOptionSet={this.props.actions.onCapacityOptionSet}
                                        onCapacitySet={this.props.actions.onCapacitySet}
                                        onCapacityTypeSet={this.props.actions.onCapacityTypeSet}
                                        onOptionCapacitiesSet={this.props.actions.onOptionCapacitiesSet}
                                        variantOptionNamesOptions={this.props.variantOptionNameOptions}
                                        capacitiesOptions={this.props.capacityOptions}
                                    />
                                </div>
                            </div>
                        </div>
                        <div id="variants" className="tab-pane">
                            <div className="panel-body">
                                <div className='col-xs-12' id='variants_attributes'>
                                    <ProductVariantsForm
                                        variants={this.props.product.variants_attributes}
                                        isNew={!this.props.product.id}
                                        legacyVariantTimes={this.props.legacy_variant_times}
                                        onVariantsSet={this.props.actions.onVariantsSet}
                                        durationEnabled={this.props.duration_enabled}
                                        durationUnitsOptions={this.props.durationUnitOptions}
                                        displayForProfiles={this.displayForProfiles}/>
                                </div>
                            </div>
                        </div>
                        <div id="times" className="tab-pane">
                            <div className="panel-body">
                                <div className='form-group'>
                                    <label className='col-sm-2 control-label'>Cutoff Days
                                        <Tooltip title="First available day (from today) in the datepicker. Set to 0 for today, 1 for tomorrow etc."/>
                                    </label>
                                    <div className='col-sm-3'>
                                        <FormInput type='text'
                                            name='mindate'
                                            classStyle='touchspin'
                                            value={this.props.product.mindate}
                                            onChange={this.props.actions.onMindateSet} />
                                    </div>

                                </div>
                            {(this.displayForProfiles([PRODUCT_PROFILE, ACTIVITY_PROFILE, APPT_PROFILE, GENERAL_PROFILE])
                                ?  <div className='form-group'>
                                <label className='col-sm-2 control-label'>Lead Time
                                    <Tooltip title="Number of days to allow before the next booking can begin, for example to account for delivery time. Unlike lag time, the lead time component is not included when a booking is created from an order."/>
                                </label>
                                <div className='col-sm-3'>
                                    <FormInput type='text'
                                        name='lead_time'
                                        classStyle='touchspin'
                                        value={this.props.product.lead_time}
                                        onChange={this.props.actions.onLeadTimeSet} />
                                </div>
                            </div>
                                : null
                            )}

                            {(this.displayForProfiles([PRODUCT_PROFILE, ACTIVITY_PROFILE, APPT_PROFILE, GENERAL_PROFILE])
                                ? <div className='form-group' id='lag_time'>
                                <label className='col-sm-2 control-label'>Lag Time
                                    <Tooltip title="Lag time is automatically added to the booking finish time on creation. Typically used to account for the time required to get an item ready before the next booking."/>
                                </label>
                                <FormInputWithTime
                                    name='lag_time'
                                    value={this.props.product.lag_time}
                                    onChange={this.props.actions.onLagTimeSet} />
                            </div>
                                : null
                            )}
                                            <hr/>
                            {(this.displayForProfiles([PRODUCT_PROFILE, GENERAL_PROFILE])
                                ?
                                <div className='form-group'>
                                    <label className='col-sm-2 control-label'>Date Range</label>
                                    <div className='col-sm-10'>

                                        <div className='form-group'>
                                            <label className='col-sm-2 control-label'>Count
                                                <Tooltip title="Count days or nights when calculating quantity for the 'Date Range Updates Quantity Setting'."/>
                                            </label>
                                            <div className='col-sm-3'>
                                                <FormSelect
                                                    value={this.props.product.range_count_basis}
                                                    options={this.props.rangeCountBasisOptions}
                                                    onChange={this.props.actions.onRangeCountBasisSet} />
                                            </div>
                                        </div>

                                        <div className='form-group'>
                                            <label className='col-sm-2 control-label'>Minimum</label>
                                            <div className='col-sm-3'>
                                                <FormInput type='text'
                                                    name='min_duration'
                                                    classStyle='touchspin'
                                                    value={this.props.product.min_duration}
                                                    onChange={this.props.actions.onMinDurationSet} />
                                            </div>
                                        </div>

                                        <div className='form-group'>
                                            <label className='col-sm-2 control-label'>Maximum</label>
                                            <div className='col-sm-3'>
                                                <FormInput type='text'
                                                    name='max_duration'
                                                    classStyle='touchspin'
                                                    value={this.props.product.max_duration}
                                                    onChange={this.props.actions.onMaxDurationSet} />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                : null
                            )}
                            </div>
                        </div>
                        <div id="schedules" className="tab-pane">
                            <div className="panel-body">
                                <div className='col-sm-12'>
                                    <ScheduleForm title={this.props.product.product_title}
                                        schedules={this.props.product.schedule_attributes.recurring_items_attributes}
                                        onSchedulesSet={this.props.actions.onProductSchedulesSet}
                                    />
                                </div>
                            </div>
                        </div>
                        <div id="calendar_colors" className="tab-pane">
                            <div className="panel-body">
                                <div className='form-group'>
                                    <label className='col-sm-2 control-label'>Text</label>
                                    <div className='col-sm-10'>
                                        <FormSelect
                                            value={this.props.product.text_color}
                                            options={this.props.colorOptions}
                                            includeBlank={true}
                                            onChange={this.props.actions.onTextColorSet} />
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label className='col-sm-2 control-label'>Background</label>
                                    <div className='col-sm-10'>
                                        <FormSelect
                                            value={this.props.product.background_color}
                                            options={this.props.colorOptions}
                                            includeBlank={true}
                                            onChange={this.props.actions.onBackgroundColorSet}/>
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label className='col-sm-2 control-label'>Border</label>
                                    <div className='col-sm-10'>
                                        <FormSelect
                                            value={this.props.product.border_color}
                                            options={this.props.colorOptions}
                                            includeBlank={true}
                                            onChange={this.props.actions.onBorderColorSet}/>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div id="course" className="tab-pane">
                            <div className="panel-body">
                                <ProductTerms items={this.props.product.terms_attributes}
                                    onTermAdd={this.props.actions.onTermAdd}
                                    onTermChange={this.props.actions.onTermSet}
                                    onErrorShow={this.onErrorShow}
                                    termEvents={this.props.term_events}
                                />
                            </div>
                        </div>
                    </div>
                </div>


                <div className='form-group' style={{marginTop: '20px'}}>
                    <div className="col-sm-6">
                        <button className="btn btn-primary" type="submit" ref='saveButton' onClick={this.onSubmit} disabled={this.props.productIsLoading} style={{marginRight: '10px'}}>Save changes</button>
                        <a href='/admin/products' className="btn btn-danger">Cancel</a>
                    </div>
                </div>
            </div>
        );
    }
});


export default ProductForm;
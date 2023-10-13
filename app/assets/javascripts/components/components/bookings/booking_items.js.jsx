const React = require('react');
const moment = require('moment');
const DateTimeField = require('react-bootstrap-datetimepicker-noicon');

import FormInput from '../common/form_input.js.jsx';
import ItemsErrorsContainer from './items_errors_container.js.jsx';

const BookingItems = React.createClass({

  propTypes: {
    shopId: React.PropTypes.number.isRequired,
    editingItemIdx: React.PropTypes.number,
    products: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.number.isRequired,
      product_title: React.PropTypes.string.isRequired,
      default_times: React.PropTypes.object
    })).isRequired,
    items: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.number,
      shop_id: React.PropTypes.number.isRequired,
      product_id: React.PropTypes.oneOfType([
          React.PropTypes.string,
          React.PropTypes.number
      ]),
      variant_id: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
      ]),
      start:  React.PropTypes.string.isRequired,
      finish: React.PropTypes.string.isRequired,
      quantity: React.PropTypes.number.isRequired,
      location_id: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
      ]),
      resource_allocations: React.PropTypes.object
    })).isRequired,
    itemsValidationErrors: React.PropTypes.object.isRequired,
    onSetVariantsResourcesLocations: React.PropTypes.func.isRequired,
    onAddItem: React.PropTypes.func.isRequired,
    onDeleteItem: React.PropTypes.func.isRequired,
    onSetEditingItemProduct: React.PropTypes.func.isRequired,
    onSetEditingItemVariant: React.PropTypes.func.isRequired,
    onSetEditingItemStart:   React.PropTypes.func.isRequired,
    onSetEditingItemFinish:  React.PropTypes.func.isRequired,
    onSetEditingItemQuantity: React.PropTypes.func.isRequired,
    onSetEditingItemResource: React.PropTypes.func.isRequired,
    onSetEditingItemLocation: React.PropTypes.func.isRequired
  },
  componentWillMount: function() {
    if (this.props.items.length == 0) {
      this.onItemAdd();
    }
  },
  handleProductSelect: function(index, event) {

    if (event.target.value === 'NULL') {
      this.props.onSetEditingItemProduct(index, '');
      this.props.onSetVariantsResourcesLocations(index, [], [], []);
    } else {
      this.props.onSetEditingItemProduct(index, parseInt(event.target.value));
      let url = '/chooser/variant_options?product_id=' + event.target.value;
      $.getJSON(
        url,
        function(data) {
          this.props.onSetVariantsResourcesLocations(
            index,
            data.variants,
            data.resources,
            data.locations
          );
        }.bind(this)
      );
    }
  },
  onItemVariantSet: function(index, event) {
    var value = '';
    if (event.target.value !== 'NULL') {
      value = parseInt(event.target.value);
    }
    this.props.onSetEditingItemVariant(index, value);
  },
  onItemResourceSet: function(index, event) {
    var value = '';
    if (event.target.value !== 'NULL') {
      value = parseInt(event.target.value);
    }
    this.props.onSetEditingItemResource(index, value);
  },
  onItemLocationSet: function(index, event) {
    var value = '';
    if (event.target.value !== 'NULL') {
      value = parseInt(event.target.value);
    }
    this.props.onSetEditingItemLocation(index, value);
  },
  onItemStartSet: function(index, value) {
    var finish = moment(this.props.items[index].finish);
    var start = moment(value);
    this.props.onSetEditingItemStart(index, value);
    if (start >= finish) {
      finish = start.add(1, 'day').format('YYYY-MM-DD HH:mm');
      this.props.onSetEditingItemFinish(index, finish);
    }
  },
  onItemFinishSet: function(index, value) {
    var start = moment(this.props.items[index].start);
    var finish = moment(value);
    this.props.onSetEditingItemFinish(index, value);
    if (start >= finish) {
      start = finish.add(-1, 'day').format('YYYY-MM-DD HH:mm');
      this.props.onSetEditingItemStart(index, start);
    }
  },
  onItemQtySet: function(index, value) {
    this.props.onSetEditingItemQuantity(index, parseInt(value));
  },
  onItemAdd: function() {
    const shopId = parseInt(this.props.shopId);
    const start  = moment().format('YYYY-MM-DD HH:mm');
    const finish = moment().add(1, 'day').format('YYYY-MM-DD HH:mm');

    const bookingItem = {
      shop_id: shopId,
      start: start,
      finish: finish,
      product_id: null,
      variant_id: null,
      quantity: 1,
      resource_allocations: {id: null, resource_id: null},
      location_id: null
    };

    this.props.onAddItem(bookingItem);

  },
  handleDeleteButton: function(e) {
    const itemIdx = parseInt(
      e.currentTarget.getAttribute('data-item-idx'));
    this.props.onDeleteItem(itemIdx);
  },
  errorClass: function(index, field) {
    if (this.props.itemsValidationErrors[index] && this.props.itemsValidationErrors[index][field]) {
      return 'error';
    }
    return null;
  },
  render: function() {
    return (
      <div>
        <div className="col-lg-12">
          <div className="panel panel-default">
            <div className="panel-heading">
              Products
            </div>
            <div className="panel-body">

              <ItemsErrorsContainer
                message='Could not create booking item'
                errors={this.props.itemsValidationErrors} />

              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th style={{width: "18%"}}>Product</th>
                      <th style={{width: "13%"}}>Variant</th>
                      <th style={{width: "15%"}}>From</th>
                      <th style={{width: "15%"}}>To</th>
                      <th style={{width: "7%"}}>Qty</th>
                      <th style={{width: "12.5%"}}>Resource</th>
                      <th style={{width: "12.5%"}}>Location</th>
                      <th style={{width: "7%"}}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.items.map(function(item, itemIdx) {
                      if ( item._destroy == true ) {
                        return null;
                      }
                      let variants = (item.variants) ? item.variants : [];
                      let resources = (item.resources) ? item.resources : [];
                      let locations = (item.locations) ? item.locations : [];
                      return (
                        <tr className="item-row" key={itemIdx}>
                          <td>
                            <select ref={'product_title' + itemIdx} className={"form-control m-b " + this.errorClass(itemIdx, 'product_id')} value={item.product_id} onChange={ this.handleProductSelect.bind(this, itemIdx) }>
                              <option value='NULL'>Select product...</option>
                              {this.props.products.map(function(product, idx) {
                                return <option value={product.id} key={idx}>{product.product_title}</option>;
                              }.bind(this))}
                            </select>
                          </td>
                          <td>
                            <select ref={'product_variant' + itemIdx} className={"form-control m-b " + this.errorClass(itemIdx, 'variant_id')} value={ (item.variant_id) ? item.variant_id: 'NULL' } onChange={ this.onItemVariantSet.bind(this, itemIdx) }>
                              <option value="NULL">Select variant...</option>
                              {variants.map(function(variant, idx) {
                                return <option value={variant.id} key={idx}>{variant.title}</option>
                              }.bind(this))}
                            </select>
                          </td>

                          <td className="text-center">
                            <DateTimeField
                              ref={'product_start' + itemIdx}
                              format="YYYY-MM-DD HH:mm"
                              dateTime={item.start}
                              inputFormat="YYYY-MM-DD HH:mm"
                              direction="onTop"
                              className={this.errorClass(itemIdx, 'start')}
                              onChange={this.onItemStartSet.bind(this, itemIdx)} />
                          </td>
                          <td className="text-center">
                            <DateTimeField
                              ref={'product_finish' + itemIdx}
                              format="YYYY-MM-DD HH:mm"
                              dateTime={item.finish}
                              inputFormat="YYYY-MM-DD HH:mm"
                              direction="onTop"
                              className={this.errorClass(itemIdx, 'finish')}
                              onChange={this.onItemFinishSet.bind(this, itemIdx)} />
                          </td>
                          <td className="text-center">
                            <FormInput type='number'
                              ref={'product_quantity' + itemIdx}
                              name='quantity'
                              min='1'
                              value={item.quantity}
                              className={"form-control " + this.errorClass(itemIdx, 'quantity')}
                              onChange={this.onItemQtySet.bind(this, itemIdx)} />
                          </td>

                          <td>
                            <select ref={'product_resource' + itemIdx} className="form-control m-b" value={ (item.resource_allocations.resource_id) ? item.resource_allocations.resource_id : 'NULL' } onChange={ this.onItemResourceSet.bind(this, itemIdx) }>
                              <option value="NULL">Resources...</option>
                              {resources.map(function(resource, idx) {
                                return <option value={resource.id} key={idx}>{resource.name}</option>;
                              }.bind(1))}
                            </select>
                          </td>
                          <td>
                            <select ref={'product_location' + itemIdx} className="form-control m-b" value={ (item.location_id) ? item.location_id: 'NULL' } onChange={ this.onItemLocationSet.bind(this, itemIdx) } >
                              <option value="NULL">Locations...</option>
                              {locations.map(function(location, idx) {
                                return <option value={location.id} key={idx}>{location.name}</option>;
                              }.bind(this))}
                            </select>
                          </td>

                          <td>
                            <button
                              type="button"
                              style={{marginTop: '7px'}}
                              onClick={this.handleDeleteButton}
                              className="btn btn-xs btn-danger pull-right delete-item"
                              data-item-idx={itemIdx}>
                              <i className="fa fa-trash-o"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    }, this)}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                onClick={this.onItemAdd}
                className="btn btn-primary">
                Add Product
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports=BookingItems;

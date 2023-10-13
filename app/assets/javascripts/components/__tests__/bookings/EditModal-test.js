jest.unmock('../../components/bookings/edit_modal');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import EditModal from '../../components/bookings/edit_modal.js.jsx';

describe('EditModal', function() {
  beforeEach(function() {

    this.products = [
      {id: 10, product_title: 'Product1'},
      {id: 11, product_title: 'Product2'},
      {id: 12, product_title: 'Product3'}
    ];

    this.editVariants = [
      {id: 1, title: 'Variant1'},
      {id: 2, title: 'Variant2'}
    ];

    this.editResources = [
      {id: 111, name: 'stuff1'},
      {id: 222, name: 'equipment1'}
    ];

    this.editLocations = [
      {id: 11, name: 'Location1'},
      {id: 22, name: 'Location2'},
      {id: 33, name: 'Location3'}
    ];

    this.item = {
      shop_id: 1,
      product: {
        id: 12,
        product_title: 'Product3'
      },
      variant: {
        id: 2,
        title: 'Variant2'
      },
      start:  "2016-05-29 16:00:00",
      finish: "2016-08-30 16:00:00",
      quantity: 1,
      location: {
        id: 22,
        name: 'Location2'
      },
      resource: {
        id: 111,
        name: 'stuff1'
      }
    };

    this.editModal = TestUtils.renderIntoDocument(
      <EditModal
        item={this.item}
        editingItemIdx={0}
        products={this.products}
        editVariants={this.editVariants}
        editResources={this.editResources}
        editLocations={this.editLocations}
        itemsEditValidationErrors={[]}
        onSetItemsEditValidationErrors={function() {}}
        onSetEditVariantsResourcesLocations={function() {}}
        onSetEditingItemProduct={function() {}}
        onSetEditingItemVariant={function() {}}
        onSetEditingItemStart={function() {}}
        onSetEditingItemFinish={function() {}}
        onSetEditingItemQuantity={function() {}}
        onDeleteEditingItemResource={function() {}}
        onSetEditingItemResource={function() {}}
        onDeleteEditingItemLocation={function() {}}
        onSetEditingItemLocation={function() {}} />
    );
  });

  describe('rendering', function() {

    it('renders correct input fields', function() {
      const refs = this.editModal.refs;

      expect(refs.editProductList).not.toBeUndefined();
      expect(refs.editProductList.type).toEqual('select-one');

      expect(refs.editProductVariant).not.toBeUndefined();
      expect(refs.editProductVariant.type).toEqual('select-one');

      expect(refs.editFromDateTimePicker).not.toBeUndefined();

      expect(refs.editToDateTimePicker).not.toBeUndefined();

      expect(refs.editProductQuantity).not.toBeUndefined();
      expect(refs.editProductQuantity.type).toEqual('number');

      expect(refs.editProductResource).not.toBeUndefined();
      expect(refs.editProductResource.type).toEqual('select-one');

      expect(refs.editProductLocation).not.toBeUndefined();
      expect(refs.editProductLocation.type).toEqual('select-one');
    });

    it('renders item vals in input fields', function() {
      const refs = this.editModal.refs;

      expect(refs.editProductList.value).toEqual(this.item.product.id.toString());
      expect(refs.editProductVariant.value).toEqual(this.item.variant.id.toString());
      expect(refs.editFromDateTimePicker.getValue()).toEqual(this.item.start);
      expect(refs.editToDateTimePicker.getValue()).toEqual(this.item.finish);
      expect(refs.editProductQuantity.value).toEqual(this.item.quantity.toString());
      expect(refs.editProductResource.value).toEqual(this.item.resource.id.toString());
      expect(refs.editProductLocation.value).toEqual(this.item.location.id.toString());
    });
  });

  describe('callbacks', function() {

    describe('onSetEditVariantsResourcesLocations', function() {

      it('gets called when product changes', function() {
        const onSetEditVariantsResourcesLocations =
          jasmine.createSpy('onSetEditVariantsResourcesLocations');

        const editModal = TestUtils.renderIntoDocument(
          <EditModal
            item={this.item}
            editingItemIdx={0}
            products={this.products}
            editVariants={this.editVariants}
            editResources={this.editResources}
            editLocations={this.editLocations}
            itemsEditValidationErrors={[]}
            onSetItemsEditValidationErrors={function() {}}
            onSetEditVariantsResourcesLocations={onSetEditVariantsResourcesLocations}
            onSetEditingItemProduct={function() {}}
            onSetEditingItemVariant={function() {}}
            onSetEditingItemStart={function() {}}
            onSetEditingItemFinish={function() {}}
            onSetEditingItemQuantity={function() {}}
            onDeleteEditingItemResource={function() {}}
            onSetEditingItemResource={function() {}}
            onDeleteEditingItemLocation={function() {}}
            onSetEditingItemLocation={function() {}} />
        );

        window.$ = function() {};
        window.$.getJSON = function(url, fn) {
          fn({variants: 'variants', resources: 'resources', locations: 'locations'});
        };

        expect(onSetEditVariantsResourcesLocations).not.toHaveBeenCalled();

        editModal.refs.editProductList.value = '11';
        TestUtils.Simulate.change(editModal.refs.editProductList);

        expect(onSetEditVariantsResourcesLocations).toHaveBeenCalledWith(
          'variants', 'resources', 'locations');
      });
    });

    describe('onSetEditingItemProduct', function() {

      it('gets called when product changes', function() {
        const onSetEditingItemProduct = jasmine.createSpy('onSetEditingItemProduct');

        const editModal = TestUtils.renderIntoDocument(
          <EditModal
            item={this.item}
            editingItemIdx={0}
            products={this.products}
            editVariants={this.editVariants}
            editResources={this.editResources}
            editLocations={this.editLocations}
            itemsEditValidationErrors={[]}
            onSetItemsEditValidationErrors={function() {}}
            onSetEditVariantsResourcesLocations={function() {}}
            onSetEditingItemProduct={onSetEditingItemProduct}
            onSetEditingItemVariant={function() {}}
            onSetEditingItemStart={function() {}}
            onSetEditingItemFinish={function() {}}
            onSetEditingItemQuantity={function() {}}
            onDeleteEditingItemResource={function() {}}
            onSetEditingItemResource={function() {}}
            onDeleteEditingItemLocation={function() {}}
            onSetEditingItemLocation={function() {}} />
        );

        window.$ = function() {};
        window.$.getJSON = function(url, fn) {
          fn({variants: 'variants', resources: 'resources', locations: 'locations'});
        };

        expect(onSetEditingItemProduct).not.toHaveBeenCalled();

        editModal.refs.editProductList.value = '11';
        TestUtils.Simulate.change(editModal.refs.editProductList);

        expect(onSetEditingItemProduct).toHaveBeenCalledWith(
          {id: 11, product_title: 'Product2'});
      });
    });

    describe('onSetEditingItemVariant', function() {

      it('gets called when variant changes', function() {
        const onSetEditingItemVariant = jasmine.createSpy('onSetEditingItemVariant');

        const editModal = TestUtils.renderIntoDocument(
          <EditModal
            item={this.item}
            editingItemIdx={0}
            products={this.products}
            editVariants={this.editVariants}
            editResources={this.editResources}
            editLocations={this.editLocations}
            itemsEditValidationErrors={[]}
            onSetItemsEditValidationErrors={function() {}}
            onSetEditVariantsResourcesLocations={function() {}}
            onSetEditingItemProduct={function() {}}
            onSetEditingItemVariant={onSetEditingItemVariant}
            onSetEditingItemStart={function() {}}
            onSetEditingItemFinish={function() {}}
            onSetEditingItemQuantity={function() {}}
            onDeleteEditingItemResource={function() {}}
            onSetEditingItemResource={function() {}}
            onDeleteEditingItemLocation={function() {}}
            onSetEditingItemLocation={function() {}} />
        );

        expect(onSetEditingItemVariant).not.toHaveBeenCalled();

        editModal.refs.editProductVariant.value = '1';
        TestUtils.Simulate.change(editModal.refs.editProductVariant);

        expect(onSetEditingItemVariant).toHaveBeenCalledWith(
          {id: 1, title: 'Variant1'});
      });
    });

    describe('onSetEditingItemQuantity', function() {

      it('gets called when quantity changes', function() {
        const onSetEditingItemQuantity = jasmine.createSpy('onSetEditingItemQuantity');

        const editModal = TestUtils.renderIntoDocument(
          <EditModal
            item={this.item}
            editingItemIdx={0}
            products={this.products}
            editVariants={this.editVariants}
            editResources={this.editResources}
            editLocations={this.editLocations}
            itemsEditValidationErrors={[]}
            onSetItemsEditValidationErrors={function() {}}
            onSetEditVariantsResourcesLocations={function() {}}
            onSetEditingItemProduct={function() {}}
            onSetEditingItemVariant={function() {}}
            onSetEditingItemStart={function() {}}
            onSetEditingItemFinish={function() {}}
            onSetEditingItemQuantity={onSetEditingItemQuantity}
            onDeleteEditingItemResource={function() {}}
            onSetEditingItemResource={function() {}}
            onDeleteEditingItemLocation={function() {}}
            onSetEditingItemLocation={function() {}} />
        );

        expect(onSetEditingItemQuantity).not.toHaveBeenCalled();

        editModal.refs.editProductQuantity.value = '5';
        TestUtils.Simulate.change(editModal.refs.editProductQuantity);

        expect(onSetEditingItemQuantity).toHaveBeenCalledWith(5);
      });
    });

    describe('onSetEditingItemResource', function() {

      it('gets called when resource changes', function() {
        const onSetEditingItemResource = jasmine.createSpy('onSetEditingItemResource');

        const editModal = TestUtils.renderIntoDocument(
          <EditModal
            item={this.item}
            editingItemIdx={0}
            products={this.products}
            editVariants={this.editVariants}
            editResources={this.editResources}
            editLocations={this.editLocations}
            itemsEditValidationErrors={[]}
            onSetItemsEditValidationErrors={function() {}}
            onSetEditVariantsResourcesLocations={function() {}}
            onSetEditingItemProduct={function() {}}
            onSetEditingItemVariant={function() {}}
            onSetEditingItemStart={function() {}}
            onSetEditingItemFinish={function() {}}
            onSetEditingItemQuantity={function() {}}
            onDeleteEditingItemResource={function() {}}
            onSetEditingItemResource={onSetEditingItemResource}
            onDeleteEditingItemLocation={function() {}}
            onSetEditingItemLocation={function() {}} />
        );

        expect(onSetEditingItemResource).not.toHaveBeenCalled();

        editModal.refs.editProductResource.value = '222';
        TestUtils.Simulate.change(editModal.refs.editProductResource);

        expect(onSetEditingItemResource).toHaveBeenCalledWith(
          {id: 222, name: 'equipment1'});
      });
    });

    describe('onSetEditingItemLocation', function() {

      it('gets called when resource changes', function() {
        const onSetEditingItemLocation = jasmine.createSpy('onSetEditingItemLocation');

        const editModal = TestUtils.renderIntoDocument(
          <EditModal
            item={this.item}
            editingItemIdx={0}
            products={this.products}
            editVariants={this.editVariants}
            editResources={this.editResources}
            editLocations={this.editLocations}
            itemsEditValidationErrors={[]}
            onSetItemsEditValidationErrors={function() {}}
            onSetEditVariantsResourcesLocations={function() {}}
            onSetEditingItemProduct={function() {}}
            onSetEditingItemVariant={function() {}}
            onSetEditingItemStart={function() {}}
            onSetEditingItemFinish={function() {}}
            onSetEditingItemQuantity={function() {}}
            onDeleteEditingItemResource={function() {}}
            onSetEditingItemResource={function() {}}
            onDeleteEditingItemLocation={function() {}}
            onSetEditingItemLocation={onSetEditingItemLocation} />
        );

        expect(onSetEditingItemLocation).not.toHaveBeenCalled();

        editModal.refs.editProductLocation.value = '33';
        TestUtils.Simulate.change(editModal.refs.editProductLocation);

        expect(onSetEditingItemLocation).toHaveBeenCalledWith(
          {id: 33, name: 'Location3'});
      });
    });

    describe('onDeleteEditingItemResource', function() {

      it('gets called when resource resets', function() {
        const onDeleteEditingItemResource = jasmine.createSpy('onDeleteEditingItemResource');

        const editModal = TestUtils.renderIntoDocument(
          <EditModal
            item={this.item}
            editingItemIdx={0}
            products={this.products}
            editVariants={this.editVariants}
            editResources={this.editResources}
            editLocations={this.editLocations}
            itemsEditValidationErrors={[]}
            onSetItemsEditValidationErrors={function() {}}
            onSetEditVariantsResourcesLocations={function() {}}
            onSetEditingItemProduct={function() {}}
            onSetEditingItemVariant={function() {}}
            onSetEditingItemStart={function() {}}
            onSetEditingItemFinish={function() {}}
            onSetEditingItemQuantity={function() {}}
            onDeleteEditingItemResource={onDeleteEditingItemResource}
            onSetEditingItemResource={function() {}}
            onDeleteEditingItemLocation={function() {}}
            onSetEditingItemLocation={function() {}} />
        );

        expect(onDeleteEditingItemResource).not.toHaveBeenCalled();

        editModal.refs.editProductResource.value = 'NULL';
        TestUtils.Simulate.change(editModal.refs.editProductResource);

        expect(onDeleteEditingItemResource).toHaveBeenCalled();
      });
    });

    describe('onDeleteEditingItemLocation', function() {

      it('gets called when resource resets', function() {
        const onDeleteEditingItemLocation = jasmine.createSpy('onDeleteEditingItemLocation');

        const editModal = TestUtils.renderIntoDocument(
          <EditModal
            item={this.item}
            editingItemIdx={0}
            products={this.products}
            editVariants={this.editVariants}
            editResources={this.editResources}
            editLocations={this.editLocations}
            itemsEditValidationErrors={[]}
            onSetItemsEditValidationErrors={function() {}}
            onSetEditVariantsResourcesLocations={function() {}}
            onSetEditingItemProduct={function() {}}
            onSetEditingItemVariant={function() {}}
            onSetEditingItemStart={function() {}}
            onSetEditingItemFinish={function() {}}
            onSetEditingItemQuantity={function() {}}
            onDeleteEditingItemResource={function() {}}
            onSetEditingItemResource={function() {}}
            onDeleteEditingItemLocation={onDeleteEditingItemLocation}
            onSetEditingItemLocation={function() {}} />
        );

        expect(onDeleteEditingItemLocation).not.toHaveBeenCalled();

        editModal.refs.editProductLocation.value = 'NULL';
        TestUtils.Simulate.change(editModal.refs.editProductLocation);

        expect(onDeleteEditingItemLocation).toHaveBeenCalled();
      });
    });
  });
});

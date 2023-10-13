jest.unmock('../../components/bookings/booking_items');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import BookingItems from '../../components/bookings/booking_items.js.jsx';

const moment = require('moment');

const DateTimeField = require('react-bootstrap-datetimepicker-noicon');

describe('bookingItems', function() {

  beforeEach(function() {

    this.products = [
      {id: 10, product_title: 'Product1'},
      {id: 20, product_title: 'Product2'},
      {id: 30, product_title: 'Product3'}
    ];

    this.variants = [
      {id: 1, title: 'Variant1'},
      {id: 2, title: 'Variant2'}
    ];

    this.resources = [
      {id: 111, name: 'stuff1'},
      {id: 222, name: 'equipment1'}
    ];

    this.locations = [
      {id: 11, name: 'Location1'},
      {id: 22, name: 'Location2'},
      {id: 33, name: 'Location3'}
    ];

    this.items = [
      {
        shop_id: 1,
        product: {
          id: 12,
          product_title: 'testing product title 1'
        },
        variant: {
          id: 43,
          title: 'testing variant title 1'
        },
        start:  "2016-05-29 16:00:00",
        finish: "2016-05-30 16:00:00",
        quantity: 1,
        location: {
          id: 91,
          name: 'testing location 1'
        },
        resource: {
          id: 39,
          name: 'testing resource 1'
        }
      },
      {
        id: 1,
        shop_id: 2,
        product: {
          id: 22,
          product_title: 'testing product title 2'
        },
        variant: {
          id: 74,
          title: 'testing variant title 2'
        },
        start:  "2016-05-29 16:00:00",
        finish: "2016-05-30 16:00:00",
        quantity: 1,
        location: {
          id: 52,
          name: 'testing location 2'
        },
        resource: {
          id: 29,
          name: 'testing resource 2'
        }
      }
    ];

    this.bookingItems = TestUtils.renderIntoDocument(
      <BookingItems
        shopId={999}
        items={this.items}
        itemsValidationErrors={[]}
        products={this.products}
        variants={this.variants}
        resources={this.resources}
        locations={this.locations}
        editVariants={[]}
        editResources={[]}
        editLocations={[]}
        itemsEditValidationErrors={[]}
        onSetVariantsResourcesLocations={function() {}}
        onSetEditVariantsResourcesLocations={function() {}}
        onSetItemsValidationErrors={function() {}}
        onSetItemsEditValidationErrors={function() {}}
        onSetEditingItemIdx={function() {}}
        onAddItem={function() {}}
        onDeleteItem={function() {}}
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
    it('renders correct inputs', function() {
      expect(this.bookingItems.refs.bookingItemId).not.toBeUndefined();
      expect(this.bookingItems.refs.bookingItemId.type).toEqual('hidden');

      expect(this.bookingItems.refs.shopId).not.toBeUndefined();
      expect(this.bookingItems.refs.shopId.type).toEqual('hidden');

      expect(this.bookingItems.refs.productList).not.toBeUndefined();
      expect(this.bookingItems.refs.productList.type).toEqual('select-one');

      expect(this.bookingItems.refs.productVariant).not.toBeUndefined();
      expect(this.bookingItems.refs.productVariant.type).toEqual('select-one');

      expect(this.bookingItems.refs.fromDateTimePicker).not.toBeUndefined();

      expect(this.bookingItems.refs.toDateTimePicker).not.toBeUndefined();

      expect(this.bookingItems.refs.productQuantity).not.toBeUndefined();
      expect(this.bookingItems.refs.productQuantity.type).toEqual('number');

      expect(this.bookingItems.refs.productResource).not.toBeUndefined();
      expect(this.bookingItems.refs.productResource.type).toEqual('select-one');

      expect(this.bookingItems.refs.productLocation).not.toBeUndefined();
      expect(this.bookingItems.refs.productLocation.type).toEqual('select-one');

      expect(this.bookingItems.refs.editModal).not.toBeUndefined();
    });

    it('renders correct number of booking item rows', function() {
      const items = TestUtils.scryRenderedDOMComponentsWithClass(
        this.bookingItems, 'item-row');
      expect(items.length).toEqual(this.items.length);
    });

    it('renders correct booking items', function() {
      const items = TestUtils.scryRenderedDOMComponentsWithClass(
        this.bookingItems, 'item-row');

      for(let i = 0; i < items.length; i++) {
        expect(items[i].children[0].textContent).toEqual(this.items[i].product.product_title);
        expect(items[i].children[1].textContent).toEqual(this.items[i].variant.title);
        expect(items[i].children[2].textContent).toEqual(this.items[i].start);
        expect(items[i].children[3].textContent).toEqual(this.items[i].finish);
        expect(items[i].children[4].textContent).toEqual(this.items[i].quantity.toString());
        expect(items[i].children[5].textContent).toEqual(this.items[i].resource.name);
        expect(items[i].children[6].textContent).toEqual(this.items[i].location.name);

        let buttonsCell = items[i].children[7];

        expect(buttonsCell.children.length).toEqual(2);

        expect(buttonsCell.children[0].type).toEqual('button');
        expect(buttonsCell.children[0].className).toMatch('btn-info');
        expect(buttonsCell.children[0].getAttribute('data-item-idx')).toEqual(i.toString());

        expect(buttonsCell.children[1].type).toEqual('button');
        expect(buttonsCell.children[1].className).toMatch('btn-danger');
        expect(buttonsCell.children[1].getAttribute('data-item-idx')).toEqual(i.toString());
      }
    });

    it('renders given available products in productList', function() {
      expect(this.bookingItems.refs.productList.children.length).toEqual(4);

      const firstOption = this.bookingItems.refs.productList.children[0];

      expect(firstOption.value).toEqual('NULL');
      expect(firstOption.textContent).toEqual('Select product...');

      for(let i = 1; i < this.bookingItems.refs.productList.children.length; i++) {
        let option = this.bookingItems.refs.productList.children[i];
        let product = this.products[i-1];
        expect(option.value).toEqual(product.id.toString());
        expect(option.textContent).toEqual(product.product_title);
      }
    });

    it('renders given variants', function() {
      expect(this.bookingItems.refs.productVariant.children.length).toEqual(3);

      const firstOption = this.bookingItems.refs.productVariant.children[0];

      expect(firstOption.value).toEqual('NULL');
      expect(firstOption.textContent).toEqual('Select variant...');

      for(let i = 1; i < this.bookingItems.refs.productVariant.children.length; i++) {
        let option = this.bookingItems.refs.productVariant.children[i];
        let variant = this.variants[i-1];
        expect(option.value).toEqual(variant.id.toString());
        expect(option.textContent).toEqual(variant.title);
      }
    });

    it('renders given resources', function() {
      expect(this.bookingItems.refs.productResource.children.length).toEqual(3);

      const firstOption = this.bookingItems.refs.productResource.children[0];

      expect(firstOption.value).toEqual('NULL');
      expect(firstOption.textContent).toEqual('Resources...');

      for(let i = 1; i < this.bookingItems.refs.productResource.children.length; i++) {
        let option = this.bookingItems.refs.productResource.children[i];
        let resource = this.resources[i-1];
        expect(option.value).toEqual(resource.id.toString());
        expect(option.textContent).toEqual(resource.name);
      }
    });

    it('renders given locations', function() {
      expect(this.bookingItems.refs.productLocation.children.length).toEqual(4);

      const firstOption = this.bookingItems.refs.productLocation.children[0];

      expect(firstOption.value).toEqual('NULL');
      expect(firstOption.textContent).toEqual('Locations...');

      for(let i = 1; i < this.bookingItems.refs.productLocation.children.length; i++) {
        let option = this.bookingItems.refs.productLocation.children[i];
        let location = this.locations[i-1];
        expect(option.value).toEqual(location.id.toString());
        expect(option.textContent).toEqual(location.name);
      }
    });

    it('renders given shopId', function() {
      expect(this.bookingItems.refs.shopId.value).toEqual(
        this.bookingItems.props.shopId.toString());
    });

    it('renders addButton', function() {
      expect(this.bookingItems.refs.addButton).not.toBeUndefined();
      expect(this.bookingItems.refs.addButton.type).toEqual('button');
    });
  });

  describe('callbacks', function() {

    describe('onSetVariantsResourcesLocations', function() {

      it('gets called with empty arrays for variant, resource & location when product is NULL', function() {
        const onSetVariantsResourcesLocations = jasmine.createSpy('onAddItem');

        const bookingItems = TestUtils.renderIntoDocument(
          <BookingItems
            shopId={999}
            items={this.items}
            itemsValidationErrors={[]}
            products={this.products}
            variants={this.variants}
            resources={this.resources}
            locations={this.locations}
            editVariants={[]}
            editResources={[]}
            editLocations={[]}
            itemsEditValidationErrors={[]}
            onSetVariantsResourcesLocations={onSetVariantsResourcesLocations}
            onSetEditVariantsResourcesLocations={function() {}}
            onSetEditingItemIdx={function() {}}
            onSetItemsValidationErrors={function() {}}
            onSetItemsEditValidationErrors={function() {}}
            onAddItem={function() {}}
            onDeleteItem={function() {}}
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

        expect(onSetVariantsResourcesLocations).not.toHaveBeenCalled();

        bookingItems.refs.productList.value = 'NULL';
        TestUtils.Simulate.change(bookingItems.refs.productList);

        expect(onSetVariantsResourcesLocations).toHaveBeenCalledWith([], [], []);
      });

      it('gets called with correct vals when product is not NULL', function() {
        const onSetVariantsResourcesLocations = jasmine.createSpy('onAddItem');

        const bookingItems = TestUtils.renderIntoDocument(
          <BookingItems
            shopId={999}
            items={this.items}
            itemsValidationErrors={[]}
            products={this.products}
            variants={this.variants}
            resources={this.resources}
            locations={this.locations}
            editVariants={[]}
            editResources={[]}
            editLocations={[]}
            itemsEditValidationErrors={[]}
            onSetVariantsResourcesLocations={onSetVariantsResourcesLocations}
            onSetEditVariantsResourcesLocations={function() {}}
            onSetEditingItemIdx={function() {}}
            onSetItemsValidationErrors={function() {}}
            onSetItemsEditValidationErrors={function() {}}
            onAddItem={function() {}}
            onDeleteItem={function() {}}
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

        window.$ = {
          getJSON: function(url, fn) {
            fn({
              variants:  'variants',
              resources: 'resources',
              locations: 'locations',
            });
          },
        };

        expect(onSetVariantsResourcesLocations).not.toHaveBeenCalled();

        bookingItems.refs.productList.value = '20';
        TestUtils.Simulate.change(bookingItems.refs.productList);

        expect(onSetVariantsResourcesLocations).toHaveBeenCalledWith(
          'variants', 'resources', 'locations');
      });
    });

    describe('onSetEditVariantsResourcesLocations', function() {

      it('gets called on edit button click', function() {
        const onSetEditVariantsResourcesLocations = jasmine.createSpy('onAddItem');

        const bookingItems = TestUtils.renderIntoDocument(
          <BookingItems
            shopId={999}
            items={this.items}
            itemsValidationErrors={[]}
            products={this.products}
            variants={this.variants}
            resources={this.resources}
            locations={this.locations}
            editVariants={[]}
            editResources={[]}
            editLocations={[]}
            itemsEditValidationErrors={[]}
            onSetVariantsResourcesLocations={function() {}}
            onSetEditVariantsResourcesLocations={onSetEditVariantsResourcesLocations}
            onSetEditingItemIdx={function() {}}
            onSetItemsValidationErrors={function() {}}
            onSetItemsEditValidationErrors={function() {}}
            onAddItem={function() {}}
            onDeleteItem={function() {}}
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

        window.$ = function() {
          return {
            modal: function() {},
          };
        };
        window.$.getJSON = function(url, fn) {
          fn({
            variants:  'variants',
            resources: 'resources',
            locations: 'locations'
          })
        };

        const editButtons = TestUtils.scryRenderedDOMComponentsWithClass(
          bookingItems, 'edit-item');

        expect(onSetEditVariantsResourcesLocations).not.toHaveBeenCalled();
        expect(editButtons.length).toEqual(2);

        TestUtils.Simulate.click(editButtons[0]);
        expect(onSetEditVariantsResourcesLocations).toHaveBeenCalledWith(
          'variants', 'resources', 'locations');
      });
    });

    describe('onSetItemsValidationErrors', function() {

      it('gets called with [] when user adds valid booking item', function() {
        const onSetItemsValidationErrors = jasmine.createSpy('onSetItemsValidationErrors');

        const bookingItems = TestUtils.renderIntoDocument(
          <BookingItems
            shopId={999}
            items={this.items}
            itemsValidationErrors={[]}
            products={this.products}
            variants={this.variants}
            resources={this.resources}
            locations={this.locations}
            editVariants={[]}
            editResources={[]}
            editLocations={[]}
            itemsEditValidationErrors={[]}
            onSetVariantsResourcesLocations={function() {}}
            onSetEditVariantsResourcesLocations={function() {}}
            onSetEditingItemIdx={function() {}}
            onSetItemsValidationErrors={onSetItemsValidationErrors}
            onSetItemsEditValidationErrors={function() {}}
            onAddItem={function() {}}
            onDeleteItem={function() {}}
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

        expect(onSetItemsValidationErrors).not.toHaveBeenCalled();

        // Fill forms incorrectly (Product missing)

        // Select first day of next month
        bookingItems.refs.toDateTimePicker.setSelectedDate({target: {
          className: 'day',
          innerHTML: 31,
        }});

        const startDT  = bookingItems.refs.fromDateTimePicker.getValue();
        const finishDT = bookingItems.refs.toDateTimePicker.getValue();

        bookingItems.refs.bookingItemId.value = '777';
        TestUtils.Simulate.change(bookingItems.refs.bookingItemId);

        bookingItems.refs.productList.value = '20';
        TestUtils.Simulate.change(bookingItems.refs.productList);

        bookingItems.refs.productVariant.value = '1';
        TestUtils.Simulate.change(bookingItems.refs.productVariant);

        bookingItems.refs.productQuantity.value = '3';
        TestUtils.Simulate.change(bookingItems.refs.productQuantity);

        bookingItems.refs.productResource.value = '222';
        TestUtils.Simulate.change(bookingItems.refs.productResource);

        bookingItems.refs.productLocation.value = '33';
        TestUtils.Simulate.change(bookingItems.refs.productLocation);

        TestUtils.Simulate.click(bookingItems.refs.addButton);

        expect(onSetItemsValidationErrors).toHaveBeenCalledWith([]);
      });

      it('gets called with errors when user adds invalid booking item', function() {
        const onSetItemsValidationErrors = jasmine.createSpy('onSetItemsValidationErrors');

        const bookingItems = TestUtils.renderIntoDocument(
          <BookingItems
            shopId={999}
            items={this.items}
            itemsValidationErrors={[]}
            products={this.products}
            variants={this.variants}
            resources={this.resources}
            locations={this.locations}
            editVariants={[]}
            editResources={[]}
            editLocations={[]}
            itemsEditValidationErrors={[]}
            onSetVariantsResourcesLocations={function() {}}
            onSetEditVariantsResourcesLocations={function() {}}
            onSetEditingItemIdx={function() {}}
            onSetItemsValidationErrors={onSetItemsValidationErrors}
            onSetItemsEditValidationErrors={function() {}}
            onAddItem={function() {}}
            onDeleteItem={function() {}}
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

        expect(onSetItemsValidationErrors).not.toHaveBeenCalled();

        // Fill forms incorrectly (Product missing)

        // Select first day of next month
        bookingItems.refs.fromDateTimePicker.setSelectedDate({target: {
          className: 'day',
          innerHTML: 31,
        }});

        const startDT  = bookingItems.refs.fromDateTimePicker.getValue();
        const finishDT = bookingItems.refs.toDateTimePicker.getValue();

        bookingItems.refs.bookingItemId.value = '777';
        TestUtils.Simulate.change(bookingItems.refs.bookingItemId);

        bookingItems.refs.productList.value = 'NULL';
        TestUtils.Simulate.change(bookingItems.refs.productList);

        bookingItems.refs.productVariant.value = 'NULL';
        TestUtils.Simulate.change(bookingItems.refs.productVariant);

        bookingItems.refs.productQuantity.value = '-1';
        TestUtils.Simulate.change(bookingItems.refs.productQuantity);

        bookingItems.refs.productResource.value = '222';
        TestUtils.Simulate.change(bookingItems.refs.productResource);

        bookingItems.refs.productLocation.value = '33';
        TestUtils.Simulate.change(bookingItems.refs.productLocation);

        TestUtils.Simulate.click(bookingItems.refs.addButton);

        expect(onSetItemsValidationErrors).toHaveBeenCalledWith([
          "Product can't be blank.",
          "Variant can't be blank.",
          "Quantity must be bigger than 0.",
          "Finish time has to be after start time."
        ]);
      });
    });

    describe('onSetEditingItemIdx', function() {

      it('gets called with correct index on edit button click', function() {
        const onSetEditingItemIdx = jasmine.createSpy('onSetEditingItemIdx');

        const bookingItems = TestUtils.renderIntoDocument(
          <BookingItems
            shopId={999}
            items={this.items}
            itemsValidationErrors={[]}
            products={this.products}
            variants={this.variants}
            resources={this.resources}
            locations={this.locations}
            editVariants={[]}
            editResources={[]}
            editLocations={[]}
            itemsEditValidationErrors={[]}
            onSetVariantsResourcesLocations={function() {}}
            onSetEditVariantsResourcesLocations={function() {}}
            onSetEditingItemIdx={onSetEditingItemIdx}
            onSetItemsValidationErrors={function() {}}
            onSetItemsEditValidationErrors={function() {}}
            onAddItem={function() {}}
            onDeleteItem={function() {}}
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

        const editButtons = TestUtils.scryRenderedDOMComponentsWithClass(
          bookingItems, 'edit-item');

        expect(onSetEditingItemIdx).not.toHaveBeenCalled();
        expect(editButtons.length).toEqual(2);

        TestUtils.Simulate.click(editButtons[0]);
        expect(onSetEditingItemIdx).toHaveBeenCalledWith(0);

        TestUtils.Simulate.click(editButtons[1]);
        expect(onSetEditingItemIdx).toHaveBeenCalledWith(1);
      });
    });

    describe('onAddItem', function() {

      it('gets called with correct params when user fills form correctly', function() {
        const onAddItem = jasmine.createSpy('onAddItem');

        const bookingItems = TestUtils.renderIntoDocument(
          <BookingItems
            shopId={999}
            items={this.items}
            itemsValidationErrors={[]}
            products={this.products}
            variants={this.variants}
            resources={this.resources}
            locations={this.locations}
            editVariants={[]}
            editResources={[]}
            editLocations={[]}
            itemsEditValidationErrors={[]}
            onSetVariantsResourcesLocations={function() {}}
            onSetEditVariantsResourcesLocations={function() {}}
            onSetEditingItemIdx={function() {}}
            onSetItemsValidationErrors={function() {}}
            onSetItemsEditValidationErrors={function() {}}
            onAddItem={onAddItem}
            onDeleteItem={function() {}}
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

        window.$ = {
          getJSON: function() {},
        };

        expect(onAddItem).not.toHaveBeenCalled();

        // Fill forms correctly

        // Select first day of next month
        bookingItems.refs.toDateTimePicker.setSelectedDate({target: {
          className: 'day',
          innerHTML: 31,
        }});

        const startDT  = bookingItems.refs.fromDateTimePicker.getValue();
        const finishDT = bookingItems.refs.toDateTimePicker.getValue();

        bookingItems.refs.bookingItemId.value = '777';
        TestUtils.Simulate.change(bookingItems.refs.bookingItemId);

        bookingItems.refs.productList.value = '20';
        TestUtils.Simulate.change(bookingItems.refs.productList);

        bookingItems.refs.productVariant.value = '1';
        TestUtils.Simulate.change(bookingItems.refs.productVariant);

        bookingItems.refs.productQuantity.value = '5';
        TestUtils.Simulate.change(bookingItems.refs.productQuantity);

        bookingItems.refs.productResource.value = '222';
        TestUtils.Simulate.change(bookingItems.refs.productResource);

        bookingItems.refs.productLocation.value = '33';
        TestUtils.Simulate.change(bookingItems.refs.productLocation);

        TestUtils.Simulate.click(bookingItems.refs.addButton);

        expect(onAddItem).toHaveBeenCalledWith({
          shop_id: 999,
          id: 777,
          product: {id: 20, product_title: 'Product2'},
          variant: {id: 1, title: 'Variant1'},
          quantity: 5,
          resource: {id: 222, name: 'equipment1'},
          location: {id: 33, name: 'Location3'},
          start:  moment(startDT,  'x').format('YYYY-MM-DD HH:mm:ss'),
          finish: moment(finishDT, 'x').format('YYYY-MM-DD HH:mm:ss'),
        });
      });

      it("doesn't get called when params are incorrect", function() {
        const onAddItem = jasmine.createSpy('onAddItem');

        const bookingItems = TestUtils.renderIntoDocument(
          <BookingItems
            shopId={999}
            items={this.items}
            itemsValidationErrors={[]}
            products={this.products}
            variants={this.variants}
            resources={this.resources}
            locations={this.locations}
            editVariants={[]}
            editResources={[]}
            editLocations={[]}
            itemsEditValidationErrors={[]}
            onSetVariantsResourcesLocations={function() {}}
            onSetEditVariantsResourcesLocations={function() {}}
            onSetEditingItemIdx={function() {}}
            onSetItemsValidationErrors={function() {}}
            onSetItemsEditValidationErrors={function() {}}
            onAddItem={onAddItem}
            onDeleteItem={function() {}}
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

        expect(onAddItem).not.toHaveBeenCalled();

        // Fill forms incorrectly (Product missing)

        // Select first day of next month
        bookingItems.refs.toDateTimePicker.setSelectedDate({target: {
          className: 'day',
          innerHTML: 31,
        }});

        const startDT  = bookingItems.refs.fromDateTimePicker.getValue();
        const finishDT = bookingItems.refs.toDateTimePicker.getValue();

        bookingItems.refs.bookingItemId.value = '777';
        TestUtils.Simulate.change(bookingItems.refs.bookingItemId);

        bookingItems.refs.productList.value = 'NULL';
        TestUtils.Simulate.change(bookingItems.refs.productList);

        bookingItems.refs.productVariant.value = '1';
        TestUtils.Simulate.change(bookingItems.refs.productVariant);

        bookingItems.refs.productQuantity.value = '5';
        TestUtils.Simulate.change(bookingItems.refs.productQuantity);

        bookingItems.refs.productResource.value = '222';
        TestUtils.Simulate.change(bookingItems.refs.productResource);

        bookingItems.refs.productLocation.value = '33';
        TestUtils.Simulate.change(bookingItems.refs.productLocation);

        TestUtils.Simulate.click(bookingItems.refs.addButton);

        expect(onAddItem).not.toHaveBeenCalled();
      });
    });

    describe('onDeleteItem', function() {

      it('gets called with correct item index', function() {
        const onDeleteItem = jasmine.createSpy('onAddItem');

        const bookingItems = TestUtils.renderIntoDocument(
          <BookingItems
            shopId={999}
            items={this.items}
            itemsValidationErrors={[]}
            products={this.products}
            variants={this.variants}
            resources={this.resources}
            locations={this.locations}
            editVariants={[]}
            editResources={[]}
            editLocations={[]}
            itemsEditValidationErrors={[]}
            onSetVariantsResourcesLocations={function() {}}
            onSetEditVariantsResourcesLocations={function() {}}
            onSetEditingItemIdx={function() {}}
            onSetItemsValidationErrors={function() {}}
            onSetItemsEditValidationErrors={function() {}}
            onAddItem={function() {}}
            onDeleteItem={onDeleteItem}
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

        const deleteButtons = TestUtils.scryRenderedDOMComponentsWithClass(
          bookingItems, 'delete-item');

        expect(onDeleteItem).not.toHaveBeenCalled();
        expect(bookingItems.props.items.length).toEqual(2);
        expect(deleteButtons.length).toEqual(2);

        TestUtils.Simulate.click(deleteButtons[0]);
        expect(onDeleteItem).toHaveBeenCalledWith(0);

        onDeleteItem.calls.reset();

        TestUtils.Simulate.click(deleteButtons[1]);
        expect(onDeleteItem).toHaveBeenCalledWith(1);
      });
    });
  });

  describe('methods', function() {

    describe('_validateItem', function() {
      it('does not add errors when item is valid', function() {
        const bookingItem = {
          id: 1,
          shop_id: 2,
          product: {
            id: 22,
            product_title: 'testing product title 2'
          },
          variant: {
            id: 74,
            title: 'testing variant title 2'
          },
          start:  "2016-05-29 16:00:00",
          finish: "2016-05-30 16:00:00",
          quantity: 1,
          location: {
            id: 52,
            name: 'testing location 2'
          },
          resource: {
            id: 29,
            name: 'testing resource 2'
          }
        };
        let errors = [];

        this.bookingItems._validateItem(bookingItem, errors);

        expect(errors.length).toEqual(0);
      });

      it('adds errors when product is missing', function() {
        const bookingItem = {
          id: 1,
          shop_id: 2,
          product: {
            id: 22,
            product_title: 'testing product title 2'
          },
          variant: null,
          start:  "2016-05-29 16:00:00",
          finish: "2016-05-30 16:00:00",
          quantity: 1,
          location: {
            id: 52,
            name: 'testing location 2'
          },
          resource: {
            id: 29,
            name: 'testing resource 2'
          }
        };
        let errors = [];

        this.bookingItems._validateItem(bookingItem, errors);

        expect(errors.length).toEqual(1);
        expect(errors[0]).toEqual("Variant can't be blank.");
      });

      it('adds errors when variant is missing', function() {
        const bookingItem = {
          id: 1,
          shop_id: 2,
          product: null,
          variant: {
            id: 74,
            title: 'testing variant title 2'
          },
          start:  "2016-05-29 16:00:00",
          finish: "2016-05-30 16:00:00",
          quantity: 1,
          location: {
            id: 52,
            name: 'testing location 2'
          },
          resource: {
            id: 29,
            name: 'testing resource 2'
          }
        };
        let errors = [];

        this.bookingItems._validateItem(bookingItem, errors);

        expect(errors.length).toEqual(1);
        expect(errors[0]).toEqual("Product can't be blank.");
      });

      it('adds error when quantity is non positive int', function() {
        const bookingItem = {
          id: 1,
          shop_id: 2,
          product: {
            id: 22,
            product_title: 'testing product title 2'
          },
          variant: {
            id: 74,
            title: 'testing variant title 2'
          },
          start:  "2016-05-29 16:00:00",
          finish: "2016-05-30 16:00:00",
          quantity: 0,
          location: {
            id: 52,
            name: 'testing location 2'
          },
          resource: {
            id: 29,
            name: 'testing resource 2'
          }
        };
        let errors = [];

        this.bookingItems._validateItem(bookingItem, errors);

        expect(errors.length).toEqual(1);
        expect(errors[0]).toEqual("Quantity must be bigger than 0.");
      });

      it('adds error when quantity is blank', function() {
        const bookingItem = {
          id: 1,
          shop_id: 2,
          product: {
            id: 22,
            product_title: 'testing product title 2'
          },
          variant: {
            id: 74,
            title: 'testing variant title 2'
          },
          start:  "2016-05-29 16:00:00",
          finish: "2016-05-30 16:00:00",
          quantity: '',
          location: {
            id: 52,
            name: 'testing location 2'
          },
          resource: {
            id: 29,
            name: 'testing resource 2'
          }
        };
        let errors = [];

        this.bookingItems._validateItem(bookingItem, errors);

        expect(errors.length).toEqual(1);
        expect(errors[0]).toEqual("Quantity can't be blank.");
      });

      it('adds error when start is after finish', function() {
        const bookingItem = {
          id: 1,
          shop_id: 2,
          product: {
            id: 22,
            product_title: 'testing product title 2'
          },
          variant: {
            id: 74,
            title: 'testing variant title 2'
          },
          start:  "2016-05-30 16:00:00",
          finish: "2016-05-30 16:00:00",
          quantity: 1,
          location: {
            id: 52,
            name: 'testing location 2'
          },
          resource: {
            id: 29,
            name: 'testing resource 2'
          }
        };
        let errors = [];

        this.bookingItems._validateItem(bookingItem, errors);

        expect(errors.length).toEqual(1);
        expect(errors[0]).toEqual('Finish time has to be after start time.');
      });
    });
  });
});

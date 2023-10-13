jest.unmock('../../reducers/bookings');
jest.unmock('../../actions/bookings');
jest.unmock('react-addons-update');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import bookingReducer from '../../reducers/bookings.js.jsx';
import * as actions from '../../actions/bookings.js';

describe('bookingReducer', function() {

  beforeEach(function() {
    this.items = [
      {
        id: 1,
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
        _destroy: true,
      },
      {
        id: 2,
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
        resource: {
          id: 29,
          name: 'testing resource 2'
        }
      }
    ];

    this.customers = [
      {
        id: 1,
        name:  'customer1',
        email: 'customer1@example.com',
        phone: '234-2345'
      },
      {
        id: 2,
        name:  'customer2',
        email: 'customer2@example.com',
        phone: '345-3456'
      },
      {
        name:  'customer3',
        email: 'customer3@example.com',
        phone: '456-4567'
      },
    ]

    this.simpleState = {
      shopId: 1,
      isTrialAccount: true,
      id: 1,
      name: 'Test Name',
      email: 'testemail@example.com',
      phone: '123-1234',
      hotel: 'My Hotel',
      orderName: 'order name',
      status: '1',
      notes: 'order notes',
      items: this.items,
      customers: this.customers
    }
  });

  it('returns unmodified state when action does not exist', function() {
    const dummyAction = {type: 'DUMMY_ACTION'};

    expect(bookingReducer({}, dummyAction)).toEqual({});
    expect(bookingReducer(this.simpleState, dummyAction)).toEqual(this.simpleState);
  });

  it('sets isTrialAccount', function() {
    const initState = {
      isTrialAccount: true,
      id: 10
    }
    const act = actions.onSetIsTrialAccount(false);
    expect(bookingReducer(initState, act)).toEqual({isTrialAccount: false, id: 10});
  });

  it('sets reminderTemplates', function() {
    const initState = {
      reminderTemplates: [],
      hotel: 'My Hotel'
    };
    const act = actions.onSetReminderTemplates(['temp1', 'temp2']);
    expect(bookingReducer(initState, act)).toEqual({
      reminderTemplates: ['temp1', 'temp2'],
      hotel: 'My Hotel'
    });
  });

  it('sets shopId', function() {
    const initState = {
      id: 1,
      shopId: 10
    };
    const act = actions.onSetShopId(20);
    expect(bookingReducer(initState, act)).toEqual({
      id: 1,
      shopId: 20
    });
  });

  it('sets products', function() {
    const initState = {
      products: [
        {id: 10, product_title: 'Product1'}
      ],
      phone: '123-1234'
    };
    const act = actions.onSetProducts([
      {id: 20, product_title: 'Product2'},
      {id: 30, product_title: 'Product3'}
    ]);
    expect(bookingReducer(initState, act)).toEqual({
      products: [
        {id: 20, product_title: 'Product2'},
        {id: 30, product_title: 'Product3'}
      ],
      phone: '123-1234'
    });
  });

  it('sets resources', function() {
    const initState = {
      resources: [
        {id: 10, name: 'resource'},
      ],
      email: 'me@example.com'
    };
    const act = actions.onSetResources([
      {id: 111, name: 'stuff1'},
      {id: 222, name: 'equipment1'}
    ]);
    expect(bookingReducer(initState, act)).toEqual({
      resources: [
        {id: 111, name: 'stuff1'},
        {id: 222, name: 'equipment1'}
      ],
      email: 'me@example.com'
    });
  });

  it('sets locations', function() {
    const initState = {
      orderName: 'test order',
      locations: [
        {id: 11, name: 'Location1'}
      ]
    };
    const act = actions.onSetLocations([
      {id: 22, name: 'Location2'},
      {id: 33, name: 'Location3'}
    ]);
    expect(bookingReducer(initState, act)).toEqual({
      orderName: 'test order',
      locations: [
        {id: 22, name: 'Location2'},
        {id: 33, name: 'Location3'}
      ]
    });
  });

  it('sets variants', function() {
    const initState = {
      id: 1,
      variants: [
        {id: 1, title: 'Variant1'},
        {id: 2, title: 'Variant2'}
      ]
    };
    const act = actions.onSetVariants([
      {id: 10, title: 'Variant10'}
    ]);
    expect(bookingReducer(initState, act)).toEqual({
      id: 1,
      variants: [
        {id: 10, title: 'Variant10'}
      ]
    });
  });

  it('sets editResources', function() {
    const initState = {
      editResources: [
        {id: 10, name: 'resource'},
      ],
      email: 'me@example.com'
    };
    const act = actions.onSetEditResources([
      {id: 111, name: 'stuff1'},
      {id: 222, name: 'equipment1'}
    ]);
    expect(bookingReducer(initState, act)).toEqual({
      editResources: [
        {id: 111, name: 'stuff1'},
        {id: 222, name: 'equipment1'}
      ],
      email: 'me@example.com'
    });
  });

  it('sets editLocations', function() {
    const initState = {
      orderName: 'test order',
      editLocations: [
        {id: 11, name: 'Location1'}
      ]
    };
    const act = actions.onSetEditLocations([
      {id: 22, name: 'Location2'},
      {id: 33, name: 'Location3'}
    ]);
    expect(bookingReducer(initState, act)).toEqual({
      orderName: 'test order',
      editLocations: [
        {id: 22, name: 'Location2'},
        {id: 33, name: 'Location3'}
      ]
    });
  });

  it('sets editVariants', function() {
    const initState = {
      id: 1,
      editVariants: [
        {id: 1, title: 'Variant1'},
        {id: 2, title: 'Variant2'}
      ]
    };
    const act = actions.onSetEditVariants([
      {id: 10, title: 'Variant10'}
    ]);
    expect(bookingReducer(initState, act)).toEqual({
      id: 1,
      editVariants: [
        {id: 10, title: 'Variant10'}
      ]
    });
  });

  it('sets variant, resource & location', function() {
    const initState = {
      variants:  [{id: 1, title: 'Variant1'}],
      resources: [{id: 1, name: 'Resource1'}],
      locations: [{id: 1, name: 'Location1'}]
    };
    const act = actions.onSetVariantsResourcesLocations(
      [{id: 2, title: 'Variant2'}],
      [{id: 2, name: 'Resource2'}],
      [{id: 2, name: 'Location2'}]
    );
    expect(bookingReducer(initState, act)).toEqual({
      variants:  [{id: 2, title: 'Variant2'}],
      resources: [{id: 2, name: 'Resource2'}],
      locations: [{id: 2, name: 'Location2'}]
    });
  });

  it('sets edit variant, resource & location', function() {
    const initState = {
      editVariants:  [{id: 1, title: 'Variant1'}],
      editResources: [{id: 1, name: 'Resource1'}],
      editLocations: [{id: 1, name: 'Location1'}]
    };
    const act = actions.onSetEditVariantsResourcesLocations(
      [{id: 2, title: 'Variant2'}],
      [{id: 2, name: 'Resource2'}],
      [{id: 2, name: 'Location2'}]
    );
    expect(bookingReducer(initState, act)).toEqual({
      editVariants:  [{id: 2, title: 'Variant2'}],
      editResources: [{id: 2, name: 'Resource2'}],
      editLocations: [{id: 2, name: 'Location2'}]
    });
  });

  it('sets editingItemIdx', function() {
    const initState = {
      id: 10,
      editingItemIdx: 1
    };
    const act = actions.onSetEditingItemIdx(100);
    expect(bookingReducer(initState, act)).toEqual({
      id: 10,
      editingItemIdx: 100
    });
  });

  it('sets editingItemProduct', function() {
    const initState = {
      items: this.items,
      editingItemIdx: 0,
    };
    const newProduct = {
      id: 1000,
      product_title: 'New Product Title'
    };
    const act = actions.onSetEditingItemProduct(newProduct);
    const result = bookingReducer(initState, act);

    expect(result.items[0].product).toEqual(newProduct);
    expect(result.items[1]).toEqual(this.items[1]);
  });

  it('sets editingItemVariant', function() {
    const initState = {
      items: this.items,
      editingItemIdx: 1,
    };
    const newVariant = {
      id: 10,
      title: 'New Variant Title'
    };
    const act = actions.onSetEditingItemVariant(newVariant);
    const result = bookingReducer(initState, act);

    expect(result.items[0]).toEqual(this.items[0]);
    expect(result.items[1].variant).toEqual(newVariant);
  });

  it('sets editingItemStart', function() {
    const initState = {
      items: this.items,
      editingItemIdx: 0,
    };

    const act = actions.onSetEditingItemStart('2017-06-06 20:00:00');
    const result = bookingReducer(initState, act);

    expect(result.items[0].start).toEqual('2017-06-06 20:00:00');
    expect(result.items[1]).toEqual(this.items[1]);
  });

  it('sets editingItemFinish', function() {
    const initState = {
      items: this.items,
      editingItemIdx: 1,
    };

    const act = actions.onSetEditingItemFinish('2014-08-02 19:00:00');
    const result = bookingReducer(initState, act);

    expect(result.items[0]).toEqual(this.items[0]);
    expect(result.items[1].finish).toEqual('2014-08-02 19:00:00');
  });

  it('sets editingItemQuantity', function() {
    const initState = {
      items: this.items,
      editingItemIdx: 0,
    };

    const act = actions.onSetEditingItemQuantity(100);
    const result = bookingReducer(initState, act);

    expect(result.items[0].quantity).toEqual(100);
    expect(result.items[1]).toEqual(this.items[1]);
  });

  it('sets editingItemResource', function() {
    const initState = {
      items: this.items,
      editingItemIdx: 1,
    };
    const newResource = {
      id: 9,
      name: 'New Resource Name'
    };
    const act = actions.onSetEditingItemResource(newResource);
    const result = bookingReducer(initState, act);

    expect(result.items[0]).toEqual(this.items[0]);
    expect(result.items[1].resource).toEqual(newResource);
  });

  it('sets editingItemLocation', function() {
    const initState = {
      items: this.items,
      editingItemIdx: 0,
    };
    const newLocation = {
      id: 34,
      name: 'New Location Name'
    };
    const act = actions.onSetEditingItemLocation(newLocation);
    const result = bookingReducer(initState, act);

    expect(result.items[0].location).toEqual(newLocation);
    expect(result.items[1]).toEqual(this.items[1]);
  });

  it('deletes editingItemResource', function() {
    const initState = {
      items: this.items,
      editingItemIdx: 1,
    };

    const act = actions.onDeleteEditingItemResource();
    const result = bookingReducer(initState, act);

    expect(result.items[0]).toEqual(this.items[0]);
    expect(result.items[1].resource).toBeUndefined();
  });

  it('deletes editingItemLocation', function() {
    const initState = {
      items: this.items,
      editingItemIdx: 0,
    };

    const act = actions.onDeleteEditingItemLocation();
    const result = bookingReducer(initState, act);

    expect(result.items[0].resource).toBeUndefined();
    expect(result.items[1]).toEqual(this.items[1]);
  });

  it('sets id', function() {
    const initState = {
      id: 2,
      shopId: 10
    };
    const act = actions.onSetId(20);
    expect(bookingReducer(initState, act)).toEqual({
      id: 20,
      shopId: 10
    });
  });

  it('sets name', function() {
    const initState = {
      name: 'john doe',
      email: 'doe@example.com'
    };
    const act = actions.onSetName('tom doe');
    expect(bookingReducer(initState, act)).toEqual({
      name: 'tom doe',
      email: 'doe@example.com'
    });
  });

  it('sets email', function() {
    const initState = {
      name: 'john doe',
      email: 'doe@example.com'
    };
    const act = actions.onSetEmail('john@example.com');
    expect(bookingReducer(initState, act)).toEqual({
      name: 'john doe',
      email: 'john@example.com'
    });
  });

  it('sets phone', function() {
    const initState = {
      name: 'john doe',
      phone: '123-1234'
    };
    const act = actions.onSetPhone('432-4321');
    expect(bookingReducer(initState, act)).toEqual({
      name: 'john doe',
      phone: '432-4321'
    });
  });

  it('sets hotel', function() {
    const initState = {
      id: 10,
      hotel: 'hotel1'
    };
    const act = actions.onSetHotel('hotel2');
    expect(bookingReducer(initState, act)).toEqual({
      id: 10,
      hotel: 'hotel2'
    });
  });

  it('sets customers', function() {
    const initState = {
      id: 10,
      customers: []
    };
    const act = actions.onSetCustomers(this.customers);
    expect(bookingReducer(initState, act)).toEqual({
      id: 10,
      customers: this.customers
    });
  });

  it('sets order name', function() {
    const initState = {
      name: 'john doe',
      orderName: 'order#1'
    };
    const act = actions.onSetOrderName('order#2');
    expect(bookingReducer(initState, act)).toEqual({
      name: 'john doe',
      orderName: 'order#2'
    });
  });

  it('sets status', function() {
    const initState = {
      orderName: 'order#1',
      status: '2',
    };
    const act = actions.onSetStatus('1');
    expect(bookingReducer(initState, act)).toEqual({
      orderName: 'order#1',
      status: '1',
    });
  });

  it('sets notes', function() {
    const initState = {
      notes: 'notes1',
      email: 'doe@example.com'
    };
    const act = actions.onSetNotes('notes2');
    expect(bookingReducer(initState, act)).toEqual({
      notes: 'notes2',
      email: 'doe@example.com'
    });
  });

  it('sets items', function() {
    const initState = {
      shopId: 1,
      items: []
    };
    const act = actions.onSetItems(this.items);
    expect(bookingReducer(initState, act)).toEqual({
      shopId: 1,
      items: this.items
    });
  });

  it('sets itemsValidationErrors', function() {
    const initState = {
      id: 1,
      itemsValidationErrors: []
    };
    const act = actions.onSetItemsValidationErrors([
      'error1',
      'error2'
    ]);
    expect(bookingReducer(initState, act)).toEqual({
      id: 1,
      itemsValidationErrors: [
        'error1',
        'error2'
      ]
    });
  });

  it('sets itemsEditValidationErrors', function() {
    const initState = {
      notes: 'test notes',
      itemsEditValidationErrors: []
    };
    const act = actions.onSetItemsEditValidationErrors([
      'error1',
      'error2'
    ]);
    expect(bookingReducer(initState, act)).toEqual({
      notes: 'test notes',
      itemsEditValidationErrors: [
        'error1',
        'error2'
      ]
    });
  });

  it('sets bookingNamesValidationErrors', function() {
    const initState = {
      phone: '123-1234',
      bookingNamesValidationErrors: []
    };
    const act = actions.onSetBookingNamesValidationErrors([
      'error1',
      'error2'
    ]);
    expect(bookingReducer(initState, act)).toEqual({
      phone: '123-1234',
      bookingNamesValidationErrors: [
        'error1',
        'error2'
      ]
    });
  });

  it('sets submissionErrors', function() {
    const initState = {
      status: '31',
      submissionErrors: []
    };
    const act = actions.onSetSubmissionErrors([
      'error1',
      'error2'
    ]);
    expect(bookingReducer(initState, act)).toEqual({
      status: '31',
      submissionErrors: [
        'error1',
        'error2'
      ]
    });
  });

  it('adds customer', function() {
    const initState = {
      customers: [
        {
          id: 1,
          name:  'customer1',
          email: 'customer1@example.com',
          phone: '234-2345'
        },
        {
          id: 2,
          name:  'customer2',
          email: 'customer2@example.com',
          phone: '345-3456'
        }
      ]
    };
    const act = actions.onAddCustomer({
      name:  'customer3',
      email: 'customer3@example.com',
      phone: '456-4567'
    });
    expect(bookingReducer(initState, act)).toEqual({
      customers: [
        {
          id: 1,
          name:  'customer1',
          email: 'customer1@example.com',
          phone: '234-2345'
        },
        {
          id: 2,
          name:  'customer2',
          email: 'customer2@example.com',
          phone: '345-3456'
        },
        {
          name:  'customer3',
          email: 'customer3@example.com',
          phone: '456-4567'
        }
      ]
    });
  });

  it('adds item', function() {
    const initState = {
      items: [
        {
          id: 1,
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
          _destroy: true,
        }
      ]
    };
    const act = actions.onAddItem({
      id: 2,
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
      resource: {
        id: 29,
        name: 'testing resource 2'
      }
    });
    expect(bookingReducer(initState, act)).toEqual({
      items: [
        {
          id: 1,
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
          _destroy: true,
        },
        {
          id: 2,
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
          resource: {
            id: 29,
            name: 'testing resource 2'
          }
        }
      ]
    });
  });

  it('removes item from items when there is no id', function() {
    const initState = {
      items: [
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
        }
      ]
    };
    const act = actions.onDeleteItem(0);
    expect(bookingReducer(initState, act)).toEqual({
      items: []
    })
  });

  it('marks item fro destruction when there is id', function() {
    const initState = {
      items: [
        {
          id: 2,
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
        }
      ]
    };
    const act = actions.onDeleteItem(0);
    expect(bookingReducer(initState, act)).toEqual({
      items: [
        {
          id: 2,
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
          _destroy: true
        }
      ]
    })
  });

  it('removes customer from customers when there is no id', function() {
    const initState = {
      customers: [
        {
          name:  'customer1',
          email: 'customer1@example.com',
          phone: '234-2345'
        },
        {
          id: 2,
          name:  'customer2',
          email: 'customer2@example.com',
          phone: '345-3456'
        }
      ]
    };
    const act = actions.onDeleteCustomer(0);
    expect(bookingReducer(initState, act)).toEqual({
      customers: [
        {
          id: 2,
          name:  'customer2',
          email: 'customer2@example.com',
          phone: '345-3456'
        }
      ]
    })
  });

  it('marks customer from destruction when there is id', function() {
    const initState = {
      customers: [
        {
          name:  'customer1',
          email: 'customer1@example.com',
          phone: '234-2345'
        },
        {
          id: 2,
          name:  'customer2',
          email: 'customer2@example.com',
          phone: '345-3456'
        }
      ]
    };
    const act = actions.onDeleteCustomer(1);
    expect(bookingReducer(initState, act)).toEqual({
      customers: [
        {
          name:  'customer1',
          email: 'customer1@example.com',
          phone: '234-2345'
        },
        {
          id: 2,
          name:  'customer2',
          email: 'customer2@example.com',
          phone: '345-3456',
          _destroy: true
        }
      ]
    })
  });
});

class Report < ActiveRecord::Base
  belongs_to :shop
  serialize :fields, Array

  EVENT_ORDER_ID = 'order_id'
  BOOKING_ID = 'id'
  CUSTOMER_NAME = 'name'
  CUSTOMER_EMAIL = 'email'
  CUSTOMER_PHONE = 'phone'
  NOTES = 'notes'
  PRODUCT_TITLE = 'product_title'
  VARIANT_TITLE = 'title'
  QUANTITY = 'quantity'
  START = 'start'
  FINISH = 'finish'
  START_FINISH = 'start_finish'
  PRODUCT_WITH_VARIANT = 'product_variant'
  CUSTOMER_CONTACTS = 'customer_contact'

  FIELDS = {
      EVENT_ORDER_ID => { text: 'Order Number'},
      BOOKING_ID => { text: 'Booking ID'},
      CUSTOMER_NAME => { text: 'Customer Name'},
      CUSTOMER_EMAIL => { text: 'Customer Email'},
      CUSTOMER_PHONE => { text: 'Customer Phone'},
      NOTES => { text: 'Note'},
      PRODUCT_TITLE => { text: 'Product'},
      VARIANT_TITLE => { text: 'Variant'},
      QUANTITY => { text: 'Quantity'},
      START => { text: 'Start date'},
      FINISH => { text: 'Finish date'},
      START_FINISH => { text: 'Start/Finish dates'},
      PRODUCT_WITH_VARIANT => { text: 'Product with Variant'},
      CUSTOMER_CONTACTS => { text: 'Customer contacts'},
  }

end

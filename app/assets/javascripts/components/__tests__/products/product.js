export const product = {
    id: 1,
    capacity: 1,
    background_color: '',
    border_color: '',
    calendar_display: false,
    capacity_option1: 'Color',
    capacity_option2: '',
    capacity_option3: '',
    capacity_type: '1',
    external_id: '111',
    lag_time: 1200,
    lead_time: 0,
    max_duration: 0,
    min_duration: 0,
    mindate: 0,
    option_capacities_attributes: [
        {
            capacity: 1,
            option1: 'Black',
            option2: null,
            option3: null
        }
    ],
    product_handle: '123dwd',
    product_image_url: 'http://foo',
    product_locations_attributes: [
        {
            id: 1,
            location_id: 2
        }
    ],
    product_title: 'title',
    profile: 'product',
    resource_constraints_attributes: [
        {
            id: 2,
            resource_id: 1
        }
    ],
    schedule_attributes: {
        id: 1,
        recurring_items_attributes: [{
            id: 1,
            schedule_ical: {
                recurrencePattern: "FREQ=HOURLY;COUNT=3",
                startDateTime: "2016-06-24T23:00",
                timeZone: { offset: "+00:00" }
            }
        }]
    },
    scheduled: false,
    shopify_url: '',
    terms_attributes: [
        {
            id:1,
            finish_date: "2016-04-30 00:00",
            start_date: "2016-04-13 00:00",
            name: 'term1'
        }
    ],
    text_color: '',
    variants_attributes: [
        {
            all_day: 0,
            booking_items_count: 3,
            compare_at_price: null,
            duration: 100,
            duration_units: 1,
            external_id: 12313,
            finish_time: "2000-01-01T17:00:00.000Z",
            id: 1,
            ignore: false,
            option1: 'Black',
            option2: null,
            option3: null,
            options_yaml: '',
            party_size: 1,
            settings_yaml: '',
            sky: '',
            start_time: "2000-01-01T09:00:00.000Z",
            name: 'black'
        }
    ]
}
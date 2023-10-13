
window.BtaDatepickerWidget = xcomponent.create({
    tag: 'bookthatapp-datepicker',

    url: '//www.bookthatapp.dev:3002/widgets/datepicker/component.html',

    singleton: false,

    props: {
        date: {
            type: 'string',
            required: false
        },

        onDateSelected: {
            type: 'function',
            required: false
        },

        onInit: {
            type: 'function',
            required: false
        }
    },

    dimensions: {
        width: 308,
        height: 270
    },

    contexts: {
        iframe: true,
        lightbox: true,
        popup: true
    },
});
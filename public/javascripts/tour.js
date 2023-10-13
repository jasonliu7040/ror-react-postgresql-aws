guiders.createGuider({
    id:"first",
    next:"second",
    buttons:[{name:"Next", classString:"primary-button"}],
    description:"Welcome to BookThatApp. To get started, let's take a look around...<br/><br/>The page you are currently on is showing you the booking calendar. It will display " +
            "bookings and blackout periods you have created manually, as well as those received via orders made through your store.<br/><br/>Next, let's look at the configuration options...",
    overlay:true,
    title:"Welcome to BookThatApp!"
});

guiders.createGuider({
    id:"second",
    next:"third",
    attachTo:"#config-menu",
    buttons:[
        {name:"Close"},
        {name:"Next"}
    ],
    title:"Configuration",
    description: "The configuration menu section lets you change the way BookThatApp works. <ul>" +
    "<li><strong>Products</strong> allows you to import the products you want BookThatApp to track orders on.</li>" +
    "<li><strong>Resources</strong> lets you set up staff, rooms or equipment that are part of product bookings.</li>" +
    "<li><strong>Opening Hours</strong> is used to configure when your store is open.</li>" +
    "<li><strong>Locations</strong> specify where you can book items.</li>" +
    "<li><strong>Settings</strong> configures the look and feel of the datepicker, as well as messages that appear when products are booked out.</li>" +
    "<li><strong>Templates</strong> lets you edit the email notifications, and the layout of pdf tickets and BookThatApp pages within your store.</li>" +
    "</ul>",
    position:3
});

guiders.createGuider({
    id:"third",
    next:"fourth",
    attachTo:"#tour-manual-bookings",
    buttons:[
        {name:"Close"},
        {name:"Next"}
    ],
    title:"Bookings",
    description:"Once you have imported products you can start creating bookings. Create a booking manually using " +
            "this button. You can also create a Blackout using the 'Create Blackout' button.<br/><br/><strong>Tip</strong>: once " +
            "BookThatApp is installed into your theme bookings will be created automatically when orders are received.",
    position:6
});

guiders.createGuider({
    id:"fourth",
    attachTo:"#install-menu",
    buttons:[
        {name:"Close", classString:"primary-button", onclick:function () {
            if ($("#custom-install").is(":checked")) {
                document.location.href = "/charges/installation";
            }
            guiders.hideAll();
        }}
    ],
    buttonCustomHTML:"<input type=\"checkbox\" id=\"custom-install\" /><label for=\"custom-install\" class=\"hint\">Learn more about getting BookThatApp installed for me</label>",
    title:"Installation",
    description:"The Install Instruction section provides step by step instruction on how to install BookThatApp into your store.<br/><br/>BookThatApp is designed to work with the jQuery UI datepicker, and provides " +
            "the ability to show real-time availability.<br/><br/>If you aren't technical we can set it up for you for a small installation fee.<br/><br/>",
    position:3
});



const TouchspinHelper = {
    touchspinDidMount: function(callback) {
        $("#" + this.props.name +" .touchspin").TouchSpin({
        }).on('touchspin.on.startspin', function () { callback(this); });
    },
    setTouchspinInterval: function(step, min, max) {
        if (step != null && min != null && max != null) {
            $("#" + this.props.name + " .touchspin").trigger("touchspin.updatesettings", {
                step: step,
                max: max,
                min: min
            });
        }
    }
};

export default TouchspinHelper;
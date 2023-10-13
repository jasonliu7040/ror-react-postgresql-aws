(function() {
    this.loadingCount = 0;

    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date#Example.3a_ISO_8601_formatted_dates
    this.ISODateString = function(d) {
        return d.getUTCFullYear() + '-'
            + bta.pad(d.getUTCMonth() + 1) + '-'
            + bta.pad(d.getUTCDate()) + 'T'
            + bta.pad(d.getUTCHours()) + ':'
            + bta.pad(d.getUTCMinutes()) + ':'
            + bta.pad(d.getUTCSeconds()) + 'Z';
    };

    this.toLocalIsoString = function(date, includeSeconds) {
        var localIsoString = date.getFullYear() + '-'
            + bta.pad(date.getMonth() + 1) + '-'
            + bta.pad(date.getDate()) + 'T'
            + bta.pad(date.getHours()) + ':'
            + bta.pad(date.getMinutes()) + ':'
            + bta.pad(date.getSeconds());
        if (date.getTimezoneOffset() === 0) localIsoString += 'Z';
        return localIsoString;
    };

    this.parseISODateString = function(iso8601) { // originally from https://github.com/rmm5t/jquery-timeago/blob/master/jQ.timeago.js
        var s = jQ.trim(iso8601);
        s = s.replace(/\.\d\d\d+/, ""); // remove milliseconds
        s = s.replace(/-/, "/").replace(/-/, "/");
        s = s.replace(/T/, " ").replace(/Z/, " UTC");
        s = s.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"); // -04:00 -> -0400
        var result = new Date(s);
        return isNaN(result.getTime()) ? null : result;
    };

    this.YMDDateString = function(date) {
        var result = [];
        result.push(date.getFullYear());
        result.push('-');
        result.push(bta.pad(date.getMonth() + 1));
        result.push('-');
        result.push(bta.pad(date.getDate()));
        result.push('T');
        result.push(bta.pad(date.getHours()));
        result.push(':');
        result.push(bta.pad(date.getMinutes()));
        return result.join('');
    };

    this.parseYMDDateString = function(s) {
        var parts = s.split('T'), ss = parts[0];
        ss = s.split('-');
        if (parts.length == 1) {
            return new Date(parseInt(ss[0], 10), parseInt(ss[1], 10) - 1, parseInt(ss[2].substring(0, 2)), 10);
        } else {
            var tt = parts[1].split(':');
            return new Date(parseInt(ss[0], 10), parseInt(ss[1], 10) - 1, parseInt(ss[2].substring(0, 2), 10), parseInt(tt[0], 10), parseInt(tt[1], 10));
        }

    };

    this.setHhMm = function(date, hhmm) {
        date.setHours(parseInt(hhmm.hour, 10));
        date.setMinutes(parseInt(hhmm.minute, 10));
        date.setSeconds(0);
        return date;
    };

    this.setTime = function(date, time) {
        if (!date) return date;
        if (!time) return date;

        var hhmm = time.split(':');
        if (hhmm.length > 1) {
            date.setHours(parseInt(hhmm[0], 10));
            date.setMinutes(parseInt(hhmm[1], 10));
            date.setSeconds(0);
        }
        return date;
    };

    this.getMinDate = function(minDateAttr) {
        if (!minDateAttr) return;

        if (typeof minDateAttr.getDate === "function") {
            return minDateAttr;
        }

        var minDate = new Date();
        var pattern = /([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g;
        var matches = pattern.exec(minDateAttr);
        while (matches) {
            switch (matches[2] || 'd') {
                case 'd' : case 'D' :
                    minDate.setDate(minDate.getDate() + parseInt(matches[1], 10));
                    break;
                case 'w' : case 'W' :
                    minDate.setDate(minDate.getDate() + parseInt(matches[1], 10) * 7);
                    break;
                case 'm' : case 'M' :
                    minDate.setMonth(minDate.getMonth() + parseInt(matches[1], 10));
                    break;
                case 'y': case 'Y' :
                    minDate.setYear(minDate.getFullYear() + parseInt(matches[1], 10));
                    break;
            }
            matches = pattern.exec(minDateAttr);
        }
        return minDate;
    };

    this.timeslice = function(start, finish, minutes, callback) {
        var s = new Date(start.getTime()), // clone
            f = new Date(s.getTime() + minutes * 60000);

        while (f <= finish) {
            callback(s, f);
            s = new Date(s.getTime() + minutes * 60000);
            f = new Date(f.getTime() + minutes * 60000);
        }
    };

    this.loaded = function() {
        var callback = bta.listener("loaded");
        if (callback) {
            callback();
        }
    };

    this.saveTheDate = function(form) {
        var values = {}, found = false,
            variant = bta.findSelectedVariantId(form),
            qtyfld = form.find('select[name=qty], select[name=quantity], input[name=quantity]');

        if (qtyfld.length > 0) {
            var qty = qtyfld.val();
            if (/^\d+$/.test(qty)) {
                qty = parseInt(qty, 10);
                var max = qtyfld.attr('max');
                if (max && (max = parseInt(max, 10)) && (qty > max)) {
                    alert("There are only " + max + " places available. Please enter a quantity less than or equal to " + max);
                    qtyfld.focus();
                    return false;
                }
            } else {
                alert("The quantity entered doesn't appear to be a number");
                qtyfld.focus();
                return false;
            }
        }

        var valid = true; // assume valid (for non bookthatapp products)
        form.find("[id*='booking'].hasDatepicker").not(":disabled").not(":hidden").each(function(n, field) {
            var $this = jQ(this),
                val = jQ('div.bta-scheduled-times-widget[data-datepicker="' + $this.attr('id') + '"] select').val() || $this.val(),
                wdate = $this.data('widget-date');

            if (typeof val === "string" && val.length > 0) {
                var attribute = $this.attr('name') || $this.attr('id');
                values[attribute] = val;
                if (wdate) {
                    values[attribute + "-dateval"] = wdate.getTime();
                } else {
                    var date;
                    if ($this.hasClass('datetimepicker')) {
                        date = $this.datetimepicker('getDate');
                    } else {
                        date = $this.datepicker('getDate');
                    }
                    if (date === null) {
                        $this.focus();
                        valid = false;
                        return false; // stop iterating over fields
                    }
                    values[attribute + "-dateval"] = date.getTime();
                }
                found = true;
            } else {
                $this.focus();
                valid = false;
                return false;
            }
        });

        if (!valid) {
            alert('Please select a date');
            return false;
        }

        if (found && valid) {
            values["variant"] = variant;
            values["qty"] = qty || 1;
            values["ts"] = new Date().getTime();
            bta.saveTheCookie(variant, values);
        }

        return true;
    };

    // hook this up to the change event (cart page)
    this.updateTheDate = function(field) {
        var variantId = field.attr('id').split('-')[1],
            date = field.datepicker('getDate');

        bta.readTheCookie(variantId, function(cookie) {
            cookie["booking-start"] = field.val();
            cookie["booking-start-dateval"] = date.getTime();
            cookie["qty"] = parseInt(jQ('#updates_' + variantId).val(), 10);
            bta.saveTheCookie(variantId, cookie);
        });
    };

    this.saveTheCookie = function(variant, values) {
        jQ.cookie(["__bta", variant].join('.'), null);
        if (values) {
            jQ.cookie(["__bta", variant].join('.'), JSON.stringify(values), {path: '/', expires: 14});
        }
    };

    this.readTheCookie = function(variant, callback) {
        var cookie = jQ.cookie(["__bta", variant].join('.')), values;

        if (cookie) {
            values = JSON.parse(cookie);

            if (typeof callback == "function") {
                callback(values);
            }
        }

        return values;
    };

    this.findFinishField = function(field, variant) {
        var end_field_id = field.attr('rel-booking-end');
        var end_field = end_field_id ? jQ('#' + end_field_id) : jQ("#booking-" + variant + "-finish");
        if (end_field.length === 0) {
            end_field = jQ("#booking-" + variant + "-end"); // legacy
        }
        return end_field;
    };

    this.listener = function(callbacks, type) {
        if (typeof(callbacks) === 'string') {
            type = callbacks;
            callbacks = bta.callbacks || {};
        }

        if ((typeof(bta_callbacks) !== 'undefined') && (typeof(bta_callbacks[type]) == "function")) {
            return bta_callbacks[type];
        }

        if ((typeof(bta.callbacks) !== 'undefined') && typeof(bta.callbacks[type]) == "function") {
            return bta.callbacks[type];
        }

        if ((typeof(callbacks) !== 'undefined') && typeof(callbacks[type]) == "function") {
            return callbacks[type];
        }

        return false;
    };

    this.chainOnSelect = function(existing, field, selectedDate) {
        // use existing onSelect functionality if it was defined
        if (existing) {
            return existing(selectedDate);
        }

        // otherwise try to use a event listener
        var callback = bta.listener("dateSelected");
        if (callback) {
            return callback(field, field.datepicker('getDate'));
        }
    };

    this.capacity = function(product, variant) {
        var result = 100;

        if (!product) return result;

        if (product instanceof Array) { // deprecated
            return confirmCapacity(product);
        } else {
            switch(product.capacity_type) {
                case 0: // product
                    result = product.capacity;
                    break;

                case 1: // variant
                    if (variant) {
                        var oc = bta.oc(product, variant);
                        if (oc) {
                            result = oc.capacity;
                        }
                    }
                    break;
            }

            return result;
        }
    };

    /*
     reserves items for 5 mins

     callback can inspect result to determine which variants were successful

     reservations: [{"variant":"190703682","start":"2012-02-21T09:00","finish":"2012-02-21T10:00"}]
     - finish is optional
      */
    this.reserve = function(reservations, callback) {
        jQ.ajax({
            url: bta.base + "/availability/reserve.json",
            contentType: "application/json; charset=utf-8", dataType: "jsonp",
            type: "POST",
            data: {"variants": JSON.stringify(reservations)},
            success: function(data, status) {
                callback({status: status, result:data});
            },
            error: function(xhr, status, error) {
                callback({status: status, error: error, result:{}});
            }
        });
    }

    /*
    deprecated - use bta.reserve instead

   takes an array of variants with requested dates - e.g. [{"variant":"190703682","start":"2012-02-21","finish":"2012-02-21"}]
    */
    this.confirmCapacity = function(reservations, callback) {
        jQ.ajax({
            url: bta.base + "/availability/capacity.json",
            contentType: "application/json; charset=utf-8", dataType: "jsonp", // async:false,
            data: {"variants": JSON.stringify(reservations)},
            success: function(data) {
                jQ(data.variants).each(function(i, variant) {
                    if (callback) {
                        variant.start = bta.dateInst(variant.start);
                        variant.finish = bta.dateInst(variant.finish);
                        callback(variant, i);
                    }
                });
                bta.loaded();
            },
            error: function(xhr, status, error) {
                bta.loaded();
//                console.log([xhr, status, error]);
            }
        });
    };

    this.dayDelta = function(start, finish) {
        return Math.round(Math.abs((start.getTime() - finish.getTime())/(24*60*60*1000))); // hours*minutes*seconds*milliseconds
    };

    // look up variant capacity (uses cached data) - deprecated as at July 26/2014. No longer used by BTA but left in case any shops using it.
    this.availableCapacity = function(variantId, start, finish) {
        var date = start || new Date(),
            data = bta.cached(date),
            product = data.products[0],
            variant = bta.variant(product, variantId),
            capacity = bta.capacity(product, variant);

        if ((capacity > 0) && start && finish) {
            var min = capacity, // track capacity based on min available in the date range
                days = bta.dayDelta(start, finish);

            for (var day = 0; day < days; day++) {
                bta.checkAvailability(date, jQ('#booking-start'), {
                    availability: function(capacity, bookingCount) {
                        var available = capacity - bookingCount;
                        if (available < min) {
                            min = available;
                        }
                    }
                });

                date.setDate(date.getDate() + 1);
            }

            capacity = min;
        }

        return capacity;
    };

    this.setSelectedVariantId = function(form, id) {
        var btaForm = form.data('bta.bookingForm');
        btaForm.setSelectedVariantId(id);
    };

    // deprecated - use BookingForm now
    this.populateScheduledTimes = function(datepicker, startymd) {
        var date = datepicker.datepicker('getDate');

        if (date == null) {
            return;
        }

        new bta.BookingForm(jQ("form[action='/cart/add']:first")).loadScheduledTimes();
    };

    // populate a select with time slots based on opening hours - now deprecated use BookingForm instead
    this.populateOpeningHoursTimes = function(datepicker, date) {
        if (date == null) {
            return;
        }

        new bta.BookingForm(jQ("form[action='/cart/add']:first")).loadOpeningHours();
    };

    // deprecated - use BookingForm now
    this.updateAvailableTimeSlots = function() {
        new bta.BookingForm(jQ("form[action='/cart/add']:first")).updateSlots();
    };

    this.findSelectedVariantId = function(form) {
        return bta.variantId || jQ('input[name^=id]:checked, select[name^=id], input[name=id], hidden[name^=id]', form).val();
    };

    this.parseVariantConfigs = function(configs) {
        var variantConfigs = {}, a = configs.split(','), i;
        for (i = 0; i < a.length; i++) {
            var config = a[i].split(':');
            variantConfigs[config[0]] = config[1];
        }
        return variantConfigs;
    };

    this.cartPage = function(form) {
        var reservations = [];
        form.find("input[id*='booking']").each(function() {
             var field = jQ(this), parts = field.attr('id').split('-'), variant = parts[1];
             if (parts[2] === "start") {
                 bta.readTheCookie(variant, function(item) {
                     var sdate = new Date(item["booking-start-dateval"]),
                         s = bta.YMDDateString(sdate);

                     if (item["booking-finish"]) {
                         var fdate = new Date(item["booking-finish-dateval"]),
                             f =  bta.YMDDateString(fdate);
                     }

                     if (field.hasClass('hasDatepicker')) {
                         field.datepicker("setDate", sdate);
                     } else {
                         field.val(s);
                     }

                     end_field = bta.findFinishField(field, variant);
                     if (end_field) {
                         end_field.val(f);
                     }

                     var cvd = bta.listener("cartVariantDates");  // cartVariantDates deprecated
                     if (cvd) {
                         cvd(item);
                     }

                     reservations.push({
                         "variant": variant,
                         "start": s,
                         "finish": f
                     });
                 })
             } else if (parts[1] === "start") { // all items in cart
                 var existing = field.datepicker('option', 'onSelect');
                 field.datepicker('option', 'onSelect', function(selectedDate) {
                     jQ('#booking-finish').datepicker('option', 'minDate', selectedDate);
                     bta.updateAvailableTimeSlots(form);
                     bta.chainOnSelect(existing, field, selectedDate);
                 })
             } else if (parts[1] === "finish") { // all items in cart
                 var existing = field.datepicker('option', 'onSelect');
                 field.datepicker('option', 'onSelect', function(selectedDate) {
                     jQ('#booking-start').datepicker('option', 'maxDate', selectedDate);
                     bta.chainOnSelect(existing, field, selectedDate);
                 })
             }
         })

        var callback = bta.listener("capacity");
        if ((reservations.length > 0) && (typeof(callback) != "undefined")) {
            return bta.confirmCapacity(reservations, callback);
        }

        bta.loaded();
    };

    this.removeBooking = function(variant, booking) {
        bta.saveTheCookie(variant, {});
    };

    this.syncCart = function() {
        var cookies = [];
        if (document.cookie && document.cookie != '') {
            jQ.each(document.cookie.split(';'), function(i, cookie) {
                var name = cookie.split("=")[0];
                if (name.substring(1, 6) === "__bta") {
                    cookies.push(name);
                }
            });
        }

        if (cookies.length === 0) {
            return;
        }

        Shopify.getCart(function(cart) {
            if (cart && cart.item_count === 0) { // check if cart is empty
                jQ.each(cookies, function(i, cookie) {
                    jQ.cookie(cookie, null); // delete bta cookies if cart is empty
                });
            }

            if (document.location.href.indexOf('/cart') > -1) {
                var data = [];
                cart.attributes && jQ.each(cart.attributes, function(n, i) {
                    if (n.indexOf('booking') != -1) {
                        data.push("attributes[" + n + "]=");
                    }
                });

                if (data.length > 0) {
                    var params = {
                        type: 'POST', url: '/cart/update.js', dataType: 'json', data: data.join('&'),
                        success: function(a) {
                        }
                    };
                    jQ.ajax(params);
                }
            }
        })
    };

    this.loadAvailability = function(params, cache_key, callback) {
//        jQ('#ui-datepicker-div .ui-datepicker-title').css('background', 'url(//www.bookthatapp.com/images/ui-anim_basic_16x16.gif) left center no-repeat');

        bta.loadingCount++;

        params["format"] = "json";

        var handle = jQ(this).attr('data-handle');
        if (bta.productId || bta.product_id) {
            params["products"] = bta.productId || bta.product_id
        } else if (typeof(handle) != "undefined") {
            params["handle"] = handle;
        }

        return jQ.ajax({
            url: bta.base + "/availability",
            contentType: "application/json; charset=utf-8", dataType: "jsonp", cache: false, // async:false,
            data: params,
            success: function (data) {
                if (data.products.length > 0) {
                    jQ.each(data.products, function (n, product) {
                        jQ.each(product.bookings, function (i, booking) {
                            booking.start = bta.dateInst(booking.start);
                            booking.end = bta.dateInst(booking.end);
                            booking.handle = product.handle;
                        });

                        jQ.each(product.schedule, function (n, s) {
                            s.start = bta.dateInst(s.start);
                        });

                        jQ.each(product.variants, function (n, v) {
                            jQ.each(v.schedule, function (n, s) {
                                s.start = bta.dateInst(s.start);
                            })
                        });
                    })
                }

                var blackouts = data.blackouts.length === 0 ? [] : jQ.map(data.blackouts, function (item) {
                    return jQ.extend(item, {
                        start: bta.dateInst(item.start),
                        end: bta.dateInst(item.end)
                    });
                });

                var allocation = data.allocation.length === 0 ? [] : jQ.map(data.allocation, function (item) {
                    return jQ.extend(item, {
                        start: bta.dateInst(item.start),
                        end: bta.dateInst(item.end),
                        quantity: 1
                    });
                });

                bta.cache[cache_key] = {"products": data.products, "blackouts": blackouts, "allocation": allocation};

                jQ('.bta.hasDatepicker.openDatepicker').each(function () {
                    jQ(this).datepicker('refresh'); // undocumented method but it the only way to update it after data is refreshed
                });
                jQ('.bta.hasDatepicker').datepicker('enable'); // if input was initially disabled then enable it when availability info is there

                if (typeof callback == "function") {
                    callback(bta.cache[cache_key]);
                }

                var available = bta.listener("available");
                if (available) {
                    available(bta.cache[cache_key]);
                }

                jQ(".bta-load-enable").prop('disabled', false).removeClass('bta-load-enable').addClass('bta-loaded');

                jQ('form[action="/cart/add"], form.bta-standalone-form').each(function () {
                    var btaForm = jQ(this).data('bta.bookingForm');
                    btaForm.triggerDataLoaded(bta.cache[cache_key]);
                });

                bta.loadingCount--;
//                jQ('#ui-datepicker-div .ui-datepicker-title').removeClass('ui-autocomplete-loading');
            },
            error: function (xhr, status, error) {
//                console.log([xhr, status, error]);
                bta.cache[cache_key] = [];
                bta.loadingCount--;
//                jQ('#ui-datepicker-div .ui-datepicker-title').removeClass('ui-autocomplete-loading');
            }
        });
    };

    // responds to datepicker onChangeMonthYear
    this.availability = function(year, month, datepicker) {
        var cache_key = bta.cache_key(year, month);
        if (bta.cache[cache_key]) { // cache hit
            return;
        }

        var start = moment([year, month - 1, 1]);
        bta.rangeAvailability(start.toDate(), moment(start).add(bta.maxDuration, 'minute').toDate());
    };

    this.rangeAvailability = function(start, finish, callback) {
        var availabilityLookups = [],
            rangeStart = moment(start),
            rangeFinish = moment(finish);

        while (rangeFinish > rangeStart) {
            var cache_key = rangeStart.format('YYYY_MM');

            if (bta.cache[cache_key]) { // cache hit
                if (typeof callback == "function") {
                    callback(bta.cache[cache_key]);
                }
            } else {
                bta.preload.push(cache_key);  // keep track of the dates loaded

                var params = {
                    "format": "json",
                    "start": rangeStart.format('YYYY-MM-01'),
                    "end": moment(rangeStart).add(2, 'month').format('YYYY-MM-01')
                };

                availabilityLookups.push(bta.loadAvailability(params, cache_key));
            }

            rangeStart.add(1, 'month');
        }

        jQ.when.apply(jQ, availabilityLookups).then(function() {
            if (typeof callback == "function") {
                callback(bta.cache[bta.cache_key(start.getFullYear(), start.getMonth() + 1)])
            }
        });
    };

    this.cached = function(date) {
        return bta.cache[bta.cache_key(date)];
    };

    this.cache_key = function(year, month) {
        if (typeof year == "object") {
            month = year.getMonth() + 1
            year = year.getFullYear()
        }

        return year + "_" + bta.pad(month);
    };

    this.dateMatches = function(date, event) {
        var datematch = false;
        if (event.end) {
            var start = bta.YMDDateString(event.start).split('T')[0],
                finish = bta.YMDDateString(event.end).split('T')[0],
                compare = bta.YMDDateString(date).split('T')[0];
            datematch = ((start <= compare) && (finish >= compare));
        } else {
            datematch = ((event.start.getDate() == date.getDate()) && (event.start.getMonth() == date.getMonth()) && (event.start.getFullYear() == date.getFullYear()));
        }
        return datematch;
    };

    this.timeOverlaps = function(date, time, variant, event) {
        if (event.allDay) {
            return true;
        }

        if (time == null || typeof(time) == 'undefined') { // no timepicker so ignore time
            return true;
        }

        if (time === "") { // time is not specified so there is no overlap
            return false;
        }

        if (!variant) { // variant not defined on cart page
            return false;
        }

        if (variant.allDay) {
            return true;
        }

        // check if the time as at date falls within the event window
        var compareDateTime = new Date(date.getTime());
        bta.setTime(compareDateTime, time);

        return event.start <= compareDateTime && compareDateTime <= event.end;
    };

    this.product = function(data, handle) {
        if (data) {
            var products = jQ.grep(data.products, function(product, i) {
                return product.handle === handle;
            });

            return (products.length > 0) ? products[0] : false;
        }
    };

    this.variant = function(product, variant) {
        if (product) {
            var variants = product.variants,
                length = variants.length;

            for (var i = 0; i < length; i++) {
                if (variants[i].id == variant) {
                    return variants[i];
                }
            }
        }
    };

    /*
     Finds resource allocations on date for other products that share the same resources
     */
    this.sharedResourceAllocations = function(data, product, date) {
        var result = [];

        if (data) {
            var resources = product.resources,
                allocations = data.allocation;

            for (var x = 0; x < resources.length; x++) {
                for (var y = 0; y < allocations.length; y++) {
                    if (allocations[y].product != product.id &&
                        resources[x].id == allocations[y].resource &&
                        bta.dateMatches(date, allocations[y])) {
                        result.push(allocations[y]);
                    }
                }
            }
        }

        return result;
    };

    this.oc = function(product, variant) {
        var oc = jQ.grep(product.option_capacities, function(oc, ocn) {
            var found = false;

            if (oc.option1 != null) {
                found = (oc.option1 === variant.option1) || (oc.option1 === variant.option2) || (oc.option1 === variant.option3);
            }

            if (oc.option2 != null && found) {
                found = (oc.option2 === variant.option1) || (oc.option2 === variant.option2) || (oc.option2 === variant.option3);
            }

            if (oc.option3 != null && found) {
                found = (oc.option3 === variant.option1) || (oc.option3 === variant.option2) || (oc.option3 === variant.option3);
            }

            return found;
        });

        return (oc.length > 0) ? oc[0] : false;
    };

    // get bookings for a particular date based on product and optionally variant
    this.bookings = function(date, product, variant) {
        if (product) {
            return jQ.grep(product.bookings, function(b, n) {
                var result = bta.dateMatches(date, b);

                if (result && product.capacity_type === 1 && typeof(variant) != "undefined") {
                    result = b.variant == variant.id;
                }

                return result;
            });
        } else {
            return [];
        };
    };

    // get blackouts for a particular date based on product. Uses cached data object.
    this.blackouts = function(date, data, product) {
        return jQ.grep(data.blackouts, function(blackout, i) {
            // check blackout date
            var result = bta.dateMatches(date, blackout);

            // check product handle
            result = result && ((blackout.handle === "") || (blackout.handle === product.handle));

            return result;
        });
    };

    this.clone = function(obj) {
        var clone = {};
        for (var i in obj) {
            if (obj[i] == null) {
                clone[i] = null;
            } else if (obj[i] instanceof Date) {
                clone[i] = new Date(obj[i].getTime());
            } else if (typeof(obj[i]) == "object") {
                clone[i] = bta.clone(obj[i]);
            } else {
                clone[i] = obj[i];
            }
        }
        return clone;
    };

    this.checkAvailability = function(date, dp, callbacks) {
        var data = bta.cached(date),
            $this = dp,
            minDate = dp.datepicker('option', 'minDate'),
            today = new Date(), yesterday = new Date(),
            btaForm = $this.parents('form').data('bta.bookingForm'),
            start = btaForm.datepicker('start'),
            handle = start.attr('data-handle'),
            season = start.attr('data-season'),
            variantId = start.attr('data-variant') || start.data('variant'),
            time = start.attr('data-time'),
            duration = parseInt(start.attr('data-duration'), 10) || 0,
            config = start.attr('data-bta-product-config') || start.attr('data-bta-config'),
            leadTime = (parseInt(bta.config(config, 'lead_time'), 10) || 0) * 1440,
            lagTime = parseInt(bta.config(config, 'lag_time'), 10) || 0;

        yesterday.setDate(today.getDate() - 1);

        if (data) {
            // small optimization that checks
            // if it occurs in the past & minDate = "0"
            if (date.getTime() < yesterday.getTime()) {
                var callback = bta.listener(callbacks, "past");
                if (callback) {
                    callback();
                }
                return;
            }

            var seasonOpen = (typeof(season) != "undefined") ? bta.isSeasonOpen(date, season) : bta.isOpen(date, handle);
            if (!seasonOpen) {
                var callback = bta.listener(callbacks, "closed");
                if (callback) {
                    callback();
                }
                return;
            }


            // Add duration (in minutes) to the
            // front of existing blackouts/bookings to prevent overlapping bookings.
            if (duration >= 1440) {
                duration -= 1440;
                time = null; // ignore time if duration is >= 1 day
            }

            duration += leadTime;
            duration += lagTime;

            // find matching blackouts
            var blackouts = jQ.grep(data.blackouts, function(blackout, i) {
                var compare = bta.clone(blackout),
                    black = bta.dateMatches(date, compare);

                if (!black) return false; // different date

                if (typeof(handle) == 'undefined' && compare.handle != '') {
                    return false;
                }

                if (typeof(handle) != 'undefined') { // check handle if supplied
                    if (handle && compare.handle) {
                        black = compare.handle === handle;
                    }
                }
                if (!black) return false; // product doesn't match

                if (variantId && compare.variantId) {
                    black = compare.variantId === parseInt(variantId, 10);
                }
                if (!black) return false; // variant doesn't match

                if (compare.all_day == 1) { // don't need to worry about time if all day blackout
                    return true;
                }

                // check if a time is currently specified
                if ((typeof(time) == "string") && (time.length > 0)) {
                    var t = time.split(':');
                    if (t.length == 2) {
                        // ticket 2401 - don't modify date var because it screws up jquery ui datepicker logic (DST)
                        var compareTime = new Date(date.getTime());
                        bta.setTime(compareTime, time);
                        black = (compare.start <= compareTime && compareTime < compare.end);
                        return black;
                    }
                } else { // no date or time chosen yet (time is nil or blank)
                    return false; // assume not blacked out since there may be multiple timeslots available
                }

                return false; // no match
            });

            if (blackouts.length > 0) {
                var callback = bta.listener(callbacks, "blackedout");
                if (callback) {
                    callback();
                }
                return;
            }

            var product = bta.product(data, handle),
                variant = bta.variant(product, variantId);

            if (product) {
                var schedule = jQ.grep(product.schedule, function (s, n) {
                        return bta.dateMatches(date, s);
                    });

                // if this product is scheduled, but not on this day
                if (product.scheduled && schedule.length === 0) {
                    var callback = bta.listener(callbacks, "unscheduled");
                    if (callback) {
                        callback();
                    }
                    return;
                }

                // see if variant is scheduled - deprecated - use opening hours now
                if (variant) {
                    var variantSchedule = jQ.grep(variant.schedule, function (s, i) {
                        return bta.dateMatches(date, s);
                    });

                    if (variant.schedule.length > 0 && variantSchedule.length === 0) { // nothing scheduled
                        var callback = bta.listener(callbacks, "unscheduled");
                        if (callback) {
                            callback();
                        }
                        return;
                    }
                }

                // find bookings and resource allocations matching the date
                var bookings = bta.bookingsAt(data, product, variant, date, time, duration, function(booking) {
                    var compare = bta.clone(booking);
                    compare.start.setMinutes(compare.start.getMinutes() - duration);
                    compare.end.setMinutes(compare.end.getMinutes() + leadTime); // add time required before next booking can start

                    if (btaForm.isCountNights() && bta.dayDelta(compare.start, compare.end) > 1) {
                        compare.end.setMinutes(compare.end.getMinutes() - 1440); // subtract 1 day
                    }

                    return compare;
                });

                // figure out what capacity we have
                var capacity = bta.capacity(product, variant),
                    bookingCount = 0;

                for (var i = 0; i < bookings.length; i++) {
                    bookingCount += bookings[i].quantity;
                }

                var callback = bta.listener(callbacks, "availability");
                if (callback) {
                    callback(capacity, bookingCount);
                }
            } else {
                var callback = bta.listener(callbacks, "undetermined");
                if (callback) {
                    callback();
                }
            }
        } else { // not loaded yet
            var callback = bta.listener(callbacks, "loading");
            if (callback) {
                callback();
            }
        }
    };

    this.beforeShow = function(input, inst) {
        var dp = jQ(input);

        dp.addClass('openDatepicker').css('z-index', '100000'); // make sure datepicker appears over menus

        // handle date range behaviour
        // - min days in range
        // - max days in range
        // - restrict min/max dates to finish/start

        if (jQ('.bta-range-start:visible').length === 0) return null;
        if (jQ('.bta-range-finish:visible').length === 0) return null;

        var minDate = bta.getMinDate(dp.datepicker('option', 'minDate')),
            dateMin = minDate,
            dateMax = input.getAttribute('data-maxdate') || null,
            daysMax = parseInt(input.getAttribute('data-bta-range-days-max'), 10), // this value is already bias adjusted
            daysMin = parseInt(input.getAttribute('data-bta-range-days-min'), 10), // this value is already bias adjusted
            form = jQ(this).parents('form'),
            btaForm = form.data('bta.bookingForm'),
            partnerId = input.getAttribute('data-bta-range-partner-id'),
            partner = jQ(partnerId);

        // find partner if not specified explicitly
        if (partner.length == 0) {
            if (jQ(this).hasClass('bta-range-start')) {
                partner = jQ('.bta-range-finish', form);
            } else if (jQ(this).hasClass('bta-range-finish')) {
                partner = jQ('.bta-range-start', form);
            }
        }

        if (partner.length == 0) {
            bta.log("Error: Date range behaviour disabled (could not find partner datepickers).");
            return null;
        }

        var partnerDate = partner.datepicker('getDate');

        if (dp.hasClass('bta-range-finish') && (partnerDate != null)) { // finish date
            dateMin = partnerDate;

            // finish date should never span across existing bookings
            dateMax = btaForm.firstBookedOutDate(partnerDate);

            // calc max date if daysMax has been specified
            if (daysMax > 0) {
                var daysMaxDate = new Date(partnerDate.getFullYear(), partnerDate.getMonth(), partnerDate.getDate() + daysMax);

                // check if max date is less than existing booked out dates
                if (dateMax == null || (daysMaxDate < dateMax)) {
                    dateMax = daysMaxDate;
                }
            }

            if (daysMin > 0) {
                dateMin = new Date(partnerDate.getFullYear(), partnerDate.getMonth(), partnerDate.getDate() + daysMin);
            }
        }

        return {minDate: dateMin, maxDate: dateMax};
    };

    this.isAvailable = function(date) {
        return bta.beforeShowDay(date);
    };

    this.beforeShowDay = function(date) {
        var result = bta.chainBeforeShowDay ? bta.chainBeforeShowDay(date) : [true, ''];
        if (!result[0]) {
            return result;
        }

        var callback = bta.listener("beforeShowDay");
        if (callback) {
            result = callback(date);
            if (!result[0]) {
                return result;
            }
        }

        var input = jQ(this),
            form = input.parents('form').data('bta.bookingForm'),
            available = false,
            css = '',
            tip = '';

        bta.checkAvailability(date, input, {
            loading: function() {
                css = 'bta-loading';
                tip = 'Loading...';
            },
            past: function() {
            },
            closed: function() {
                css = 'bta-closed';
                tip = bta.settings.message_closed || 'Closed';
            },
            blackedout: function () {
                css = 'bta-blackedout';
                tip = bta.settings.message_blacked_out || 'Blacked Out';
            },
            unscheduled: function () {
                css = 'bta-unscheduled';
                tip = bta.settings.message_unscheduled || 'Unscheduled';
            },
            undetermined: function () { // happens when product or variant is not specified
                available = true;
            },
            availability: function (capacity, bookingCount) {
                if (capacity === 0) {
                    css = 'bta-unavailable';
                    tip = bta.settings.message_unavailable || 'Unavailable';
                } else if (capacity > 0 && bookingCount >= capacity) { // product is booked out
                    css = 'bta-bookedout';
                    tip = bta.settings.message_booked_out || 'Booked Out';

                    if (form) {
                        form.addBookedOutDate(date); // track booked out dates for this form
                    }
                } else {
                    available = true;

                    if (input.hasClass('bta-range-finish')) {
                        // highlight date if after start date
                        if (form.getStartDate() < date) {
                            css = 'ui-state-highlight';
                        }
                    }
                }
            }
        });

        return [available, css, tip];
    };

    this.enumSeasons = function(cb) {
        for (var n = 0; n < bta.hours.seasons.length; n++) {
            var season = bta.hours.seasons[n];
            if (!cb(season)) {
                break;
            }
        }
    };

    this.season = function(date, handle) {
        var result = null;

        bta.enumSeasons(function(season) {
            var start = bta.parseYMDDateString(season.start),
                finish = bta.parseYMDDateString(season.finish);

            start.setFullYear(date.getFullYear());
            start.setHours(0);
            start.setMinutes(0);
            finish.setFullYear(date.getFullYear());
            finish.setHours(0);
            finish.setMinutes(0);

            // date falls within the season and handle matches
//            if ((start <= date && date <= finish) && (typeof(handle) != "undefined" ? season.id === handle : true)) {
            if (start <= date && date <= finish) {
                result = season;
                return false;
            }

            return true;
        });

        if (typeof(handle) != "undefined") {
            result = bta.seasonById(handle) || result;
        }

        return result;
    };

    this.seasonById = function(id) {
        for (n = 0; n < bta.hours.seasons.length; n++) {
            var season = bta.hours.seasons[n];

            if (season.id === id) {
                return season;
            }
        }

        return null;
    };

    this.isOpen = function(date, handle) {
        if (bta.hours.enforced) {
            var season = bta.season(date, handle);

            if (season) {
                if (season.days[date.getDay()].hours.length === 0) {
                    return false;
                }
            } else {
                return false;
            }
        }

        return true;
    };

    this.isSeasonOpen = function(date, season) {
        var season = bta.seasonById(season);

        if (season) {
            // found a season
            var start = bta.parseYMDDateString(season.start),
                finish = bta.parseYMDDateString(season.finish);

            start.setFullYear(date.getFullYear());
            start.setHours(0);
            start.setMinutes(0);
            finish.setFullYear(date.getFullYear());
            finish.setHours(0);
            finish.setMinutes(0);

            // date falls within the season?
            if (start <= date && date <= finish) {
                if (season.days[date.getDay()].hours.length === 0) {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }

        return true;
    };
}).apply(bta);

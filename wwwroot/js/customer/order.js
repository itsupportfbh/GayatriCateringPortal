// ===== CUSTOMER ORDER WIZARD =====
$(function () {
    var gstRate = 0.09;
    var currentStep = 1;
    var state = {
        pax: 50,
        gstMode: 'apply',
        selectedPackage: '',
        packageName: '-',
        packagePrice: 0,
        step1View: 'packages',
        extraItems: { 'Vegetable Samosa': 1 },
        addons: { 'Table Setting': 1 },
        utensils: { 'Fork': 49 },
        details: {
            company: 'ddg',
            contact: 'dfdfd',
            email: 'fdfd',
            mobile: 'fdfdf',
            eventDate: '2026-06-30',
            mealPeriod: 'Lunch',
            postal: 'fdghh',
            location: 'fdsghj',
            notes: 'rs'
        }
    };

    var packages = [
        { id: 'veg-buffet', name: 'Vegetarian Indian Buffet', price: 18, min: 30, desc: 'Pure vegetarian buffet with North and South Indian choices.' },
        { id: 'nonveg-buffet', name: 'Non-Vegetarian Indian Buffet', price: 22, min: 30, desc: 'Popular Indian non-veg buffet with biryani, curries and dessert.' },
        { id: 'north-feast', name: 'Premium North Indian Feast', price: 28, min: 50, desc: 'Premium buffet for corporate and family functions.' },
        { id: 'banana-leaf', name: 'South Indian Banana Leaf', price: 20, min: 30, desc: 'Banana leaf style meal with South Indian classics.' },
        { id: 'hi-tea', name: 'Indian High Tea / Snacks', price: 15, min: 30, desc: 'Tea-time Indian snacks for office meetings and events.' },
        { id: 'lunch-box', name: 'Indian Corporate Lunch Box', price: 13, min: 20, desc: 'Individual packed Indian meal boxes for offices.' },
        { id: 'wedding-feast', name: 'Wedding / Special Event Indian Feast', price: 35, min: 100, desc: 'Celebration package for weddings and grand occasions.' }
    ];

    var includedChoices = {
        Starters: ['Vegetable Samosa', 'Paneer Tikka'],
        'Rice & Biryani': ['Jeera Rice'],
        'Non-Veg Curries': ['Chilli Chicken', 'Chicken Curry'],
        Dessert: ['Gulab Jamun']
    };

    var extraRows = [
        { category: 'Starters', code: 'S001', dish: 'Vegetable Samosa', type: 'Veg', price: 1.80, unit: 'tray' },
        { category: 'Starters', code: 'S002', dish: 'Paneer Tikka', type: 'Veg', price: 4.20, unit: 'tray' },
        { category: 'Starters', code: 'S003', dish: 'Gobi Manchurian', type: 'Veg', price: 3.50, unit: 'tray' },
        { category: 'Starters', code: 'S004', dish: 'Masala Vadai', type: 'Veg', price: 1.50, unit: 'tray' },
        { category: 'Starters', code: 'S005', dish: 'Chicken 65', type: 'Non-Veg', price: 4.50, unit: 'tray' },
        { category: 'Starters', code: 'S006', dish: 'Tandoori Chicken', type: 'Non-Veg', price: 5.50, unit: 'tray' },
        { category: 'Starters', code: 'S007', dish: 'Fish Cutlet', type: 'Non-Veg', price: 3.80, unit: 'tray' }
    ];

    var addonRows = [
        { name: 'Live Dosa Station', unit: 'station', price: 350 },
        { name: 'Live Chaat Counter', unit: 'station', price: 380 },
        { name: 'Live Masala Tea Counter', unit: 'station', price: 180 },
        { name: 'Banana Leaf Setup', unit: 'pax', price: 1.5 },
        { name: 'Function Hall', unit: 'event', price: 0 },
        { name: 'Buffet Set-up', unit: 'event', price: 80 },
        { name: 'Cutleries Set-up', unit: 'event', price: 0 },
        { name: 'Table Setting', unit: 'event', price: 0 },
        { name: 'LED Wall & Sound System', unit: 'event', price: 0 }
    ];

    var utensilRows = [
        { name: 'Chafing Dish', unit: 'per dish', rule: 'selected hot dishes', suggested: 7, price: 10, deposit: 20 },
        { name: 'Serving Spoon / Ladle', unit: 'per pc', rule: '2 per chafing dish', suggested: 14, price: 0, deposit: 2 },
        { name: 'Fork', unit: 'per pc', rule: 'pax + 10%', suggested: 56, price: 0.08, deposit: 0 },
        { name: 'Spoon', unit: 'per pc', rule: 'pax + 10%', suggested: 56, price: 0.08, deposit: 0 },
        { name: 'Disposable Plate', unit: 'per pc', rule: 'pax + 10%', suggested: 56, price: 0.18, deposit: 0 },
        { name: 'Cup', unit: 'per pc', rule: 'beverage pax + 10%', suggested: 56, price: 0.12, deposit: 0 },
        { name: 'Napkin', unit: 'per pc', rule: 'pax + 10%', suggested: 56, price: 0.05, deposit: 0 },
        { name: 'Buffet Table with Skirting', unit: 'per table', rule: '1 per 4 chafing dishes', suggested: 2, price: 15, deposit: 0 }
    ];

    function money(value) {
        return 'S$' + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function packageBase() {
        return state.pax * state.packagePrice;
    }

    function extraTotal() {
        return extraRows.reduce(function (sum, row) {
            return sum + ((state.extraItems[row.dish] || 0) * row.price);
        }, 0);
    }

    function addonTotal() {
        return addonRows.reduce(function (sum, row) {
            return sum + ((state.addons[row.name] || 0) * row.price);
        }, 0);
    }

    function utensilTotal() {
        return utensilRows.reduce(function (sum, row) {
            return sum + ((state.utensils[row.name] || 0) * row.price);
        }, 0);
    }

    function depositTotal() {
        return utensilRows.reduce(function (sum, row) {
            return sum + ((state.utensils[row.name] || 0) * row.deposit);
        }, 0);
    }

    function gstTotal() {
        var subtotal = packageBase() + extraTotal() + addonTotal() + utensilTotal();
        return state.gstMode === 'apply' ? subtotal * gstRate : 0;
    }

    function grandTotal() {
        return packageBase() + extraTotal() + addonTotal() + utensilTotal() + gstTotal();
    }

    function updateSummary() {
        $('#summaryPkg').text(state.packageName);
        $('#summaryPax').text(state.pax);
        $('#summaryBase').text(money(packageBase()));
        $('#summaryAdditional').text(money(extraTotal()));
        $('#summaryAddons').text(money(addonTotal()));
        $('#summaryUtensils').text(money(utensilTotal()));
        $('#summaryGst').text(money(gstTotal()));
        $('#summaryDeposit').text(money(depositTotal()));
        $('#summaryTotal').text(money(grandTotal()));
        $('#summaryBackBtn').prop('disabled', currentStep === 1);
        $('#summaryNextBtn').toggleClass('hidden', currentStep === 6);
        $('#summarySubmitBtn').toggleClass('hidden', currentStep !== 6);
    }

    function updateSteps() {
        $('.wizard-step').removeClass('active done');
        $('.wizard-step').each(function () {
            var step = parseInt($(this).data('step'), 10);
            if (step < currentStep) {
                $(this).addClass('done').find('.wizard-step-num').html('&#10003;');
            } else {
                $(this).find('.wizard-step-num').text(step);
            }
            if (step === currentStep) {
                $(this).addClass('active');
            }
        });
    }

    function renderStep() {
        updateSteps();
        if (currentStep === 1) renderStep1();
        if (currentStep === 2) renderStep2();
        if (currentStep === 3) renderStep3();
        if (currentStep === 4) renderStep4();
        if (currentStep === 5) renderStep5();
        if (currentStep === 6) renderStep6();
        updateSummary();
    }

    function renderStep1() {
        var html = '';

        if (state.step1View === 'packages') {
            html = '<div class="card order-card">' +
                '<div class="section-label">All Package Types</div>' +
                '<div class="muted" style="font-size:13px;margin-bottom:12px">Select one package to continue to Step 1 form.</div>' +
                '<div class="pkg-grid">' + packages.map(renderPackageCard).join('') + '</div>' +
                '</div>';
            $('#orderStepContent').html(html);
            return;
        }

        html = '<div class="card order-card">' +
            '<div class="section-label">Step 1 - Select Indian Package</div>' +
            '<div class="actions" style="justify-content:flex-end;margin-bottom:10px"><button class="btn btn-light btn-sm" id="btnChangePackage">Change Package</button></div>' +
            '<div class="order-fields">' +
            '<div><label>No. of Pax</label><input type="number" id="paxCount" min="1" value="' + state.pax + '"></div>' +
            '<div><label>Package Type</label><select id="packageSelect">' + packages.map(function (p) { return '<option value="' + p.id + '"' + (p.id === state.selectedPackage ? ' selected' : '') + '>' + p.name + ' - S$' + p.price + '/pax</option>'; }).join('') + '</select></div>' +
            '<div><label>GST</label><select id="gstMode"><option value="apply"' + (state.gstMode === 'apply' ? ' selected' : '') + '>Apply 9% GST</option><option value="none"' + (state.gstMode === 'none' ? ' selected' : '') + '>No GST</option></select></div>' +
            '</div>' +
            '<div class="choice-block"><div class="section-label">Package Choice Selection - ' + state.packageName.toUpperCase() + '</div>' +
            '<div class="package-value-box"><div>Package Rate<b>' + money(state.packagePrice) + ' / pax</b></div><div>No. of Pax<b>' + state.pax + '</b></div><div>Package Value<b>' + money(packageBase()) + '</b></div></div>' +
            '<div class="muted" style="font-size:13px">Choose only the dishes included in this package. Dish prices are not shown here because these selections are already covered by the package value above. Additional chargeable items with prices are in Step 2.</div>' +
            Object.keys(includedChoices).map(function (key, idx) { return renderChoiceBlock(key, includedChoices[key], idx === 0 ? 'Required: choose 2' : 'Required: choose 1'); }).join('') +
            '</div>' +
            '</div>';
        $('#orderStepContent').html(html);
    }

    function renderChoiceBlock(title, choices, requirement) {
        return '<div class="choice-block"><div class="choice-header"><div class="choice-title">' + title + '</div><div class="choice-title">' + requirement + '</div></div>' +
            choices.map(function (choice, index) {
                return '<div class="form-group"><label>Choice ' + (index + 1) + '</label><select><option selected>' + choice + '</option></select></div>';
            }).join('') + '</div>';
    }

    function renderPackageCard(pkg) {
        var selected = pkg.id === state.selectedPackage;
        return '<div class="pkg-card ' + (selected ? 'selected' : '') + '" data-package-id="' + pkg.id + '">' +
            '<div class="pkg-name">' + pkg.name + '</div>' +
            '<div class="pkg-price">S$' + pkg.price + '<span>/pax</span></div>' +
            '<div class="pkg-min">Min ' + pkg.min + ' pax</div>' +
            '<div class="pkg-desc">' + pkg.desc + '</div>' +
            '<div class="pkg-pill">' + (selected ? 'Selected package' : 'Select package to choose dishes') + '</div>' +
            '<div class="muted" style="font-size:13px;margin-bottom:16px">Dish choice dropdowns are hidden until this package is selected.</div>' +
            '<button class="btn ' + (selected ? 'btn-orange' : 'btn-primary') + ' select-package-btn">' + (selected ? 'Selected' : 'Select Package') + '</button>' +
            '</div>';
    }

    function renderStep2() {
        var html = '<div class="card order-card"><div class="section-label">Step 2 - Additional Menu Items + Qty</div><div class="muted" style="font-size:13px;margin-bottom:16px">This tab is only for extra items the customer wants in addition to the selected package. Only this tab shows item prices because these are additional chargeable items outside the package.</div>' + renderExtraTable() + '</div>';
        $('#orderStepContent').html(html);
    }

    function renderExtraTable() {
        var rows = extraRows.map(function (row) {
            var qty = state.extraItems[row.dish] || 0;
            var selected = qty > 0;
            return '<tr class="' + (selected ? 'selected-row' : '') + '">' +
                '<td><input type="checkbox" class="extra-check" data-dish="' + row.dish + '"' + (selected ? ' checked' : '') + '></td>' +
                '<td><strong>' + row.dish + '</strong><div class="muted">' + row.code + '</div></td>' +
                '<td>' + row.type + '</td>' +
                '<td class="price-cell">' + money(row.price) + '</td>' +
                '<td><input class="qty-input extra-qty" data-dish="' + row.dish + '" type="number" min="0" value="' + qty + '"></td>' +
                '<td>' + row.unit + '</td>' +
                '<td class="amount-cell">' + money(qty * row.price) + '</td></tr>';
        }).join('');
        return '<div class="data-table-card"><div class="mini-head"><div><div class="mini-head-title">Starters</div><div class="muted">Optional extra items. Selected: ' + Object.keys(state.extraItems).length + '</div></div><span class="badge badge-quotation">Additional</span></div><table class="item-table"><thead><tr><th>Select</th><th>Dish</th><th>Type</th><th>Guide Price</th><th>Qty</th><th>Unit</th><th>Amount</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
    }

    function renderStep3() {
        var html = '<div class="card order-card"><div class="section-label">Step 3 - Add-ons / Live Counters / Service</div><div class="muted" style="font-size:13px;margin-bottom:16px">Select optional items. Quantity is enabled for station/service based items.</div><div class="data-table-card"><table class="item-table"><thead><tr><th>Select</th><th>Add-on</th><th>Unit</th><th>Price</th><th>Qty</th><th>Amount</th></tr></thead><tbody>' +
            addonRows.map(function (row) {
                var qty = state.addons[row.name] || 0;
                return '<tr class="' + (qty > 0 ? 'selected-row' : '') + '"><td><input type="checkbox" class="addon-check" data-name="' + row.name + '"' + (qty > 0 ? ' checked' : '') + '></td><td><strong>' + row.name + '</strong></td><td>' + row.unit + '</td><td class="price-cell">' + (row.unit === 'pax' ? money(row.price) + '/pax' : money(row.price)) + '</td><td><input class="qty-input addon-qty" data-name="' + row.name + '" type="number" min="0" value="' + qty + '"></td><td class="amount-cell">' + money(qty * row.price) + '</td></tr>';
            }).join('') + '</tbody></table></div></div>';
        $('#orderStepContent').html(html);
    }

    function renderStep4() {
        var d = state.details;
        var html = '<div class="card order-card"><div class="section-label">Step 4 - Event and Customer Details</div><div class="form-row col2">' +
            '<div class="form-group"><label>Customer / Company Name</label><input id="detailCompany" value="' + d.company + '"></div>' +
            '<div class="form-group"><label>Contact Person</label><input id="detailContact" value="' + d.contact + '"></div>' +
            '<div class="form-group"><label>Email</label><input id="detailEmail" value="' + d.email + '"></div>' +
            '<div class="form-group"><label>Mobile / WhatsApp</label><input id="detailMobile" value="' + d.mobile + '"></div>' +
            '<div class="form-group"><label>Event Date</label><input id="detailDate" type="date" value="' + d.eventDate + '"></div>' +
            '<div class="form-group"><label>Meal Period</label><select id="detailPeriod"><option' + (d.mealPeriod === 'Lunch' ? ' selected' : '') + '>Lunch</option><option>Dinner</option><option>Breakfast</option><option>Hi-Tea</option></select></div>' +
            '<div class="form-group"><label>Postal Code / Area</label><input id="detailPostal" value="' + d.postal + '"></div>' +
            '<div class="form-group"><label>Delivery / Event Location</label><input id="detailLocation" value="' + d.location + '"></div>' +
            '</div><div class="form-group"><label>Remarks / Dietary Notes</label><textarea id="detailNotes" rows="3">' + d.notes + '</textarea></div><div class="save-row"><button class="btn btn-primary" id="saveEventBtn">Save Event Details</button></div></div>';
        $('#orderStepContent').html(html);
    }

    function renderStep5() {
        var html = '<div class="card order-card"><div class="section-label">Step 5 - Utensils, Equipment and Payment</div><div class="muted" style="font-size:13px;margin-bottom:16px">Utensil quantity can be auto-suggested from admin/kitchen configuration, then adjusted manually by Sales/Admin/Kitchen Admin.</div><div class="actions" style="margin-bottom:14px"><button class="btn btn-primary" id="suggestUtensilsBtn">Use Suggested Qty</button><button class="btn btn-light" id="clearUtensilsBtn">Clear Utensils</button><button class="btn btn-light">Admin Utensils Config</button></div><div class="data-table-card"><table class="item-table"><thead><tr><th>Item</th><th>Rule</th><th>Suggested</th><th>Qty</th><th>Price</th><th>Deposit</th><th>Amount</th></tr></thead><tbody>' +
            utensilRows.map(function (row) {
                var qty = state.utensils[row.name] || 0;
                return '<tr class="' + (qty > 0 ? 'selected-row' : '') + '"><td><strong>' + row.name + '</strong><div class="muted">' + row.unit + '</div></td><td>' + row.rule + '</td><td>' + row.suggested + '</td><td><input class="qty-input utensil-qty" data-name="' + row.name + '" type="number" min="0" value="' + qty + '"></td><td class="price-cell">' + money(row.price) + '</td><td>' + money(row.deposit) + '</td><td class="amount-cell">' + money(qty * row.price) + '</td></tr>';
            }).join('') + '</tbody></table></div></div>';
        $('#orderStepContent').html(html);
    }

    function renderStep6() {
        var html = '<div class="review-sheet"><div class="review-top"><div class="review-brand"><img class="review-logo" src="/images/logo.jpg" alt="Gayatri"><div class="review-title">Gayatri Restaurant</div><div class="review-line">UEN: 52817812A</div><div class="review-line">Email: info@gayatrirestaurant.com | Catering@gayatrirestaurant.com</div><div class="review-line">Accounts: Accounts@gayatrirestaurant.com</div><div class="review-line">Hotline: 6294 6294 | WhatsApp: 62946294</div></div><div class="review-line"><strong>Quotation Request</strong><br>Date: 03/07/2026<br>Status: Draft</div></div><div class="review-split"><div><strong>Customer</strong><div>' + state.details.company + '</div><div>' + state.details.email + '</div><div>' + state.details.mobile + '</div></div><div><strong>Event</strong><div>' + state.details.eventDate + ' ' + state.details.mealPeriod + '</div><div>' + state.details.location + '</div><div>Pax: ' + state.pax + '</div></div></div><div class="review-table-title">Package: ' + state.packageName + ' (S$' + state.packagePrice.toFixed(2) + '/pax x ' + state.pax + ' pax = ' + money(packageBase()) + ')</div><div class="review-table-title">Included Package Dish Choices</div><table class="item-table"><thead><tr><th>Category</th><th>Dish</th><th>Included Qty</th><th>Unit</th><th>Status</th></tr></thead><tbody>' +
            Object.keys(includedChoices).map(function (key) {
                return includedChoices[key].map(function (dish) {
                    return '<tr><td>' + key + '</td><td>' + dish + '</td><td>5</td><td>tray</td><td><span class="badge badge-paid">Included in Package</span></td></tr>';
                }).join('');
            }).join('') + '</tbody></table></div>';
        $('#orderStepContent').html(html);
    }

    function generateOrderNumber() {
        var datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        var randomPart = Math.floor(Math.random() * 900) + 100;
        return 'GC-' + datePart + '-' + randomPart;
    }

    function buildOrderPayload() {
        return {
            id: '',
            orderNumber: generateOrderNumber(),
            customerId: '',
            packageId: state.selectedPackage,
            mealPeriodId: state.details.mealPeriod,
            locationId: '',
            eventStartDateTime: state.details.eventDate,
            eventEndDateTime: '',
            deliveryAddress: state.details.location,
            notes: state.details.notes,
            pax: state.pax.toString(),
            packageBaseAmount: packageBase().toString(),
            additionalMenuAmount: extraTotal().toString(),
            addOnsAmount: addonTotal().toString(),
            utensilsAmount: utensilTotal().toString(),
            subTotal: grandTotal().toString(),
            discount: '0',
            deliveryFee: '0',
            taxAmount: gstTotal().toString(),
            totalAmount: grandTotal().toString(),
            taxPercentage: state.gstMode === 'apply' ? '9' : '0',
            paidAmount: '0',
            orderStatus: 'Quotation',
            createdDate: new Date().toISOString(),
            createdBy: '',
            updatedDate: null,
            updatedBy: null,
            isActive: '1',
            isDeleted: '0'
        };
    }

    function submitOrder() {
        var order = buildOrderPayload();
        $.ajax({
            url: '/Customer/Order/save',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(order),
            success: function (response) {
                if (response && response.success) {
                    showToast('Order submitted successfully');
                    setTimeout(function () {
                        window.location.href = '/Customer/MyOrders';
                    }, 1200);
                } else {
                    alert('Failed to submit order');
                }
            },
            error: function () {
                alert('Error submitting order');
            }
        });
    }

    $(document).on('click', '.wizard-step', function () {
        currentStep = parseInt($(this).data('step'), 10);
        renderStep();
    });

    $('#summaryNextBtn').on('click', function () {
        if (currentStep === 1 && state.step1View === 'packages') {
            showToast('Select a package to continue.');
            return;
        }
        if (currentStep < 6) {
            currentStep += 1;
            renderStep();
        }
    });

    $('#summaryBackBtn').on('click', function () {
        if (currentStep > 1) {
            currentStep -= 1;
            renderStep();
        }
    });

    $('#summarySubmitBtn').on('click', function () {
        submitOrder();
    });

    $('#btnResetOrder').on('click', function () {
        currentStep = 1;
        state.step1View = 'packages';
        state.selectedPackage = '';
        state.packageName = '-';
        state.packagePrice = 0;
        state.extraItems = { 'Vegetable Samosa': 1 };
        state.addons = { 'Table Setting': 1 };
        state.utensils = { 'Fork': 49 };
        renderStep();
    });

    $(document).on('click', '#btnChangePackage', function () {
        state.step1View = 'packages';
        currentStep = 1;
        renderStep();
    });

    $(document).on('change', '#paxCount', function () {
        state.pax = parseInt($(this).val(), 10) || 0;
        renderStep();
    });

    $(document).on('change', '#packageSelect', function () {
        selectPackage($(this).val());
    });

    $(document).on('change', '#gstMode', function () {
        state.gstMode = $(this).val();
        updateSummary();
    });

    $(document).on('click', '.pkg-card, .select-package-btn', function (e) {
        var card = $(e.target).closest('.pkg-card');
        if (card.length) {
            selectPackage(card.data('package-id'));
        }
    });

    function selectPackage(packageId) {
        var pkg = packages.find(function (x) { return x.id === packageId; });
        if (!pkg) return;
        state.selectedPackage = pkg.id;
        state.packageName = pkg.name;
        state.packagePrice = pkg.price;
        state.step1View = 'form';
        currentStep = 1;
        renderStep();
    }

    $(document).on('change', '.extra-check', function () {
        var dish = $(this).data('dish');
        if ($(this).is(':checked')) {
            state.extraItems[dish] = state.extraItems[dish] || 1;
        } else {
            delete state.extraItems[dish];
        }
        renderStep();
    });

    $(document).on('change', '.extra-qty', function () {
        var dish = $(this).data('dish');
        var qty = parseInt($(this).val(), 10) || 0;
        if (qty > 0) state.extraItems[dish] = qty; else delete state.extraItems[dish];
        renderStep();
    });

    $(document).on('change', '.addon-check', function () {
        var name = $(this).data('name');
        if ($(this).is(':checked')) {
            state.addons[name] = state.addons[name] || 1;
        } else {
            delete state.addons[name];
        }
        renderStep();
    });

    $(document).on('change', '.addon-qty', function () {
        var name = $(this).data('name');
        var qty = parseInt($(this).val(), 10) || 0;
        if (qty > 0) state.addons[name] = qty; else delete state.addons[name];
        renderStep();
    });

    $(document).on('change', '.utensil-qty', function () {
        var name = $(this).data('name');
        var qty = parseInt($(this).val(), 10) || 0;
        if (qty > 0) state.utensils[name] = qty; else delete state.utensils[name];
        renderStep();
    });

    $(document).on('click', '#suggestUtensilsBtn', function () {
        state.utensils = {};
        utensilRows.forEach(function (row) {
            state.utensils[row.name] = row.name === 'Fork' ? 49 : 0;
        });
        renderStep();
    });

    $(document).on('click', '#clearUtensilsBtn', function () {
        state.utensils = {};
        renderStep();
    });

    $(document).on('click', '#saveEventBtn', function () {
        state.details = {
            company: $('#detailCompany').val(),
            contact: $('#detailContact').val(),
            email: $('#detailEmail').val(),
            mobile: $('#detailMobile').val(),
            eventDate: $('#detailDate').val(),
            mealPeriod: $('#detailPeriod').val(),
            postal: $('#detailPostal').val(),
            location: $('#detailLocation').val(),
            notes: $('#detailNotes').val()
        };
        showToast('Event details saved');
    });

    renderStep();
});

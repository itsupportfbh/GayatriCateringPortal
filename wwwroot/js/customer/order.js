// ===== CUSTOMER ORDER WIZARD =====
$(function () {
    var gstRate = 0.09;
    var currentStep = 1;
    var state = {
        pax: 0,
        selectedPackage: '',
        packageName: '-',
        packagePrice: 0,
        step1View: 'packages',
        extraItems: {},
        addons: {},
        utensils: {},
        details: {
            company: '',
            contact: '',
            email: '',
            mobile: '',
            eventDate: '',
            mealPeriod: '',
            postal: '',
            location: '',
            notes: ''
        }
    };

    var packages = [];

    function loadOrderPackages() {
        $('#orderStepContent').html(
            '<div class="card order-card"><div class="muted">Loading packages...</div></div>'
        );

        $.ajax({
            url: '/Customer/Packages/get',
            type: 'GET',
            success: function (rows) {
                renderOrderPackages(rows || []);
            },
            error: function () {
                renderOrderPackages([]);
                showToast('Unable to load packages.', 3000, { type: 'error', title: 'Package load failed' });
            }
        });
    }

    function renderOrderPackages(rows) {
        rows = Array.isArray(rows) ? rows : [];
        packages = rows.filter(function (item) {
            var isActive = item.isActive ?? item.IsActive ?? false;
            var isDeleted = item.isDeleted ?? item.IsDeleted ?? false;
            return isActive && !isDeleted;
        }).map(function (item) {
            return {
                id: String(item.id ?? item.Id ?? ''),
                name: item.name ?? item.Name ?? 'Package',
                price: Number(item.price ?? item.Price ?? 0),
                min: Number(item.minPersons ?? item.MinPersons ?? 0),
                desc: item.description ?? item.Description ?? ''
            };
        }).filter(function (item) {
            return item.id !== '';
        });

        renderStep();
    }

    var includedChoices = [];
    var packageCategoriesLoading = false;

    var extraRows = [];
    var addonRows = [];
    var utensilRows = [];

    function money(value) {
        return 'S$' + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function escapeHtml(value) {
        return $('<div>').text(value ?? '').html();
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
        return subtotal * gstRate;
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
                (packages.length
                    ? '<div class="pkg-grid">' + packages.map(renderPackageCard).join('') + '</div>'
                    : '<div class="muted">No active packages are available right now.</div>') +
                '</div>';
            $('#orderStepContent').html(html);
            return;
        }

        html = '<div class="card order-card">' +
            '<div class="section-label">Step 1 - Select Indian Package</div>' +
            '<div class="actions" style="justify-content:flex-end;margin-bottom:10px"><button class="btn btn-light btn-sm" id="btnChangePackage">Change Package</button></div>' +
            '<div class="order-fields">' +
            '<div><label>No. of Pax</label><input type="number" id="paxCount" min="1" value="' + state.pax + '"></div>' +
            '<div><label>Package Type</label><input type="text" value="' + escapeHtml(state.packageName) + ' - S$' + state.packagePrice.toFixed(2) + '/pax" readonly></div>' +
            '<div><label>GST</label><input type="text" value="' + (gstRate * 100).toFixed(0) + '% GST" readonly></div>' +
            '</div>' +
            '<div class="choice-block"><div class="section-label">Package Choice Selection - ' + state.packageName.toUpperCase() + '</div>' +
            '<div class="package-value-box"><div>Package Rate<b>' + money(state.packagePrice) + ' / pax</b></div><div>No. of Pax<b>' + state.pax + '</b></div><div>Package Value<b>' + money(packageBase()) + '</b></div></div>' +
            '<div class="muted" style="font-size:13px">Choose only the dishes included in this package. Dish prices are not shown here because these selections are already covered by the package value above. Additional chargeable items with prices are in Step 2.</div>' +
            (packageCategoriesLoading
                ? '<div class="muted">Loading package categories...</div>'
                : includedChoices.length
                    ? includedChoices.map(renderChoiceBlock).join('')
                    : '<div class="muted">No categories are configured for this package.</div>') +
            '</div>' +
            '</div>';
        $('#orderStepContent').html(html);
    }

    function renderChoiceBlock(category) {
        var requiredQuantity = Number(category.requiredQuantity) || 1;
        return '<div class="choice-block"><div class="choice-header"><div class="choice-title">' + escapeHtml(category.categoryName) + '</div><div class="choice-title">Required: choose ' + requiredQuantity + '</div></div>' +
            Array.from({ length: requiredQuantity }, function (_, index) {
                return '<div class="form-group"><label>Choice ' + (index + 1) + '</label><select disabled><option selected>Menu binding pending</option></select></div>';
            }).join('') + '</div>';
    }

    function loadPackageCategories(packageId) {
        includedChoices = [];
        packageCategoriesLoading = true;
        renderStep();

        $.ajax({
            url: '/Customer/Packages/get/' + encodeURIComponent(packageId) + '/categories',
            type: 'GET',
            success: function (rows) {
                renderPackageCategories(rows || []);
            },
            error: function () {
                renderPackageCategories([]);
                showToast('Unable to load package categories.', 3000, { type: 'error', title: 'Load failed' });
            }
        });
    }

    function renderPackageCategories(rows) {
        rows = Array.isArray(rows) ? rows : [];
        includedChoices = rows.map(function (category) {
            return {
                categoryId: category.categoryId ?? category.CategoryId ?? 0,
                categoryName: category.categoryName ?? category.CategoryName ?? '',
                requiredQuantity: Number(category.requiredQuantity ?? category.RequiredQuantity ?? 1) || 1
            };
        }).filter(function (category) {
            return category.categoryId && category.categoryName;
        });

        packageCategoriesLoading = false;
        renderStep();
    }

    function renderPackageCard(pkg) {
        var selected = pkg.id === state.selectedPackage;
        return '<div class="pkg-card ' + (selected ? 'selected' : '') + '" data-package-id="' + pkg.id + '">' +
            '<div class="pkg-name">' + escapeHtml(pkg.name) + '</div>' +
            '<div class="pkg-price">S$' + pkg.price.toFixed(2) + '<span>/pax</span></div>' +
            '<div class="pkg-min">Min ' + pkg.min + ' pax</div>' +
            '<div class="pkg-desc" role="button" tabindex="0" aria-expanded="false" title="Click to show full description">' + escapeHtml(pkg.desc) + '</div>' +
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
        return '<div class="data-table-card"><div class="mini-head"><div><div class="mini-head-title">Additional Items</div><div class="muted">Optional extra items. Selected: ' + Object.keys(state.extraItems).length + '</div></div><span class="badge badge-quotation">Additional</span></div><table class="item-table"><thead><tr><th>Select</th><th>Dish</th><th>Type</th><th>Guide Price</th><th>Qty</th><th>Unit</th><th>Amount</th></tr></thead><tbody>' + (rows || '<tr><td colspan="7" class="muted">No additional items available.</td></tr>') + '</tbody></table></div>';
    }

    function renderStep3() {
        var html = '<div class="card order-card"><div class="section-label">Step 3 - Add-ons / Live Counters / Service</div><div class="muted" style="font-size:13px;margin-bottom:16px">Select optional items. Quantity is enabled for station/service based items.</div><div class="data-table-card"><table class="item-table"><thead><tr><th>Select</th><th>Add-on</th><th>Unit</th><th>Price</th><th>Qty</th><th>Amount</th></tr></thead><tbody>' +
            addonRows.map(function (row) {
                var qty = state.addons[row.name] || 0;
                return '<tr class="' + (qty > 0 ? 'selected-row' : '') + '"><td><input type="checkbox" class="addon-check" data-name="' + row.name + '"' + (qty > 0 ? ' checked' : '') + '></td><td><strong>' + row.name + '</strong></td><td>' + row.unit + '</td><td class="price-cell">' + (row.unit === 'pax' ? money(row.price) + '/pax' : money(row.price)) + '</td><td><input class="qty-input addon-qty" data-name="' + row.name + '" type="number" min="0" value="' + qty + '"></td><td class="amount-cell">' + money(qty * row.price) + '</td></tr>';
            }).join('') + (addonRows.length ? '' : '<tr><td colspan="6" class="muted">No add-ons available.</td></tr>') + '</tbody></table></div></div>';
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
            '<div class="form-group"><label>Meal Period</label><select id="detailPeriod"><option value="">Select meal period</option></select></div>' +
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
            }).join('') + (utensilRows.length ? '' : '<tr><td colspan="7" class="muted">No utensils available.</td></tr>') + '</tbody></table></div></div>';
        $('#orderStepContent').html(html);
    }

    function renderStep6() {
        var html = '<div class="review-sheet"><div class="review-top"><div class="review-brand"><div class="review-title">Order Review</div></div><div class="review-line"><strong>Quotation Request</strong><br>Date: ' + new Date().toLocaleDateString() + '<br>Status: Draft</div></div><div class="review-split"><div><strong>Customer</strong><div>' + escapeHtml(state.details.company) + '</div><div>' + escapeHtml(state.details.email) + '</div><div>' + escapeHtml(state.details.mobile) + '</div></div><div><strong>Event</strong><div>' + escapeHtml(state.details.eventDate) + ' ' + escapeHtml(state.details.mealPeriod) + '</div><div>' + escapeHtml(state.details.location) + '</div><div>Pax: ' + state.pax + '</div></div></div><div class="review-table-title">Package: ' + escapeHtml(state.packageName) + ' (S$' + state.packagePrice.toFixed(2) + '/pax x ' + state.pax + ' pax = ' + money(packageBase()) + ')</div><div class="review-table-title">Included Package Dish Choices</div><table class="item-table"><thead><tr><th>Category</th><th>Dish</th><th>Included Qty</th><th>Unit</th><th>Status</th></tr></thead><tbody>' +
            includedChoices.map(function (category) {
                return '<tr><td>' + escapeHtml(category.categoryName) + '</td><td>-</td><td>' + (Number(category.requiredQuantity) || 1) + '</td><td>choice</td><td><span class="badge badge-paid">Included in Package</span></td></tr>';
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
            id: 0,
            orderNumber: generateOrderNumber(),
            customerId: 0,
            packageId: parseInt(state.selectedPackage, 10) || null,
            mealPeriodId: null,
            locationId: null,
            eventStartDateTime: state.details.eventDate || null,
            eventEndDateTime: null,
            deliveryAddress: state.details.location,
            notes: state.details.notes,
            pax: state.pax,
            packageBaseAmount: packageBase(),
            additionalMenuAmount: extraTotal(),
            addOnsAmount: addonTotal(),
            utensilsAmount: utensilTotal(),
            subTotal: grandTotal(),
            discount: 0,
            deliveryFee: 0,
            taxAmount: gstTotal(),
            totalAmount: grandTotal(),
            taxPercentage: gstRate * 100,
            paidAmount: 0,
            orderStatus: 0,
            createdDate: new Date().toISOString(),
            createdBy: null,
            updatedDate: null,
            updatedBy: null
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
        state.pax = 0;
        state.extraItems = {};
        state.addons = {};
        state.utensils = {};
        includedChoices = [];
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

    $(document).on('click', '.pkg-card, .select-package-btn', function (e) {
        var card = $(e.target).closest('.pkg-card');
        if (card.length) {
            selectPackage(card.data('package-id'));
        }
    });

    function togglePackageDescription(description) {
        var isExpanded = description.toggleClass('expanded').hasClass('expanded');
        description.attr('aria-expanded', isExpanded);
        description.attr('title', isExpanded ? 'Click to hide full description' : 'Click to show full description');
    }

    $(document).on('click', '.pkg-desc', function (e) {
        e.stopPropagation();
        togglePackageDescription($(this));
    });

    $(document).on('keydown', '.pkg-desc', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            togglePackageDescription($(this));
        }
    });

    function selectPackage(packageId) {
        packageId = String(packageId);
        var pkg = packages.find(function (x) { return x.id === packageId; });
        if (!pkg) return;
        state.selectedPackage = pkg.id;
        state.packageName = pkg.name;
        state.packagePrice = pkg.price;
        state.pax = pkg.min;
        state.step1View = 'form';
        currentStep = 1;
        loadPackageCategories(pkg.id);
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
            state.utensils[row.name] = row.suggested || 0;
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

    loadOrderPackages();
});

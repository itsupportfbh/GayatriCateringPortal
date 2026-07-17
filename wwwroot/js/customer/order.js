// ===== CUSTOMER ORDER WIZARD =====
$(function () {
    var gstRate = 0;
    var organizationInfo = {};
    var currentStep = 1;
    var state = {
        selectedEvent: '',
        eventName: '',
        eventMinPax: 0,
        eventAdvanceBookingDays: 0,
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
            mealPeriodId: '',
            mealPeriod: '',
            postal: '',
            addressLine1: '',
            notes: ''
        }
    };

    var packages = [];
    var events = [];

    function loadOrganizationGst() {
        return $.ajax({
            url: '/Customer/Organization/gst',
            type: 'GET',
            dataType: 'json',
            success: function (organization) {
                organizationInfo = organization || {};
                var configuredRate = Number(organization?.gstRate ?? organization?.GSTRate);

                gstRate = Number.isFinite(configuredRate) && configuredRate >= 0
                    ? configuredRate / 100
                    : 0;

                renderStep();
            },
            error: function () {
                gstRate = 0;
                renderStep();
                showToast('Unable to load GST from Organization.', 3000, {
                    type: 'error',
                    title: 'GST load failed'
                });
            }
        });
    }

    function loadOrderEvents() {
        $.ajax({
            url: '/Customer/Order/events',
            type: 'GET',
            success: function (rows) {
                events = (Array.isArray(rows) ? rows : []).map(function (item) {
                    return {
                        id: String(item.id ?? item.Id ?? ''),
                        name: item.name ?? item.Name ?? 'Event',
                        minPax: Number(item.minPax ?? item.MinPax ?? 0),
                        advanceBookingDays: Number(item.advanceBookingDays ?? item.AdvanceBookingDays ?? 0)
                    };
                }).filter(function (item) { return item.id; });
                renderStep();
            },
            error: function () {
                events = [];
                renderStep();
                showToast('Unable to load events.', 3000, { type: 'error', title: 'Event load failed' });
            }
        });
    }

    function loadOrderPackages(eventId) {
        packages = [];
        renderStep();
        $.ajax({
            url: '/Customer/Order/events/' + encodeURIComponent(eventId) + '/packages',
            type: 'GET',
            success: function (rows) { renderOrderPackages(rows || []); },
            error: function () {
                renderOrderPackages([]);
                showToast('Unable to load packages for this event.', 3000, { type: 'error', title: 'Package load failed' });
            }
        });
    }

    function toBool(value, defaultValue) {
        if (value === null || value === undefined) {
            return !!defaultValue;
        }
        if (typeof value === 'boolean') {
            return value;
        }
        if (typeof value === 'number') {
            return value !== 0;
        }
        if (typeof value === 'string') {
            var normalized = value.trim().toLowerCase();
            if (normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'y') {
                return true;
            }
            if (normalized === '0' || normalized === 'false' || normalized === 'no' || normalized === 'n' || normalized === '') {
                return false;
            }
        }
        return !!value;
    }

    function renderOrderPackages(rows) {
        rows = Array.isArray(rows) ? rows : [];
        packages = rows.filter(function (item) {
            var isActive = toBool(item.isActive ?? item.IsActive, true);
            var isDeleted = toBool(item.isDeleted ?? item.IsDeleted, false);
            return isActive && !isDeleted;
        }).map(function (item) {
            return {
                id: String(item.id ?? item.Id ?? ''),
                name: item.name ?? item.Name ?? 'Package',
                price: Number(item.price ?? item.Price ?? 0),
                desc: item.description ?? item.Description ?? ''
            };
        }).filter(function (item) {
            return item.id !== '';
        });

        renderStep();
    }

    var includedChoices = [];
    var includedChoiceSelections = {};
    var packageCategoriesLoading = false;

    var extraRows = [];
    var extraGroups = [];
    var additionalMenusLoading = false;
    var additionalMenusLoaded = false;
    var addonRows = [];
    var addOnsLoading = false;
    var addOnsLoaded = false;
    var mealPeriods = [];
    var mealPeriodsLoading = false;
    var mealPeriodsLoaded = false;
    var utensilRows = [];
    var utensilsLoading = false;
    var utensilsLoaded = false;

    function money(value) {
        var amount = Number(value);
        if (!Number.isFinite(amount)) amount = 0;
        return 'S$' + amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function escapeHtml(value) {
        return $('<div>').text(value ?? '').html();
    }

    function packageBase() {
        return state.pax * state.packagePrice;
    }

    function extraTotal() {
        return extraRows.reduce(function (sum, row) {
            return sum + ((state.extraItems[row.key] || 0) * row.price);
        }, 0);
    }

    function addonTotal() {
        return addonRows.reduce(function (sum, row) {
            return sum + ((state.addons[row.key] || 0) * row.price);
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
        $('#summaryEvent').text(state.eventName || '-');
        $('#summaryPkg').text(state.packageName);
        $('#summaryPax').text(state.pax);
        $('#summaryBase').text(money(packageBase()));
        $('#summaryAdditional').text(money(extraTotal() || 0));
        $('#summaryAddons').text(money(addonTotal() || 0));
        $('#summaryUtensils').text(money(utensilTotal()));
        $('#summaryGst').text(money(gstTotal()));
        $('#summaryDeposit').text(money(depositTotal()));
        $('#summaryTotal').text(money(grandTotal()));
        $('#btnTopBack').toggleClass('hidden', currentStep === 1);
        $('#summaryNextBtn').toggleClass('hidden', currentStep === 6);
        $('#summaryQuoteBtn').toggleClass('hidden', currentStep !== 6);
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

    function showOrderLoader(show) {
        var $panel = $('#orderStepWrap .pageloaderpanel');
        $('#orderStepContent').toggleClass('hidden', show);
        $panel.toggleClass('hidden', !show);
    }

    function renderStep() {
        showOrderLoader(true);
        updateSteps();
        setTimeout(function () {
            if (currentStep === 1) renderStep1();
            if (currentStep === 2) renderStep2();
            if (currentStep === 3) renderStep3();
            if (currentStep === 4) renderStep4();
            if (currentStep === 5) renderStep5();
            if (currentStep === 6) renderStep6();
            updateSummary();
        }, 80);
    }

    function renderStep1() {
        var html = '';

        if (state.step1View === 'packages') {
            var eventOptions = events.map(function (item) {
                return '<option value="' + item.id + '"' + (item.id === state.selectedEvent ? ' selected' : '') + '>' + escapeHtml(item.name) + '</option>';
            }).join('');
            html = '<div class="card order-card">' +
                '<div class="section-label">Select Event</div>' +
                '<div class="order-fields" style="margin-bottom:18px"><div><label>Event Type</label><select id="eventType"><option value="">-- Select Event --</option>' + eventOptions + '</select></div>' +
                '<div><label>No. of Pax</label><input type="number" id="eventPaxCount" min="' + state.eventMinPax + '" value="' + (state.selectedEvent ? state.pax : '') + '"' + (state.selectedEvent ? '' : ' disabled') + '></div></div>' +
                '<div class="section-label">Available Packages</div>' +
                '<div class="muted" style="font-size:13px;margin-bottom:12px">Select an event first, then choose one of its configured packages.</div>' +
                (!state.selectedEvent
                    ? '<div class="muted">Please select an event to view packages.</div>'
                    : packages.length
                    ? '<div class="pkg-grid">' + packages.map(renderPackageCard).join('') + '</div>'
                    : '<div class="muted">No packages are configured for this event.</div>') +
                '</div>';
            showOrderLoader(false);
            $('#orderStepContent').html(html);
            return;
        }

        html = '<div class="card order-card">' +
            '<div class="section-label">Step 1 - Select Indian Package</div>' +
            '<div class="actions" style="justify-content:flex-end;margin-bottom:10px"><button class="btn btn-light btn-sm" id="btnChangePackage">Change Package</button></div>' +
            '<div class="order-fields">' +
            '<div><label>Event Type</label><input type="text" value="' + escapeHtml(state.eventName) + '" readonly></div>' +
            '<div><label>No. of Pax</label><input type="number" id="paxCount" min="' + state.eventMinPax + '" value="' + state.pax + '"></div>' +
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
        showOrderLoader(false);
        $('#orderStepContent').html(html);
    }

    function renderChoiceBlock(category) {
        var requiredQuantity = Number(category.requiredQuantity) || 1;
        var categoryId = String(category.categoryId);
        var selections = includedChoiceSelections[categoryId] || [];
        return '<div class="choice-block"><div class="choice-header"><div class="choice-title">' + escapeHtml(category.categoryName) + '</div><div class="choice-title">Required: choose ' + requiredQuantity + '</div></div>' +
            Array.from({ length: requiredQuantity }, function (_, index) {
                var selectedId = String(selections[index] || '');
                var selectedInOtherChoices = selections.filter(function (_, selectionIndex) {
                    return selectionIndex !== index;
                }).map(String);
                var selectedOptions = (category.menus || []).filter(function (menu) {
                    return selectedInOtherChoices.indexOf(String(menu.id)) === -1;
                }).map(function (menu) {
                    var menuId = String(menu.id);
                    return '<option value="' + menuId + '"' + (menuId === selectedId ? ' selected' : '') + '>' + escapeHtml(menu.name) + '</option>';
                }).join('');
                var placeholder = category.menusLoading ? 'Loading menus...' : (category.menus || []).length ? 'Select menu' : 'No menus available';
                return '<div class="form-group"><label>Choice ' + (index + 1) + '</label><select class="included-menu-select" data-category-id="' + categoryId + '" data-choice-index="' + index + '"' + ((category.menus || []).length ? '' : ' disabled') + '><option value="">' + placeholder + '</option>' + selectedOptions + '</select></div>';
            }).join('') + '</div>';
    }

    function refreshCategoryChoiceDropdowns(categoryId) {
        categoryId = String(categoryId);
        var category = includedChoices.find(function (item) {
            return String(item.categoryId) === categoryId;
        });
        if (!category) return;

        var selections = includedChoiceSelections[categoryId] || [];
        $('.included-menu-select[data-category-id="' + categoryId + '"]').each(function () {
            var $select = $(this);
            var choiceIndex = Number($select.data('choice-index'));
            var selectedId = String(selections[choiceIndex] || '');
            var selectedInOtherChoices = selections.filter(function (_, index) {
                return index !== choiceIndex;
            }).map(String);

            $select.empty().append($('<option></option>').val('').text('Select menu'));
            (category.menus || []).forEach(function (menu) {
                var menuId = String(menu.id);
                if (selectedInOtherChoices.indexOf(menuId) === -1) {
                    $select.append($('<option></option>').val(menuId).text(menu.name));
                }
            });
            $select.val(selectedId);
        });
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
                requiredQuantity: Number(category.requiredQuantity ?? category.RequiredQuantity ?? 1) || 1,
                menus: [],
                menusLoading: true
            };
        }).filter(function (category) {
            return category.categoryId && category.categoryName;
        });

        packageCategoriesLoading = false;
        renderStep();
        includedChoices.forEach(loadCategoryMenus);
    }

    function loadCategoryMenus(category) {
        $.ajax({
            url: '/Customer/Packages/categories/' + encodeURIComponent(category.categoryId) + '/menus',
            type: 'GET',
            success: function (rows) {
                category.menus = (Array.isArray(rows) ? rows : []).map(function (menu) {
                    return {
                        id: String(menu.id ?? menu.Id ?? ''),
                        name: menu.name ?? menu.Name ?? ''
                    };
                }).filter(function (menu) {
                    return menu.id && menu.name;
                });
            },
            error: function (xhr) {
                category.menus = [];
                showToast(xhr.responseJSON?.message || 'Unable to load menus for ' + category.categoryName + '.', 3000, { type: 'error', title: 'Menu load failed' });
            },
            complete: function () {
                category.menusLoading = false;
                renderStep();
            }
        });
    }

    function renderPackageCard(pkg) {
        var selected = pkg.id === state.selectedPackage;
        return '<div class="pkg-card ' + (selected ? 'selected' : '') + '" data-package-id="' + pkg.id + '">' +
            '<div class="pkg-name">' + escapeHtml(pkg.name) + '</div>' +
            '<div class="pkg-price">S$' + pkg.price.toFixed(2) + '<span>/pax</span></div>' +
            '<div class="pkg-desc" role="button" tabindex="0" aria-expanded="false" title="Click to show full description">' + escapeHtml(pkg.desc) + '</div>' +
            '<button class="btn ' + (selected ? 'btn-orange' : 'btn-primary') + ' select-package-btn">' + (selected ? 'Selected' : 'Select Package') + '</button>' +
            '</div>';
    }

    function renderStep2() {
        if (!additionalMenusLoaded && !additionalMenusLoading) {
            loadAdditionalMenus();
        }
        var html = '<div class="card order-card"><div class="section-label">Step 2 - Additional Menu Items + Qty</div><div class="muted" style="font-size:13px;margin-bottom:16px">This tab is only for extra items the customer wants in addition to the selected package. Only this tab shows item prices because these are additional chargeable items outside the package.</div>' + renderExtraTable() + '</div>';
        showOrderLoader(false);
        $('#orderStepContent').html(html);
    }

    function renderExtraTable() {
        if (additionalMenusLoading) return '<div class="muted">Loading additional menu items...</div>';
        if (!extraGroups.length) return '<div class="data-table-card"><div class="muted" style="padding:18px">No additional items available.</div></div>';

        return extraGroups.map(function (group) {
            var selectedCount = group.items.filter(function (row) { return (state.extraItems[row.key] || 0) > 0; }).length;
            var rows = group.items.map(function (row) {
                var qty = state.extraItems[row.key] || 0;
                var selected = qty > 0;
                return '<tr class="' + (selected ? 'selected-row' : '') + '">' +
                    '<td><input type="checkbox" class="extra-check" data-item-id="' + row.key + '"' + (selected ? ' checked' : '') + '></td>' +
                    '<td><strong>' + escapeHtml(row.dish) + '</strong><div class="muted">' + escapeHtml(row.code) + '</div></td>' +
                    '<td>' + escapeHtml(row.type) + '</td>' +
                    '<td class="price-cell">' + money(row.price) + '</td>' +
                    '<td><input class="qty-input extra-qty" data-item-id="' + row.key + '" type="number" min="0" value="' + qty + '"></td>' +
                    '<td>' + escapeHtml(row.unit) + '</td>' +
                    '<td class="amount-cell">' + money(qty * row.price) + '</td></tr>';
            }).join('');
            return '<div class="data-table-card" style="margin-bottom:18px"><div class="mini-head"><div><div class="mini-head-title">' + escapeHtml(group.name) + '</div><div class="muted">Optional extra items. Selected: ' + selectedCount + '</div></div><span class="badge badge-quotation">Additional</span></div><table class="item-table"><thead><tr><th>Select</th><th>Dish</th><th>Type</th><th>Guide Price</th><th>Qty</th><th>Unit</th><th>Amount</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
        }).join('');
    }

    function loadAdditionalMenus() {
        
        additionalMenusLoading = true;
        $.ajax({
            url: '/Customer/Packages/additional-menus',
            type: 'GET',
            success: function (rows) {
                extraGroups = (Array.isArray(rows) ? rows : []).map(function (group) {
                    var items = group.items ?? group.Items ?? [];
                    var categoryId = Number(group.categoryId ?? group.CategoryId ?? 0) || null;
                    return {
                        name: group.categoryName ?? group.CategoryName ?? 'Menu Items',
                        items: items.map(function (item) {
                            return {
                                key: String(item.id ?? item.Id ?? ''),
                                categoryId: categoryId,
                                code: item.code ?? item.Code ?? '',
                                dish: item.name ?? item.Name ?? '',
                                type: item.foodType ?? item.FoodType ?? '',
                                price: Number(item.price ?? item.Price ?? 0),
                                unit: item.unit ?? item.Unit ?? 'item'
                            };
                        })
                    };
                });
                extraRows = extraGroups.reduce(function (rows, group) { return rows.concat(group.items); }, []);
            },
            error: function (xhr) {
                extraGroups = [];
                extraRows = [];
                showToast(xhr.responseJSON?.message || 'Unable to load additional menu items.', 3000, { type: 'error', title: 'Load failed' });
            },
            complete: function () {
                additionalMenusLoading = false;
                additionalMenusLoaded = true;
                if (currentStep === 2) renderStep();
            }
        });
    }

    function renderStep3() {
        if (!addOnsLoaded && !addOnsLoading) {
            loadAddOns();
        }
        var html = '<div class="card order-card"><div class="section-label">Step 3 - Add-ons / Live Counters / Service</div><div class="muted" style="font-size:13px;margin-bottom:16px">Select optional items. Quantity is enabled for station/service based items.</div><div class="data-table-card"><table class="item-table"><thead><tr><th>Select</th><th>Add-on</th><th>Unit</th><th>Price</th><th>Qty</th><th>Amount</th></tr></thead><tbody>' +
            addonRows.map(function (row) {
                var qty = state.addons[row.key] || 0;
                return '<tr class="' + (qty > 0 ? 'selected-row' : '') + '"><td><input type="checkbox" class="addon-check" data-addon-id="' + row.key + '"' + (qty > 0 ? ' checked' : '') + '></td><td><strong>' + escapeHtml(row.name) + '</strong><div class="muted">' + escapeHtml(row.code) + '</div></td><td>' + escapeHtml(row.unit) + '</td><td class="price-cell">' + (row.unit.toLowerCase() === 'pax' ? money(row.price) + '/pax' : money(row.price)) + '</td><td><input class="qty-input addon-qty" data-addon-id="' + row.key + '" type="number" min="0" value="' + qty + '"></td><td class="amount-cell">' + money(qty * row.price) + '</td></tr>';
            }).join('') + (addonRows.length ? '' : '<tr><td colspan="6" class="muted">' + (addOnsLoading ? 'Loading add-ons...' : 'No add-ons available.') + '</td></tr>') + '</tbody></table></div></div>';
        showOrderLoader(false);
        $('#orderStepContent').html(html);
    }

    function loadAddOns() {
        addOnsLoading = true;
        $.ajax({
            url: '/Customer/Order/addons',
            type: 'GET',
            success: function (rows) {
                addonRows = (Array.isArray(rows) ? rows : []).map(function (item) {
                    return {
                        key: String(item.id ?? item.Id ?? ''),
                        code: item.code ?? item.Code ?? '',
                        name: item.addOnName ?? item.AddOnName ?? '',
                        unit: item.unitType ?? item.UnitType ?? 'item',
                        price: Number(item.rate ?? item.Rate ?? 0)
                    };
                }).filter(function (item) {
                    return item.key && item.name;
                });
            },
            error: function (xhr) {
                addonRows = [];
                showToast(xhr.responseJSON?.message || 'Unable to load add-ons.', 3000, { type: 'error', title: 'Load failed' });
            },
            complete: function () {
                addOnsLoading = false;
                addOnsLoaded = true;
                if (currentStep === 3) renderStep();
            }
        });
    }

    function renderStep4() {
        if (!mealPeriodsLoaded && !mealPeriodsLoading) {
            loadMealPeriods();
        }
        var d = state.details;
        var mealPeriodOptions = mealPeriods.map(function (period) {
            return '<option value="' + period.id + '"' + (String(d.mealPeriodId) === period.id ? ' selected' : '') + '>' + escapeHtml(period.name) + '</option>';
        }).join('');
        var mealPeriodPlaceholder = mealPeriodsLoading ? 'Loading meal periods...' : (mealPeriods.length ? 'Select meal period' : 'No meal periods available');
        var html = '<div class="card order-card"><div class="section-label">Step 4 - Event and Customer Details</div><div class="form-row col2">' +
            '<div class="form-group"><label>Customer / Company Name <span class="field-required">*</span></label><input id="detailCompany" class="form-control" value="' + d.company + '"><div class="field-error hidden" id="detailCompanyError"></div></div>' +
            '<div class="form-group"><label>Contact Person <span class="field-required">*</span></label><input id="detailContact" class="form-control" value="' + d.contact + '"><div class="field-error hidden" id="detailContactError"></div></div>' +
            '<div class="form-group"><label>Email</label><input id="detailEmail" class="form-control" value="' + d.email + '"><div class="field-error hidden" id="detailEmailError"></div></div>' +
            '<div class="form-group"><label>Mobile / WhatsApp <span class="field-required">*</span></label><input id="detailMobile" class="form-control" value="' + d.mobile + '"><div class="field-error hidden" id="detailMobileError"></div></div>' +
            '<div class="form-group"><label>Event Date <span class="field-required">*</span></label><input id="detailDate" class="form-control" type="date" min="' + getMinimumEventDate() + '" value="' + d.eventDate + '"><div class="muted" style="font-size:12px;margin-top:5px">Book at least ' + state.eventAdvanceBookingDays + ' day(s) in advance.</div><div class="field-error hidden" id="detailDateError"></div></div>' +
            '<div class="form-group"><label>Meal Period <span class="field-required">*</span></label><select id="detailPeriod" class="form-control"' + (mealPeriods.length ? '' : ' disabled') + '><option value="">' + mealPeriodPlaceholder + '</option>' + mealPeriodOptions + '</select><div class="field-error hidden" id="detailPeriodError"></div></div>' +
            '<div class="form-group event-address-field"><label for="detailAddressLine1">Address Line 1 <span class="field-required">*</span></label><input type="text" class="form-control" id="detailAddressLine1" name="AddressLine1" autocomplete="address-line1" placeholder="Enter address line 1" value="' + escapeHtml(d.addressLine1 || '') + '"><div class="field-error hidden" id="detailAddressLine1Error"></div></div>' +
            '<div class="form-group"><label>Postal Code </label><input id="detailPostal" value="' + d.postal + '"></div>' +
            '</div><div class="form-group"><label>Notes</label><textarea id="detailNotes" rows="3">' + d.notes + '</textarea></div></div>';
        showOrderLoader(false);
        $('#orderStepContent').html(html);
    }

    function getMinimumEventDate() {
        var date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + Math.max(0, Number(state.eventAdvanceBookingDays) || 0));
        var year = date.getFullYear();
        var month = String(date.getMonth() + 1).padStart(2, '0');
        var day = String(date.getDate()).padStart(2, '0');
        return year + '-' + month + '-' + day;
    }

    function loadMealPeriods() {
        mealPeriodsLoading = true;
        $.ajax({
            url: '/Customer/Order/meal-periods',
            type: 'GET',
            success: function (rows) {
                mealPeriods = (Array.isArray(rows) ? rows : []).filter(function (item) {
                    var isActive = toBool(item.isActive ?? item.IsActive, true);
                    var isDeleted = toBool(item.isDeleted ?? item.IsDeleted, false);
                    return isActive && !isDeleted;
                }).sort(function (left, right) {
                    return Number(left.displayOrder ?? left.DisplayOrder ?? 0) - Number(right.displayOrder ?? right.DisplayOrder ?? 0);
                }).map(function (item) {
                    return {
                        id: String(item.id ?? item.Id ?? ''),
                        name: item.mealPeriodName ?? item.MealPeriodName ?? ''
                    };
                }).filter(function (item) {
                    return item.id && item.name;
                });
            },
            error: function (xhr) {
                mealPeriods = [];
                var message = xhr.responseJSON?.detail || xhr.responseJSON?.message || 'Unable to load meal periods.';
                showToast(message, 4000, { type: 'error', title: 'Meal period load failed' });
            },
            complete: function () {
                mealPeriodsLoading = false;
                mealPeriodsLoaded = true;
                if (currentStep === 4) renderStep();
            }
        });
    }

    function renderStep5() {
        if (!utensilsLoaded && !utensilsLoading) {
            loadOrderUtensils();
        }
        var html = '<div class="card order-card"><div class="section-label">Step 5 - Utensils, Equipment and Payment</div><div class="muted" style="font-size:13px;margin-bottom:16px">Utensil quantity can be auto-suggested from admin/kitchen configuration, then adjusted manually by Sales/Admin/Kitchen Admin.</div><div class="actions" style="margin-bottom:14px"><button class="btn btn-primary" id="suggestUtensilsBtn">Use Suggested Qty</button><button class="btn btn-light" id="clearUtensilsBtn">Clear Utensils</button></div><div class="data-table-card"><table class="item-table"><thead><tr><th>Item</th><th>Suggested</th><th>Qty</th><th>Price</th><th>Deposit</th><th>Amount</th></tr></thead><tbody>' +
            (utensilsLoading
                ? '<tr><td colspan="6" class="muted">Loading utensils...</td></tr>'
                : utensilRows.map(function (row) {
                row.suggested = calculateUtensilSuggestedQty(row);
                var qty = state.utensils[row.name] || 0;
                return '<tr class="' + (qty > 0 ? 'selected-row' : '') + '"><td><strong>' + row.name + '</strong><div class="muted">' + row.unit + '</div></td><td>' + row.suggested + '</td><td><input class="qty-input utensil-qty" data-id="' + row.id + '" data-name="' + row.name + '" type="number" min="0" max="' + row.suggested + '" step="1" value="' + qty + '"></td><td class="price-cell">' + money(row.price) + '</td><td>' + money(row.deposit) + '</td><td class="amount-cell">' + money(qty * row.price) + '</td></tr>';
            }).join('') + (utensilRows.length ? '' : '<tr><td colspan="6" class="muted">No utensils available.</td></tr>')) + '</tbody></table></div></div>';
        showOrderLoader(false);
        $('#orderStepContent').html(html);
    }

    function calculateUtensilSuggestedQty(row, calculatingIds) {

       
        calculatingIds = calculatingIds || {};

        if (calculatingIds[row.id]) {
            return Math.max(0, Number(row.minimumQty) || 0);
        }

        calculatingIds[row.id] = true;

        var baseQty = Number(state.pax) || 0;
        var ruleType = String(row.ruleType || 'PAX').trim().toUpperCase();
        var operator = String(row.ruleOperator || 'SAME').trim().toUpperCase();
        var ruleValue = Number(row.ruleValue) || 0;
        var rulePercentage = Number(row.rulePercentage) || 0;

        if (ruleType === 'CHAFING_DISH_QTY') {
            var chafingDish = utensilRows.find(function (item) {
                return item.id !== row.id &&
                    String(item.ruleType || '').trim().toUpperCase() === 'PAX' &&
                    String(item.name || '').trim().toUpperCase().includes('CHAFING');
            });

            baseQty = chafingDish
                ? calculateUtensilSuggestedQty(chafingDish, calculatingIds)
                : 0;
        }

        var suggested;
        switch (operator) {
            case 'ADD':
                suggested = baseQty + ruleValue;
                break;
            case 'MULTIPLY':
                suggested = baseQty * ruleValue;
                break;
            case 'DIVIDE':
                suggested = ruleValue > 0 ? baseQty / ruleValue : 0;
                break;
            case 'PERCENTAGE':
                suggested = baseQty + (baseQty * rulePercentage / 100);
                break;
            case 'FIXED':
                suggested = ruleValue;
                break;
            case 'SAME':
            default:
                suggested = baseQty;
                break;
        }

        delete calculatingIds[row.id];

        suggested = Number.isFinite(suggested) ? Math.ceil(suggested) : 0;
        return Math.max(suggested, Number(row.minimumQty) || 0, 0);
    }

    function loadOrderUtensils() {
      
        utensilsLoading = true;
        $.ajax({
            url: '/Customer/Order/utensils',
            type: 'GET',
            dataType: 'json',
            success: function (rows) {
                utensilRows = (Array.isArray(rows) ? rows : []).filter(function (item) {
                    var isActive = toBool(item.isActive ?? item.IsActive, true);
                    var isDeleted = toBool(item.isDeleted ?? item.IsDeleted, false);
                    return isActive && !isDeleted;
                }).map(function (item) {
                    var ruleType = String(item.ruleType ?? item.RuleType ?? 'PAX').trim().toUpperCase();
                    var ruleOperator = String(item.ruleOperator ?? item.RuleOperator ?? 'SAME').trim().toUpperCase();
                    var ruleValue = Number(item.ruleValue ?? item.RuleValue ?? 0);
                    var rulePercentage = Number(item.rulePercentage ?? item.RulePercentage ?? 0);
                    var minimumQty = Number(item.minimumQty ?? item.MinimumQty ?? 0);
                    return {
                        id: String(item.id ?? item.Id ?? ''),
                        name: item.utensilName ?? item.UtensilName ?? '',
                        unit: 'per pc',
                        ruleType: ruleType,
                        ruleOperator: ruleOperator,
                        ruleValue: ruleValue,
                        rulePercentage: rulePercentage,
                        minimumQty: minimumQty,
                        ruleLabel: item.ruleDescription ?? item.RuleDescription ?? 'Manual',
                        suggested: 0,
                        price: Number(item.price ?? item.Price ?? 0),
                        deposit: Number(item.depositAmount ?? item.DepositAmount ?? 0)
                    };
                }).filter(function (item) {
                    return item.id && item.name;
                });
            },
            error: function (xhr) {
                utensilRows = [];
                var response = xhr && xhr.responseJSON ? xhr.responseJSON : {};
                showToast(response.detail || response.message || 'Unable to load utensils.', 3000, { type: 'error', title: 'Load failed' });
            },
            complete: function () {
                utensilsLoading = false;
                utensilsLoaded = true;
                if (currentStep === 5) renderStep();
            }
        });
    }

    function renderStep6() {
        var includedRows = [];
        includedChoices.forEach(function (category) {
            var selections = includedChoiceSelections[String(category.categoryId)] || [];
            var requiredQuantity = Number(category.requiredQuantity) || 1;
            for (var index = 0; index < requiredQuantity; index++) {
                var selectedId = String(selections[index] || '');
                var selectedMenu = (category.menus || []).find(function (menu) {
                    return String(menu.id) === selectedId;
                });
                includedRows.push('<tr><td>' + escapeHtml(category.categoryName) + '</td><td>' +
                    escapeHtml(selectedMenu ? selectedMenu.name : 'Not selected') + '</td><td>1</td><td>choice</td><td>' +
                    (selectedMenu ? '<span class="badge badge-paid">Included</span>' : '<span class="badge badge-quotation">Pending</span>') +
                    '</td></tr>');
            }
        });

        var extraReviewRows = extraRows.filter(function (row) {
            return (state.extraItems[row.key] || 0) > 0;
        }).map(function (row) {
            var qty = state.extraItems[row.key] || 0;
            return '<tr><td>' + escapeHtml(row.dish) + '</td><td>' + escapeHtml(row.type) + '</td><td>' + qty +
                '</td><td>' + escapeHtml(row.unit) + '</td><td>' + money(row.price) + '</td><td>' + money(qty * row.price) + '</td></tr>';
        }).join('');

        var addonReviewRows = addonRows.filter(function (row) {
            return (state.addons[row.key] || 0) > 0;
        }).map(function (row) {
            var qty = state.addons[row.key] || 0;
            return '<tr><td>' + escapeHtml(row.name) + '</td><td>' + escapeHtml(row.unit) + '</td><td>' + qty +
                '</td><td>' + money(row.price) + '</td><td>' + money(qty * row.price) + '</td></tr>';
        }).join('');

        var utensilReviewRows = utensilRows.filter(function (row) {
            return (state.utensils[row.name] || 0) > 0;
        }).map(function (row) {
            var qty = state.utensils[row.name] || 0;
            return '<tr><td>' + escapeHtml(row.name) + '</td><td>' + qty +
                '</td><td>' + money(row.price) + '</td><td>' + money(row.deposit) + '</td><td>' + money(qty * row.price) + '</td></tr>';
        }).join('');

        var organizationName = organizationInfo.name ?? organizationInfo.Name ?? 'Gayatri Restaurant';
        var organizationUen = organizationInfo.uen ?? organizationInfo.UEN ?? '-';
        var organizationEmail = organizationInfo.email ?? organizationInfo.Email ?? '-';
        var organizationHotline = organizationInfo.hotline ?? organizationInfo.Hotline ?? '-';
        var organizationWhatsapp = organizationInfo.whatsapp ?? organizationInfo.Whatsapp ?? '-';

        var html = '<div class="review-sheet report-review" id="orderReviewReport">' +
            '<div class="review-top"><div class="review-brand"><img class="review-logo" src="/images/logo.jpg" alt="' + escapeHtml(organizationName) + ' logo"><div><div class="review-title">' + escapeHtml(organizationName) + '</div><div class="review-company-details">UEN: ' + escapeHtml(organizationUen) + '<br>Email: ' + escapeHtml(organizationEmail) + '<br>Hotline: ' + escapeHtml(organizationHotline) + ' &nbsp;|&nbsp; WhatsApp: ' + escapeHtml(organizationWhatsapp) + '</div></div></div><div class="review-line"><strong>Quotation Request</strong><br>Date: ' + new Date().toLocaleDateString('en-SG') + '<br>Status: Draft</div></div>' +
            '<div class="review-split"><div><strong>Customer</strong><div>Name : ' + escapeHtml(state.details.company || '-') + '</div><div>Contact: ' + escapeHtml(state.details.contact || '-') + '</div><div>Email: ' + escapeHtml(state.details.email || '-') + '</div><div>Mobile: ' + escapeHtml(state.details.mobile || '-') + '</div></div>' +
            '<div><strong>Event</strong><div>Type: ' + escapeHtml(state.eventName || '-') + '</div><div>Date: ' + escapeHtml(state.details.eventDate || '-') + '</div><div>Meal Period: ' + escapeHtml(state.details.mealPeriod || '-') + '</div><div>Pax: ' + state.pax + '</div><div>Address: ' + escapeHtml(buildDeliveryAddress() || '-') + '</div><div>Notes: ' + escapeHtml(state.details.notes || '-') + '</div></div></div>' +
            '<section class="review-section"><div class="review-table-title">Package Details</div><div class="review-table-wrap"><table class="item-table review-table"><thead><tr><th>Package</th><th>Rate</th><th>Pax</th><th>Amount</th></tr></thead><tbody><tr><td>' + escapeHtml(state.packageName) + '</td><td>' + money(state.packagePrice) + '/pax</td><td>' + state.pax + '</td><td>' + money(packageBase()) + '</td></tr></tbody></table></div></section>' +
            '<section class="review-section"><div class="review-table-title">Included Package Dish Choices</div><div class="review-table-wrap"><table class="item-table review-table"><thead><tr><th>Category</th><th>Dish</th><th>Included Qty</th><th>Unit</th><th>Status</th></tr></thead><tbody>' + (includedRows.join('') || '<tr><td colspan="5" class="muted">No package dishes selected.</td></tr>') + '</tbody></table></div></section>' +
            '<section class="review-section"><div class="review-table-title">Additional Chargeable Menu Items</div><div class="review-table-wrap"><table class="item-table review-table"><thead><tr><th>Item</th><th>Type</th><th>Qty</th><th>Unit</th><th>Unit Price</th><th>Amount</th></tr></thead><tbody>' + (extraReviewRows || '<tr><td colspan="6" class="muted">No additional menu items selected.</td></tr>') + '</tbody></table></div></section>' +
            '<section class="review-section"><div class="review-table-title">Add-ons</div><div class="review-table-wrap"><table class="item-table review-table"><thead><tr><th>Add-on</th><th>Unit</th><th>Qty</th><th>Price</th><th>Amount</th></tr></thead><tbody>' + (addonReviewRows || '<tr><td colspan="5" class="muted">No add-ons selected.</td></tr>') + '</tbody></table></div></section>' +
            '<section class="review-section"><div class="review-table-title">Utensils / Equipment</div><div class="review-table-wrap"><table class="item-table review-table"><thead><tr><th>Item</th><th>Qty</th><th>Rental</th><th>Deposit</th><th>Amount</th></tr></thead><tbody>' + (utensilReviewRows || '<tr><td colspan="5" class="muted">No utensils selected.</td></tr>') + '</tbody></table></div></section>' +
            '<section class="review-section review-payment-section"><div class="review-table-title">Payment Summary</div><div class="review-table-wrap"><table class="item-table review-table review-payment-table"><tbody><tr><td>Package Base</td><td>' + money(packageBase()) + '</td></tr><tr><td>Additional Menu</td><td>' + money(extraTotal()) + '</td></tr><tr><td>Add-ons</td><td>' + money(addonTotal()) + '</td></tr><tr><td>Utensils / Setup</td><td>' + money(utensilTotal()) + '</td></tr><tr><td>GST (' + (gstRate * 100).toFixed(0) + '%)</td><td>' + money(gstTotal()) + '</td></tr><tr><td>Refundable Deposit</td><td>' + money(depositTotal()) + '</td></tr><tr class="review-grand-total"><td>Total</td><td>' + money(grandTotal()) + '</td></tr></tbody></table></div></section></div>';
        showOrderLoader(false);
        $('#orderStepContent').html(html);
    }

    function generateOrderNumber() {
        var datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        var randomPart = Math.floor(Math.random() * 900) + 100;
        return 'GC-' + datePart + '-' + randomPart;
    }

    function buildDeliveryAddress() {
        return [state.details.addressLine1, state.details.postal]
            .filter(function (part) { return part && part.trim(); })
            .join(', ');
    }

    function buildOrderPayload() {
        var customerName = String(state.details.company || state.details.contact || '').trim();
        var customerMobile = String(state.details.mobile || '').trim();
        var order = {
            id: 0,
            orderNumber: generateOrderNumber(),
            customerId: 0,
            packageId: parseInt(state.selectedPackage, 10) || null,
            mealPeriodId: parseInt(state.details.mealPeriodId, 10) || null,
            locationId: null,
            eventDate: state.details.eventDate || null,
            deliveryAddress: buildDeliveryAddress(),
            notes: state.details.notes,
            pax: state.pax,
            packageBaseAmount: packageBase(),
            additionalMenuAmount: extraTotal(),
            addOnsAmount: addonTotal(),
            utensilsAmount: utensilTotal(),
            subTotal: packageBase() + extraTotal() + addonTotal() + utensilTotal(),
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

        var packageDetails = [];
        includedChoices.forEach(function (category) {
            var selections = includedChoiceSelections[String(category.categoryId)] || [];
            selections.forEach(function (menuId) {
                var parsedMenuId = parseInt(menuId, 10) || 0;
                if (parsedMenuId) {
                    packageDetails.push({
                        categoryId: parseInt(category.categoryId, 10) || null,
                        menuId: parsedMenuId,
                        isActive: true,
                        isDeleted: false
                    });
                }
            });
        });

        var extraItems = extraRows.filter(function (row) {
            return (state.extraItems[row.key] || 0) > 0;
        }).map(function (row) {
            var qty = state.extraItems[row.key] || 0;
            return {
                categoryId: row.categoryId,
                menuId: parseInt(row.key, 10) || null,
                qty: qty,
                unitPrice: row.price,
                totalAmount: qty * row.price,
                isActive: true,
                isDeleted: false
            };
        });

        var addOns = addonRows.filter(function (row) {
            return (state.addons[row.key] || 0) > 0;
        }).map(function (row) {
            var qty = state.addons[row.key] || 0;
            return {
                addOnsId: parseInt(row.key, 10) || 0,
                qty: qty,
                unitPrice: row.price,
                totalAmount: qty * row.price,
                isActive: true,
                isDeleted: false
            };
        });

        var utensils = utensilRows.filter(function (row) {
            return (state.utensils[row.name] || 0) > 0;
        }).map(function (row) {
            var qty = state.utensils[row.name] || 0;
            return {
                utensilsId: parseInt(row.id, 10) || 0,
                qty: qty,
                unitPrice: row.price,
                totalAmount: qty * row.price,
                refundableDeposit: qty * row.deposit,
                isActive: true,
                isDeleted: false
            };
        });

        return {
            customer: {
                id: 0,
                name: customerName,
                mobileNo: customerMobile,
                emailId: state.details.email || null,
                address: buildDeliveryAddress() || null,
                pincode: state.details.postal || null,
                remarks: state.details.notes || null,
                isActive: true,
                isDeleted: false
            },
            order: order,
            event: {
                eventStartDate: state.details.eventDate || null,
                eventEndDate: null,
                addressLine1: state.details.addressLine1 || null,
                notes: state.details.notes || null,
                mealPeriodId: parseInt(state.details.mealPeriodId, 10) || null,
                isActive: true,
                isDeleted: false
            },
            packageDetails: packageDetails,
            extraItems: extraItems,
            addOns: addOns,
            utensils: utensils
        };
    }

    function submitOrder() {
        var request = buildOrderPayload();
        if (!validateStep(4, true)) {
            currentStep = 4;
            renderStep();
            return;
        }

        $.ajax({
            url: '/Customer/Order/save',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(request),
            success: function (response) {
                if (response && response.success) {
                    var orderId = parseInt(response.id, 10) || 0;
                    showToast('Order details saved successfully. Please complete payment.', 3000, { type: 'success', title: 'Saved' });
                    loadUpiAndOpenPayment(orderId);
                } else {
                    showToast('Failed to submit order details.', 4000, { type: 'error', title: 'Submit failed' });
                }
            },
            error: function (xhr) {
                showToast(xhr.responseJSON?.message || 'Error submitting order.', 4000, { type: 'error', title: 'Submit failed' });
            }
        });
    }

    function closePaymentModal() {
        $('#paymentModal').addClass('hidden');
        $('#paymentQrImage').attr('src', '');
    }

    function openPaymentModal(orderId, upiId) {
        var amount = grandTotal();
        var payeeName = String(organizationInfo.name ?? organizationInfo.Name ?? 'Gayatri Catering');
        var upiUri = 'upi://pay?pa=' + encodeURIComponent(upiId) +
            '&pn=' + encodeURIComponent(payeeName) +
            '&tn=' + encodeURIComponent('Order ' + orderId) +
            '&am=' + amount.toFixed(2) + '&cu=INR';
        var qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent(upiUri);
        $('#paymentAmountText').text('Amount: ' + money(amount));
        $('#paymentUpiText').text('UPI ID: ' + upiId);
        $('#paymentQrImage').attr('src', qrUrl);
        $('#paymentModal').removeClass('hidden');
    }

    function loadUpiAndOpenPayment(orderId) {
        var upiId = String(organizationInfo.upiId ?? organizationInfo.UPIId ?? '').trim();
        if (upiId) {
            openPaymentModal(orderId, upiId);
            return;
        }
        $.ajax({
            url: '/Admin/Settings/get',
            type: 'GET',
            success: function (rows) {
                var data = Array.isArray(rows) && rows.length ? rows[0] : {};
                var settingsUpi = String(data.upiId ?? data.UPIId ?? '').trim();
                if (!settingsUpi) {
                    showToast('UPI Id is not configured. Please contact support.', 4000, { type: 'error', title: 'Payment unavailable' });
                    return;
                }
                openPaymentModal(orderId, settingsUpi);
            },
            error: function () {
                showToast('Unable to load UPI Id for payment.', 4000, { type: 'error', title: 'Payment unavailable' });
            }
        });
    }

    $(document).on('click', '.wizard-step', function () {
        var nextStep = parseInt($(this).data('step'), 10);
        if (!canMoveToStep(nextStep, true)) {
            return;
        }
        currentStep = nextStep;
        renderStep();
    });

    $('#summaryNextBtn').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (!canMoveToStep(currentStep + 1, true)) {
            return;
        }
        if (currentStep < 6) {
            currentStep += 1;
            renderStep();
        }
    });

    $('#btnTopBack').on('click', function () {
        if (currentStep > 1) {
            currentStep -= 1;
            renderStep();
        }
    });

    $('#summaryQuoteBtn').on('click', function (e) {
        e.preventDefault();
        showToast('Quotation request sent successfully.', 2600, { type: 'success', title: 'Quotation sent' });
    });

    $('#summarySubmitBtn').on('click', function (e) {
        e.preventDefault();
        submitOrder();
    });

    $('#btnClosePayment, #btnPaymentCancel').on('click', function () {
        closePaymentModal();
    });

    $('#btnPaymentDone').on('click', function () {
        closePaymentModal();
        showToast('Payment confirmed. Thank you!', 3000, { type: 'success', title: 'Payment confirmed' });
    });

    $('#paymentModal').on('click', function (e) {
        if (e.target === this) {
            closePaymentModal();
        }
    });

    $('#btnResetOrder').on('click', function () {
        closePaymentModal();
        currentStep = 1;
        state.step1View = 'packages';
        state.selectedEvent = '';
        state.eventName = '';
        state.eventMinPax = 0;
        state.eventAdvanceBookingDays = 0;
        state.selectedPackage = '';
        state.packageName = '-';
        state.packagePrice = 0;
        state.pax = 0;
        state.extraItems = {};
        state.addons = {};
        state.utensils = {};
        includedChoices = [];
        includedChoiceSelections = {};
        renderStep();
    });

    $(document).on('click', '#btnChangePackage', function () {
        state.step1View = 'packages';
        currentStep = 1;
        renderStep();
    });

    $(document).on('change', '#eventType', function () {
        var eventId = String($(this).val() || '');
        var selectedEvent = events.find(function (item) { return item.id === eventId; });
        state.selectedEvent = selectedEvent ? selectedEvent.id : '';
        state.eventName = selectedEvent ? selectedEvent.name : '';
        state.eventMinPax = selectedEvent ? selectedEvent.minPax : 0;
        state.eventAdvanceBookingDays = selectedEvent ? selectedEvent.advanceBookingDays : 0;
        state.selectedPackage = '';
        state.packageName = '-';
        state.packagePrice = 0;
        state.pax = Math.max(parseInt(state.pax, 10) || 0, state.eventMinPax);
        packages = [];
        includedChoices = [];
        includedChoiceSelections = {};
        if (state.selectedEvent) loadOrderPackages(state.selectedEvent);
        else renderStep();
    });

    $(document).on('input', '#eventPaxCount', function () {
        var enteredPax = parseInt($(this).val(), 10) || 0;
        if (enteredPax >= state.eventMinPax) {
            state.pax = enteredPax;
            updateSummary();
        }
    });

    $(document).on('change', '#eventPaxCount', function () {
        var enteredPax = parseInt($(this).val(), 10) || 0;
        if (enteredPax < state.eventMinPax) {
            enteredPax = state.eventMinPax;
            $(this).val(enteredPax);
            showToast('Pax cannot be less than the event minimum of ' + state.eventMinPax + '.', 2500, {
                type: 'warning',
                title: 'Minimum pax'
            });
        }
        state.pax = enteredPax;
        updateSummary();
    });

    $(document).on('change', '#paxCount', function () {
        var enteredPax = parseInt($(this).val(), 10) || 0;
        if (enteredPax < state.eventMinPax) {
            enteredPax = state.eventMinPax;
            showToast('Pax cannot be less than the event minimum of ' + state.eventMinPax + '.', 2500, {
                type: 'warning', title: 'Minimum pax'
            });
        }
        state.pax = enteredPax;
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
        state.pax = Math.max(parseInt(state.pax, 10) || 0, state.eventMinPax);
        state.step1View = 'form';
        currentStep = 1;
        includedChoiceSelections = {};
        loadPackageCategories(pkg.id);
    }

    function setFieldError(inputSelector, errorSelector, message) {
        var $input = $(inputSelector);
        var $error = $(errorSelector);
        $input.addClass('input-error');
        $error.removeClass('hidden').text(message || 'Required');
    }

    function clearFieldError(inputSelector, errorSelector) {
        $(inputSelector).removeClass('input-error');
        $(errorSelector).addClass('hidden').text('');
    }

    function validateStep1(showFeedback) {
        if (!state.selectedEvent) {
            if (showFeedback) showToast('Select an event to continue.', 3000, { type: 'error', title: 'Validation' });
            return false;
        }
        if (state.step1View === 'packages' || !state.selectedPackage) {
            if (showFeedback) {
                showToast('Select a package to continue.', 3000, { type: 'error', title: 'Validation' });
            }
            return false;
        }

        if ((parseInt(state.pax, 10) || 0) <= 0) {
            if (showFeedback) {
                showToast('Enter a valid pax count.', 3000, { type: 'error', title: 'Validation' });
            }
            return false;
        }

        if ((parseInt(state.pax, 10) || 0) < state.eventMinPax) {
            if (showFeedback) {
                showToast('Minimum pax for ' + state.eventName + ' is ' + state.eventMinPax + '.', 3000, { type: 'error', title: 'Validation' });
            }
            return false;
        }

        for (var i = 0; i < includedChoices.length; i++) {
            var category = includedChoices[i];
            var requiredQuantity = Number(category.requiredQuantity) || 1;
            var selections = includedChoiceSelections[String(category.categoryId)] || [];
            for (var index = 0; index < requiredQuantity; index++) {
                if (!String(selections[index] || '').trim()) {
                    if (showFeedback) {
                        showToast('Please complete all package dish choices before moving next.', 3500, { type: 'error', title: 'Validation' });
                    }
                    return false;
                }
            }
        }

        return true;
    }

    function validateStep4(showFeedback) {
        var requiredFields = [
            { key: 'company', input: '#detailCompany', error: '#detailCompanyError', message: 'Customer / Company Name is required' },
            { key: 'contact', input: '#detailContact', error: '#detailContactError', message: 'Contact Person is required' },
            { key: 'mobile', input: '#detailMobile', error: '#detailMobileError', message: 'Mobile / WhatsApp is required' },
            { key: 'eventDate', input: '#detailDate', error: '#detailDateError', message: 'Event Date is required' },
            { key: 'mealPeriodId', input: '#detailPeriod', error: '#detailPeriodError', message: 'Meal Period is required' },
            { key: 'addressLine1', input: '#detailAddressLine1', error: '#detailAddressLine1Error', message: 'Address Line 1 is required' }
        ];

        if ($('#detailCompany').length) {
            updateEventDetails();
        }

        var firstInvalid = null;
        var hasErrors = false;
        requiredFields.forEach(function (field) {
            clearFieldError(field.input, field.error);
            var value = $(field.input).length
                ? String($(field.input).val() || '').trim()
                : String(state.details[field.key] || '').trim();
            if (!value || value === '0') {
                hasErrors = true;
                if (showFeedback) {
                    if ($(field.input).length) {
                        setFieldError(field.input, field.error, field.message);
                    }
                }
                if (!firstInvalid && $(field.input).length) {
                    firstInvalid = field.input;
                }
            }
        });

        var eventDate = String(state.details.eventDate || '').trim();
        var minimumEventDate = getMinimumEventDate();
        if (eventDate && eventDate < minimumEventDate) {
            hasErrors = true;
            if (showFeedback) {
                setFieldError('#detailDate', '#detailDateError', 'Event date must be on or after ' + minimumEventDate);
                if (!firstInvalid) firstInvalid = '#detailDate';
            }
        }

        var email = $('#detailEmail').length
            ? String($('#detailEmail').val() || '').trim()
            : String(state.details.email || '').trim();
        clearFieldError('#detailEmail', '#detailEmailError');
        if (email && !/^\S+@\S+\.\S+$/.test(email)) {
            hasErrors = true;
            if (showFeedback) {
                if ($('#detailEmail').length) {
                    setFieldError('#detailEmail', '#detailEmailError', 'Enter a valid email address');
                }
            }
            if (!firstInvalid && $('#detailEmail').length) {
                firstInvalid = '#detailEmail';
            }
        }

        if (hasErrors && showFeedback) {
            if (firstInvalid) {
                $(firstInvalid).focus();
            }
            showToast('Please fill all required Event Details fields.', 3200, { type: 'error', title: 'Validation' });
        }

        return !hasErrors;
    }

    function validateStep(stepNumber, showFeedback) {
        if (stepNumber === 1) {
            return validateStep1(showFeedback);
        }
        if (stepNumber === 4) {
            return validateStep4(showFeedback);
        }
        return true;
    }

    function canMoveToStep(targetStep, showFeedback) {
        if (targetStep <= currentStep) {
            return true;
        }
        return validateStep(currentStep, showFeedback);
    }

    $(document).on('change', '.included-menu-select', function () {
        var categoryId = String($(this).data('category-id'));
        var choiceIndex = Number($(this).data('choice-index'));
        includedChoiceSelections[categoryId] = includedChoiceSelections[categoryId] || [];
        includedChoiceSelections[categoryId][choiceIndex] = String($(this).val() || '');
        refreshCategoryChoiceDropdowns(categoryId);
    });

    $(document).on('change', '.extra-check', function () {
        var itemId = String($(this).data('item-id'));
        if ($(this).is(':checked')) {
            state.extraItems[itemId] = state.extraItems[itemId] || 1;
        } else {
            delete state.extraItems[itemId];
        }
        renderStep();
    });

    $(document).on('change', '.extra-qty', function () {
        var itemId = String($(this).data('item-id'));
        var qty = parseInt($(this).val(), 10) || 0;
        if (qty > 0) state.extraItems[itemId] = qty; else delete state.extraItems[itemId];
        renderStep();
    });

    $(document).on('change', '.addon-check', function () {
        var addonId = String($(this).data('addon-id'));
        if ($(this).is(':checked')) {
            state.addons[addonId] = state.addons[addonId] || 1;
        } else {
            delete state.addons[addonId];
        }
        renderStep();
    });

    $(document).on('change', '.addon-qty', function () {
        var addonId = String($(this).data('addon-id'));
        var qty = parseInt($(this).val(), 10) || 0;
        if (qty > 0) state.addons[addonId] = qty; else delete state.addons[addonId];
        renderStep();
    });

    $(document).on('change', '.utensil-qty', function () {
        var utensilId = String($(this).data('id'));
        var name = $(this).data('name');
        var qty = parseInt($(this).val(), 10) || 0;
        var utensil = utensilRows.find(function (row) {
            return String(row.id) === utensilId;
        });
        var suggestedQty = utensil ? calculateUtensilSuggestedQty(utensil) : 0;

        if (qty > suggestedQty) {
            qty = suggestedQty;
            showToast('Quantity must be equal to or less than the suggested quantity (' + suggestedQty + ').', 3000, {
                type: 'warning',
                title: 'Invalid quantity'
            });
        }

        qty = Math.max(qty, 0);
        if (qty > 0) state.utensils[name] = qty; else delete state.utensils[name];
        renderStep();
    });

    $(document).on('click', '#suggestUtensilsBtn', function () {
        state.utensils = {};
        utensilRows.forEach(function (row) {
            state.utensils[row.name] = calculateUtensilSuggestedQty(row);
        });
        renderStep();
    });

    $(document).on('click', '#clearUtensilsBtn', function () {
        state.utensils = {};
        renderStep();
    });

    function updateEventDetails() {
        var selectedMealPeriod = $('#detailPeriod option:selected');
        state.details = {
            company: $('#detailCompany').val(),
            contact: $('#detailContact').val(),
            email: $('#detailEmail').val(),
            mobile: $('#detailMobile').val(),
            eventDate: $('#detailDate').val(),
            mealPeriodId: $('#detailPeriod').val(),
            mealPeriod: selectedMealPeriod.val() ? selectedMealPeriod.text() : '',
            postal: $('#detailPostal').val(),
            addressLine1: $('#detailAddressLine1').val(),
            notes: $('#detailNotes').val()
        };
    }

    $(document).on('input change', '#detailCompany, #detailContact, #detailEmail, #detailMobile, #detailDate, #detailPeriod, #detailPostal, #detailAddressLine1, #detailNotes', function () {
        var id = this.id;
        if (id) {
            clearFieldError('#' + id, '#' + id + 'Error');
        }
        updateEventDetails();
    });

    showOrderLoader(true);
    loadOrganizationGst();
    loadOrderEvents();
});

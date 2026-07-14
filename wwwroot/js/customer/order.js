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
            mealPeriodId: '',
            mealPeriod: '',
            postal: '',
            addressLine1: '',
            addressLine2: '',
            cityId: '',
            city: '',
            stateId: '',
            state: '',
            countryId: '',
            country: '',
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
        var categoryId = String(category.categoryId);
        var selections = includedChoiceSelections[categoryId] || [];
        var options = (category.menus || []).map(function (menu) {
            return '<option value="' + menu.id + '">' + escapeHtml(menu.name) + '</option>';
        }).join('');

        return '<div class="choice-block"><div class="choice-header"><div class="choice-title">' + escapeHtml(category.categoryName) + '</div><div class="choice-title">Required: choose ' + requiredQuantity + '</div></div>' +
            Array.from({ length: requiredQuantity }, function (_, index) {
                var selectedId = selections[index] || '';
                var selectedOptions = options.replace('value="' + selectedId + '"', 'value="' + selectedId + '" selected');
                var placeholder = category.menusLoading ? 'Loading menus...' : (category.menus || []).length ? 'Select menu' : 'No menus available';
                return '<div class="form-group"><label>Choice ' + (index + 1) + '</label><select class="included-menu-select" data-category-id="' + categoryId + '" data-choice-index="' + index + '"' + ((category.menus || []).length ? '' : ' disabled') + '><option value="">' + placeholder + '</option>' + selectedOptions + '</select></div>';
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
            '<div class="pkg-min">Min ' + pkg.min + ' pax</div>' +
            '<div class="pkg-desc" role="button" tabindex="0" aria-expanded="false" title="Click to show full description">' + escapeHtml(pkg.desc) + '</div>' +
            '<button class="btn ' + (selected ? 'btn-orange' : 'btn-primary') + ' select-package-btn">' + (selected ? 'Selected' : 'Select Package') + '</button>' +
            '</div>';
    }

    function renderStep2() {
        if (!additionalMenusLoaded && !additionalMenusLoading) {
            loadAdditionalMenus();
        }
        var html = '<div class="card order-card"><div class="section-label">Step 2 - Additional Menu Items + Qty</div><div class="muted" style="font-size:13px;margin-bottom:16px">This tab is only for extra items the customer wants in addition to the selected package. Only this tab shows item prices because these are additional chargeable items outside the package.</div>' + renderExtraTable() + '</div>';
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
                    return {
                        name: group.categoryName ?? group.CategoryName ?? 'Menu Items',
                        items: items.map(function (item) {
                            return {
                                key: String(item.id ?? item.Id ?? ''),
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
            '<div class="form-group"><label>Customer / Company Name</label><input id="detailCompany" value="' + d.company + '"></div>' +
            '<div class="form-group"><label>Contact Person</label><input id="detailContact" value="' + d.contact + '"></div>' +
            '<div class="form-group"><label>Email</label><input id="detailEmail" value="' + d.email + '"></div>' +
            '<div class="form-group"><label>Mobile / WhatsApp</label><input id="detailMobile" value="' + d.mobile + '"></div>' +
            '<div class="form-group"><label>Event Date</label><input id="detailDate" type="date" value="' + d.eventDate + '"></div>' +
            '<div class="form-group"><label>Meal Period</label><select id="detailPeriod"' + (mealPeriods.length ? '' : ' disabled') + '><option value="">' + mealPeriodPlaceholder + '</option>' + mealPeriodOptions + '</select></div>' +
            '<div class="form-group"><label>Address Line 1</label><input id="detailAddressLine1" value="' + d.addressLine1 + '"></div>' +
            '<div class="form-group"><label>Address Line 2</label><input id="detailAddressLine2" value="' + d.addressLine2 + '"></div>' +
            '<div class="form-group"><label>Country</label><select id="detailCountry"><option value="">--Select Country--</option></select></div>' +
            '<div class="form-group"><label>State</label><select id="detailState" disabled><option value="">--Select State--</option></select></div>' +
            '<div class="form-group"><label>City</label><select id="detailCity" disabled><option value="">--Select City--</option></select></div>' +
            '<div class="form-group"><label>Postal Code </label><input id="detailPostal" value="' + d.postal + '"></div>' +
            '</div><div class="form-group"><label>Notes</label><textarea id="detailNotes" rows="3">' + d.notes + '</textarea></div></div>';
        $('#orderStepContent').html(html);
        loadEventCountries(d.countryId, d.stateId, d.cityId);
    }

    function loadEventCountries(selectedCountryId, selectedStateId, selectedCityId) {
        return $.ajax({
            url: '/Common/GetCountry',
            type: 'GET',
            dataType: 'json',
            success: function (rows) {
                var list = Array.isArray(rows) ? rows : [];
                var html = '<option value="0">--Select Country--</option>';
                for (var i = 0; i < list.length; i++) {
                    var row = list[i] || {};
                    html += '<option value="' + row.id + '">' + escapeHtml(row.name || '') + '</option>';
                }
                $('#detailCountry').html(html);
                if (selectedCountryId) $('#detailCountry').val(selectedCountryId.toString());

                $('#detailCountry').off('change.location').on('change.location', function () {
                    var countryId = parseInt($(this).val(), 10) || 0;
                    $('#detailState').prop('disabled', true).html('<option value="0">--Select State--</option>');
                    $('#detailCity').prop('disabled', true).html('<option value="0">--Select City--</option>');
                    updateEventDetails();
                    if (countryId > 0) loadEventStates(countryId);
                });

                if (selectedCountryId) loadEventStates(selectedCountryId, selectedStateId, selectedCityId);
            },
            error: function () {
                $('#detailCountry').html('<option value="0">--Select Country--</option>');
                showToast('Unable to load countries.', 3000, { type: 'error', title: 'Load failed' });
            }
        });
    }

    function loadEventStates(countryId, selectedStateId, selectedCityId) {
        if (!countryId) return $.Deferred().resolve().promise();
        return $.ajax({
            url: '/Common/GetStateByCountryId?countryId=' + parseInt(countryId, 10),
            type: 'GET',
            dataType: 'json',
            success: function (rows) {
                var list = Array.isArray(rows) ? rows : [];
                var html = '<option value="0">--Select State--</option>';
                for (var i = 0; i < list.length; i++) {
                    var row = list[i] || {};
                    html += '<option value="' + row.id + '">' + escapeHtml(row.name || '') + '</option>';
                }
                $('#detailState').prop('disabled', false).html(html);
                if (selectedStateId) $('#detailState').val(selectedStateId.toString());

                $('#detailState').off('change.location').on('change.location', function () {
                    var stateId = parseInt($(this).val(), 10) || 0;
                    $('#detailCity').prop('disabled', true).html('<option value="0">--Select City--</option>');
                    updateEventDetails();
                    if (stateId > 0) loadEventCities(stateId);
                });

                if (selectedStateId) loadEventCities(selectedStateId, selectedCityId);
            },
            error: function () {
                $('#detailState').prop('disabled', true).html('<option value="0">--Select State--</option>');
                showToast('Unable to load states.', 3000, { type: 'error', title: 'Load failed' });
            }
        });
    }

    function loadEventCities(stateId, selectedCityId) {
        if (!stateId) return $.Deferred().resolve().promise();
        return $.ajax({
            url: '/Common/GetCityByStateId?stateId=' + parseInt(stateId, 10),
            type: 'GET',
            dataType: 'json',
            success: function (rows) {
                var list = Array.isArray(rows) ? rows : [];
                var html = '<option value="0">--Select City--</option>';
                for (var i = 0; i < list.length; i++) {
                    var row = list[i] || {};
                    html += '<option value="' + row.id + '">' + escapeHtml(row.name || '') + '</option>';
                }
                $('#detailCity').prop('disabled', false).html(html);
                if (selectedCityId) $('#detailCity').val(selectedCityId.toString());
            },
            error: function () {
                $('#detailCity').prop('disabled', true).html('<option value="0">--Select City--</option>');
                showToast('Unable to load cities.', 3000, { type: 'error', title: 'Load failed' });
            }
        });
    }

    function loadMealPeriods() {
        mealPeriodsLoading = true;
        $.ajax({
            url: '/Admin/MealPeriods/getAll',
            type: 'GET',
            success: function (rows) {
                mealPeriods = (Array.isArray(rows) ? rows : []).filter(function (item) {
                    var isActive = item.isActive ?? item.IsActive ?? false;
                    var isDeleted = item.isDeleted ?? item.IsDeleted ?? false;
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
                showToast(xhr.responseJSON?.message || 'Unable to load meal periods.', 3000, { type: 'error', title: 'Load failed' });
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
        var html = '<div class="card order-card"><div class="section-label">Step 5 - Utensils, Equipment and Payment</div><div class="muted" style="font-size:13px;margin-bottom:16px">Utensil quantity can be auto-suggested from admin/kitchen configuration, then adjusted manually by Sales/Admin/Kitchen Admin.</div><div class="actions" style="margin-bottom:14px"><button class="btn btn-primary" id="suggestUtensilsBtn">Use Suggested Qty</button><button class="btn btn-light" id="clearUtensilsBtn">Clear Utensils</button></div><div class="data-table-card"><table class="item-table"><thead><tr><th>Item</th><th>Rule</th><th>Suggested</th><th>Qty</th><th>Price</th><th>Deposit</th><th>Amount</th></tr></thead><tbody>' +
            (utensilsLoading
                ? '<tr><td colspan="7" class="muted">Loading utensils...</td></tr>'
                : utensilRows.map(function (row) {
                row.suggested = row.rule > 0 ? Math.ceil(state.pax / row.rule) : 0;
                var qty = state.utensils[row.name] || 0;
                return '<tr class="' + (qty > 0 ? 'selected-row' : '') + '"><td><strong>' + row.name + '</strong><div class="muted">' + row.unit + '</div></td><td>' + row.ruleLabel + '</td><td>' + row.suggested + '</td><td><input class="qty-input utensil-qty" data-name="' + row.name + '" type="number" min="0" value="' + qty + '"></td><td class="price-cell">' + money(row.price) + '</td><td>' + money(row.deposit) + '</td><td class="amount-cell">' + money(qty * row.price) + '</td></tr>';
            }).join('') + (utensilRows.length ? '' : '<tr><td colspan="7" class="muted">No utensils available.</td></tr>')) + '</tbody></table></div></div>';
        $('#orderStepContent').html(html);
    }

    function loadOrderUtensils() {
        utensilsLoading = true;
        $.ajax({
            url: '/Admin/Utensils/get',
            type: 'GET',
            dataType: 'json',
            success: function (rows) {
                utensilRows = (Array.isArray(rows) ? rows : []).filter(function (item) {
                    var isActive = item.isActive ?? item.IsActive ?? false;
                    var isDeleted = item.isDeleted ?? item.IsDeleted ?? false;
                    return isActive && !isDeleted;
                }).map(function (item) {
                    var rule = Number(item.rules ?? item.Rules ?? 0);
                    return {
                        id: String(item.id ?? item.Id ?? ''),
                        name: item.utensilName ?? item.UtensilName ?? '',
                        unit: 'per pc',
                        rule: rule,
                        ruleLabel: rule > 0 ? '1 per ' + rule + ' pax' : 'Manual',
                        suggested: 0,
                        price: Number(item.price ?? item.Price ?? 0),
                        deposit: Number(item.depositAmount ?? item.DepositAmount ?? 0)
                    };
                }).filter(function (item) {
                    return item.id && item.name;
                });
            },
            error: function () {
                utensilRows = [];
                showToast('Unable to load utensils.', 3000, { type: 'error', title: 'Load failed' });
            },
            complete: function () {
                utensilsLoading = false;
                utensilsLoaded = true;
                if (currentStep === 5) renderStep();
            }
        });
    }

    function renderStep6() {
        var html = '<div class="review-sheet"><div class="review-top"><div class="review-brand"><div class="review-title">Order Review</div></div><div class="review-line"><strong>Quotation Request</strong><br>Date: ' + new Date().toLocaleDateString() + '<br>Status: Draft</div></div><div class="review-split"><div><strong>Customer</strong><div>' + escapeHtml(state.details.company) + '</div><div>' + escapeHtml(state.details.email) + '</div><div>' + escapeHtml(state.details.mobile) + '</div></div><div><strong>Event</strong><div>' + escapeHtml(state.details.eventDate) + ' ' + escapeHtml(state.details.mealPeriod) + '</div><div>' + escapeHtml(buildDeliveryAddress()) + '</div><div>Pax: ' + state.pax + '</div></div></div><div class="review-table-title">Package: ' + escapeHtml(state.packageName) + ' (S$' + state.packagePrice.toFixed(2) + '/pax x ' + state.pax + ' pax = ' + money(packageBase()) + ')</div><div class="review-table-title">Included Package Dish Choices</div><table class="item-table"><thead><tr><th>Category</th><th>Dish</th><th>Included Qty</th><th>Unit</th><th>Status</th></tr></thead><tbody>' +
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

    function buildDeliveryAddress() {
        return [state.details.addressLine1, state.details.addressLine2, state.details.city, state.details.state, state.details.country, state.details.postal]
            .filter(function (part) { return part && part.trim(); })
            .join(', ');
    }

    function buildOrderPayload() {
        return {
            id: 0,
            orderNumber: generateOrderNumber(),
            customerId: 0,
            packageId: parseInt(state.selectedPackage, 10) || null,
            mealPeriodId: parseInt(state.details.mealPeriodId, 10) || null,
            locationId: null,
            eventStartDateTime: state.details.eventDate || null,
            eventEndDateTime: null,
            deliveryAddress: buildDeliveryAddress(),
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
        includedChoiceSelections = {};
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
        includedChoiceSelections = {};
        loadPackageCategories(pkg.id);
    }

    $(document).on('change', '.included-menu-select', function () {
        var categoryId = String($(this).data('category-id'));
        var choiceIndex = Number($(this).data('choice-index'));
        includedChoiceSelections[categoryId] = includedChoiceSelections[categoryId] || [];
        includedChoiceSelections[categoryId][choiceIndex] = String($(this).val() || '');
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

    function updateEventDetails() {
        var selectedMealPeriod = $('#detailPeriod option:selected');
        var cityId = parseInt($('#detailCity').val(), 10) || 0;
        var stateId = parseInt($('#detailState').val(), 10) || 0;
        var countryId = parseInt($('#detailCountry').val(), 10) || 0;
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
            addressLine2: $('#detailAddressLine2').val(),
            cityId: cityId || '',
            city: cityId ? $('#detailCity option:selected').text() : '',
            stateId: stateId || '',
            state: stateId ? $('#detailState option:selected').text() : '',
            countryId: countryId || '',
            country: countryId ? $('#detailCountry option:selected').text() : '',
            notes: $('#detailNotes').val()
        };
    }

    $(document).on('input change', '#detailCompany, #detailContact, #detailEmail, #detailMobile, #detailDate, #detailPeriod, #detailPostal, #detailAddressLine1, #detailAddressLine2, #detailCity, #detailState, #detailCountry, #detailNotes', function () {
        updateEventDetails();
    });

    loadOrderPackages();
});

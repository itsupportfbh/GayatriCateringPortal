$(document).ready(function ()
{ initEventPage(); });

var eventPackages = [];
var availablePackages = [];
var currentEventId = 0;

function initEventPage() {
    if ($('#eventsTable').length) loadEvents();
    if ($('#eventName').length) initEventForm();
}

function loadEvents() {
    $('#eventsListPanel .table-wrap').addClass('hidden');
    $('.pageloaderpanel').removeClass('hidden');
    $.getJSON('/Admin/EventMaster/get').done(renderEvents).fail(function () { renderEvents([]); }).always(function () {
        $('#eventsListPanel .table-wrap').removeClass('hidden');
        $('.pageloaderpanel').addClass('hidden');
    });
}

function renderEvents(rows) {
    var html = '';
    (Array.isArray(rows) ? rows : []).forEach(function (item, index) {
        var active = !!item.isActive;
        html += '<tr><td>' + (index + 1) + '</td><td><strong>' + escapeEventHtml(item.name) + '</strong></td><td>' + (item.minPax || 0) + '</td>' +
            '<td><span class="badge ' + (active ? 'badge-confirmed' : 'badge-cancelled') + '">' + (active ? 'Active' : 'Inactive') + '</span></td>' +
            '<td><div class="row-actions"><button type="button" class="dots-btn">&#8943;</button><div class="actions-menu hidden">' +
            '<button type="button" class="action-item btn-edit" onclick="editEvent(' + item.id + ')">Edit</button>' +
            '<button type="button" class="action-item btn-delete" onclick="deleteEvent(' + item.id + ')">Delete</button>' +
            '<button type="button" class="action-item btn-toggle" onclick="toggleEventStatus(' + item.id + ',' + (!active) + ')">' + (active ? 'Inactive' : 'Active') + '</button>' +
            '</div></div></td></tr>';
    });
    $('#eventsTable tbody').html(html);
    if (typeof renderDataTable === 'function') renderDataTable('eventsTable');
}

function initEventForm() {
    $('#eventName').on('input', clearEventErrors);
    $('#minPax').on('input', clearEventErrors);
    $('#addPackageRow').on('click', addEventPackageRow);
    $('#clearEvent').on('click', clearEventForm);
    $('#saveEvent').on('click', saveEvent);
    currentEventId = parseInt(new URLSearchParams(window.location.search).get('eventId') || 0, 10);
    loadAvailablePackages(function () {
        if (currentEventId > 0) {
            if (typeof setActionButtonLabel === 'function') setActionButtonLabel('#saveEvent', 'Update');
            loadEventForEdit(currentEventId);
        } else addEventPackageRow();
    });
}

function loadAvailablePackages(done) {
    $.getJSON('/Admin/Packages/get').done(function (rows) {
        availablePackages = (Array.isArray(rows) ? rows : []).filter(function (x) { return x.isActive; });
    }).always(done);
}

function addEventPackageRow() {
    if (eventPackages.some(function (x) { return !x.packageId; })) {
        showToast('Please select a package for the current row', 3000, { type: 'error', title: 'Validation' });
        return;
    }
    eventPackages.push({ id: 0, packageId: 0 });
    renderEventPackages();
}

function renderEventPackages() {
    var $rows = $('#eventPackageRows').empty();
    eventPackages.forEach(function (item) {
        var $row = $('<div class="event-package-row"></div>');
        var $select = $('<select class="form-control"><option value="0">-- Select package --</option></select>');
        var selectedElsewhere = eventPackages.filter(function (x) { return x !== item; }).map(function (x) { return x.packageId; });
        availablePackages.forEach(function (pkg) {
            if (selectedElsewhere.indexOf(pkg.id) < 0) $select.append($('<option></option>').val(pkg.id).text(pkg.name));
        });
        $select.val(item.packageId || 0).on('change', function () { item.packageId = parseInt(this.value, 10) || 0; renderEventPackages(); });
        var $remove = $('<button type="button" class="btn btn-light btn-sm">Remove</button>').on('click', function () { removeEventPackage(item); });
        $row.append($select, $remove); $rows.append($row);
    });
}

function removeEventPackage(item) {
    function removeLocal() { eventPackages = eventPackages.filter(function (x) { return x !== item; }); renderEventPackages(); }
    if (!item.id) return removeLocal();
    $.ajax({ url: '/Admin/EventDetails/delete/' + item.id, type: 'DELETE' }).done(function (result) {
        if (result && result.success) removeLocal(); else showToast('Unable to remove package.', 3000, { type: 'error', title: 'Delete failed' });
    });
}

function loadEventForEdit(id) {
    $.getJSON('/Admin/EventMaster/get/' + id).done(function (item) {
        $('#eventName').val(item.name || ''); $('#minPax').val(item.minPax || '');
        $.getJSON('/Admin/EventDetails/get?eventId=' + id).done(function (rows) {
            eventPackages = (Array.isArray(rows) ? rows : []).map(function (x) {
                return { id: x.id, packageId: x.packageId, originalPackageId: x.packageId };
            });
            if (!eventPackages.length) eventPackages.push({ id: 0, packageId: 0 });
            renderEventPackages();
        });
    }).fail(function () { showToast('Unable to load event details.', 3000, { type: 'error', title: 'Load failed' }); });
}

function validateEvent() {
    clearEventErrors(); var valid = true;
    if (!$('#eventName').val().trim()) { $('#eventName').addClass('input-error'); $('#eventNameError').removeClass('hidden').text('Event name is required'); valid = false; }
    if ((parseInt($('#minPax').val(), 10) || 0) <= 0) { $('#minPax').addClass('input-error'); $('#minPaxError').removeClass('hidden').text('Minimum pax is required'); valid = false; }
    if (!eventPackages.some(function (x) { return x.packageId > 0; })) { showToast('Add at least one package', 3000, { type: 'error', title: 'Validation' }); valid = false; }
    return valid;
}

function saveEvent() {
    if (!validateEvent()) return;
    if (typeof setButtonBusy === 'function') setButtonBusy('#saveEvent', true, 'Saving...');
    var userId = window.getCurrentUserId ? window.getCurrentUserId() : 0;
    var packageIds = eventPackages.filter(function (x) { return x.packageId > 0; }).map(function (x) { return x.packageId; });
    var payload = { Id: currentEventId, Name: $('#eventName').val().trim(), MinPax: parseInt($('#minPax').val(), 10), PackageIds: packageIds.join(','), IsActive: true, IsDeleted: false, CreatedBy: userId, UpdatedBy: userId };
    $.ajax({ url: currentEventId ? '/Admin/EventMaster/update' : '/Admin/EventMaster/create', type: 'POST', contentType: 'application/json', data: JSON.stringify(payload) })
        .done(function (result) {
            if (!result || !result.success) return eventSaveFailed(result && result.message);
            if (currentEventId > 0) saveEventDetails(currentEventId, userId);
            else eventSaveComplete();
        }).fail(function () { eventSaveFailed(); });
}

function saveEventDetails(eventId, userId) {
    var newItems = eventPackages.filter(function (x) { return x.packageId > 0 && !x.id; }).map(function (x) {
        return { EventId: eventId, PackageId: x.packageId, CreatedBy: userId, UpdatedBy: userId, IsActive: true, IsDeleted: false };
    });
    var changedItems = eventPackages.filter(function (x) {
        return x.id > 0 && x.packageId > 0 && x.packageId !== x.originalPackageId;
    });
    var requests = [];
    if (newItems.length) {
        requests.push($.ajax({ url: '/Admin/EventDetails/save', type: 'POST', contentType: 'application/json', data: JSON.stringify(newItems) }));
    }
    changedItems.forEach(function (x) {
        requests.push($.ajax({
            url: '/Admin/EventDetails/update', type: 'POST', contentType: 'application/json',
            data: JSON.stringify({ Id: x.id, EventId: eventId, PackageId: x.packageId, UpdatedBy: userId, IsActive: true, IsDeleted: false })
        }));
    });
    if (!requests.length) return eventSaveComplete();
    $.when.apply($, requests).done(function () {
        var responses = requests.length === 1 ? [arguments[0]] : Array.prototype.map.call(arguments, function (x) { return x[0]; });
        if (responses.every(function (x) { return x && x.success; })) eventSaveComplete();
        else eventSaveFailed('Unable to update event packages.');
    }).fail(function () { eventSaveFailed('Unable to update event packages.'); });
}

function eventSaveComplete() { showToast(currentEventId ? 'Event updated successfully.' : 'Event created successfully.', 500, { type: 'success', title: 'Success' }); setTimeout(function () { location.href = '/Admin/EventMaster'; }, 300); }
function eventSaveFailed(message) { if (typeof setButtonBusy === 'function') setButtonBusy('#saveEvent', false); showToast(message || 'Unable to save event.', 3000, { type: 'error', title: 'Save failed' }); }
function clearEventForm() { $('#eventName,#minPax').val(''); eventPackages = []; addEventPackageRow(); clearEventErrors(); }
function clearEventErrors() { $('#eventName,#minPax').removeClass('input-error'); $('#eventNameError,#minPaxError').addClass('hidden').text(''); }
function editEvent(id) { location.href = '/Admin/EventMaster/edit?eventId=' + id; }

function deleteEvent(id) { confirmEventAction('Delete this event?', function () { $.post('/Admin/EventMaster/delete/' + id).done(function (r) { eventActionResult(r, 'Event deleted successfully.'); }); }); }
function toggleEventStatus(id, status) { confirmEventAction(status ? 'Mark this event active?' : 'Mark this event inactive?', function () { $.post('/Admin/EventMaster/activeinactive?id=' + id + '&status=' + status).done(function (r) { eventActionResult(r, 'Event status updated.'); }); }); }
function confirmEventAction(message, action) { showToast(message, 0, { confirm: true, type: 'warning', title: 'Confirm', yesText: 'Yes', noText: 'No', onYes: action }); }
function eventActionResult(result, message) { showToast(result && result.success ? message : 'Unable to update event.', 3000, { type: result && result.success ? 'success' : 'error', title: result && result.success ? 'Success' : 'Failed' }); setTimeout(loadEvents, 300); }
function escapeEventHtml(value) { return $('<div>').text(value || '').html(); }

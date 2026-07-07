$(document).ready(function () {
    loadVenues();
});

function loadVenues() {
    $.ajax({
        url: "/Customer/Venue/get",
        type: "GET",
        success: function (data) {
            renderVenues(data);
        },
        error: function () {
            renderVenues([]);
        }
    });
}

function renderVenues(venues) {
    var html = '';
    if (!Array.isArray(venues) || venues.length === 0) {
        html = '<div class="card"><p class="muted">No venues available at the moment. Please contact us for availability.</p></div>';
    } else {
        html = venues.map(function (item) {
            var locationName = item.locationName || item.LocationName || 'Venue';
            var remarks = item.remarks || item.Remarks || 'Function hall and event setup available.';
            var minPax = item.minimumPax || item.MinimumPax || 'N/A';
            var deliveryFee = parseFloat(item.deliveryFee || item.DeliveryFee || 0) || 0;
            var isActive = item.isActive === '1' || item.isActive === 'true' || item.isActive === true || item.IsActive === true;
            var buttonClass = isActive ? 'btn-orange' : 'btn-light disabled';
            var buttonText = isActive ? 'Book Function' : 'Not Available';

            return '<div class="venue-card' + (isActive ? '' : ' muted') + '">' +
                '<div class="venue-caption"><b>' + locationName + '</b>' +
                '<span>' + remarks + '</span></div>' +
                '<div class="venue-meta">' +
                '<div><strong>Min Pax</strong>' + minPax + '</div>' +
                '<div><strong>Delivery Fee</strong>S$' + deliveryFee.toFixed(2) + '</div>' +
                '</div>' +
                '<a href="/Customer/Order" class="btn ' + buttonClass + ' btn-sm">' + buttonText + '</a>' +
                '</div>';
        }).join('');
    }
    $('#venueCards').html(html);
}

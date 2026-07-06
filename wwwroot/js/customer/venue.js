// Venue page JS
$(document).ready(function() {
    // Venue gallery lightbox
    $('.venue-card img').on('click', function() {
        const src = $(this).attr('src');
        const caption = $(this).closest('.venue-card').find('b').text();
        const html = '<div class="modal-overlay" onclick="closeModal()"><div class="modal-box" style="max-width:800px;padding:0;overflow:hidden"><img src="' + src + '" style="width:100%;display:block"><div style="padding:14px"><b>' + caption + '</b></div></div></div>';
        openModal(html);
    });
});
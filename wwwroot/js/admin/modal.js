// Modal helper that can render into a per-view container (preferred) or fallback to global container
(function(){
    function findContainer(opts) {
        if (!opts) return null;
        var sel = opts.container || opts.containerSelector || opts.containerId;
        if (sel && $(sel).length) return $(sel);
        return null;
    }

    window.openCrudModal = function (title, bodyHtml, onSubmit, options) {
        options = options || {};
        var showClear = !!options.showClear;
        var html = '<div class="modal-header"><h3>' + (title || '') + '</h3><button class="btn-close modal-internal-close">×</button></div>';
        html += '<div class="modal-body">' + bodyHtml + '</div>';
        html += '<div class="modal-footer">';
        // note: per-user preference - only show Clear and Save by default when requested; cancel remains for backward compatibility
        if (options.showCancel) html += '<button class="btn btn-light modal-internal-cancel">Cancel</button> ';
        if (showClear) html += '<button class="btn btn-secondary modal-internal-clear">Clear</button> ';
        html += '<button class="btn btn-primary modal-internal-submit">Save</button>';
        html += '</div>';

        var $container = findContainer(options);
        if ($container) {
            // render into provided container
            $container.html(html);
            // show overlay if parent has .modal-overlay
            var $overlay = $container.closest('.modal-overlay');
            if ($overlay.length) $overlay.removeClass('hidden');

            $overlay.find('.modal-internal-close, .modal-internal-cancel').on('click', function () {
                $overlay.addClass('hidden');
                $container.html('');
            });
            if (showClear) {
                $overlay.find('.modal-internal-clear').on('click', function () {
                    $container.find('input, select, textarea').each(function () { var $el = $(this); if ($el.is(':checkbox')||$el.is(':radio')) $el.prop('checked', false); else $el.val(''); });
                });
            }
            $overlay.find('.modal-internal-submit').on('click', function () { if (typeof onSubmit === 'function') onSubmit(); });
            return;
        }

        // fallback to global modal
        var showClear = !!options.showClear;
        var fallbackHtml = html;
        if ($('#crudModalBox').length) {
            $('#crudModalBox').html(fallbackHtml);
            $('#crudModal').removeClass('hidden');
            $('#crudModal').find('.modal-internal-close, .modal-internal-cancel').on('click', function () { window.closeCrudModal(); });
            if (showClear) {
                $('#crudModal').find('.modal-internal-clear').on('click', function () { $('#crudModalBox').find('input, select, textarea').each(function () { var $el = $(this); if ($el.is(':checkbox')||$el.is(':radio')) $el.prop('checked', false); else $el.val(''); }); });
            }
            $('#crudModal').find('.modal-internal-submit').on('click', function () { if (typeof onSubmit === 'function') onSubmit(); });
        } else {
            console.warn('No modal container found to render CRUD modal.');
        }
    };

    window.closeCrudModal = function () {
        if ($('#crudModalBox').length) { $('#crudModalBox').html(''); $('#crudModal').addClass('hidden'); return; }
        // hide any per-view overlays
        $('.modal-overlay').each(function () { var $o = $(this); if (!$o.hasClass('keep-open')) { $o.addClass('hidden'); $o.find('.modal-box').html(''); } });
    };

    // Helper to build a three-dot actions menu for table rows.
    window.buildRowActions = function (id, opts) {
        opts = opts || {};
        var showEdit = opts.showEdit !== false;
        var showDelete = opts.showDelete !== false;
        var showToggle = opts.showToggle !== false;
        var showWA = !!opts.showWA;
        var active = opts.active;
        var html = '<div class="row-actions">';
        html += '<button class="dots-btn" title="Actions">⋯</button>';
        html += '<div class="actions-menu hidden">';
        if (showWA) html += '<button class="action-item btn-wa" data-id="' + id + '">WA</button>';
        if (showEdit) html += '<button class="action-item btn-edit" data-id="' + id + '">Edit</button>';
        if (showDelete) html += '<button class="action-item btn-delete" data-id="' + id + '">Delete</button>';
        if (showToggle) html += '<button class="action-item btn-toggle" data-id="' + id + '" data-state="' + (active ? 'active' : 'inactive') + '">' + (active ? 'Deactivate' : 'Activate') + '</button>';
        html += '</div></div>';
        return html;
    };

    // Document handlers for actions menu
    $(document).on('click', '.dots-btn', function (e) {
        e.stopPropagation();
        var $menu = $(this).next('.actions-menu');
        $('.actions-menu').not($menu).addClass('hidden');
        $menu.toggleClass('hidden');
    });
    $(document).on('click', function () {
        $('.actions-menu').addClass('hidden');
    });
})();

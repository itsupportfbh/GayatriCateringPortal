// ===== ADMIN REPORT RUNTIME =====
$(function () {
    var state = {
        roleId: typeof window.getCurrentRoleId === 'function' ? (parseInt(window.getCurrentRoleId() || '0', 10) || 1) : 1,
        categories: [],
        reports: [],
        reportSearch: '',
        reportPageSize: 12,
        reportVisibleCount: 12,
        selectedCategoryId: 0,
        selectedReportId: 0,
        definition: null,
        lastPreviewResult: null
    };

    function escapeHtml(value) {
        return $('<div>').text(value ?? '').html();
    }

    function fetchCategories() {
        return $.ajax({
            url: '/Admin/Reports/categories?roleId=' + encodeURIComponent(state.roleId),
            type: 'GET',
            dataType: 'json'
        });
    }

    function fetchReports(categoryId) {
        var url = '/Admin/Reports/list?roleId=' + encodeURIComponent(state.roleId);
        if (categoryId && categoryId > 0) {
            url += '&categoryId=' + encodeURIComponent(categoryId);
        }

        return $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json'
        });
    }

    function fetchDefinition(reportId) {
        return $.ajax({
            url: '/Admin/Reports/definition?roleId=' + encodeURIComponent(state.roleId) + '&reportId=' + encodeURIComponent(reportId),
            type: 'GET',
            dataType: 'json'
        });
    }

    function renderCategories() {
        var rows = state.categories || [];
        var html = '<option value="0">All Categories</option>';
        rows.forEach(function (row) {
            var id = parseInt(row.id || row.Id || '0', 10) || 0;
            var name = row.name || row.Name || 'Category';
            var count = parseInt(row.reportCount || row.ReportCount || '0', 10) || 0;
            html += '<option value="' + id + '">' + escapeHtml(name) + ' (' + count + ')</option>';
        });

        $('#selReportCategory').html(html).val(String(state.selectedCategoryId || 0));
        if (!rows.length) {
            $('#reportCategoriesMeta').text('No categories available for this role.');
        } else {
            $('#reportCategoriesMeta').text(rows.length + ' categories available.');
        }
    }

    function filterReports(rows) {
        var keyword = String(state.reportSearch || '').trim().toLowerCase();
        if (!keyword) return rows;

        return rows.filter(function (row) {
            var reportCode = String(row.reportCode || row.ReportCode || '').toLowerCase();
            var displayName = String(row.displayName || row.DisplayName || row.reportName || row.ReportName || '').toLowerCase();
            var desc = String(row.description || row.Description || '').toLowerCase();
            return reportCode.indexOf(keyword) >= 0 || displayName.indexOf(keyword) >= 0 || desc.indexOf(keyword) >= 0;
        });
    }

    function updateReportStats(totalCount, filteredCount, visibleCount) {
        var text = 'Showing ' + visibleCount + ' of ' + filteredCount;
        if (state.selectedCategoryId === 0) {
            text += ' reports';
        } else {
            text += ' in category';
        }
        if (filteredCount !== totalCount) {
            text += ' (from ' + totalCount + ')';
        }
        $('#reportListStats').text(text);
    }

    function renderReportCards() {
        var allRows = state.reports || [];
        if (!allRows.length) {
            $('#reportCards').html('<div class="hint">No reports found for selected category.</div>');
            $('#reportListStats').text('No reports');
            $('#btnReportLoadMore').hide();
            return;
        }

        var filteredRows = filterReports(allRows);
        if (!filteredRows.length) {
            $('#reportCards').html('<div class="hint">No matching report found.</div>');
            updateReportStats(allRows.length, 0, 0);
            $('#btnReportLoadMore').hide();
            return;
        }

        var visibleCount = Math.min(state.reportVisibleCount, filteredRows.length);
        var rows = filteredRows.slice(0, visibleCount);

        var html = '';
        rows.forEach(function (row) {
            var id = parseInt(row.id || row.Id || '0', 10) || 0;
            var displayName = row.displayName || row.DisplayName || row.reportName || row.ReportName || 'Report';
            var desc = row.description || row.Description || 'No description.';
            var categoryName = row.categoryName || row.CategoryName || '-';
            var isSelected = state.selectedReportId === id;

            html += '<button type="button" class="report-card-btn ' + (isSelected ? 'selected' : '') + '" data-report-id="' + id + '">' +
                '<div class="report-card-title">' + escapeHtml(displayName) + '</div>' +
                '<div class="report-card-desc">' + escapeHtml(desc) + '</div>' +
                '<div class="report-card-meta">' +
                '<span class="meta-category">' + escapeHtml(categoryName) + '</span>' +
                '</div>' +
                '</button>';
        });

        $('#reportCards').html(html);
        updateReportStats(allRows.length, filteredRows.length, visibleCount);

        if (visibleCount < filteredRows.length) {
            $('#btnReportLoadMore').text('Load more (' + (filteredRows.length - visibleCount) + ' more)').show();
        } else {
            $('#btnReportLoadMore').hide();
        }
    }

    function renderFilters() {
        var definition = state.definition;
        if (!definition || !definition.filters) {
            $('#reportFilterWrap').html('<div class="hint">Select a report to load filters.</div>');
            return;
        }

        var filters = Array.isArray(definition.filters) ? definition.filters : [];
        if (!filters.length) {
            $('#reportFilterWrap').html('<div class="hint">No filters configured for this report.</div>');
            return;
        }

        var html = '<div class="report-filter-grid">';

        filters.forEach(function (filter) {
            var fieldName = filter.fieldName || filter.FieldName || '';
            var displayName = filter.displayName || filter.DisplayName || fieldName;
            var controlType = (filter.controlType || filter.ControlType || 'text').toString().toLowerCase();
            var isRequired = !!(filter.isRequired || filter.IsRequired);
            var isShow = filter.isShow === undefined ? !!filter.IsShow : !!filter.isShow;
            var dataType = (filter.dataType || filter.DataType || '').toString().toLowerCase();
            var value = '';

            if (fieldName.toLowerCase() === 'roleid') {
                value = String(state.roleId);
            }

            if (!isShow) {
                html += '<input type="hidden" class="report-filter" data-field-name="' + escapeHtml(fieldName) + '" data-data-type="' + escapeHtml(dataType) + '" value="' + escapeHtml(value) + '">';
                return;
            }

            var inputType = 'text';
            if (controlType === 'date') inputType = 'date';
            if (controlType === 'number' || dataType === 'int' || dataType === 'decimal' || dataType === 'numeric') inputType = 'number';

            html += '<div class="report-filter-item">' +
                '<label>' + escapeHtml(displayName) + (isRequired ? ' *' : '') + '</label>' +
                '<input type="' + inputType + '" class="report-filter" data-field-name="' + escapeHtml(fieldName) + '" data-required="' + (isRequired ? '1' : '0') + '" data-data-type="' + escapeHtml(dataType) + '" value="' + escapeHtml(value) + '">' +
                '</div>';
        });

        html += '</div>';
        $('#reportFilterWrap').html(html);
    }

    function readFilters() {
        var values = {};
        var missing = [];

        $('.report-filter').each(function () {
            var fieldName = ($(this).data('field-name') || '').toString();
            if (!fieldName) return;

            var isRequired = String($(this).data('required') || '0') === '1';
            var dataType = ($(this).data('data-type') || '').toString().toLowerCase();
            var rawValue = ($(this).val() || '').toString().trim();

            if (isRequired && !rawValue) {
                missing.push(fieldName);
                return;
            }

            if (!rawValue) {
                values[fieldName] = null;
                return;
            }

            if (dataType === 'int' || dataType === 'integer') {
                values[fieldName] = parseInt(rawValue, 10) || 0;
                return;
            }

            if (dataType === 'decimal' || dataType === 'numeric' || dataType === 'money') {
                values[fieldName] = parseFloat(rawValue) || 0;
                return;
            }

            values[fieldName] = rawValue;
        });

        return {
            values: values,
            missing: missing
        };
    }

    function resolvePath(source, path) {
        if (!source || !path) return null;
        var parts = String(path).split('.');
        var current = source;

        for (var i = 0; i < parts.length; i++) {
            if (current === null || current === undefined) return null;
            var key = parts[i];

            if (Array.isArray(current) && /^\d+$/.test(key)) {
                current = current[parseInt(key, 10)];
                continue;
            }

            var foundKey = null;
            Object.keys(current).some(function (candidate) {
                if (candidate.toLowerCase() === key.toLowerCase()) {
                    foundKey = candidate;
                    return true;
                }
                return false;
            });

            current = foundKey ? current[foundKey] : null;
        }

        return current;
    }

    function formatTemplateValue(value, formatHint) {
        if (value === null || value === undefined) return '';
        var hint = String(formatHint || '').toLowerCase();

        if (hint === 'date') {
            var onlyDate = new Date(value);
            return isNaN(onlyDate.getTime())
                ? value
                : onlyDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        }

        if (hint === 'number') {
            var n = Number(value);
            return Number.isFinite(n) ? n.toLocaleString() : value;
        }

        if (hint === 'currency') {
            var c = Number(value);
            return Number.isFinite(c) ? c.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value;
        }

        if (hint === 'datetime') {
            var d = new Date(value);
            return isNaN(d.getTime()) ? value : d.toLocaleString();
        }

        return value;
    }

    function applyTokens(template, context) {
        return String(template || '').replace(/{{\s*([^{}]+?)\s*}}/g, function (_match, tokenExpr) {
            var expr = String(tokenExpr || '').trim();
            if (!expr || expr.charAt(0) === '#' || expr.charAt(0) === '/') return _match;

            var parts = expr.split('|');
            var path = parts[0] || '';
            var formatHint = parts.length > 1 ? parts[1] : '';
            var value = resolvePath(context, path);
            return escapeHtml(formatTemplateValue(value, formatHint));
        });
    }

    function renderTemplateLoops(template, context) {
        return String(template || '').replace(/{{#\s*([A-Za-z0-9_.]+)\s*}}([\s\S]*?){{\/\s*\1\s*}}/g, function (_match, collectionPath, block) {
            var rows = resolvePath(context, collectionPath);
            if (!Array.isArray(rows) || !rows.length) return '';

            return rows.map(function (row) {
                var rowContext = $.extend({}, context, row);
                return applyTokens(block, rowContext);
            }).join('');
        });
    }

    function buildTableMarkup(rows, columns) {
        if (!rows.length || !columns.length) {
            return '<div class="hint" style="padding:12px">No data found for selected filters.</div>';
        }

        var html = '<div class="table-wrap"><table class="table" id="reportResultTable"><thead><tr>';
        columns.forEach(function (column) {
            html += '<th>' + escapeHtml(column.header || column.field || '-') + '</th>';
        });
        html += '</tr></thead><tbody>';

        rows.forEach(function (row) {
            html += '<tr>';
            columns.forEach(function (column) {
                var field = column.field || '';
                var value = row[field];
                html += '<td>' + escapeHtml(value === null || value === undefined ? '' : value) + '</td>';
            });
            html += '</tr>';
        });

        html += '</tbody></table></div>';
        return html;
    }

    function renderTemplatePreview(result) {
        var htmlTemplate = (result && result.htmlTemplate) ? String(result.htmlTemplate) : '';
        if (!htmlTemplate) return null;

        var rows = Array.isArray(result.rows) ? result.rows : [];
        var columns = Array.isArray(result.columns) ? result.columns : [];
        var report = result.report || {};

        function sumByField(fieldName) {
            var total = 0;
            rows.forEach(function (row) {
                var value = resolvePath(row, fieldName);
                var n = Number(value);
                if (Number.isFinite(n)) total += n;
            });
            return total;
        }

        function sumBalance() {
            var total = 0;
            rows.forEach(function (row) {
                var value = resolvePath(row, 'BalanceAmount');
                if (value === null || value === undefined || value === '') {
                    value = resolvePath(row, 'BalanceRemaining');
                }
                var n = Number(value);
                if (Number.isFinite(n)) total += n;
            });
            return total;
        }

        var context = {
            report: report,
            rows: rows,
            columns: columns,
            meta: {
                rowCount: rows.length,
                executedAt: result.executedAt || ''
            },
            table: buildTableMarkup(rows, columns),
            sumTotalAmount: sumByField('TotalAmount'),
            sumTaxAmount: sumByField('TaxAmount'),
            sumBalanceAmount: sumBalance()
        };

        var rawTableToken = '__REPORT_TABLE__';
        var templateWithRawTable = htmlTemplate.replace(/{{\s*table\s*}}/gi, rawTableToken);
        var htmlWithLoops = renderTemplateLoops(templateWithRawTable, context);
        var htmlWithTokens = applyTokens(htmlWithLoops, context);
        return htmlWithTokens.replace(new RegExp(rawTableToken, 'g'), context.table);
    }

    function renderPreview(result) {
        state.lastPreviewResult = result || null;
        var rows = result && Array.isArray(result.rows) ? result.rows : [];
        var columns = result && Array.isArray(result.columns) ? result.columns : [];
        var report = result && result.report ? result.report : null;
        var templateKind = (result && result.templateKind ? String(result.templateKind) : '').toLowerCase();

        if (templateKind === 'html' && result && result.htmlTemplate) {
            var rendered = renderTemplatePreview(result);
            if (rendered) {
                $('#reportResultWrap').html(rendered);
                return;
            }
        }

        if (!rows.length || !columns.length) {
            $('#reportResultWrap').html('<div class="hint" style="padding:12px">No data found for selected filters.</div>');
            return;
        }

        var html = '';
        if (report) {
            html += '<div class="report-result-head">' +
                '<div><strong>' + escapeHtml(report.displayName || report.reportName || 'Report') + '</strong></div>' +
                '<div class="hint">Stored Procedure: ' + escapeHtml(report.storedProcedure || '-') + ' | Rows: ' + rows.length + '</div>' +
                '</div>';
        }

        html += buildTableMarkup(rows, columns);
        $('#reportResultWrap').html(html);
    }

    function loadCategoriesAndReports() {
        fetchCategories().done(function (rows) {
            state.categories = Array.isArray(rows) ? rows : [];
            renderCategories();
            loadReports();
        }).fail(function () {
            $('#reportCategories').html('<div class="hint">Unable to load report categories.</div>');
            $('#reportCards').html('<div class="hint">Unable to load reports.</div>');
        });
    }

    function loadReports() {
        fetchReports(state.selectedCategoryId).done(function (rows) {
            state.reports = Array.isArray(rows) ? rows : [];
            state.reportVisibleCount = state.reportPageSize;
            renderReportCards();

            if (state.selectedReportId > 0) {
                var found = state.reports.some(function (item) {
                    return parseInt(item.id || item.Id || '0', 10) === state.selectedReportId;
                });
                if (found) {
                    loadDefinition(state.selectedReportId);
                    return;
                }
            }

            if (state.reports.length > 0) {
                state.selectedReportId = parseInt(state.reports[0].id || state.reports[0].Id || '0', 10) || 0;
                renderReportCards();
                loadDefinition(state.selectedReportId);
            } else {
                state.selectedReportId = 0;
                state.definition = null;
                renderFilters();
                $('#reportResultWrap').html('');
            }
        }).fail(function () {
            $('#reportCards').html('<div class="hint">Unable to load reports.</div>');
        });
    }

    function applyReportSearch() {
        state.reportSearch = ($('#txtReportSearch').val() || '').toString();
        state.reportVisibleCount = state.reportPageSize;
        renderReportCards();
    }

    function ensureExportTable(result) {
        var tableId = 'reportExportTable';
        $('#' + tableId).remove();

        var rows = result && Array.isArray(result.rows) ? result.rows : [];
        var columns = result && Array.isArray(result.columns) ? result.columns : [];
        if (!rows.length || !columns.length) return null;

        var html = '<table id="' + tableId + '" style="display:none"><thead><tr>';
        columns.forEach(function (column) {
            html += '<th>' + escapeHtml(column.header || column.field || '-') + '</th>';
        });
        html += '</tr></thead><tbody>';

        rows.forEach(function (row) {
            html += '<tr>';
            columns.forEach(function (column) {
                var field = column.field || '';
                var value = row[field];
                html += '<td>' + escapeHtml(value === null || value === undefined ? '' : value) + '</td>';
            });
            html += '</tr>';
        });

        html += '</tbody></table>';
        $('body').append(html);
        return tableId;
    }

    function getActiveReportName() {
        if (!state.lastPreviewResult || !state.lastPreviewResult.report) return 'Report';
        return state.lastPreviewResult.report.displayName || state.lastPreviewResult.report.reportName || 'Report';
    }

    function printCurrentPreview() {
        if (!state.lastPreviewResult || !Array.isArray(state.lastPreviewResult.rows) || !state.lastPreviewResult.rows.length) {
            showToast('Run preview before print.', 2500, { type: 'warning', title: 'Print' });
            return;
        }

        var html = $('#reportResultWrap').html() || '';
        var win = window.open('', '_blank', 'width=1200,height=900');
        if (!win) {
            showToast('Popup blocked. Allow popups to print report.', 3000, { type: 'warning', title: 'Print' });
            return;
        }

        win.document.write('<html><head><title>' + escapeHtml(getActiveReportName()) + '</title>');
        win.document.write('<link rel="stylesheet" href="/css/site.css">');
        win.document.write('<style>body{padding:18px;font-family:Segoe UI,Arial,sans-serif;} .table{width:100%;border-collapse:collapse;} .table th,.table td{border:1px solid #d6d9de;padding:7px;text-align:left;} .table th{background:#f4f6f8;}</style>');
        win.document.write('</head><body>' + html + '</body></html>');
        win.document.close();
        win.focus();
        win.print();
    }

    function exportCurrentPreviewExcel() {
        var tableId = ensureExportTable(state.lastPreviewResult);
        if (!tableId) {
            showToast('Run preview before Excel export.', 2500, { type: 'warning', title: 'Export Excel' });
            return;
        }

        if (typeof window.exportTableToExcel === 'function') {
            window.exportTableToExcel(tableId, getActiveReportName());
        } else {
            showToast('Excel export helper is not available.', 2500, { type: 'error', title: 'Export Excel' });
        }
    }

    function exportCurrentPreviewPdf() {
        var tableId = ensureExportTable(state.lastPreviewResult);
        if (!tableId) {
            showToast('Run preview before PDF export.', 2500, { type: 'warning', title: 'Export PDF' });
            return;
        }

        if (typeof window.exportTableToPdf === 'function') {
            window.exportTableToPdf(tableId, getActiveReportName());
        } else {
            showToast('PDF export helper is not available.', 2500, { type: 'error', title: 'Export PDF' });
        }
    }

    function loadDefinition(reportId) {
        if (!reportId) {
            state.definition = null;
            renderFilters();
            return;
        }

        fetchDefinition(reportId).done(function (definition) {
            state.definition = definition || null;
            renderFilters();
            $('#reportResultWrap').html('<div class="hint" style="padding:12px">Click Preview to run this report.</div>');
        }).fail(function () {
            state.definition = null;
            renderFilters();
            $('#reportResultWrap').html('<div class="hint" style="padding:12px">Unable to load report definition.</div>');
        });
    }

    function previewCurrentReport() {
        if (!state.selectedReportId) {
            showToast('Please select a report first.', 3000, { type: 'warning', title: 'Report' });
            return;
        }

        var result = readFilters();
        if (result.missing.length) {
            showToast('Please fill required filters before preview.', 3000, { type: 'warning', title: 'Validation' });
            return;
        }

        setButtonBusy('#btnPreviewReport', true, 'Loading...');

        $.ajax({
            url: '/Admin/Reports/preview',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                roleId: state.roleId,
                reportId: state.selectedReportId,
                filters: result.values
            }),
            success: function (response) {
                renderPreview(response || {});
            },
            error: function (xhr) {
                var message = (xhr && xhr.responseJSON && xhr.responseJSON.message) ? xhr.responseJSON.message : 'Unable to execute report.';
                $('#reportResultWrap').html('<div class="hint" style="padding:12px">' + escapeHtml(message) + '</div>');
                showToast(message, 3200, { type: 'error', title: 'Preview failed' });
            },
            complete: function () {
                setButtonBusy('#btnPreviewReport', false);
            }
        });
    }

    $('#selReportCategory').on('change', function () {
        state.selectedCategoryId = parseInt($(this).val() || '0', 10) || 0;
        state.reportVisibleCount = state.reportPageSize;
        loadReports();
    });

    $(document).on('click', '.report-card-btn', function () {
        state.selectedReportId = parseInt($(this).data('report-id') || '0', 10) || 0;
        renderReportCards();
        loadDefinition(state.selectedReportId);
    });

    $('#btnPreviewReport').on('click', function () {
        previewCurrentReport();
    });

    $('#btnClearReportFilters').on('click', function () {
        $('.report-filter').each(function () {
            var field = (($(this).data('field-name') || '') + '').toLowerCase();
            if (field === 'roleid') {
                $(this).val(String(state.roleId));
                return;
            }
            $(this).val('');
        });
    });

    $('#txtReportSearch').on('input', function () {
        applyReportSearch();
    });

    $('#selReportPageSize').on('change', function () {
        var pageSize = parseInt($(this).val() || '12', 10) || 12;
        state.reportPageSize = pageSize;
        state.reportVisibleCount = pageSize;
        renderReportCards();
    });

    $('#btnReportLoadMore').on('click', function () {
        state.reportVisibleCount += state.reportPageSize;
        renderReportCards();
    });

    $('#btnBackToMenus').on('click', function () {
        window.location.href = '/Admin/Dashboard';
    });

    $('#btnPrintReport').on('click', function () {
        printCurrentPreview();
    });

    $('#btnExportExcelReport').on('click', function () {
        exportCurrentPreviewExcel();
    });

    $('#btnExportPdfReport').on('click', function () {
        exportCurrentPreviewPdf();
    });

    loadCategoriesAndReports();
});

using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using GayatriCateringPortal.Models.Reports;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections;
using System.Globalization;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace GayatriCateringPortal.Controllers
{
    [Route("Common")]
    public class CommonController : Controller
    {
        private readonly ICommonRepository _common;
        private readonly IWebHostEnvironment _environment;
        private readonly IReportsRepository _reports;
        private readonly ILogger<CommonController> _logger;

        public CommonController(ICommonRepository common, IWebHostEnvironment environment, IReportsRepository reports, ILogger<CommonController> logger)
        {
            _common = common;
            _environment = environment;
            _reports = reports;
            _logger = logger;
        }

        [HttpGet("menus")]
        public IActionResult Menus(int roleId)
        {
            if (roleId <= 0)
            {
                return BadRequest(new { success = false, message = "RoleId is required." });
            }

            var items = _common.GetMenuGroups(roleId);
            return Ok(items);
        }

        [HttpGet("GetCountry")]
        public IActionResult GetCountry()
        {
            var items = _common.GetCountry();
            return Ok(items);
        }

        [HttpGet("GetStateByCountryId")]
        public IActionResult GetStateByCountryId(int countryId)
        {
            if (countryId <= 0) return Ok(new List<Models.State>());
            var items = _common.GetStateByCountryId(countryId);
            return Ok(items);
        }

        [HttpGet("GetCityByStateId")]
        public IActionResult GetCityByStateId(int stateId)
        {
            if (stateId <= 0) return Ok(new List<Models.City>());
            var items = _common.GetCityByStateId(stateId);
            return Ok(items);
        }

        [HttpGet("GetEntityMaster")]
        public IActionResult GetEntityMaster()
        {
            var items = _common.GetEntityMaster();
            return Ok(items);
        }

        [HttpPost("CreateRolePermission")]
        public IActionResult CreateRolePermission([FromBody] List<CreateRolePermissionRequest> requests)
        {
            if (requests == null || requests.Count == 0)
            {
                return BadRequest(new { success = false, message = "Invalid request." });
            }

            for (int i = 0; i < requests.Count; i++)
            {
                var request = requests[i];
                if (request == null || request.RoleId <= 0 || request.EntityNo <= 0)
                {
                    return BadRequest(new { success = false, message = "Invalid request." });
                }
            }

            var savedCount = _common.CreateRolePermission(requests);
            return Ok(new { success = savedCount > 0, count = savedCount });
        }

        [HttpGet("GetRolePermissionsByRoleId")]
        public IActionResult GetRolePermissionsByRoleId(int roleId)
        {
            if (roleId <= 0) return Ok(new List<RolePermissionItem>());

            var items = _common.GetRolePermissionsByRoleId(roleId);
            return Ok(items);
        }

        [HttpGet("GetMenuRights")]
        public IActionResult GetMenuRights(int roleId, int entityNo)
        {
            if (roleId <= 0 || entityNo <= 0)
            {
                return Ok(new RolePermissionItem
                {
                    RoleId = roleId,
                    EntityNo = entityNo,
                    View = false,
                    Create = false,
                    Edit = false,
                    Delete = false,
                    ActiveInActive = false,
                    Download = false,
                    Print = false
                });
            }

            var rights = _common.GetMenuRights(roleId, entityNo);
            return Ok(rights);
        }

        [HttpPost("FileUpload")]
        public async Task<IActionResult> FileUpload(string folderName)
        {
            var dict = new Dictionary<string, object>();

            try
            {
                var httpRequest = HttpContext.Request;

                foreach (var file in httpRequest.Form.Files)
                {
                    var result = await _common.FileUpload(file, folderName);
                    return Created(string.Empty, result);
                }

                dict.Add("error", "Please upload an image or voice recording.");
                return NotFound(dict);
            }
            catch (Exception ex)
            {
                dict.Add("error", "Some error occurred.");
                Exception objErr = ex.GetBaseException();
                _logger.LogError(ex, "Error in Common/FileUpload. BaseError={Error}", objErr.Message);
                return NotFound(dict);
            }
        }

        [HttpPost("SendEmail")]
        public async Task<IActionResult> SendEmail([FromForm] SendEmailRequest request)
        {
            try
            {
                byte[]? fileBytes = null;
                string? fileName = null;
                string? contentType = null;

                if (request.Attachment != null && request.Attachment.Length > 0)
                {
                    using var memoryStream = new MemoryStream();
                    await request.Attachment.CopyToAsync(memoryStream);
                    fileBytes = memoryStream.ToArray();
                    fileName = request.Attachment.FileName;
                    contentType = request.Attachment.ContentType;
                }

                await _common.SendEmail(
                    request.ToEmail ?? string.Empty,
                    request.CcEmail,
                    request.Subject ?? string.Empty,
                    request.Body ?? string.Empty,
                    fileBytes,
                    fileName,
                    contentType);

                return Ok(new
                {
                    Message = "Mail sent successfully."
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while sending email.");
                return BadRequest(new
                {
                    Message = ex.Message
                });
            }
        }

        [HttpPost("SendReportEmail")]
        public async Task<IActionResult> SendReportEmail([FromForm] SendReportEmailRequest request)
        {
            try
            {
                if (request.ReportId.GetValueOrDefault() <= 0)
                {
                    return BadRequest(new { Message = "ReportId is required." });
                }

                var reportResult = _reports.ExecuteReport(new ReportExecutionRequest
                {
                    RoleId = 0,
                    ReportId = request.ReportId.GetValueOrDefault(),
                    Filters = ParseReportFilters(request.OrderId.GetValueOrDefault(), request.ReportFiltersJson)
                });

                var emailBody = BuildReportEmailBody(reportResult);
                var pdfBytes = BuildReportPdf(reportResult);
                var pdfFileName = BuildReportPdfFileName(reportResult, request.OrderId.GetValueOrDefault());

                await _common.SendEmail(
                    request.ToEmail ?? string.Empty,
                    request.CcEmail,
                    request.Subject ?? string.Empty,
                    emailBody,
                    pdfBytes,
                    pdfFileName,
                    "application/pdf");

                return Ok(new
                {
                    Message = "Mail sent successfully."
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while sending report email.");
                return BadRequest(new
                {
                    Message = ex.Message
                });
            }
        }

        private static Dictionary<string, object?> ParseReportFilters(int orderId, string? reportFiltersJson)
        {
            var filters = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase);

            if (!string.IsNullOrWhiteSpace(reportFiltersJson))
            {
                try
                {
                    using var document = JsonDocument.Parse(reportFiltersJson);
                    if (document.RootElement.ValueKind == JsonValueKind.Object)
                    {
                        foreach (var property in document.RootElement.EnumerateObject())
                        {
                            filters[property.Name] = ConvertJsonValue(property.Value);
                        }
                    }
                }
                catch
                {
                    // Ignore malformed JSON and fall back to the explicit order id filter.
                }
            }

            if (orderId > 0 && !filters.ContainsKey("BillId"))
            {
                filters["BillId"] = orderId;
            }

            return filters;
        }

        private static object? ConvertJsonValue(JsonElement element)
        {
            return element.ValueKind switch
            {
                JsonValueKind.String => element.GetString(),
                JsonValueKind.Number when element.TryGetInt64(out var longValue) => longValue,
                JsonValueKind.Number => element.GetDecimal(),
                JsonValueKind.True => true,
                JsonValueKind.False => false,
                JsonValueKind.Null => null,
                JsonValueKind.Undefined => null,
                _ => element.GetRawText()
            };
        }

        private static string BuildReportEmailBody(object reportResult)
        {
            var root = ToDictionary(reportResult);
            var report = ToDictionary(GetValue(root, "report") ?? new Dictionary<string, object?>());
            var reportName = Convert.ToString(GetValue(report, "displayName"))
                ?? Convert.ToString(GetValue(report, "reportName"))
                ?? "Report";
            var reportId = Convert.ToInt32(GetValue(report, "id") ?? 0, CultureInfo.InvariantCulture);
            var rows = GetList(GetValue(root, "rows"));
            var rowCount = GetList(GetValue(root, "rows")).Count;

            if (reportId == 4)
            {
                var firstRow = rows.FirstOrDefault() ?? new Dictionary<string, object?>();
                var orderNumber = Convert.ToString(GetValue(firstRow, "OrderNumber")) ?? "Invoice";
                var customerName = Convert.ToString(GetValue(firstRow, "CustomerName")) ?? "Customer";
                var eventDate = FormatAsDate(GetValue(firstRow, "EventDate"));
                var totalAmount = FormatNumericText(GetValue(firstRow, "TotalAmount"), true);

                return "<p>Dear " + HtmlEncode(customerName) + ",</p>"
                    + "<p>Thank you for choosing <strong>Gayatri Catering</strong>. Please find attached the invoice PDF for your order <strong>" + HtmlEncode(orderNumber) + "</strong>.</p>"
                    + "<p><strong>Invoice Summary</strong><br>"
                    + "Event Date: " + HtmlEncode(eventDate) + "<br>"
                    + "Invoice Total: S$" + HtmlEncode(totalAmount) + "</p>"
                    + "<p>Kindly review the attached invoice and keep it for your reference. If you need any clarification regarding the order details, invoice amount, or payment status, please contact our team and we will assist you.</p>"
                    + "<p>Warm regards,<br><strong>Gayatri Catering</strong><br>Catering Hotline: +65 6294 6294<br>Email: catering@gayatri.com.sg</p>";
            }

            return "<p>Please find attached the <strong>" + HtmlEncode(reportName) + "</strong> PDF.</p>"
                + "<p>Records included: " + rowCount.ToString(CultureInfo.InvariantCulture) + "</p>"
                + "<p>Regards,<br>Gayatri Catering</p>";
        }

        private byte[] BuildReportPdf(object reportResult)
        {
            var root = ToDictionary(reportResult);
            var report = ToDictionary(GetValue(root, "report") ?? new Dictionary<string, object?>());
            var reportId = Convert.ToInt32(GetValue(report, "id") ?? 0, CultureInfo.InvariantCulture);
            var reportName = Convert.ToString(GetValue(report, "displayName"))
                ?? Convert.ToString(GetValue(report, "reportName"))
                ?? "Report";
            var rows = GetList(GetValue(root, "rows"));
            var columns = GetList(GetValue(root, "columns"));

            if (reportId == 4)
            {
                return BuildInvoicePdf(rows, logoImage);
                return BuildInvoicePdf(rows, LoadInvoiceLogoData());
            }

            var lines = new List<PdfTextLine>
            {
                new(reportName, true, 18),
                new($"Generated: {DateTime.Now:dd MMM yyyy HH:mm}", false, 10),
                new($"Row Count: {rows.Count}", false, 10),
                new(string.Empty),
            };

            if (!columns.Any())
            {
                lines.Add(new PdfTextLine("No data found.", true));
                return BuildSimplePdf(lines);
            }

            for (var rowIndex = 0; rowIndex < rows.Count; rowIndex++)
            {
                var row = rows[rowIndex];
                lines.Add(new PdfTextLine($"Record {rowIndex + 1}", true, 12));

                foreach (var column in columns)
                {
                    var columnDictionary = ToDictionary(column);
                    var header = Convert.ToString(GetValue(columnDictionary, "header"))
                        ?? Convert.ToString(GetValue(columnDictionary, "field"))
                        ?? "Field";
                    var field = Convert.ToString(GetValue(columnDictionary, "field")) ?? string.Empty;
                    var value = GetDisplayValue(GetValue(row, field), Convert.ToString(GetValue(columnDictionary, "type")));
                    lines.AddRange(BuildWrappedLines(header + ": " + value, 100));
                }

                lines.Add(new PdfTextLine(string.Empty));
            }

            return BuildSimplePdf(lines);
        }

        private byte[] BuildInvoicePdf(List<Dictionary<string, object?>> rows, PdfImageData? logoImage)
        {
            var firstRow = rows.FirstOrDefault() ?? new Dictionary<string, object?>();
            var pageWidth = 595f;
            var pageHeight = 842f;
            var left = 32f;
            var right = 563f;
            var pageTop = 810f;
            var pageBottom = 36f;
            var footerReserve = 150f;
            var pages = new List<string>();
            var stream = new StringBuilder();
            var y = pageTop;
            var isFirstPage = true;
            var totalTableWidth = right - left;
            var colNo = left + 30f;
            var colDesc = left + 280f;
            var colQty = left + 330f;
            var colUnit = left + 430f;

            void StartNewPage(bool includeMeta)
            {
                stream = new StringBuilder();
                y = pageTop;

                if (logoImage != null)
                {
                    AppendPdfImage(stream, logoImage, left, y - 44f, 112f, 44f);
                    AppendPdfText(stream, left, y - 56f, "Catering Hotline: +65 6294 6294", false, 10);
                }
                else
                {
                    AppendPdfText(stream, left, y, "Gayatri Restaurant", true, 16);
                    AppendPdfText(stream, left, y - 18f, "Catering Hotline: +65 6294 6294", false, 10);
                }

                AppendPdfText(stream, right, y, "TAX INVOICE", true, 22, PdfTextAlign.Right);
                AppendPdfText(stream, right, y - 18f, "GST Reg No. 201234567A", false, 10, PdfTextAlign.Right);
                AppendPdfText(stream, right, y - 34f, "INVOICE NO: " + GetString(firstRow, "OrderNumber"), true, 11, PdfTextAlign.Right);
                AppendPdfText(stream, right, y - 50f, "Order Date: " + FormatAsDate(GetValue(firstRow, "OrderDate")), false, 10, PdfTextAlign.Right);

                y -= 90f;

                if (includeMeta)
                {
                    AppendPdfText(stream, left, y, GetString(firstRow, "CustomerName"), true, 12);
                    y -= 16f;
                    foreach (var addressLine in BuildAddressLines(firstRow))
                    {
                        AppendPdfText(stream, left, y, addressLine, false, 10);
                        y -= 14f;
                    }
                    AppendPdfText(stream, left, y, "Tel: " + GetString(firstRow, "MobileNo"), false, 10);

                    var metaX = 340f;
                    var metaY = pageTop - 94f;
                    AppendPdfText(stream, metaX, metaY, "Invoice/Function Date:", true, 10);
                    AppendPdfText(stream, metaX + 140f, metaY, FormatAsDate(GetValue(firstRow, "EventDate")), false, 10);
                    AppendPdfText(stream, metaX, metaY - 16f, "Departure Time:", true, 10);
                    AppendPdfText(stream, metaX + 140f, metaY - 16f, "-", false, 10);
                    AppendPdfText(stream, metaX, metaY - 32f, "Consuming Time:", true, 10);
                    AppendPdfText(stream, metaX + 140f, metaY - 32f, GetString(firstRow, "MealPeriodName"), false, 10);
                    AppendPdfText(stream, metaX, metaY - 48f, "Location:", true, 10);
                    AppendPdfText(stream, metaX + 140f, metaY - 48f, GetString(firstRow, "Location"), false, 10);

                    y = Math.Min(y - 24f, metaY - 70f);
                }
                else
                {
                    AppendPdfText(stream, left, y, "Invoice Items (continued)", true, 12);
                    y -= 24f;
                }

                DrawInvoiceTableHeader(stream, left, right, ref y, colNo, colDesc, colQty, colUnit);
            }

            void FinishPage()
            {
                pages.Add(stream.ToString());
            }

            StartNewPage(true);

            foreach (var row in rows)
            {
                var descriptionLines = BuildInvoiceDescriptionLines(GetString(row, "Description"));
                var rowLineCount = Math.Max(1, descriptionLines.Count);
                var rowHeight = 18f + ((rowLineCount - 1) * 12f);

                if (y - rowHeight < pageBottom + footerReserve)
                {
                    FinishPage();
                    StartNewPage(false);
                }

                DrawInvoiceRow(stream, row, descriptionLines, left, right, ref y, colNo, colDesc, colQty, colUnit);
            }

            if (y - 160f < pageBottom)
            {
                FinishPage();
                StartNewPage(false);
            }

            DrawInvoiceSummary(stream, firstRow, left, right, ref y);
            DrawInvoiceTerms(stream, left, ref y);
            DrawInvoiceSignatures(stream, left, right, ref y);
            DrawInvoiceFooter(stream, left, right, pageBottom + 24f);
            FinishPage();

            return BuildPdfDocument(pages, pageWidth, pageHeight, logoImage);
        }

        private PdfImageData? LoadInvoiceLogoData()
        {
            var webRoot = string.IsNullOrWhiteSpace(_environment.WebRootPath)
                ? Path.Combine(_environment.ContentRootPath, "wwwroot")
                : _environment.WebRootPath;
            var logoPath = Path.Combine(webRoot, "images", "logo.jpg");

            if (!System.IO.File.Exists(logoPath))
            {
                return null;
            }

            var bytes = System.IO.File.ReadAllBytes(logoPath);
            return TryReadJpegDimensions(bytes, out var width, out var height)
                ? new PdfImageData(bytes, width, height)
                : null;
        }

        private static List<Dictionary<string, object?>> GetList(object? value)
        {
            var items = new List<Dictionary<string, object?>>();
            if (value is not IEnumerable enumerable)
            {
                return items;
            }

            foreach (var item in enumerable)
            {
                if (item is null)
                {
                    continue;
                }

                items.Add(ToDictionary(item));
            }

            return items;
        }

        private static string RenderLoops(string template, IDictionary<string, object?> context)
        {
            return Regex.Replace(template, @"{{#\s*([A-Za-z0-9_.]+)\s*}}([\s\S]*?){{/\s*\1\s*}}", match =>
            {
                var collectionPath = match.Groups[1].Value;
                var block = match.Groups[2].Value;
                var rows = ResolvePath(context, collectionPath) as IEnumerable;

                if (rows == null)
                {
                    return string.Empty;
                }

                var output = new System.Text.StringBuilder();
                foreach (var row in rows)
                {
                    if (row == null)
                    {
                        continue;
                    }

                    var rowContext = new Dictionary<string, object?>(context, StringComparer.OrdinalIgnoreCase);
                    foreach (var entry in ToDictionary(row))
                    {
                        rowContext[entry.Key] = entry.Value;
                    }

                    output.Append(RenderTokens(block, rowContext));
                }

                return output.ToString();
            }, RegexOptions.IgnoreCase | RegexOptions.Singleline);
        }

        private static string RenderTokens(string template, IDictionary<string, object?> context)
        {
            return Regex.Replace(template, @"{{\s*([^{}]+?)\s*}}", match =>
            {
                var expr = match.Groups[1].Value.Trim();
                if (string.IsNullOrWhiteSpace(expr) || expr.StartsWith("#") || expr.StartsWith("/"))
                {
                    return match.Value;
                }

                var parts = expr.Split('|');
                var path = parts[0].Trim();
                var format = parts.Length > 1 ? parts[1].Trim() : string.Empty;
                var value = ResolvePath(context, path);
                return FormatValue(value, format);
            }, RegexOptions.IgnoreCase | RegexOptions.Singleline);
        }

        private static object? ResolvePath(object? source, string path)
        {
            if (source == null || string.IsNullOrWhiteSpace(path))
            {
                return null;
            }

            object? current = source;
            foreach (var part in path.Split('.'))
            {
                if (current == null)
                {
                    return null;
                }

                if (int.TryParse(part, out var index) && index >= 0)
                {
                    if (current is IList list && index < list.Count)
                    {
                        current = list[index];
                        continue;
                    }

                    if (current is IEnumerable enumerable && current is not string)
                    {
                        current = enumerable.Cast<object?>().ElementAtOrDefault(index);
                        continue;
                    }
                }

                var dictionary = ToDictionary(current);
                var matchKey = dictionary.Keys.FirstOrDefault(key => string.Equals(key, part, StringComparison.OrdinalIgnoreCase));
                current = matchKey == null ? null : dictionary[matchKey];
            }

            return current;
        }

        private static string FormatValue(object? value, string format)
        {
            if (value == null)
            {
                return string.Empty;
            }

            var hint = format.ToLowerInvariant();
            if (hint == "date")
            {
                return DateTime.TryParse(Convert.ToString(value), out var dateValue)
                    ? dateValue.ToString("dd MMM yyyy")
                    : Convert.ToString(value) ?? string.Empty;
            }

            if (hint == "datetime")
            {
                return DateTime.TryParse(Convert.ToString(value), out var dateTimeValue)
                    ? dateTimeValue.ToString("dd MMM yyyy HH:mm")
                    : Convert.ToString(value) ?? string.Empty;
            }

            if (hint == "number")
            {
                return decimal.TryParse(Convert.ToString(value), out var numberValue)
                    ? numberValue.ToString("N0")
                    : Convert.ToString(value) ?? string.Empty;
            }

            if (hint == "currency")
            {
                return decimal.TryParse(Convert.ToString(value), out var currencyValue)
                    ? currencyValue.ToString("N2")
                    : Convert.ToString(value) ?? string.Empty;
            }

            return Convert.ToString(value) ?? string.Empty;
        }

        private static object? GetValue(IDictionary<string, object?> source, string key)
        {
            return source.TryGetValue(key, out var value) ? value : null;
        }

        private static Dictionary<string, object?> ToDictionary(object source)
        {
            if (source is IDictionary<string, object?> typedDictionary)
            {
                return new Dictionary<string, object?>(typedDictionary, StringComparer.OrdinalIgnoreCase);
            }

            if (source is IDictionary dictionary)
            {
                var values = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase);
                foreach (DictionaryEntry entry in dictionary)
                {
                    values[Convert.ToString(entry.Key) ?? string.Empty] = entry.Value;
                }
                return values;
            }

            var valuesFromObject = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase);
            foreach (var property in source.GetType().GetProperties())
            {
                valuesFromObject[property.Name] = property.GetValue(source);
            }

            return valuesFromObject;
        }

        private static string HtmlEncode(string value)
        {
            return System.Net.WebUtility.HtmlEncode(value ?? string.Empty);
        }

        private static string GetDisplayValue(object? value, string? typeHint)
        {
            if (value == null || value == DBNull.Value)
            {
                return string.Empty;
            }

            var hint = (typeHint ?? string.Empty).Trim().ToLowerInvariant();
            if (hint is "date" or "datetime")
            {
                if (DateTime.TryParse(Convert.ToString(value), CultureInfo.InvariantCulture, DateTimeStyles.None, out var dateValue))
                {
                    return hint == "date"
                        ? dateValue.ToString("dd MMM yyyy", CultureInfo.InvariantCulture)
                        : dateValue.ToString("dd MMM yyyy HH:mm", CultureInfo.InvariantCulture);
                }
            }

            if (hint is "number" or "currency")
            {
                if (decimal.TryParse(Convert.ToString(value), NumberStyles.Any, CultureInfo.InvariantCulture, out var decimalValue))
                {
                    return hint == "currency"
                        ? decimalValue.ToString("N2", CultureInfo.InvariantCulture)
                        : decimalValue.ToString("N0", CultureInfo.InvariantCulture);
                }
            }

            return Convert.ToString(value, CultureInfo.InvariantCulture) ?? string.Empty;
        }

        private static List<PdfTextLine> BuildWrappedLines(string text, int maxChars)
        {
            var output = new List<PdfTextLine>();
            var remaining = SanitizePdfText(text ?? string.Empty);

            if (string.IsNullOrWhiteSpace(remaining))
            {
                output.Add(new PdfTextLine(string.Empty));
                return output;
            }

            while (remaining.Length > maxChars)
            {
                var split = remaining.LastIndexOf(' ', maxChars);
                if (split <= 0)
                {
                    split = maxChars;
                }

                output.Add(new PdfTextLine(remaining.Substring(0, split).TrimEnd()));
                remaining = remaining.Substring(split).TrimStart();
            }

            output.Add(new PdfTextLine(remaining));
            return output;
        }

        private static string BuildReportPdfFileName(object reportResult, int orderId)
        {
            var root = ToDictionary(reportResult);
            var report = ToDictionary(GetValue(root, "report") ?? new Dictionary<string, object?>());
            var reportName = Convert.ToString(GetValue(report, "displayName"))
                ?? Convert.ToString(GetValue(report, "reportName"))
                ?? "Report";
            var orderNumber = GetList(GetValue(root, "rows")).FirstOrDefault() is Dictionary<string, object?> firstRow
                ? Convert.ToString(GetValue(firstRow, "OrderNumber"))
                : string.Empty;

            var cleanName = SanitizeFileName(!string.IsNullOrWhiteSpace(orderNumber) ? orderNumber : $"Order-{orderId}");
            return $"{SanitizeFileName(reportName)}-{cleanName}.pdf";
        }

        private static string SanitizeFileName(string value)
        {
            var invalid = Path.GetInvalidFileNameChars();
            var cleaned = new string((value ?? string.Empty).Select(ch => invalid.Contains(ch) ? '-' : ch).ToArray());
            return string.IsNullOrWhiteSpace(cleaned) ? "Report.pdf" : cleaned;
        }

        private static string SanitizePdfText(string value)
        {
            if (string.IsNullOrEmpty(value))
            {
                return string.Empty;
            }

            var builder = new StringBuilder(value.Length);
            foreach (var ch in value)
            {
                if (ch == '(' || ch == ')' || ch == '\\')
                {
                    builder.Append('\\').Append(ch);
                }
                else if (ch <= 255)
                {
                    builder.Append(ch);
                }
                else
                {
                    builder.Append('?');
                }
            }

            return builder.ToString();
        }

        private static byte[] BuildSimplePdf(List<PdfTextLine> lines)
        {
            const float pageWidth = 595f;
            const float pageHeight = 842f;
            const float leftMargin = 48f;
            const float topMargin = 48f;
            const float fontSize = 11f;
            const float titleFontSize = 18f;
            const float lineHeight = 15f;
            const int maxLinesPerPage = (int)((pageHeight - (topMargin * 2)) / lineHeight);

            var pages = new List<List<PdfTextLine>>();
            var currentPage = new List<PdfTextLine>();

            foreach (var line in lines)
            {
                var wrapped = string.IsNullOrWhiteSpace(line.Text)
                    ? new List<PdfTextLine> { line }
                    : BuildWrappedPdfLines(line);

                foreach (var wrappedLine in wrapped)
                {
                    if (currentPage.Count >= maxLinesPerPage)
                    {
                        pages.Add(currentPage);
                        currentPage = new List<PdfTextLine>();
                    }

                    currentPage.Add(wrappedLine);
                }
            }

            if (currentPage.Count > 0)
            {
                pages.Add(currentPage);
            }

            var pageStreams = pages
                .Select(page => BuildPageContentStream(page, pageWidth, pageHeight, leftMargin, topMargin, lineHeight, titleFontSize, fontSize))
                .ToList();
            return BuildPdfDocument(pageStreams, pageWidth, pageHeight, null);
        }

        private static byte[] BuildPdfDocument(List<string> pageStreams, float pageWidth, float pageHeight, PdfImageData? image)
        {
            var objects = new List<string>();
            objects.Add("<< /Type /Catalog /Pages 2 0 R >>");

            var kids = new StringBuilder();
            var objectNumber = image == null ? 5 : 6;
            for (var i = 0; i < pageStreams.Count; i++)
            {
                kids.Append(objectNumber).Append(" 0 R ");
                objectNumber += 2;
            }

            objects.Add($"<< /Type /Pages /Kids [{kids}] /Count {pageStreams.Count} >>");
            objects.Add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
            objects.Add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");

            if (image != null)
            {
                var imageHex = Convert.ToHexString(image.Bytes) + ">";
                objects.Add($"<< /Type /XObject /Subtype /Image /Width {image.Width} /Height {image.Height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter [/ASCIIHexDecode /DCTDecode] /Length {imageHex.Length} >>\nstream\n{imageHex}\nendstream");
            }

            foreach (var contentStream in pageStreams)
            {
                var contentObjectNumber = objects.Count + 2;
                var xObject = image == null ? string.Empty : " /XObject << /Im1 5 0 R >>";
                objects.Add($"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {pageWidth.ToString(CultureInfo.InvariantCulture)} {pageHeight.ToString(CultureInfo.InvariantCulture)}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >>{xObject} >> /Contents {contentObjectNumber} 0 R >>");
                objects.Add($"<< /Length {Encoding.ASCII.GetByteCount(contentStream)} >>\nstream\n{contentStream}\nendstream");
            }

            var pdf = new StringBuilder();
            pdf.Append("%PDF-1.4\n");

            var offsets = new List<int> { 0 };
            for (var i = 0; i < objects.Count; i++)
            {
                offsets.Add(Encoding.ASCII.GetByteCount(pdf.ToString()));
                pdf.Append(i + 1).Append(" 0 obj\n").Append(objects[i]).Append("\nendobj\n");
            }

            var xrefOffset = Encoding.ASCII.GetByteCount(pdf.ToString());
            pdf.Append("xref\n");
            pdf.Append("0 ").Append(objects.Count + 1).Append("\n");
            pdf.Append("0000000000 65535 f \n");
            for (var i = 1; i < offsets.Count; i++)
            {
                pdf.Append(offsets[i].ToString("D10", CultureInfo.InvariantCulture)).Append(" 00000 n \n");
            }

            pdf.Append("trailer\n");
            pdf.Append($"<< /Size {objects.Count + 1} /Root 1 0 R >>\n");
            pdf.Append("startxref\n");
            pdf.Append(xrefOffset.ToString(CultureInfo.InvariantCulture)).Append("\n%%EOF");

            return Encoding.ASCII.GetBytes(pdf.ToString());
        }

        private static List<PdfTextLine> BuildWrappedPdfLines(PdfTextLine line)
        {
            var text = line.Text ?? string.Empty;
            var maxChars = line.Bold ? 78 : 96;
            var wrapped = new List<PdfTextLine>();
            var remaining = SanitizePdfText(text);

            if (remaining.Length == 0)
            {
                wrapped.Add(line);
                return wrapped;
            }

            while (remaining.Length > maxChars)
            {
                var split = remaining.LastIndexOf(' ', maxChars);
                if (split <= 0)
                {
                    split = maxChars;
                }

                wrapped.Add(new PdfTextLine(remaining[..split].TrimEnd(), line.Bold, line.FontSize));
                remaining = remaining[split..].TrimStart();
            }

            wrapped.Add(new PdfTextLine(remaining, line.Bold, line.FontSize));
            return wrapped;
        }

        private static string BuildPageContentStream(List<PdfTextLine> pageLines, float pageWidth, float pageHeight, float leftMargin, float topMargin, float lineHeight, float titleFontSize, float fontSize)
        {
            var builder = new StringBuilder();
            var y = pageHeight - topMargin;

            foreach (var line in pageLines)
            {
                var font = line.Bold ? "/F2" : "/F1";
                var size = line.FontSize > 0 ? line.FontSize : (line.Bold ? titleFontSize : fontSize);
                builder.Append("BT ")
                    .Append(font).Append(' ').Append(size.ToString(CultureInfo.InvariantCulture)).Append(" Tf ")
                    .Append(leftMargin.ToString(CultureInfo.InvariantCulture)).Append(' ')
                    .Append(y.ToString(CultureInfo.InvariantCulture)).Append(" Td (")
                    .Append(SanitizePdfText(line.Text ?? string.Empty))
                    .Append(") Tj ET\n");

                y -= lineHeight;
            }

            return builder.ToString();
        }

        private static void DrawInvoiceTableHeader(StringBuilder stream, float left, float right, ref float y, float colNo, float colDesc, float colQty, float colUnit)
        {
            var rowTop = y;
            var rowBottom = y - 28f;
            DrawRect(stream, left, rowBottom, right - left, rowTop - rowBottom);
            DrawVerticalLine(stream, colNo, rowBottom, rowTop);
            DrawVerticalLine(stream, colDesc, rowBottom, rowTop);
            DrawVerticalLine(stream, colQty, rowBottom, rowTop);
            DrawVerticalLine(stream, colUnit, rowBottom, rowTop);

            AppendPdfText(stream, left + 14f, y - 18f, "NO", true, 10, PdfTextAlign.Center);
            AppendPdfText(stream, (colNo + colDesc) / 2f, y - 18f, "DESCRIPTION", true, 10, PdfTextAlign.Center);
            AppendPdfText(stream, (colDesc + colQty) / 2f, y - 12f, "NO OF", true, 9, PdfTextAlign.Center);
            AppendPdfText(stream, (colDesc + colQty) / 2f, y - 22f, "ITEMS", true, 9, PdfTextAlign.Center);
            AppendPdfText(stream, (colQty + colUnit) / 2f, y - 18f, "UNIT PRICE", true, 10, PdfTextAlign.Center);
            AppendPdfText(stream, (colUnit + right) / 2f, y - 18f, "TOTAL", true, 10, PdfTextAlign.Center);
            y = rowBottom;
        }

        private static void DrawInvoiceRow(StringBuilder stream, Dictionary<string, object?> row, List<string> descriptionLines, float left, float right, ref float y, float colNo, float colDesc, float colQty, float colUnit)
        {
            var rowLineCount = Math.Max(1, descriptionLines.Count);
            var rowTop = y;
            var rowBottom = y - (18f + ((rowLineCount - 1) * 12f));
            DrawRect(stream, left, rowBottom, right - left, rowTop - rowBottom);
            DrawVerticalLine(stream, colNo, rowBottom, rowTop);
            DrawVerticalLine(stream, colDesc, rowBottom, rowTop);
            DrawVerticalLine(stream, colQty, rowBottom, rowTop);
            DrawVerticalLine(stream, colUnit, rowBottom, rowTop);

            AppendPdfText(stream, left + 14f, rowTop - 16f, GetString(row, "No"), false, 10, PdfTextAlign.Center);

            var textY = rowTop - 16f;
            foreach (var line in descriptionLines)
            {
                AppendPdfText(stream, colNo + 8f, textY, line, false, 10);
                textY -= 12f;
            }

            AppendPdfText(stream, (colDesc + colQty) / 2f, rowTop - 16f, FormatNumericText(GetValue(row, "NoOfItems"), false), false, 10, PdfTextAlign.Center);
            AppendPdfText(stream, colUnit - 8f, rowTop - 16f, "S$" + FormatNumericText(GetValue(row, "UnitPrice"), true), false, 10, PdfTextAlign.Right);
            AppendPdfText(stream, right - 8f, rowTop - 16f, "S$" + FormatNumericText(GetValue(row, "Total"), true), false, 10, PdfTextAlign.Right);
            y = rowBottom;
        }

        private static void DrawInvoiceSummary(StringBuilder stream, Dictionary<string, object?> firstRow, float left, float right, ref float y)
        {
            var summaryLeft = right - 228f;
            var labels = new[]
            {
                ("Sub total", "S$" + FormatNumericText(GetValue(firstRow, "SubTotal"), true), false),
                (FormatNumericText(GetValue(firstRow, "TaxPercentage"), false) + "% GST", "S$" + FormatNumericText(GetValue(firstRow, "TaxAmount"), true), false),
                ("Grand Total", "S$" + FormatNumericText(GetValue(firstRow, "TotalAmount"), true), true),
                ("Balance Remaining", "S$" + FormatNumericText(GetValue(firstRow, "BalanceRemaining"), true), true)
            };

            foreach (var (label, amount, bold) in labels)
            {
                var rowTop = y;
                var rowBottom = y - 22f;
                DrawRect(stream, summaryLeft, rowBottom, right - summaryLeft, rowTop - rowBottom);
                DrawVerticalLine(stream, right - 88f, rowBottom, rowTop);
                AppendPdfText(stream, right - 96f, rowTop - 15f, label, bold, 10, PdfTextAlign.Right);
                AppendPdfText(stream, right - 8f, rowTop - 15f, amount, bold, 10, PdfTextAlign.Right);
                y = rowBottom;
            }

            y -= 18f;
        }

        private static void DrawInvoiceTerms(StringBuilder stream, float left, ref float y)
        {
            AppendPdfText(stream, left, y, "Terms & Conditions:", true, 12);
            y -= 18f;

            var terms = new[]
            {
                "Deposit paid is not refundable.",
                "Cheque should be made payable to GAYATRI RESTAURANT PTE LTD",
                "For order support, contact Hotline: +65 6294 6294 / Email: catering@gayatri.com.sg",
                "Food best consumed within 3 hours from consuming time."
            };

            foreach (var term in terms)
            {
                AppendPdfText(stream, left, y, term, false, 10);
                y -= 15f;
            }

            y -= 30f;
        }

        private static void DrawInvoiceSignatures(StringBuilder stream, float left, float right, ref float y)
        {
            var lineY = y;
            DrawHorizontalLine(stream, left + 70f, left + 210f, lineY);
            DrawHorizontalLine(stream, right - 210f, right - 70f, lineY);
            AppendPdfText(stream, left + 140f, lineY - 14f, "Authorise Signature", false, 10, PdfTextAlign.Center);
            AppendPdfText(stream, right - 140f, lineY - 14f, "Customer Signature", false, 10, PdfTextAlign.Center);
            y = lineY - 42f;
        }

        private static void DrawInvoiceFooter(StringBuilder stream, float left, float right, float y)
        {
            AppendPdfText(stream, (left + right) / 2f, y + 26f, "Gayatri Restaurant Pte Ltd", true, 11, PdfTextAlign.Center);
            AppendPdfText(stream, (left + right) / 2f, y + 12f, "2 Tessensohn Road, Singapore 217664", false, 9, PdfTextAlign.Center);
            AppendPdfText(stream, (left + right) / 2f, y - 2f, "Tel: +65 6294 6294   Email: catering@gayatri.com.sg", false, 9, PdfTextAlign.Center);
            AppendPdfText(stream, (left + right) / 2f, y - 16f, "UEN: 201234567A", false, 9, PdfTextAlign.Center);
        }

        private static List<string> BuildInvoiceDescriptionLines(string description)
        {
            var normalized = (description ?? string.Empty).Replace("\r", string.Empty);
            var parts = normalized
                .Split(new[] { "\n" }, StringSplitOptions.RemoveEmptyEntries)
                .SelectMany(line => line.Split(new[] { " - " }, StringSplitOptions.RemoveEmptyEntries))
                .Select(part => part.Trim())
                .Where(part => !string.IsNullOrWhiteSpace(part))
                .ToList();

            if (!parts.Any())
            {
                return new List<string> { string.Empty };
            }

            var lines = new List<string> { parts[0] };
            for (var i = 1; i < parts.Count; i++)
            {
                lines.Add("- " + parts[i]);
            }

            return lines.SelectMany(line => WrapPlainText(line, 52)).ToList();
        }

        private static IEnumerable<string> BuildAddressLines(Dictionary<string, object?> row)
        {
            var lines = new[]
            {
                GetString(row, "Address"),
                GetString(row, "Location"),
                GetString(row, "Pincode")
            };

            var filtered = lines.Where(line => !string.IsNullOrWhiteSpace(line)).ToList();
            
            // Remove consecutive duplicates
            var deduplicated = new List<string>();
            string? previousLine = null;
            foreach (var line in filtered)
            {
                if (line != previousLine)
                {
                    deduplicated.Add(line);
                    previousLine = line;
                }
            }
            
            return deduplicated;
        }

        private static IEnumerable<string> WrapPlainText(string text, int maxChars)
        {
            var remaining = (text ?? string.Empty).Trim();
            if (remaining.Length == 0)
            {
                yield return string.Empty;
                yield break;
            }

            while (remaining.Length > maxChars)
            {
                var split = remaining.LastIndexOf(' ', maxChars);
                if (split <= 0)
                {
                    split = maxChars;
                }

                yield return remaining[..split].TrimEnd();
                remaining = remaining[split..].TrimStart();
            }

            yield return remaining;
        }

        private static string GetString(Dictionary<string, object?> row, string key)
        {
            return Convert.ToString(GetValue(row, key), CultureInfo.InvariantCulture) ?? string.Empty;
        }

        private static string FormatAsDate(object? value)
        {
            return DateTime.TryParse(Convert.ToString(value, CultureInfo.InvariantCulture), CultureInfo.InvariantCulture, DateTimeStyles.None, out var dateValue)
                ? dateValue.ToString("dd MMM yyyy", CultureInfo.InvariantCulture)
                : string.Empty;
        }

        private static string FormatNumericText(object? value, bool currency)
        {
            if (decimal.TryParse(Convert.ToString(value, CultureInfo.InvariantCulture), NumberStyles.Any, CultureInfo.InvariantCulture, out var number))
            {
                return number.ToString(currency ? "N2" : "N0", CultureInfo.InvariantCulture);
            }

            return string.Empty;
        }

        private static void AppendPdfText(StringBuilder stream, float x, float y, string text, bool bold, float fontSize, PdfTextAlign align = PdfTextAlign.Left)
        {
            var output = SanitizePdfText(text ?? string.Empty);
            var adjustedX = x;
            if (align != PdfTextAlign.Left)
            {
                var width = EstimateTextWidth(output, fontSize, bold);
                if (align == PdfTextAlign.Right)
                {
                    adjustedX -= width;
                }
                else if (align == PdfTextAlign.Center)
                {
                    adjustedX -= width / 2f;
                }
            }

            stream.Append("BT ")
                .Append(bold ? "/F2 " : "/F1 ")
                .Append(fontSize.ToString(CultureInfo.InvariantCulture)).Append(" Tf ")
                .Append(adjustedX.ToString(CultureInfo.InvariantCulture)).Append(' ')
                .Append(y.ToString(CultureInfo.InvariantCulture)).Append(" Td (")
                .Append(output)
                .Append(") Tj ET\n");
        }

        private static float EstimateTextWidth(string text, float fontSize, bool bold)
        {
            var factor = bold ? 0.56f : 0.52f;
            return (text?.Length ?? 0) * fontSize * factor;
        }

        private static void AppendPdfImage(StringBuilder stream, PdfImageData image, float x, float y, float width, float height)
        {
            stream.Append("q ")
                .Append(width.ToString(CultureInfo.InvariantCulture)).Append(" 0 0 ")
                .Append(height.ToString(CultureInfo.InvariantCulture)).Append(' ')
                .Append(x.ToString(CultureInfo.InvariantCulture)).Append(' ')
                .Append(y.ToString(CultureInfo.InvariantCulture)).Append(" cm /Im1 Do Q\n");
        }

        private static bool TryReadJpegDimensions(byte[] jpegBytes, out int width, out int height)
        {
            width = 0;
            height = 0;

            if (jpegBytes.Length < 4 || jpegBytes[0] != 0xFF || jpegBytes[1] != 0xD8)
            {
                return false;
            }

            var index = 2;
            while (index + 8 < jpegBytes.Length)
            {
                if (jpegBytes[index] != 0xFF)
                {
                    index++;
                    continue;
                }

                var marker = jpegBytes[index + 1];
                index += 2;

                if (marker == 0xD9 || marker == 0xDA)
                {
                    break;
                }

                if (index + 1 >= jpegBytes.Length)
                {
                    break;
                }

                var segmentLength = (jpegBytes[index] << 8) + jpegBytes[index + 1];
                if (segmentLength < 2 || index + segmentLength > jpegBytes.Length)
                {
                    break;
                }

                if (marker is 0xC0 or 0xC1 or 0xC2 or 0xC3 or 0xC5 or 0xC6 or 0xC7 or 0xC9 or 0xCA or 0xCB or 0xCD or 0xCE or 0xCF)
                {
                    height = (jpegBytes[index + 3] << 8) + jpegBytes[index + 4];
                    width = (jpegBytes[index + 5] << 8) + jpegBytes[index + 6];
                    return width > 0 && height > 0;
                }

                index += segmentLength;
            }

            return false;
        }

        private static void DrawRect(StringBuilder stream, float x, float y, float width, float height)
        {
            stream.Append(x.ToString(CultureInfo.InvariantCulture)).Append(' ')
                .Append(y.ToString(CultureInfo.InvariantCulture)).Append(' ')
                .Append(width.ToString(CultureInfo.InvariantCulture)).Append(' ')
                .Append(height.ToString(CultureInfo.InvariantCulture)).Append(" re S\n");
        }

        private static void DrawVerticalLine(StringBuilder stream, float x, float y1, float y2)
        {
            stream.Append(x.ToString(CultureInfo.InvariantCulture)).Append(' ')
                .Append(y1.ToString(CultureInfo.InvariantCulture)).Append(" m ")
                .Append(x.ToString(CultureInfo.InvariantCulture)).Append(' ')
                .Append(y2.ToString(CultureInfo.InvariantCulture)).Append(" l S\n");
        }

        private static void DrawHorizontalLine(StringBuilder stream, float x1, float x2, float y)
        {
            stream.Append(x1.ToString(CultureInfo.InvariantCulture)).Append(' ')
                .Append(y.ToString(CultureInfo.InvariantCulture)).Append(" m ")
                .Append(x2.ToString(CultureInfo.InvariantCulture)).Append(' ')
                .Append(y.ToString(CultureInfo.InvariantCulture)).Append(" l S\n");
        }

        private enum PdfTextAlign
        {
            Left,
            Center,
            Right
        }

        private sealed record PdfImageData(byte[] Bytes, int Width, int Height);
        private sealed record PdfTextLine(string Text, bool Bold = false, float FontSize = 0);
    }
}

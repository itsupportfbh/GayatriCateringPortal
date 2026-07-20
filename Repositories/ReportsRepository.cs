using System;
using System.Collections;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text.Json;
using GayatriCateringPortal.Common;
using GayatriCateringPortal.Data;
using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models.Reports;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Hosting;

namespace GayatriCateringPortal.Repositories;

public class ReportsRepository : IReportsRepository
{
    private readonly IHostEnvironment _environment;
    private readonly IConfiguration _configuration;

    public ReportsRepository(IHostEnvironment environment, IConfiguration configuration)
    {
        _environment = environment;
        _configuration = configuration;
    }

    public object GetReport(string name)
    {
        return new { message = "Use /Admin/Reports endpoints for report catalog and preview." };
    }

    public IEnumerable<object> GetCategories(int roleId)
    {
        if (roleId <= 0)
        {
            return new List<object>();
        }

        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        IDataReader? reader = null;

        try
        {
            conn = DataFactory.CreateConnection();
            cmd = DataFactory.CreateCommand("SP_Report_GetCategories", conn);
            ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add(DataFactory.CreateParameter("@RoleId", roleId));
            conn.Open();
            reader = DataFactory.ExecuteReader(cmd);

            var list = new List<object>();
            while (reader.Read())
            {
                list.Add(new
                {
                    id = reader["Id"] != DBNull.Value ? Convert.ToInt32(reader["Id"]) : 0,
                    name = reader["Name"] != DBNull.Value ? Convert.ToString(reader["Name"]) : string.Empty,
                    displayOrder = reader["DisplayOrder"] != DBNull.Value ? Convert.ToInt32(reader["DisplayOrder"]) : 0,
                    reportCount = reader["ReportCount"] != DBNull.Value ? Convert.ToInt32(reader["ReportCount"]) : 0
                });
            }

            return list;
        }
        catch (SqlException)
        {
            throw new InvalidOperationException("Unable to load report categories.");
        }
        finally
        {
            reader?.Close();
            if (conn != null && conn.State != ConnectionState.Closed) conn.Close();
        }
    }

    public IEnumerable<object> GetReports(int roleId, int? categoryId = null)
    {
        if (roleId <= 0)
        {
            return new List<object>();
        }

        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        IDataReader? reader = null;

        try
        {
            conn = DataFactory.CreateConnection();
            cmd = DataFactory.CreateCommand("SP_Report_GetReports", conn);
            ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add(DataFactory.CreateParameter("@RoleId", roleId));
            cmd.Parameters.Add(DataFactory.CreateParameter("@CategoryId", categoryId.HasValue ? categoryId.Value : DBNull.Value));
            conn.Open();
            reader = DataFactory.ExecuteReader(cmd);

            var list = new List<object>();
            while (reader.Read())
            {
                var templatePath = reader["TemplatePath"] != DBNull.Value ? Convert.ToString(reader["TemplatePath"]) : string.Empty;
                list.Add(new
                {
                    id = reader["Id"] != DBNull.Value ? Convert.ToInt32(reader["Id"]) : 0,
                    categoryId = reader["CategoryId"] != DBNull.Value ? Convert.ToInt32(reader["CategoryId"]) : 0,
                    categoryName = reader["CategoryName"] != DBNull.Value ? Convert.ToString(reader["CategoryName"]) : string.Empty,
                    reportCode = reader["ReportCode"] != DBNull.Value ? Convert.ToString(reader["ReportCode"]) : string.Empty,
                    reportName = reader["ReportName"] != DBNull.Value ? Convert.ToString(reader["ReportName"]) : string.Empty,
                    displayName = reader["DisplayName"] != DBNull.Value ? Convert.ToString(reader["DisplayName"]) : string.Empty,
                    description = reader["Description"] != DBNull.Value ? Convert.ToString(reader["Description"]) : string.Empty,
                    storedProcedure = reader["StoredProcedure"] != DBNull.Value ? Convert.ToString(reader["StoredProcedure"]) : string.Empty,
                    templateName = reader["TemplateName"] != DBNull.Value ? Convert.ToString(reader["TemplateName"]) : string.Empty,
                    templatePath,
                    reportType = reader["ReportType"] != DBNull.Value ? Convert.ToString(reader["ReportType"]) : string.Empty,
                    viewerType = reader["ViewerType"] != DBNull.Value ? Convert.ToString(reader["ViewerType"]) : string.Empty,
                    paperWidth = reader["PaperWidth"] != DBNull.Value ? Convert.ToDecimal(reader["PaperWidth"]) : 0,
                    paperHeight = reader["PaperHeight"] != DBNull.Value ? Convert.ToDecimal(reader["PaperHeight"]) : 0,
                    orientation = reader["Orientation"] != DBNull.Value ? Convert.ToString(reader["Orientation"]) : string.Empty,
                    isThermal = reader["IsThermal"] != DBNull.Value && Convert.ToBoolean(reader["IsThermal"]),
                    isLandscape = reader["IsLandscape"] != DBNull.Value && Convert.ToBoolean(reader["IsLandscape"]),
                    displayOrder = reader["DisplayOrder"] != DBNull.Value ? Convert.ToInt32(reader["DisplayOrder"]) : 0,
                    icon = reader["Icon"] != DBNull.Value ? Convert.ToString(reader["Icon"]) : string.Empty,
                    canView = reader["CanView"] != DBNull.Value && Convert.ToBoolean(reader["CanView"]),
                    canPrint = reader["CanPrint"] != DBNull.Value && Convert.ToBoolean(reader["CanPrint"]),
                    exportPdf = reader["ExportPdf"] != DBNull.Value && Convert.ToBoolean(reader["ExportPdf"]),
                    exportExcel = reader["ExportExcel"] != DBNull.Value && Convert.ToBoolean(reader["ExportExcel"]),
                    templateExists = ReportLayoutAssetHelper.Exists(_environment, _configuration, templatePath)
                });
            }

            return list;
        }
        catch (SqlException)
        {
            throw new InvalidOperationException("Unable to load report list.");
        }
        finally
        {
            reader?.Close();
            if (conn != null && conn.State != ConnectionState.Closed) conn.Close();
        }
    }

    public IEnumerable<object> GetReportPermissions(int roleId)
    {
        if (roleId <= 0)
        {
            return new List<object>();
        }

        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        IDataReader? reader = null;

        try
        {
            conn = DataFactory.CreateConnection();
            conn.Open();

            cmd = DataFactory.CreateCommand("SP_Report_GetPermissions", conn);
            ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add(DataFactory.CreateParameter("@RoleId", roleId));

            reader = DataFactory.ExecuteReader(cmd);

            var list = new List<object>();
            while (reader.Read())
            {
                list.Add(new
                {
                    id = reader["Id"] != DBNull.Value ? Convert.ToInt32(reader["Id"]) : 0,
                    categoryId = reader["CategoryId"] != DBNull.Value ? Convert.ToInt32(reader["CategoryId"]) : 0,
                    categoryName = reader["CategoryName"] != DBNull.Value ? Convert.ToString(reader["CategoryName"]) : string.Empty,
                    reportCode = reader["ReportCode"] != DBNull.Value ? Convert.ToString(reader["ReportCode"]) : string.Empty,
                    reportName = reader["ReportName"] != DBNull.Value ? Convert.ToString(reader["ReportName"]) : string.Empty,
                    displayName = reader["DisplayName"] != DBNull.Value ? Convert.ToString(reader["DisplayName"]) : string.Empty,
                    canView = reader["CanView"] != DBNull.Value && Convert.ToBoolean(reader["CanView"]),
                    canPrint = reader["CanPrint"] != DBNull.Value && Convert.ToBoolean(reader["CanPrint"]),
                    exportPdf = reader["ExportPdf"] != DBNull.Value && Convert.ToBoolean(reader["ExportPdf"]),
                    exportExcel = reader["ExportExcel"] != DBNull.Value && Convert.ToBoolean(reader["ExportExcel"])
                });
            }

            return list;
        }
        catch (SqlException)
        {
            throw new InvalidOperationException("Unable to load report permissions.");
        }
        finally
        {
            reader?.Close();
            if (conn != null && conn.State != ConnectionState.Closed) conn.Close();
        }
    }

    public string SaveReportPermission(List<ReportPermissionRequest> reportPermissions)
    {
        if (reportPermissions == null || reportPermissions.Count == 0)
        {
            return "No records to save.";
        }

        IDbConnection? conn = null;
        SqlTransaction? tx = null;

        try
        {
            conn = DataFactory.CreateConnection();
            conn.Open();
            tx = ((SqlConnection)conn).BeginTransaction();

            foreach (var permission in reportPermissions)
            {
                using var cmd = new SqlCommand("SP_Report_SavePermission", (SqlConnection)conn, tx);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@RoleId", permission.RoleId);
                cmd.Parameters.AddWithValue("@ReportId", permission.ReportId);
                cmd.Parameters.AddWithValue("@CanView", permission.CanView);
                cmd.Parameters.AddWithValue("@CanPrint", permission.CanPrint);
                cmd.Parameters.AddWithValue("@ExportPdf", permission.ExportPdf);
                cmd.Parameters.AddWithValue("@ExportExcel", permission.ExportExcel);
                cmd.ExecuteNonQuery();
            }

            tx.Commit();
            return "Success";
        }
        catch (SqlException)
        {
            tx?.Rollback();
            throw new InvalidOperationException("Unable to save report permissions.");
        }
        finally
        {
            if (conn != null && conn.State != ConnectionState.Closed) conn.Close();
        }
    }

    public object? GetReportDefinition(int roleId, int reportId)
    {
        if (roleId <= 0 || reportId <= 0)
        {
            return null;
        }

        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        IDataReader? reader = null;

        try
        {
            conn = DataFactory.CreateConnection();
            conn.Open();

            cmd = DataFactory.CreateCommand("SP_Report_GetDefinition", conn);
            ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add(DataFactory.CreateParameter("@RoleId", roleId));
            cmd.Parameters.Add(DataFactory.CreateParameter("@ReportId", reportId));

            reader = DataFactory.ExecuteReader(cmd);
            if (!reader.Read())
            {
                return null;
            }

            var templatePath = reader["TemplatePath"] != DBNull.Value ? Convert.ToString(reader["TemplatePath"]) : string.Empty;

            var report = new
            {
                id = reader["Id"] != DBNull.Value ? Convert.ToInt32(reader["Id"]) : 0,
                categoryId = reader["CategoryId"] != DBNull.Value ? Convert.ToInt32(reader["CategoryId"]) : 0,
                categoryName = reader["CategoryName"] != DBNull.Value ? Convert.ToString(reader["CategoryName"]) : string.Empty,
                reportCode = reader["ReportCode"] != DBNull.Value ? Convert.ToString(reader["ReportCode"]) : string.Empty,
                reportName = reader["ReportName"] != DBNull.Value ? Convert.ToString(reader["ReportName"]) : string.Empty,
                displayName = reader["DisplayName"] != DBNull.Value ? Convert.ToString(reader["DisplayName"]) : string.Empty,
                description = reader["Description"] != DBNull.Value ? Convert.ToString(reader["Description"]) : string.Empty,
                storedProcedure = reader["StoredProcedure"] != DBNull.Value ? Convert.ToString(reader["StoredProcedure"]) : string.Empty,
                templateName = reader["TemplateName"] != DBNull.Value ? Convert.ToString(reader["TemplateName"]) : string.Empty,
                templatePath,
                reportType = reader["ReportType"] != DBNull.Value ? Convert.ToString(reader["ReportType"]) : string.Empty,
                viewerType = reader["ViewerType"] != DBNull.Value ? Convert.ToString(reader["ViewerType"]) : string.Empty,
                paperWidth = reader["PaperWidth"] != DBNull.Value ? Convert.ToDecimal(reader["PaperWidth"]) : 0,
                paperHeight = reader["PaperHeight"] != DBNull.Value ? Convert.ToDecimal(reader["PaperHeight"]) : 0,
                orientation = reader["Orientation"] != DBNull.Value ? Convert.ToString(reader["Orientation"]) : string.Empty,
                isThermal = reader["IsThermal"] != DBNull.Value && Convert.ToBoolean(reader["IsThermal"]),
                isLandscape = reader["IsLandscape"] != DBNull.Value && Convert.ToBoolean(reader["IsLandscape"]),
                icon = reader["Icon"] != DBNull.Value ? Convert.ToString(reader["Icon"]) : string.Empty,
                canView = reader["CanView"] != DBNull.Value && Convert.ToBoolean(reader["CanView"]),
                canPrint = reader["CanPrint"] != DBNull.Value && Convert.ToBoolean(reader["CanPrint"]),
                exportPdf = reader["ExportPdf"] != DBNull.Value && Convert.ToBoolean(reader["ExportPdf"]),
                exportExcel = reader["ExportExcel"] != DBNull.Value && Convert.ToBoolean(reader["ExportExcel"]),
                templateExists = ReportLayoutAssetHelper.Exists(_environment, _configuration, templatePath),
                templateKind = ReportLayoutAssetHelper.ResolveTemplateKind(_environment, _configuration, templatePath)
            };

            reader.Close();

            var filterCmd = DataFactory.CreateCommand("SP_Report_GetFilters", conn);
            ((SqlCommand)filterCmd).CommandType = CommandType.StoredProcedure;
            filterCmd.Parameters.Add(DataFactory.CreateParameter("@ReportId", reportId));

            using var filterReader = DataFactory.ExecuteReader(filterCmd);
            var filters = new List<object>();
            while (filterReader.Read())
            {
                filters.Add(new
                {
                    id = filterReader["Id"] != DBNull.Value ? Convert.ToInt32(filterReader["Id"]) : 0,
                    reportId = filterReader["ReportId"] != DBNull.Value ? Convert.ToInt32(filterReader["ReportId"]) : 0,
                    fieldName = filterReader["FieldName"] != DBNull.Value ? Convert.ToString(filterReader["FieldName"]) : string.Empty,
                    displayName = filterReader["DisplayName"] != DBNull.Value ? Convert.ToString(filterReader["DisplayName"]) : string.Empty,
                    controlType = filterReader["ControlType"] != DBNull.Value ? Convert.ToString(filterReader["ControlType"]) : string.Empty,
                    dataType = filterReader["DataType"] != DBNull.Value ? Convert.ToString(filterReader["DataType"]) : string.Empty,
                    isRequired = filterReader["IsRequired"] != DBNull.Value && Convert.ToBoolean(filterReader["IsRequired"]),
                    displayOrder = filterReader["DisplayOrder"] != DBNull.Value ? Convert.ToInt32(filterReader["DisplayOrder"]) : 0,
                    isActive = filterReader["IsActive"] == DBNull.Value || Convert.ToBoolean(filterReader["IsActive"]),
                    isShow = filterReader["IsShow"] != DBNull.Value && Convert.ToBoolean(filterReader["IsShow"])
                });
            }

            return new
            {
                report,
                filters
            };
        }
        catch (SqlException)
        {
            throw new InvalidOperationException("Unable to load report definition.");
        }
        finally
        {
            reader?.Close();
            if (conn != null && conn.State != ConnectionState.Closed) conn.Close();
        }
    }

    public object ExecuteReport(ReportExecutionRequest request)
    {
        if (request.ReportId <= 0)
        {
            throw new ArgumentException("Valid report is required.");
        }

        var definition = request.RoleId > 0
            ? GetReportDefinition(request.RoleId, request.ReportId)
            : GetReportDefinitionById(request.ReportId);
        if (definition == null)
        {
            throw new KeyNotFoundException(request.RoleId > 0
                ? "Report definition not found or access denied."
                : "Report definition not found.");
        }

        var reportObject = ((IDictionary<string, object?>)ToDictionary(definition))["report"];
        if (reportObject == null)
        {
            throw new KeyNotFoundException("Report definition not found.");
        }

        var report = ToDictionary(reportObject);
        var storedProcedure = Convert.ToString(GetDictionaryValue(report, "storedProcedure")) ?? string.Empty;
        if (string.IsNullOrWhiteSpace(storedProcedure))
        {
            throw new InvalidOperationException("Stored procedure is not configured for this report.");
        }

        var filters = request.Filters ?? new Dictionary<string, object?>();
        var normalizedFilters = new Dictionary<string, object?>(filters, StringComparer.OrdinalIgnoreCase);

        IDbConnection? conn = null;
        SqlCommand? cmd = null;

        try
        {
            conn = DataFactory.CreateConnection();
            conn.Open();

            cmd = (SqlCommand)DataFactory.CreateCommand(storedProcedure, conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandTimeout = 180;

            SqlCommandBuilder.DeriveParameters(cmd);

            foreach (SqlParameter parameter in cmd.Parameters)
            {
                if (parameter.Direction == ParameterDirection.ReturnValue)
                {
                    continue;
                }

                var key = parameter.ParameterName.TrimStart('@');
                if (!normalizedFilters.TryGetValue(key, out var value) || value == null || string.IsNullOrWhiteSpace(Convert.ToString(value)))
                {
                    parameter.Value = DBNull.Value;
                    continue;
                }

                parameter.Value = ConvertForSqlType(value, parameter.SqlDbType, key);
            }

            using var reader = cmd.ExecuteReader();
            var resultSets = new List<object>();
            var primaryRows = new List<Dictionary<string, object?>>();
            var primaryColumns = new List<object>();
            var index = 0;

            do
            {
                index++;
                var rows = new List<Dictionary<string, object?>>();
                var columns = new List<object>();

                for (var i = 0; i < reader.FieldCount; i++)
                {
                    columns.Add(new
                    {
                        field = reader.GetName(i),
                        header = ToHeaderText(reader.GetName(i)),
                        type = ResolveColumnType(reader.GetFieldType(i))
                    });
                }

                while (reader.Read())
                {
                    var row = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase);
                    for (var i = 0; i < reader.FieldCount; i++)
                    {
                        row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                    }
                    rows.Add(row);
                }

                resultSets.Add(new
                {
                    name = index == 1 ? "header" : $"result{index}",
                    index,
                    columns,
                    rows,
                    rowCount = rows.Count
                });

                if (rows.Count > primaryRows.Count)
                {
                    primaryRows = rows;
                    primaryColumns = columns;
                }
            } while (reader.NextResult());

            var templatePath = Convert.ToString(GetDictionaryValue(report, "templatePath"));

            return new
            {
                report,
                templateKind = ReportLayoutAssetHelper.ResolveTemplateKind(_environment, _configuration, templatePath),
                layoutAsset = ReportLayoutAssetHelper.LoadJson(_environment, _configuration, templatePath),
                htmlTemplate = ReportLayoutAssetHelper.LoadHtml(_environment, _configuration, templatePath),
                columns = primaryColumns,
                rows = primaryRows,
                rowCount = primaryRows.Count,
                resultSets,
                executedAt = DateTime.UtcNow
            };
        }
        catch (SqlException)
        {
            throw new InvalidOperationException("Unable to execute report. Please verify report filters and setup.");
        }
        finally
        {
            cmd?.Dispose();
            if (conn != null && conn.State != ConnectionState.Closed) conn.Close();
        }
    }

    private object? GetReportDefinitionById(int reportId)
    {
        if (reportId <= 0)
        {
            return null;
        }

        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        IDataReader? reader = null;

        try
        {
            conn = DataFactory.CreateConnection();
            conn.Open();

            cmd = DataFactory.CreateCommand(@"
                SELECT TOP 1
                    r.Id,
                    r.CategoryId,
                    c.Name AS CategoryName,
                    r.ReportCode,
                    r.ReportName,
                    r.DisplayName,
                    r.Description,
                    r.StoredProcedure,
                    r.TemplateName,
                    r.TemplatePath,
                    r.ReportType,
                    r.ViewerType,
                    r.PaperWidth,
                    r.PaperHeight,
                    r.Orientation,
                    r.IsThermal,
                    r.IsLandscape,
                    r.Icon,
                    CanView = CAST(1 AS BIT),
                    CanPrint = CAST(1 AS BIT),
                    ExportPdf = CAST(1 AS BIT),
                    ExportExcel = CAST(0 AS BIT)
                FROM dbo.ReportMaster r
                INNER JOIN dbo.ReportCategory c ON c.Id = r.CategoryId
                WHERE r.Id = @ReportId
                  AND r.IsDeleted = 0
                  AND r.IsActive = 1
                  AND c.IsDeleted = 0
                  AND c.IsActive = 1", conn);
            ((SqlCommand)cmd).CommandType = CommandType.Text;
            cmd.Parameters.Add(DataFactory.CreateParameter("@ReportId", reportId));

            reader = DataFactory.ExecuteReader(cmd);
            if (!reader.Read())
            {
                return null;
            }

            var templatePath = reader["TemplatePath"] != DBNull.Value ? Convert.ToString(reader["TemplatePath"]) : string.Empty;

            return new
            {
                report = new
                {
                    id = reader["Id"] != DBNull.Value ? Convert.ToInt32(reader["Id"]) : 0,
                    categoryId = reader["CategoryId"] != DBNull.Value ? Convert.ToInt32(reader["CategoryId"]) : 0,
                    categoryName = reader["CategoryName"] != DBNull.Value ? Convert.ToString(reader["CategoryName"]) : string.Empty,
                    reportCode = reader["ReportCode"] != DBNull.Value ? Convert.ToString(reader["ReportCode"]) : string.Empty,
                    reportName = reader["ReportName"] != DBNull.Value ? Convert.ToString(reader["ReportName"]) : string.Empty,
                    displayName = reader["DisplayName"] != DBNull.Value ? Convert.ToString(reader["DisplayName"]) : string.Empty,
                    description = reader["Description"] != DBNull.Value ? Convert.ToString(reader["Description"]) : string.Empty,
                    storedProcedure = reader["StoredProcedure"] != DBNull.Value ? Convert.ToString(reader["StoredProcedure"]) : string.Empty,
                    templateName = reader["TemplateName"] != DBNull.Value ? Convert.ToString(reader["TemplateName"]) : string.Empty,
                    templatePath,
                    reportType = reader["ReportType"] != DBNull.Value ? Convert.ToString(reader["ReportType"]) : string.Empty,
                    viewerType = reader["ViewerType"] != DBNull.Value ? Convert.ToString(reader["ViewerType"]) : string.Empty,
                    paperWidth = reader["PaperWidth"] != DBNull.Value ? Convert.ToDecimal(reader["PaperWidth"]) : 0,
                    paperHeight = reader["PaperHeight"] != DBNull.Value ? Convert.ToDecimal(reader["PaperHeight"]) : 0,
                    orientation = reader["Orientation"] != DBNull.Value ? Convert.ToString(reader["Orientation"]) : string.Empty,
                    isThermal = reader["IsThermal"] != DBNull.Value && Convert.ToBoolean(reader["IsThermal"]),
                    isLandscape = reader["IsLandscape"] != DBNull.Value && Convert.ToBoolean(reader["IsLandscape"]),
                    icon = reader["Icon"] != DBNull.Value ? Convert.ToString(reader["Icon"]) : string.Empty,
                    canView = true,
                    canPrint = true,
                    exportPdf = true,
                    exportExcel = false,
                    templateExists = ReportLayoutAssetHelper.Exists(_environment, _configuration, templatePath),
                    templateKind = ReportLayoutAssetHelper.ResolveTemplateKind(_environment, _configuration, templatePath)
                },
                filters = Enumerable.Empty<object>()
            };
        }
        catch (SqlException)
        {
            throw new InvalidOperationException("Unable to load report definition.");
        }
        finally
        {
            reader?.Close();
            if (conn != null && conn.State != ConnectionState.Closed) conn.Close();
        }
    }

    private static IDictionary<string, object?> ToDictionary(object source)
    {
        if (source is IDictionary<string, object?> dictionary)
        {
            return dictionary;
        }

        return source.GetType().GetProperties()
            .ToDictionary(property => property.Name, property => property.GetValue(source), StringComparer.OrdinalIgnoreCase);
    }

    private static object? GetDictionaryValue(IDictionary<string, object?> source, string key)
    {
        if (source.TryGetValue(key, out var value))
        {
            return value;
        }

        return null;
    }

    private static object ConvertForSqlType(object value, SqlDbType sqlDbType, string parameterName)
    {
        value = NormalizeJsonValue(value);

        switch (sqlDbType)
        {
            case SqlDbType.Int:
                return Convert.ToInt32(value, CultureInfo.InvariantCulture);
            case SqlDbType.BigInt:
                return Convert.ToInt64(value, CultureInfo.InvariantCulture);
            case SqlDbType.Decimal:
            case SqlDbType.Money:
            case SqlDbType.SmallMoney:
                return Convert.ToDecimal(value, CultureInfo.InvariantCulture);
            case SqlDbType.Bit:
                if (value is bool boolValue) return boolValue;
                return Convert.ToString(value)?.Trim() == "1" || Convert.ToString(value)?.Trim().Equals("true", StringComparison.OrdinalIgnoreCase) == true;
            case SqlDbType.Date:
            case SqlDbType.DateTime:
            case SqlDbType.DateTime2:
                {
                    var parsed = Convert.ToDateTime(value, CultureInfo.InvariantCulture);
                    if (parameterName.Equals("ToDate", StringComparison.OrdinalIgnoreCase) && parsed.TimeOfDay == TimeSpan.Zero)
                    {
                        return parsed.AddDays(1);
                    }
                    return parsed;
                }
            default:
                return Convert.ToString(value) ?? string.Empty;
        }
    }

    private static object? NormalizeJsonValue(object? value)
    {
        if (value is not JsonElement jsonElement)
        {
            return value;
        }

        return jsonElement.ValueKind switch
        {
            JsonValueKind.Undefined or JsonValueKind.Null => null,
            JsonValueKind.String => jsonElement.GetString(),
            JsonValueKind.Number => jsonElement.TryGetInt64(out var longValue)
                ? longValue
                : jsonElement.TryGetDecimal(out var decimalValue)
                    ? decimalValue
                    : jsonElement.GetDouble(),
            JsonValueKind.True => true,
            JsonValueKind.False => false,
            _ => jsonElement.ToString()
        };
    }

    private static string ResolveColumnType(Type fieldType)
    {
        if (fieldType == typeof(DateTime) || fieldType == typeof(DateTimeOffset)) return "date";
        if (fieldType == typeof(decimal) || fieldType == typeof(double) || fieldType == typeof(float)) return "number";
        if (fieldType == typeof(int) || fieldType == typeof(long) || fieldType == typeof(short)) return "number";
        if (fieldType == typeof(bool)) return "boolean";
        return "text";
    }

    private static string ToHeaderText(string fieldName)
    {
        if (string.IsNullOrWhiteSpace(fieldName)) return string.Empty;

        var chars = new List<char>(fieldName.Length + 8);
        for (var i = 0; i < fieldName.Length; i++)
        {
            var current = fieldName[i];
            if (i > 0 && char.IsUpper(current) && !char.IsWhiteSpace(fieldName[i - 1]))
            {
                chars.Add(' ');
            }
            chars.Add(current == '_' ? ' ' : current);
        }

        return new string(chars.ToArray()).Trim();
    }
}

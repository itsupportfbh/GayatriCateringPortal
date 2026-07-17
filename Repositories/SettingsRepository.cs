using GayatriCateringPortal.Data;
using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.Data.SqlClient;
using System;
using System.Data;

namespace GayatriCateringPortal.Repositories;

public class SettingsRepository : ISettingsRepository
{
    public List<Organization> GetAll()
    {
        var list = new List<Organization>();
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        IDataReader? reader = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                conn.Open();
                using (cmd = DataFactory.CreateCommand("GetOrganization", conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                    reader = DataFactory.ExecuteReader(cmd);
                    list = this.List(reader);
                }
            }
            return list ?? new List<Organization>();
        }
        catch (SqlException ex)
        {
            throw new Exception("Database error while loading organization settings: " + ex.Message, ex);
        }
        catch (Exception ex)
        {
            throw new Exception("Unable to load organization settings: " + ex.Message, ex);
        }
        finally
        {
            if (conn != null && conn.State != ConnectionState.Closed) conn.Close();
        }
    }

    public int Create(Organization item)
    {
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                conn.Open();
                using (cmd = DataFactory.CreateCommand("SP_CreateOrganization", conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Name", (object?)item.Name ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@UEN", (object?)item.UEN ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Address", (object?)item.Address ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Email", (object?)item.Email ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Hotline", (object?)item.Hotline ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@whatsapp", (object?)item.Whatsapp ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@DefaultDeposit", item.DefaultDeposit));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@QuotationValidity", item.QuotationValidity));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@MinOrderPax", item.MinOrderPax));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@GSTRate", item.GSTRate));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Servicecharge", item.Servicecharge));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@PortalMode", item.PortalMode));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@GSTNO", (object?)item.GSTNO ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@IsActive", item.IsActive));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@IsDeleted", item.IsDeleted));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@CreatedBy", item.CreatedBy));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@CreatedDate", item.CreatedDate));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@AccountHolderName", (object?)item.AccountHolderName ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@IFSCCode", (object?)item.IFSCCode ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@AccNo", (object?)item.AccNo ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@UPIId", (object?)item.UPIId ?? DBNull.Value));

                    var result = DataFactory.ExecuteScalar(cmd);
                    if (result != null)
                    {
                        return Convert.ToInt32(result);
                    }
                }
            }
        }
        catch (SqlException)
        {
            throw new Exception("Database error");
        }
        catch (Exception ex)
        {
            throw new Exception(ex.StackTrace);
        }
        finally
        {
            if (conn != null && conn.State != ConnectionState.Closed) conn.Close();
        }
        return 0;
    }

    public int Update(Organization item)
    {
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                conn.Open();
                using (cmd = DataFactory.CreateCommand("SP_UpdateOrganization", conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Id", item.Id));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Name", (object?)item.Name ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@UEN", (object?)item.UEN ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Address", (object?)item.Address ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Email", (object?)item.Email ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Hotline", (object?)item.Hotline ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@whatsapp", (object?)item.Whatsapp ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@DefaultDeposit", item.DefaultDeposit));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@QuotationValidity", item.QuotationValidity));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@MinOrderPax", item.MinOrderPax));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@GSTRate", item.GSTRate));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Servicecharge", item.Servicecharge));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@PortalMode", item.PortalMode));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@GSTNO", (object?)item.GSTNO ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@IsActive", item.IsActive));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@IsDeleted", item.IsDeleted));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@UpdatedBy", item.UpdatedBy));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@UpdatedDate", item.UpdatedDate));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@AccountHolderName", (object?)item.AccountHolderName ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@IFSCCode", (object?)item.IFSCCode ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@AccNo", (object?)item.AccNo ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@UPIId", (object?)item.UPIId ?? DBNull.Value));

                    var result = DataFactory.ExecuteScalar(cmd);
                    if (result != null)
                    {
                        int status = Convert.ToInt32(result);
                        return status;
                    }
                }
            }
        }
        catch (SqlException)
        {
            throw new Exception("Database error");
        }
        catch (Exception ex)
        {
            throw new Exception(ex.StackTrace);
        }
        finally
        {
            if (conn != null && conn.State != ConnectionState.Closed) conn.Close();
        }
        return 0;
    }

    #region Private Methods
    private List<Organization> List(IDataReader reader)
    {
        var list = new List<Organization>();
        try
        {
            var columns = Enumerable.Range(0, reader.FieldCount)
                .Select(reader.GetName)
                .ToHashSet(StringComparer.OrdinalIgnoreCase);

            object? Value(string column) =>
                columns.Contains(column) && reader[column] != DBNull.Value ? reader[column] : null;

            while (reader.Read())
            {
                var item = new Organization
                {
                    Id = Value("Id") is { } id ? Convert.ToInt32(id) : 0,
                    Name = Convert.ToString(Value("Name")) ?? string.Empty,
                    UEN = Convert.ToString(Value("UEN")) ?? string.Empty,
                    Address = Convert.ToString(Value("Address")) ?? string.Empty,
                    Email = Convert.ToString(Value("Email")) ?? string.Empty,
                    Hotline = Convert.ToString(Value("Hotline")) ?? string.Empty,
                    Whatsapp = Convert.ToString(Value("Whatsapp")) ?? string.Empty,
                    DefaultDeposit = Value("DefaultDeposit") is { } deposit ? Convert.ToInt32(deposit) : 0,
                    QuotationValidity = Value("QuotationValidity") is { } validity ? Convert.ToInt32(validity) : 0,
                    MinOrderPax = Value("MinOrderPax") is { } minPax ? Convert.ToInt32(minPax) : 0,
                    GSTRate = Value("GSTRate") is { } gst ? Convert.ToInt32(gst) : 0,
                    Servicecharge = Value("Servicecharge") is { } charge ? Convert.ToInt32(charge) : 0,
                    PortalMode = Convert.ToString(Value("PortalMode")) ?? string.Empty,
                    GSTNO = Convert.ToString(Value("GSTNO")) ?? string.Empty,
                    IsActive = Value("IsActive") is { } active && Convert.ToBoolean(active),
                    IsDeleted = Value("IsDeleted") is { } deleted && Convert.ToBoolean(deleted),
                    CreatedBy = Value("CreatedBy") is { } createdBy ? Convert.ToInt32(createdBy) : 0,
                    CreatedDate = Convert.ToDateTime(Value("CreatedDate")),
                    UpdatedBy = Value("UpdatedBy") is { } updatedBy ? Convert.ToInt32(updatedBy) : 0,
                    UpdatedDate = Convert.ToDateTime(Value("UpdatedDate")),
                    AccountHolderName = Convert.ToString(Value("AccountHolderName")) ?? string.Empty,
                    IFSCCode = Convert.ToString(Value("IFSCCode")) ?? string.Empty,
                    AccNo = Convert.ToString(Value("AccNo")) ?? string.Empty,
                    UPIId = Convert.ToString(Value("UPIId")) ?? string.Empty
                };

                list.Add(item);
            }
        }
        catch (SqlException ex)
        {
            throw new Exception("Database error while reading organization settings: " + ex.Message, ex);
        }
        catch (Exception ex)
        {
            throw new Exception("Unable to read organization settings: " + ex.Message, ex);
        }

        return list;
    }
    #endregion
}

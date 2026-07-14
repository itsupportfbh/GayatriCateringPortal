using System.Data;
using Microsoft.Data.SqlClient;
using GayatriCateringPortal.Models;
using GayatriCateringPortal.Data;
using GayatriCateringPortal.Interfaces;

namespace GayatriCateringPortal.Repositories;

public class CustomerRepository : ICustomerRepository
{
    public List<CustomerMaster> GetAll()
    {
        List<CustomerMaster> list = new List<CustomerMaster>();
        IDbConnection conn = null;
        IDbCommand cmd = null;
        IDataReader reader = null;

        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                conn.Open();
                using (cmd = DataFactory.CreateCommand("[dbo].[SP_GetCustomerMaster]", conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                    reader = DataFactory.ExecuteReader(cmd);
                    list = this.List(reader);
                }
            }

            return list ?? new List<CustomerMaster>();
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
    }

    public CustomerMaster? GetById(int id)
    {
        IDbConnection conn = null;
        IDbCommand cmd = null;
        IDataReader reader = null;
        CustomerMaster? item = null;

        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                if (conn.State == ConnectionState.Closed) conn.Open();
                using (cmd = DataFactory.CreateCommand("[dbo].[SP_GetCustomerMasterById]", conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Id", id));
                    reader = DataFactory.ExecuteReader(cmd);
                    var list = this.List(reader);
                    if (list != null && list.Count > 0) item = list[0];
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

        return item;
    }

    public int Create(CustomerMaster customer)
    {
        try
        {
            using (IDbConnection conn = DataFactory.CreateConnection())
            {
                conn.Open();

                EnsureEmailAndMobileAvailable(conn, customer.EmailId, customer.MobileNo, 0);

                using (IDbCommand cmd = DataFactory.CreateCommand("[dbo].[SP_CreateCustomerMaster]", conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add(DataFactory.CreateParameter("@Code", customer.Code ?? (object)DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Name", customer.Name ?? (object)DBNull.Value));

                    cmd.Parameters.Add(DataFactory.CreateParameter("@MobileNo", customer.MobileNo ?? (object)DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@EmailId", customer.EmailId ?? (object)DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@CompanyName", customer.CompanyName ?? (object)DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@AddressLine1", customer.AddressLine1 ?? (object)DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@AddressLine2", customer.AddressLine2 ?? (object)DBNull.Value));

                    cmd.Parameters.Add(DataFactory.CreateParameter("@CityId", customer.CityId));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@StateId", customer.StateId));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@CountryId", customer.CountryId));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Pincode", customer.Pincode ?? (object)DBNull.Value));

                    cmd.Parameters.Add(DataFactory.CreateParameter("@DateOfBirth", customer.DateOfBirth ?? (object)DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Gender", customer.Gender ?? (object)DBNull.Value));

                    cmd.Parameters.Add(DataFactory.CreateParameter("@Remarks", customer.Remarks ?? (object)DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@IsActive", customer.IsActive));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@IsDeleted", customer.IsDeleted));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@CreatedBy", customer.CreatedBy));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@CreatedDate", DateTime.Now));

                    var result = DataFactory.ExecuteScalar(cmd);

                    if (result != null && result != DBNull.Value)
                    {
                        customer.Id = Convert.ToInt32(result);
                        return customer.Id;
                    }
                }
            }
        }
        catch (SqlException ex)
        {
            throw new Exception("Database error: " + ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }

        return 0;
    }

    public bool Update(CustomerMaster customer)
    {
        try
        {
            using (IDbConnection conn = DataFactory.CreateConnection())
            {
                conn.Open();

                EnsureEmailAndMobileAvailable(conn, customer.EmailId, customer.MobileNo, customer.Id);

                using (IDbCommand cmd = DataFactory.CreateCommand("[dbo].[SP_UpdateCustomerMaster]", conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add(DataFactory.CreateParameter("@Id", customer.Id));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Code", customer.Code ?? (object)DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Name", customer.Name ?? (object)DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@MobileNo", customer.MobileNo ?? (object)DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@EmailId", customer.EmailId ?? (object)DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@CompanyName", customer.CompanyName ?? (object)DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@AddressLine1", customer.AddressLine1 ?? (object)DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@AddressLine2", customer.AddressLine2 ?? (object)DBNull.Value));

                    cmd.Parameters.Add(DataFactory.CreateParameter("@CityId", customer.CityId));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@StateId", customer.StateId));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@CountryId", customer.CountryId));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Pincode", customer.Pincode ?? (object)DBNull.Value));

                    cmd.Parameters.Add(DataFactory.CreateParameter("@DateOfBirth", customer.DateOfBirth ?? (object)DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Gender", customer.Gender ?? (object)DBNull.Value));

                    cmd.Parameters.Add(DataFactory.CreateParameter("@Remarks", customer.Remarks ?? (object)DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@IsActive", customer.IsActive));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@IsDeleted", customer.IsDeleted));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@UpdatedBy", customer.UpdatedBy));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@UpdatedDate", DateTime.Now));

                    var result = DataFactory.ExecuteScalar(cmd);

                    return result != null && result != DBNull.Value && Convert.ToInt32(result) > 0;
                }
            }
        }
        catch (SqlException ex)
        {
            throw new Exception("Database error: " + ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    private static void EnsureEmailAndMobileAvailable(
        IDbConnection conn,
        string? emailId,
        string? mobileNo,
        int currentId)
    {
        if (!string.IsNullOrWhiteSpace(emailId))
        {
            using IDbCommand emailCmd = DataFactory.CreateCommand(
                @"SELECT COUNT(1)
                  FROM dbo.CustomerMaster
                  WHERE LTRIM(RTRIM(EmailId)) = LTRIM(RTRIM(@EmailId))
                    AND Id <> @CurrentId
                    AND ISNULL(IsDeleted, 0) = 0",
                conn);

            emailCmd.Parameters.Add(DataFactory.CreateParameter("@EmailId", emailId.Trim()));
            emailCmd.Parameters.Add(DataFactory.CreateParameter("@CurrentId", currentId));

            if (Convert.ToInt32(DataFactory.ExecuteScalar(emailCmd)) > 0)
                throw new ArgumentException("Email ID already exists.");
        }

        if (!string.IsNullOrWhiteSpace(mobileNo))
        {
            using IDbCommand mobileCmd = DataFactory.CreateCommand(
                @"SELECT COUNT(1)
                  FROM dbo.CustomerMaster
                  WHERE LTRIM(RTRIM(MobileNo)) = LTRIM(RTRIM(@MobileNo))
                    AND Id <> @CurrentId
                    AND ISNULL(IsDeleted, 0) = 0",
                conn);

            mobileCmd.Parameters.Add(DataFactory.CreateParameter("@MobileNo", mobileNo.Trim()));
            mobileCmd.Parameters.Add(DataFactory.CreateParameter("@CurrentId", currentId));

            if (Convert.ToInt32(DataFactory.ExecuteScalar(mobileCmd)) > 0)
                throw new ArgumentException("Mobile Number already exists.");
        }
    }


    public bool Delete(int id)
    {
        IDbConnection conn = null;
        IDbCommand cmd = null;
        bool taskStatus = false;

        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                if (conn.State == ConnectionState.Closed) conn.Open();
                using (cmd = DataFactory.CreateCommand("[dbo].[DeleteCustomerMasterById]", conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Id", id));
                    var r = DataFactory.ExecuteScalar(cmd);
                    if (r != null && Convert.ToInt32(r) > 0)
                        taskStatus = true;
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

        return taskStatus;
    }

    public bool ActiveInActive(int id, bool status)
    {

        IDbConnection conn = null;
        IDbCommand cmd = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                if (conn.State == ConnectionState.Closed) conn.Open();
                using (cmd = DataFactory.CreateCommand("[dbo].[ActiveInActiveCustomerMasterById]", conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Id", id));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@IsActive", status));
                    var r = DataFactory.ExecuteScalar(cmd);
                    return r != null && Convert.ToInt32(r) > 0;
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
    }

    //common
    private List<CustomerMaster> List(IDataReader reader)
    {
        var list = new List<CustomerMaster>();

        try
        {
            while (reader.Read())
            {
                var customer = new CustomerMaster();

                if (reader["Id"] != DBNull.Value) customer.Id = ToInt(reader["Id"]);

                if (reader["Code"] != DBNull.Value)  customer.Code = Convert.ToString(reader["Code"]);

                if (reader["Name"] != DBNull.Value) customer.Name = Convert.ToString(reader["Name"]) ?? string.Empty;

                if (reader["MobileNo"] != DBNull.Value)customer.MobileNo = Convert.ToString(reader["MobileNo"]);

                if (reader["EmailId"] != DBNull.Value)customer.EmailId = Convert.ToString(reader["EmailId"]);

                if (reader["CompanyName"] != DBNull.Value) customer.CompanyName = Convert.ToString(reader["CompanyName"]);

                if (reader["AddressLine1"] != DBNull.Value) customer.AddressLine1 = Convert.ToString(reader["AddressLine1"]);

                if (reader["AddressLine2"] != DBNull.Value)  customer.AddressLine2 = Convert.ToString(reader["AddressLine2"]);

                if (reader["CityId"] != DBNull.Value) customer.CityId = ToInt(reader["CityId"]);

                if (reader["StateId"] != DBNull.Value) customer.StateId = ToInt(reader["StateId"]);

                if (reader["CountryId"] != DBNull.Value) customer.CountryId = ToInt(reader["CountryId"]);

                if (reader["Pincode"] != DBNull.Value) customer.Pincode = Convert.ToString(reader["Pincode"]);

                if (reader["DateOfBirth"] != DBNull.Value) customer.DateOfBirth = ToNullableDate(reader["DateOfBirth"]);

                if (reader["Gender"] != DBNull.Value) customer.Gender = ToNullableInt(reader["Gender"]);

                if (reader["Remarks"] != DBNull.Value) customer.Remarks = Convert.ToString(reader["Remarks"]);

                if (reader["IsActive"] != DBNull.Value) customer.IsActive = ToBool(reader["IsActive"]);

                if (reader["IsDeleted"] != DBNull.Value) customer.IsDeleted = ToBool(reader["IsDeleted"]);

                if (reader["CreatedBy"] != DBNull.Value) customer.CreatedBy = ToInt(reader["CreatedBy"]);

                if (reader["CreatedDate"] != DBNull.Value) customer.CreatedDate = ToNullableDate(reader["CreatedDate"]) ?? default;

                if (reader["UpdatedBy"] != DBNull.Value) customer.UpdatedBy = ToNullableInt(reader["UpdatedBy"]);

                if (reader["UpdatedDate"] != DBNull.Value) customer.UpdatedDate = ToNullableDate(reader["UpdatedDate"]);

                list.Add(customer);
            }
        }
        catch (SqlException ex)
        {
            throw new Exception("Database error: " + ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception("Customer mapping error: " + ex.Message, ex);
        }

        return list;
    }

    private static int ToInt(object value)
    {
        return int.TryParse(Convert.ToString(value), out var result) ? result : 0;
    }

    private static int? ToNullableInt(object value)
    {
        return int.TryParse(Convert.ToString(value), out var result) ? result : null;
    }

    private static DateTime? ToNullableDate(object value)
    {
        return DateTime.TryParse(Convert.ToString(value), out var result) ? result : null;
    }

    private static bool ToBool(object value)
    {
        var text = Convert.ToString(value);
        return text == "1" || bool.TryParse(text, out var result) && result;
    }


   



}


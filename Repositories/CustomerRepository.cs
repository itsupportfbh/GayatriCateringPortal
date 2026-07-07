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
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        IDataReader? reader = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                conn.Open();
                using (cmd = DataFactory.CreateCommand(@"SELECT Id, Code, Name, MobileNo, EmailId, CompanyName, AddressLine1, AddressLine2, CityId, StateId, CountryId, Pincode, DateOfBirth, Gender, Remarks, IsActive, CreatedBy, CreatedDate, UpdatedBy, UpdatedDate, IsDeleted FROM CustomerMaster WHERE IsDeleted = 0", conn))
                {
                    reader = DataFactory.ExecuteReader(cmd);
                    list = new List<CustomerMaster>();
                    while (reader.Read())
                    {
                        list.Add(ReadCustomer((SqlDataReader)reader));
                    }
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
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        IDataReader? reader = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                using (cmd = DataFactory.CreateCommand(@"SELECT Id, Code, Name, MobileNo, EmailId, CompanyName, AddressLine1, AddressLine2, CityId, StateId, CountryId, Pincode, DateOfBirth, Gender, Remarks, IsActive, CreatedBy, CreatedDate, UpdatedBy, UpdatedDate, IsDeleted FROM CustomerMaster WHERE Id = @Id", conn))
                {
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Id", id));
                    if (conn.State == ConnectionState.Closed) conn.Open();
                    reader = DataFactory.ExecuteReader(cmd);
                    if (reader.Read())
                    {
                        return ReadCustomer((SqlDataReader)reader);
                    }
                }
            }
            return null;
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

    public int Create(CustomerMaster customer)
    {
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                var query = @"INSERT INTO CustomerMaster (Code, Name, MobileNo, EmailId, CompanyName, AddressLine1, AddressLine2, CityId, StateId, CountryId, Pincode, DateOfBirth, Gender, Remarks, IsActive, CreatedBy, CreatedDate, IsDeleted)
                              OUTPUT INSERTED.Id
                              VALUES (@Code, @Name, @MobileNo, @EmailId, @CompanyName, @AddressLine1, @AddressLine2, @CityId, @StateId, @CountryId, @Pincode, @DateOfBirth, @Gender, @Remarks, @IsActive, @CreatedBy, @CreatedDate, @IsDeleted)";

                using (cmd = DataFactory.CreateCommand(query, conn))
                {
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Code", (object?)customer.Code ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Name", (object?)customer.Name ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@MobileNo", (object?)customer.MobileNo ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@EmailId", (object?)customer.EmailId ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@CompanyName", (object?)customer.CompanyName ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@AddressLine1", (object?)customer.AddressLine1 ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@AddressLine2", (object?)customer.AddressLine2 ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@CityId", customer.CityId == 0 ? (object)DBNull.Value : customer.CityId));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@StateId", customer.StateId == 0 ? (object)DBNull.Value : customer.StateId));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@CountryId", customer.CountryId == 0 ? (object)DBNull.Value : customer.CountryId));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Pincode", (object?)customer.Pincode ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@DateOfBirth", customer.DateOfBirth.HasValue ? (object)customer.DateOfBirth.Value : DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Gender", customer.Gender.HasValue ? (object)customer.Gender.Value : DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Remarks", (object?)customer.Remarks ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@IsActive", customer.IsActive));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@CreatedBy", customer.CreatedBy == 0 ? (object)DBNull.Value : customer.CreatedBy));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@CreatedDate", customer.CreatedDate == default ? DateTime.Now : customer.CreatedDate));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@IsDeleted", customer.IsDeleted));

                    conn.Open();
                    var result = DataFactory.ExecuteScalar(cmd);
                    if (result != null && int.TryParse(Convert.ToString(result), out var newId))
                    {
                        return newId;
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

    public bool Update(CustomerMaster customer)
    {
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                var query = @"UPDATE CustomerMaster SET Code = @Code, Name = @Name, MobileNo = @MobileNo, EmailId = @EmailId, CompanyName = @CompanyName, AddressLine1 = @AddressLine1, AddressLine2 = @AddressLine2, CityId = @CityId, StateId = @StateId, CountryId = @CountryId, Pincode = @Pincode, DateOfBirth = @DateOfBirth, Gender = @Gender, Remarks = @Remarks, IsActive = @IsActive, UpdatedBy = @UpdatedBy, UpdatedDate = @UpdatedDate, IsDeleted = @IsDeleted WHERE Id = @Id";

                using (cmd = DataFactory.CreateCommand(query, conn))
                {
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Id", customer.Id));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Code", (object?)customer.Code ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Name", (object?)customer.Name ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@MobileNo", (object?)customer.MobileNo ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@EmailId", (object?)customer.EmailId ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@CompanyName", (object?)customer.CompanyName ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@AddressLine1", (object?)customer.AddressLine1 ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@AddressLine2", (object?)customer.AddressLine2 ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@CityId", customer.CityId == 0 ? (object)DBNull.Value : customer.CityId));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@StateId", customer.StateId == 0 ? (object)DBNull.Value : customer.StateId));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@CountryId", customer.CountryId == 0 ? (object)DBNull.Value : customer.CountryId));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Pincode", (object?)customer.Pincode ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@DateOfBirth", customer.DateOfBirth.HasValue ? (object)customer.DateOfBirth.Value : DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Gender", customer.Gender.HasValue ? (object)customer.Gender.Value : DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Remarks", (object?)customer.Remarks ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@IsActive", customer.IsActive));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@UpdatedBy", customer.UpdatedBy.HasValue ? (object)customer.UpdatedBy.Value : DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@UpdatedDate", customer.UpdatedDate.HasValue ? (object)customer.UpdatedDate.Value : DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@IsDeleted", customer.IsDeleted));

                    conn.Open();
                    return DataFactory.ExecuteNonQuery(cmd) > 0;
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

    public bool Delete(int id)
    {
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                using (cmd = DataFactory.CreateCommand("UPDATE CustomerMaster SET IsDeleted = 1 WHERE Id = @Id", conn))
                {
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Id", id));
                    conn.Open();
                    return cmd.ExecuteNonQuery() > 0;
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

    public bool ActiveInActive(int id)
    {
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                using (cmd = DataFactory.CreateCommand("UPDATE UserMaster SET IsActive = CASE WHEN IsActive = 1 THEN 0 ELSE 1 END WHERE Id = @Id", conn))
                {
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Id", id));
                    conn.Open();
                    return cmd.ExecuteNonQuery() > 0;
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

    private static CustomerMaster ReadCustomer(SqlDataReader reader)
    {
        return new CustomerMaster
        {
            Id = reader["Id"] != DBNull.Value ? Convert.ToInt32(reader["Id"]) : 0,
            Code = reader["Code"]?.ToString(),
            Name = reader["Name"]?.ToString() ?? string.Empty,
            MobileNo = reader["MobileNo"]?.ToString(),
            EmailId = reader["EmailId"]?.ToString(),
            CompanyName = reader["CompanyName"]?.ToString(),
            AddressLine1 = reader["AddressLine1"]?.ToString(),
            AddressLine2 = reader["AddressLine2"]?.ToString(),
            CityId = reader["CityId"] != DBNull.Value ? Convert.ToInt32(reader["CityId"]) : 0,
            StateId = reader["StateId"] != DBNull.Value ? Convert.ToInt32(reader["StateId"]) : 0,
            CountryId = reader["CountryId"] != DBNull.Value ? Convert.ToInt32(reader["CountryId"]) : 0,
            Pincode = reader["Pincode"]?.ToString(),
            DateOfBirth = reader["DateOfBirth"] != DBNull.Value ? (DateTime?)Convert.ToDateTime(reader["DateOfBirth"]) : null,
            Gender = reader["Gender"] != DBNull.Value ? (int?)Convert.ToInt32(reader["Gender"]) : null,
            Remarks = reader["Remarks"]?.ToString(),
            IsActive = reader["IsActive"] != DBNull.Value ? Convert.ToBoolean(reader["IsActive"]) : false,
            CreatedBy = reader["CreatedBy"] != DBNull.Value ? Convert.ToInt32(reader["CreatedBy"]) : 0,
            CreatedDate = reader["CreatedDate"] != DBNull.Value ? Convert.ToDateTime(reader["CreatedDate"]) : DateTime.MinValue,
            UpdatedBy = reader["UpdatedBy"] != DBNull.Value ? (int?)Convert.ToInt32(reader["UpdatedBy"]) : null,
            UpdatedDate = reader["UpdatedDate"] != DBNull.Value ? (DateTime?)Convert.ToDateTime(reader["UpdatedDate"]) : null,
            IsDeleted = reader["IsDeleted"] != DBNull.Value ? Convert.ToBoolean(reader["IsDeleted"]) : false
        };
    }
}


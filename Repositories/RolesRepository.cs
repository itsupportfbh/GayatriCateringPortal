using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using GayatriCateringPortal.Data;
using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Repositories;

public class RolesRepository : IRolesRepository
{
    public List<RoleMaster> GetAll()
    {
        var list = new List<RoleMaster>();
        IDbConnection conn = null;
        IDbCommand cmd = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                using (cmd = DataFactory.CreateCommand("SELECT * FROM RoleMaster WHERE IsDeleted = 0", conn))
                {
                    conn.Open();
                    using (IDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var role = new RoleMaster();
                            if (reader["Id"] != DBNull.Value) role.Id = Convert.ToString(reader["Id"]);
                            if (reader["Code"] != DBNull.Value) role.Code = Convert.ToString(reader["Code"]);
                            if (reader["Name"] != DBNull.Value) role.Name = Convert.ToString(reader["Name"]);
                            if (reader["Remarks"] != DBNull.Value) role.Remarks = Convert.ToString(reader["Remarks"]);
                            if (reader["IsActive"] != DBNull.Value) role.IsActive = Convert.ToBoolean(reader["IsActive"]) ? "1" : "0";
                            if (reader["IsDeleted"] != DBNull.Value) role.IsDeleted = Convert.ToBoolean(reader["IsDeleted"]) ? "1" : "0";
                            if (reader["CreatedBy"] != DBNull.Value) role.CreatedBy = Convert.ToString(reader["CreatedBy"]);
                            if (reader["CreatedDate"] != DBNull.Value) role.CreatedDate = Convert.ToString(reader["CreatedDate"]);
                            if (reader["UpdatedBy"] != DBNull.Value) role.UpdatedBy = Convert.ToString(reader["UpdatedBy"]);
                            if (reader["UpdatedDate"] != DBNull.Value) role.UpdatedDate = Convert.ToString(reader["UpdatedDate"]);
                            list.Add(role);
                        }
                    }
                }
            }
            return list;
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

    public RoleMaster? GetById(int id)
    {
        IDbConnection conn = null;
        IDbCommand cmd = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                using (cmd = DataFactory.CreateCommand("SELECT * FROM RoleMaster WHERE Id = @Id", conn))
                {
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Id", id));
                    conn.Open();
                    using (IDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            var role = new RoleMaster();
                            if (reader["Id"] != DBNull.Value) role.Id = Convert.ToString(reader["Id"]);
                            if (reader["Code"] != DBNull.Value) role.Code = Convert.ToString(reader["Code"]);
                            if (reader["Name"] != DBNull.Value) role.Name = Convert.ToString(reader["Name"]);
                            if (reader["Remarks"] != DBNull.Value) role.Remarks = Convert.ToString(reader["Remarks"]);
                            if (reader["IsActive"] != DBNull.Value) role.IsActive = Convert.ToBoolean(reader["IsActive"]) ? "1" : "0";
                            if (reader["IsDeleted"] != DBNull.Value) role.IsDeleted = Convert.ToBoolean(reader["IsDeleted"]) ? "1" : "0";
                            if (reader["CreatedBy"] != DBNull.Value) role.CreatedBy = Convert.ToString(reader["CreatedBy"]);
                            if (reader["CreatedDate"] != DBNull.Value) role.CreatedDate = Convert.ToString(reader["CreatedDate"]);
                            if (reader["UpdatedBy"] != DBNull.Value) role.UpdatedBy = Convert.ToString(reader["UpdatedBy"]);
                            if (reader["UpdatedDate"] != DBNull.Value) role.UpdatedDate = Convert.ToString(reader["UpdatedDate"]);
                            return role;
                        }
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

    public bool Save(RoleMaster item)
    {
        IDbConnection conn = null;
        IDbCommand cmd = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                conn.Open();
                using (cmd = DataFactory.CreateCommand("SP_CreateRoleMaster", conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Id", item.Id));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Code", item.Code));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Name", item.Name));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Remarks", item.Remarks));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@IsActive", item.IsActive));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@IsDeleted", item.IsDeleted));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@CreatedBy", item.CreatedBy));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@CreatedDate", item.CreatedDate));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@UpdatedBy", item.UpdatedBy));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@UpdatedDate", item.UpdatedDate));

                    var result = cmd.ExecuteScalar();
                    if (result != null)
                    {
                        item.Id = Convert.ToString(result) ?? item.Id;
                    }
                }
            }
            return true;
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
        IDbConnection conn = null;
        IDbCommand cmd = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                using (cmd = DataFactory.CreateCommand("UPDATE RoleMaster SET IsDeleted = 1 WHERE Id = @Id", conn))
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
        IDbConnection conn = null;
        IDbCommand cmd = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                using (cmd = DataFactory.CreateCommand("UPDATE RoleMaster SET IsActive = CASE WHEN IsActive = 1 THEN 0 ELSE 1 END WHERE Id = @Id", conn))
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
}

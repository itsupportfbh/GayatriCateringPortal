using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using GayatriCateringPortal.Data;
using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Repositories;

public class UserRoleMappingRepository : IUserRoleMappingRepository
{
    public List<UserRoleMapping> GetByUserId(int userId)
    {
        List<UserRoleMapping> list = new List<UserRoleMapping>();
        IDbConnection conn = null;
        IDbCommand cmd = null;
        IDataReader reader = null;

        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                conn.Open();
                using (cmd = DataFactory.CreateCommand("SP_GetUserRoleMappingByUserId", conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(DataFactory.CreateParameter("@UserId", userId));
                    reader = DataFactory.ExecuteReader(cmd);
                    list = this.List(reader);
                }
            }

            return list ?? new List<UserRoleMapping>();
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

    public bool CreateUserRoleMappings(List<UserRoleMapping> items)
    {
        IDbConnection conn = null;
        IDbCommand cmd = null;

        try
        {
            if (items == null || items.Count == 0)
                return false;

            int userId = items[0].UserId;

            using (conn = DataFactory.CreateConnection())
            {
                conn.Open();

                // Replace existing mappings before inserting the selected list.
                var existingItems = GetByUserId(userId);
                foreach (var existing in existingItems)
                {
                    using (cmd = DataFactory.CreateCommand("DeleteUserRoleMappingById", conn))
                    {
                        ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add(DataFactory.CreateParameter("@Id", existing.Id));
                        DataFactory.ExecuteScalar(cmd);
                    }
                }

                foreach (var item in items)
                {
                    using (cmd = DataFactory.CreateCommand("SP_CreateUserRoleMapping", conn))
                    {
                        ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add(DataFactory.CreateParameter("@UserId", item.UserId));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@RoleId", item.RoleId));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@CreatedBy", item.CreatedBy ?? (object)DBNull.Value));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@IsActive", item.IsActive));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@IsDeleted", item.IsDeleted));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@UpdatedBy", item.UpdatedBy ?? (object)DBNull.Value));

                        DataFactory.ExecuteNonQuery(cmd);
                    }
                }

                return true;
            }
        }
        catch (SqlException)
        {
            return false;
        }
        catch (Exception ex)
        {
            return false;
        }
        finally
        {
            if (conn != null && conn.State != ConnectionState.Closed) conn.Close();
        }
    }

    public bool DeleteUserRoleMappingById(int id)
    {
        IDbConnection conn = null;
        IDbCommand cmd = null;
        bool taskStatus = false;

        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                if (conn.State == ConnectionState.Closed) conn.Open();
                using (cmd = DataFactory.CreateCommand("DeleteUserRoleMappingById", conn))
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
            if (conn != null && conn.State != ConnectionState.Closed)
                conn.Close();
        }

        return taskStatus;
    }

    #region Private Methods
    private List<UserRoleMapping> List(IDataReader reader)
    {
        var list = new List<UserRoleMapping>();
        try
        {
            while (reader.Read())
            {
                var item = new UserRoleMapping();
                if (reader["Id"] != DBNull.Value)
                    item.Id = Convert.ToInt32(reader["Id"]);
                if (reader["UserId"] != DBNull.Value)
                    item.UserId = Convert.ToInt32(reader["UserId"]);
                if (reader["RoleId"] != DBNull.Value)
                    item.RoleId = Convert.ToInt32(reader["RoleId"]);
                if (reader["IsActive"] != DBNull.Value)
                    item.IsActive = Convert.ToBoolean(reader["IsActive"]);
                if (reader["IsDeleted"] != DBNull.Value)
                    item.IsDeleted = Convert.ToBoolean(reader["IsDeleted"]);
                if (reader["CreatedBy"] != DBNull.Value)
                    item.CreatedBy = Convert.ToInt32(reader["CreatedBy"]);
                if (reader["CreatedDate"] != DBNull.Value)
                    item.CreatedDate = Convert.ToDateTime(reader["CreatedDate"]);
                if (reader["UpdatedBy"] != DBNull.Value)
                    item.UpdatedBy = Convert.ToInt32(reader["UpdatedBy"]);
                if (reader["UpdatedDate"] != DBNull.Value)
                    item.UpdatedDate = Convert.ToDateTime(reader["UpdatedDate"]);

                list.Add(item);
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

        return list;
    }
    #endregion
}

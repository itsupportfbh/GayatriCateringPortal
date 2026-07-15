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
        try
        {
            if (items == null || items.Count == 0)
                return false;

            int userId = items[0].UserId;
            using (var conn = (SqlConnection)DataFactory.CreateConnection())
            {
                conn.Open();
                using (var transaction = conn.BeginTransaction())
                {
                    try
                    {
                        using (var deleteCmd = new SqlCommand("DELETE FROM [dbo].[UserRoleMapping] WHERE [UserId] = @UserId", conn, transaction))
                        {
                            deleteCmd.Parameters.Add(new SqlParameter("@UserId", SqlDbType.Int) { Value = userId });
                            deleteCmd.ExecuteNonQuery();
                        }

                        foreach (var item in items)
                        {
                            using (var insertCmd = new SqlCommand(@"
                                INSERT INTO [dbo].[UserRoleMapping]
                                    ([UserId], [RoleId], [IsActive], [IsDeleted], [CreatedBy], [CreatedDate], [UpdatedBy], [UpdatedDate])
                                VALUES
                                    (@UserId, @RoleId, @IsActive, @IsDeleted, @CreatedBy, GETDATE(), @UpdatedBy, GETDATE())", conn, transaction))
                            {
                                insertCmd.Parameters.Add(new SqlParameter("@UserId", SqlDbType.Int) { Value = item.UserId });
                                insertCmd.Parameters.Add(new SqlParameter("@RoleId", SqlDbType.Int) { Value = item.RoleId });
                                insertCmd.Parameters.Add(new SqlParameter("@IsActive", SqlDbType.Bit) { Value = item.IsActive });
                                insertCmd.Parameters.Add(new SqlParameter("@IsDeleted", SqlDbType.Bit) { Value = item.IsDeleted });
                                insertCmd.Parameters.Add(new SqlParameter("@CreatedBy", SqlDbType.Int) { Value = (object?)item.CreatedBy ?? DBNull.Value });
                                insertCmd.Parameters.Add(new SqlParameter("@UpdatedBy", SqlDbType.Int) { Value = (object?)item.UpdatedBy ?? DBNull.Value });
                                insertCmd.ExecuteNonQuery();
                            }
                        }

                        transaction.Commit();
                        return true;
                    }
                    catch
                    {
                        try
                        {
                            transaction.Rollback();
                        }
                        catch
                        {
                        }

                        return false;
                    }
                }
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
    }

    public bool DeleteUserRoleMappingById(int id)
    {
        try
        {
            using (var conn = (SqlConnection)DataFactory.CreateConnection())
            {
                conn.Open();
                using (var cmd = new SqlCommand("DELETE FROM [dbo].[UserRoleMapping] WHERE [Id] = @Id", conn))
                {
                    cmd.Parameters.Add(new SqlParameter("@Id", SqlDbType.Int) { Value = id });
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

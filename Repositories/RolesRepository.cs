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
        List<RoleMaster> list = null;
        IDbConnection conn = null;
        IDbCommand cmd = null;
        IDataReader reader = null;

        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                conn.Open();
                using (cmd = DataFactory.CreateCommand("SP_ListRoleMaster", conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                    reader = DataFactory.ExecuteReader(cmd);
                    list = this.List(reader);
                }
            }

            return list ?? new List<RoleMaster>();
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
        IDataReader reader = null;
        RoleMaster? item = null;

        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                if (conn.State == ConnectionState.Closed) conn.Open();
                using (cmd = DataFactory.CreateCommand("SP_GetRoleMasterByID", conn))
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

    public int Create(RoleMaster item)
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
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Code", (object?)item.Code ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Name", (object?)item.Name ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Remarks", (object?)item.Remarks ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@IsActive", item.IsActive == "1"));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@IsDeleted", item.IsDeleted == "1"));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@CreatedBy", int.TryParse(item.CreatedBy, out var createdBy) ? createdBy : (object?)DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@CreatedDate", DateTime.TryParse(item.CreatedDate, out var createdDate) ? createdDate : (object?)DBNull.Value));

                    var result = DataFactory.ExecuteScalar(cmd);
                    if (result != null)
                    {
                        item.Id = Convert.ToString(result) ?? item.Id;
                        return Convert.ToInt32(item.Id);
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

    public bool Update(RoleMaster item)
    {
        IDbConnection conn = null;
        IDbCommand cmd = null;
        try
        {
            var idValue = int.TryParse(item.Id, out var parsedId) ? parsedId : 0;
            using (conn = DataFactory.CreateConnection())
            {
                conn.Open();
                using (cmd = DataFactory.CreateCommand("SP_UpdateRoleMaster", conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Id", idValue));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Code", (object?)item.Code ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Name", (object?)item.Name ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Remarks", (object?)item.Remarks ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@IsActive", item.IsActive == "1"));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@IsDeleted", item.IsDeleted == "1"));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@UpdatedBy", int.TryParse(item.UpdatedBy, out var updatedBy) ? updatedBy : (object?)DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@UpdatedDate", DateTime.TryParse(item.UpdatedDate, out var updatedDate) ? updatedDate : (object?)DBNull.Value));

                    var result = DataFactory.ExecuteScalar(cmd);
                    return result != null && Convert.ToInt32(result) > 0;
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
        IDbConnection conn = null;
        IDbCommand cmd = null;
        bool taskStatus = false;

        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                if (conn.State == ConnectionState.Closed) conn.Open();
                using (cmd = DataFactory.CreateCommand("SP_DeleteRoleMasterByID", conn))
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

    public bool ActiveInActive(int id)
    {
        var existing = GetById(id);
        if (existing == null)
            return false;

        var nextActive = existing.IsActive == "1" ? "0" : "1";

        IDbConnection conn = null;
        IDbCommand cmd = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                if (conn.State == ConnectionState.Closed) conn.Open();
                using (cmd = DataFactory.CreateCommand("SP_SetRoleMasterActive", conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Id", id));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@IsActive", nextActive == "1"));
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

    #region Private Methods
    private List<RoleMaster> List(IDataReader reader)
    {
        var list = new List<RoleMaster>();
        try
        {
            while (reader.Read())
            {
                var item = new RoleMaster();
                if (reader["Id"] != DBNull.Value)
                    item.Id = Convert.ToString(reader["Id"])!;
                if (reader["Code"] != DBNull.Value)
                    item.Code = Convert.ToString(reader["Code"])!;
                if (reader["Name"] != DBNull.Value)
                    item.Name = Convert.ToString(reader["Name"])!;
                if (reader["Remarks"] != DBNull.Value)
                    item.Remarks = Convert.ToString(reader["Remarks"]);
                if (reader["IsActive"] != DBNull.Value)
                    item.IsActive = Convert.ToBoolean(reader["IsActive"]) ? "1" : "0";
                else
                    item.IsActive = "0";
                if (reader["IsDeleted"] != DBNull.Value)
                    item.IsDeleted = Convert.ToBoolean(reader["IsDeleted"]) ? "1" : "0";
                if (reader["CreatedBy"] != DBNull.Value)
                    item.CreatedBy = Convert.ToString(reader["CreatedBy"]);
                if (reader["CreatedDate"] != DBNull.Value)
                    item.CreatedDate = Convert.ToString(reader["CreatedDate"]);
                if (reader["UpdatedBy"] != DBNull.Value)
                    item.UpdatedBy = Convert.ToString(reader["UpdatedBy"]);
                if (reader["UpdatedDate"] != DBNull.Value)
                    item.UpdatedDate = Convert.ToString(reader["UpdatedDate"]);

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

using GayatriCateringPortal.Data;
using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Net.NetworkInformation;
using System.Reflection.PortableExecutable;

namespace GayatriCateringPortal.Repositories;

public class UtensilsRepository : IUtensilsRepository
{
    public List<UtensilMaster> GetAll()
    {
        var list = new List<UtensilMaster>();
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        IDataReader? reader = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                conn.Open();
                using (cmd = DataFactory.CreateCommand("GetUtensilMaster", conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                    reader = DataFactory.ExecuteReader(cmd);
                    list = this.List(reader);
                }
            }
            return list ?? new List<UtensilMaster>();
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

    public UtensilMaster? GetById(int id)
    {
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        IDataReader? reader = null;
        UtensilMaster? item = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                if (conn.State == ConnectionState.Closed) conn.Open();
                using (cmd = DataFactory.CreateCommand("SP_GetUtensilMasterById", conn))
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

    public int Create(UtensilMaster item)
    {
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                conn.Open();
                using (cmd = DataFactory.CreateCommand("SP_CreateUtensilMaster", conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(DataFactory.CreateParameter("@UtensilName", (object?)item.UtensilName ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@UnitType", (object?)item.UnitType ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Price", (object?)item.Price ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@DepositAmount", (object?)item.DepositAmount ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@IsActive", item.IsActive));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@IsDeleted", item.IsDeleted));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@CreatedBy", item.CreatedBy));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@CreatedDate", DateTime.TryParse(item.CreatedDate, out var createdDate) ? createdDate : (object?)DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@UpdatedBy", item.UpdatedBy));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@UpdatedDate", DateTime.TryParse(item.UpdatedDate, out var updatedDate) ? updatedDate : (object?)DBNull.Value));

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

    public bool Update(UtensilMaster item)
    {
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        try
        {
            var idValue = int.TryParse(item.Id, out var parsedId) ? parsedId : 0;
            using (conn = DataFactory.CreateConnection())
            {
                conn.Open();
                using (cmd = DataFactory.CreateCommand("SP_UpdateUtensilMaster", conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Id", idValue));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@UtensilName", (object?)item.UtensilName ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@UnitType", (object?)item.UnitType ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Price", (object?)item.Price ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@DepositAmount", (object?)item.DepositAmount ?? DBNull.Value)); 
                    cmd.Parameters.Add(DataFactory.CreateParameter("@IsActive", item.IsActive));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@IsDeleted", item.IsDeleted));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@CreatedBy", item.CreatedBy));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@CreatedDate", DateTime.TryParse(item.CreatedDate, out var createdDate) ? createdDate : (object?)DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@UpdatedBy", item.UpdatedBy));
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
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        bool taskStatus = false;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                if (conn.State == ConnectionState.Closed) conn.Open();
                using (cmd = DataFactory.CreateCommand("DeleteUtensilMasterById", conn))
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
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                if (conn.State == ConnectionState.Closed) conn.Open();
                using (cmd = DataFactory.CreateCommand("ActiveInActiveUtensilMasterById", conn))
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

    #region Private Methods
    private List<UtensilMaster> List(IDataReader reader)
    {
        var list = new List<UtensilMaster>();
        try
        {
            while (reader.Read())
            {
                var item = new UtensilMaster();
                if (reader["Id"] != DBNull.Value)
                    item.Id = Convert.ToString(reader["Id"])!;
                if (reader["UtensilName"] != DBNull.Value)
                    item.UtensilName = Convert.ToString(reader["UtensilName"])!;
                if (reader["UnitType"] != DBNull.Value)
                    item.UnitType = Convert.ToString(reader["UnitType"])!;
                if (reader["Price"] != DBNull.Value)
                    item.Price = Convert.ToDecimal(reader["Price"]);
                if (reader["DepositAmount"] != DBNull.Value)
                    item.DepositAmount = Convert.ToDecimal(reader["DepositAmount"]);                
                if (reader["IsActive"] != DBNull.Value)
                    item.IsActive = Convert.ToBoolean(reader["IsActive"]);
                if (reader["IsDeleted"] != DBNull.Value)
                    item.IsDeleted = Convert.ToBoolean(reader["IsDeleted"]);
                if (reader["CreatedBy"] != DBNull.Value)
                    item.CreatedBy = Convert.ToInt32(reader["CreatedBy"]);
                if (reader["CreatedDate"] != DBNull.Value)
                    item.CreatedDate = Convert.ToString(reader["CreatedDate"]);
                if (reader["UpdatedBy"] != DBNull.Value)
                    item.UpdatedBy = Convert.ToInt32(reader["UpdatedBy"]);
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


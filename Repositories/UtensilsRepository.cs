using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using GayatriCateringPortal.Data;
using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Repositories;

public class UtensilsRepository : IUtensilsRepository
{
    public List<UtensilMaster> GetAll()
    {
        var list = new List<UtensilMaster>();
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        try
        {
            conn = DataFactory.CreateConnection();
            cmd = DataFactory.CreateCommand("SELECT * FROM UtensilMaster WHERE IsDeleted = 0", conn);
            conn.Open();
            using IDataReader reader = cmd.ExecuteReader();
            while (reader.Read()) list.Add(new UtensilMaster());
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

    public UtensilMaster? GetById(int id)
    {
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        try
        {
            conn = DataFactory.CreateConnection();
            cmd = DataFactory.CreateCommand("SELECT * FROM UtensilMaster WHERE Id = @Id", conn);
            cmd.Parameters.Add(DataFactory.CreateParameter("@Id", id));
            conn.Open();
            using IDataReader reader = cmd.ExecuteReader();
            if (reader.Read()) return new UtensilMaster();
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

    public bool Save(UtensilMaster item)
    {
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        try
        {
            conn = DataFactory.CreateConnection();
            cmd = DataFactory.CreateCommand("SP_CreateUtensilMaster", conn);
            ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add(DataFactory.CreateParameter("@Id", item.Id));
            conn.Open();
            cmd.ExecuteNonQuery();
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
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        try
        {
            conn = DataFactory.CreateConnection();
            cmd = DataFactory.CreateCommand("UPDATE UtensilMaster SET IsDeleted = 1 WHERE Id = @Id", conn);
            cmd.Parameters.Add(DataFactory.CreateParameter("@Id", id));
            conn.Open();
            return cmd.ExecuteNonQuery() > 0;
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
                using (cmd = DataFactory.CreateCommand("UPDATE UtensilMaster SET IsActive = CASE WHEN IsActive = 1 THEN 0 ELSE 1 END WHERE Id = @Id", conn))
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

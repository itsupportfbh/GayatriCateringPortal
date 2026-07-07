using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using GayatriCateringPortal.Data;
using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Repositories;

public class KitchenRepository : IKitchenRepository
{
    public List<FoodMenu> GetAll()
    {
        List<FoodMenu> list = new List<FoodMenu>();
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        IDataReader? reader = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
                {
                    conn.Open();
                    using (cmd = DataFactory.CreateCommand("SELECT * FROM FoodMenu WHERE IsDeleted = 0", conn))
                    {
                        reader = DataFactory.ExecuteReader(cmd);
                        list = new List<FoodMenu>();
                        while (reader.Read()) list.Add(new FoodMenu());
                    }
                }
            return list ?? new List<FoodMenu>();
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

    public FoodMenu? GetById(int id)
    {
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        IDataReader? reader = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
                {
                    using (cmd = DataFactory.CreateCommand("SELECT * FROM FoodMenu WHERE Id = @Id", conn))
                    {
                        cmd.Parameters.Add(DataFactory.CreateParameter("@Id", id));
                        if (conn.State == ConnectionState.Closed) conn.Open();
                        reader = DataFactory.ExecuteReader(cmd);
                        if (reader.Read()) return new FoodMenu();
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

    public int Create(FoodMenu item)
    {
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
                {
                    using (cmd = DataFactory.CreateCommand("SP_CreateFoodMenu", conn))
                    {
                        ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add(DataFactory.CreateParameter("@Id", item.Id));
                        conn.Open();
                        var rows = DataFactory.ExecuteNonQuery(cmd);
                        return rows > 0 ? 1 : 0;
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

    public bool Update(FoodMenu item)
    {
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
                {
                    using (cmd = DataFactory.CreateCommand("SP_CreateFoodMenu", conn))
                    {
                        ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add(DataFactory.CreateParameter("@Id", item.Id));
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
                    using (cmd = DataFactory.CreateCommand("UPDATE FoodMenu SET IsDeleted = 1 WHERE Id = @Id", conn))
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
                using (cmd = DataFactory.CreateCommand("UPDATE FoodMenu SET IsActive = CASE WHEN IsActive = 1 THEN 0 ELSE 1 END WHERE Id = @Id", conn))
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


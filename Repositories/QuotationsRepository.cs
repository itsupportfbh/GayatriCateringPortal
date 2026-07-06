using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using GayatriCateringPortal.Data;
using GayatriCateringPortal.Interfaces;

namespace GayatriCateringPortal.Repositories;

public class QuotationsRepository : IQuotationsRepository
{
    public List<object> GetAll()
    {
        var list = new List<object>();
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        try
        {
            conn = DataFactory.CreateConnection();
            cmd = DataFactory.CreateCommand("SELECT TOP 0 1", conn);
            conn.Open();
            using IDataReader reader = cmd.ExecuteReader();
            while (reader.Read()) list.Add(new object());
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

    public object? GetById(int id)
    {
        return null;
    }

    public bool Save(object item)
    {
        throw new NotImplementedException();
    }

    public bool Delete(int id)
    {
        throw new NotImplementedException();
    }

    public bool ActiveInActive(int id)
    {
        throw new NotImplementedException();
    }
}

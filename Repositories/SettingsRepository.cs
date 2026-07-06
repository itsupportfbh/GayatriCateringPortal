using System;
using System.Data;
using Microsoft.Data.SqlClient;
using GayatriCateringPortal.Data;
using GayatriCateringPortal.Interfaces;

namespace GayatriCateringPortal.Repositories;

public class SettingsRepository : ISettingsRepository
{
    public object GetSettings()
    {
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        try
        {
            conn = DataFactory.CreateConnection();
            cmd = DataFactory.CreateCommand("SELECT TOP 1 * FROM Settings", conn);
            conn.Open();
            return new { }; // placeholder
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

    public bool Save(object settings)
    {
        throw new NotImplementedException();
    }
}

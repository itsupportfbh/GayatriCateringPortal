using System;
using System.Data;
using Microsoft.Data.SqlClient;
using GayatriCateringPortal.Data;
using GayatriCateringPortal.Interfaces;

namespace GayatriCateringPortal.Repositories;

public class ReportsRepository : IReportsRepository
{
    public object GetReport(string name)
    {
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        try
        {
            conn = DataFactory.CreateConnection();
            cmd = DataFactory.CreateCommand("SP_GetReport", conn);
            ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add(DataFactory.CreateParameter("@Name", name));
            conn.Open();
            return new { Message = "Report not implemented" };
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

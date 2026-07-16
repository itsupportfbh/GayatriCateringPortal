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

    
}


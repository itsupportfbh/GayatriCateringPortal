using System.Data;
using Microsoft.Data.SqlClient;
using GayatriCateringPortal.Models;
using GayatriCateringPortal.Data;
using GayatriCateringPortal.Interfaces;

namespace GayatriCateringPortal.Repositories;

public class MealPeriodRepository : IMealPeriodsRepository
{
    public List<MealPeriodMaster> GetAll()
    {
        List<MealPeriodMaster> list = new List<MealPeriodMaster>();

        try
        {
            using (IDbConnection conn = DataFactory.CreateConnection())
            {
                conn.Open();

                using (IDbCommand cmd = DataFactory.CreateCommand(
                    "[dbo].[GetMealPeriodMaster]", conn))
                {
                    ((SqlCommand)cmd).CommandType =  CommandType.StoredProcedure;

                    using (IDataReader reader = DataFactory.ExecuteReader(cmd))
                    {
                        list = List(reader);
                    }
                }
            }

            return list;
        }
        catch (SqlException ex)
        {
            throw new Exception("Database error: " + ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }


    public MealPeriodMaster? GetById(int id)
    {
        MealPeriodMaster? item = null;

        try
        {
            using (IDbConnection conn = DataFactory.CreateConnection())
            {
                conn.Open();

                using (IDbCommand cmd = DataFactory.CreateCommand(
                    "[dbo].[SP_GetMealPeriodMasterById]", conn))
                {
                    ((SqlCommand)cmd).CommandType =
                        CommandType.StoredProcedure;

                    cmd.Parameters.Add(
                        DataFactory.CreateParameter("@Id", id));

                    using (IDataReader reader =
                        DataFactory.ExecuteReader(cmd))
                    {
                        var list = List(reader);

                        if (list.Count > 0)
                        {
                            item = list[0];
                        }
                    }
                }
            }
        }
        catch (SqlException ex)
        {
            throw new Exception("Database error: " + ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }

        return item;
    }


    public int Create(MealPeriodMaster mealPeriod)
    {
        try
        {
            using (IDbConnection conn = DataFactory.CreateConnection())
            {
                conn.Open();

                using (IDbCommand cmd = DataFactory.CreateCommand(
                    "[dbo].[SP_CreateMealPeriodMaster]", conn))
                {
                    ((SqlCommand)cmd).CommandType =
                        CommandType.StoredProcedure;


                    cmd.Parameters.Add(
                        DataFactory.CreateParameter(
                            "@Code",
                            mealPeriod.Code ??
                            (object)DBNull.Value));


                    cmd.Parameters.Add(
                        DataFactory.CreateParameter(
                            "@MealPeriodName",
                            mealPeriod.MealPeriodName ??
                            (object)DBNull.Value));


                    cmd.Parameters.Add(
                        DataFactory.CreateParameter(
                            "@StartTime",
                            mealPeriod.StartTime ??
                            (object)DBNull.Value));


                    cmd.Parameters.Add(
                        DataFactory.CreateParameter(
                            "@EndTime",
                            mealPeriod.EndTime ??
                            (object)DBNull.Value));


                    cmd.Parameters.Add(
                        DataFactory.CreateParameter(
                            "@DisplayOrder",
                            mealPeriod.DisplayOrder ??
                            (object)DBNull.Value));


                    cmd.Parameters.Add(
                        DataFactory.CreateParameter(
                            "@IsActive",
                            mealPeriod.IsActive ??
                            (object)DBNull.Value));


                    cmd.Parameters.Add(
                        DataFactory.CreateParameter(
                            "@IsDeleted",
                            mealPeriod.IsDeleted ??
                            (object)DBNull.Value));


                    cmd.Parameters.Add(
                        DataFactory.CreateParameter(
                            "@CreatedBy",
                            mealPeriod.CreatedBy ??
                            (object)DBNull.Value));


                    cmd.Parameters.Add(
                        DataFactory.CreateParameter(
                            "@CreatedDate",
                            DateTime.Now));


                    var result = DataFactory.ExecuteScalar(cmd);


                    if (result != null &&
                        result != DBNull.Value)
                    {
                        mealPeriod.Id =
                            Convert.ToString(result) ?? "0";

                        return Convert.ToInt32(result);
                    }
                }
            }
        }
        catch (SqlException ex)
        {
            throw new Exception(
                "Database error: " + ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }

        return 0;
    }


    public bool Update(MealPeriodMaster mealPeriod)
    {
        if (mealPeriod == null)
            throw new ArgumentNullException(nameof(mealPeriod));

        try
        {
            using (IDbConnection conn = DataFactory.CreateConnection())
            {
                conn.Open();

                using (IDbCommand cmd = DataFactory.CreateCommand(
                    "[dbo].[SP_UpdateMealPeriodMaster]", conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add( DataFactory.CreateParameter( "@Id",  mealPeriod.Id));

                    cmd.Parameters.Add(DataFactory.CreateParameter( "@Code", string.IsNullOrWhiteSpace(mealPeriod.Code) ? (object)DBNull.Value : mealPeriod.Code.Trim()));

                    cmd.Parameters.Add(DataFactory.CreateParameter("@MealPeriodName",  string.IsNullOrWhiteSpace(mealPeriod.MealPeriodName) ? (object)DBNull.Value   : mealPeriod.MealPeriodName.Trim()));

                    cmd.Parameters.Add( DataFactory.CreateParameter("@StartTime",   string.IsNullOrWhiteSpace(mealPeriod.StartTime) ? (object)DBNull.Value  : mealPeriod.StartTime));

                    cmd.Parameters.Add(DataFactory.CreateParameter("@EndTime", string.IsNullOrWhiteSpace(mealPeriod.EndTime)? (object)DBNull.Value               : mealPeriod.EndTime));

                    cmd.Parameters.Add(DataFactory.CreateParameter("@DisplayOrder",  string.IsNullOrWhiteSpace(mealPeriod.DisplayOrder)? (object)DBNull.Value : mealPeriod.DisplayOrder));

                    cmd.Parameters.Add(   DataFactory.CreateParameter("@IsActive",   string.IsNullOrWhiteSpace(mealPeriod.IsActive)  ? (object)DBNull.Value  : mealPeriod.IsActive));

                    cmd.Parameters.Add( DataFactory.CreateParameter( "@IsDeleted", string.IsNullOrWhiteSpace(mealPeriod.IsDeleted)      ? (object)DBNull.Value                                : mealPeriod.IsDeleted));

                    cmd.Parameters.Add( DataFactory.CreateParameter("@UpdatedBy", string.IsNullOrWhiteSpace(mealPeriod.UpdatedBy) ? (object)DBNull.Value : mealPeriod.UpdatedBy));

                    cmd.Parameters.Add( DataFactory.CreateParameter("@UpdatedDate", DateTime.Now));

                    object result = DataFactory.ExecuteScalar(cmd);

                    if (result == null || result == DBNull.Value)
                    {
                        throw new Exception(
                            "No result was returned while updating Meal Period.");
                    }

                    int status = Convert.ToInt32(result);

                    switch (status)
                    {
                        case -1:
                            throw new Exception(
                                "Meal Period Name already exists.");

                        case -2:
                            throw new Exception(
                                "Display Order already exists.");

                        case 0:
                            throw new Exception(
                                "Meal Period not found or no changes were made.");

                        default:
                            return status > 0;
                    }
                }
            }
        }
        catch (SqlException ex) when (
            ex.Number == 2601 ||
            ex.Number == 2627)
        {
            throw new Exception(
                "Meal Period Name or Display Order already exists.",
                ex);
        }
        catch (SqlException ex)
        {
            throw new Exception(
                "Database error: " + ex.Message,
                ex);
        }
        catch
        {
            throw;
        }
    }


    public bool Delete(int id)
    {
        try
        {
            using (IDbConnection conn =
                DataFactory.CreateConnection())
            {
                conn.Open();

                using (IDbCommand cmd =
                    DataFactory.CreateCommand(
                        "[dbo].[DeleteMealPeriodMasterById]",
                        conn))
                {
                    ((SqlCommand)cmd).CommandType =
                        CommandType.StoredProcedure;

                    cmd.Parameters.Add(
                        DataFactory.CreateParameter("@Id", id));

                    var result =
                        DataFactory.ExecuteScalar(cmd);

                    return result != null &&
                           result != DBNull.Value &&
                           Convert.ToInt32(result) > 0;
                }
            }
        }
        catch (SqlException ex)
        {
            throw new Exception(
                "Database error: " + ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }


    public bool ActiveInActive(int id, bool status)
    {
        try
        {
            using (IDbConnection conn =
                DataFactory.CreateConnection())
            {
                conn.Open();

                using (IDbCommand cmd =
                    DataFactory.CreateCommand(
                        "[dbo].[ActiveInActiveMealPeriodMasterById]",
                        conn))
                {
                    ((SqlCommand)cmd).CommandType =
                        CommandType.StoredProcedure;


                    cmd.Parameters.Add(
                        DataFactory.CreateParameter(
                            "@Id",
                            id));


                    cmd.Parameters.Add(
                        DataFactory.CreateParameter(
                            "@IsActive",
                            status));


                    var result =
                        DataFactory.ExecuteScalar(cmd);


                    return result != null &&
                           result != DBNull.Value &&
                           Convert.ToInt32(result) > 0;
                }
            }
        }
        catch (SqlException ex)
        {
            throw new Exception(
                "Database error: " + ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }


    // COMMON DATA READER MAPPING

    private List<MealPeriodMaster> List(IDataReader reader)
    {
        var list = new List<MealPeriodMaster>();

        try
        {
            while (reader.Read())
            {
                var mealPeriod = new MealPeriodMaster();


                if (reader["Id"] != DBNull.Value)    mealPeriod.Id =Convert.ToString(reader["Id"]) ?? "";


                if (reader["Code"] != DBNull.Value) mealPeriod.Code = Convert.ToString(reader["Code"]) ?? "";


                if (reader["MealPeriodName"] != DBNull.Value)mealPeriod.MealPeriodName = Convert.ToString(  reader["MealPeriodName"]) ?? "";


                if (reader["StartTime"] != DBNull.Value)mealPeriod.StartTime = Convert.ToString(reader["StartTime"]);


                if (reader["EndTime"] != DBNull.Value)mealPeriod.EndTime = Convert.ToString( reader["EndTime"]);


                if (reader["DisplayOrder"] != DBNull.Value)
                    mealPeriod.DisplayOrder =
                        Convert.ToString(
                            reader["DisplayOrder"]) ?? "";


                if (reader["IsActive"] != DBNull.Value)
                    mealPeriod.IsActive =
                        Convert.ToString(
                            reader["IsActive"]) ?? "";


                //if (reader["CreatedBy"] != DBNull.Value)
                //    mealPeriod.CreatedBy =
                //        Convert.ToString(
                //            reader["CreatedBy"]);


                //if (reader["CreatedDate"] != DBNull.Value)
                //    mealPeriod.CreatedDate =
                //        Convert.ToString(
                //            reader["CreatedDate"]) ?? "";


                //if (reader["UpdatedBy"] != DBNull.Value)
                //    mealPeriod.UpdatedBy =
                //        Convert.ToString(
                //            reader["UpdatedBy"]);


                //if (reader["UpdatedDate"] != DBNull.Value)
                //    mealPeriod.UpdatedDate =
                //        Convert.ToString(
                //            reader["UpdatedDate"]);


                if (reader["IsDeleted"] != DBNull.Value)
                    mealPeriod.IsDeleted =
                        Convert.ToString(
                            reader["IsDeleted"]);


                list.Add(mealPeriod);
            }
        }
        catch (SqlException ex)
        {
            throw new Exception(
                "Database error: " + ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(
                "Meal Period mapping error: " +
                ex.Message);
        }

        return list;
    }
}
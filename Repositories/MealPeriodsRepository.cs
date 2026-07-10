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
        if (mealPeriod == null)
            throw new ArgumentNullException(nameof(mealPeriod));

        ValidateMealPeriod(mealPeriod);
        

        try
          {
            using (IDbConnection conn = DataFactory.CreateConnection())
            {
                conn.Open();

                // Duplicate Meal Period Name check
                using (IDbCommand nameCheckCmd = DataFactory.CreateCommand(
                    @"SELECT COUNT(1)
                  FROM dbo.MealPeriodMaster
                  WHERE LTRIM(RTRIM(MealPeriodName)) = LTRIM(RTRIM(@MealPeriodName))
                    AND ISNULL(IsDeleted, 0) = 0",
                    conn))
                {
                    nameCheckCmd.Parameters.Add(
                        DataFactory.CreateParameter(
                            "@MealPeriodName",
                            mealPeriod.MealPeriodName?.Trim() ?? string.Empty));

                    object nameCountResult =
                        DataFactory.ExecuteScalar(nameCheckCmd);

                    int nameCount = nameCountResult == null || nameCountResult == DBNull.Value  ? 0 : Convert.ToInt32(nameCountResult);

                    if (nameCount > 0)
                        return -1;
                }

                // Duplicate Display Order check
                using (IDbCommand orderCheckCmd = DataFactory.CreateCommand(
                    @"SELECT COUNT(1)
                  FROM dbo.MealPeriodMaster
                  WHERE DisplayOrder = @DisplayOrder
                    AND ISNULL(IsDeleted, 0) = 0",
                    conn))
                {
                    orderCheckCmd.Parameters.Add(
                        DataFactory.CreateParameter(
                            "@DisplayOrder",
                            mealPeriod.DisplayOrder));

                    object orderCountResult =
                        DataFactory.ExecuteScalar(orderCheckCmd);

                    int orderCount =
                        orderCountResult == null ||
                        orderCountResult == DBNull.Value
                            ? 0
                            : Convert.ToInt32(orderCountResult);

                    if (orderCount > 0)
                        return -2;
                }



                using (IDbCommand cmd = DataFactory.CreateCommand("[dbo].[SP_CreateMealPeriodMaster]", conn))
                    {
                        ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add(DataFactory.CreateParameter("@Code", string.IsNullOrWhiteSpace(mealPeriod.Code) ? DBNull.Value : mealPeriod.Code.Trim()));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@MealPeriodName", mealPeriod.MealPeriodName.Trim()));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@StartTime", mealPeriod.StartTime.HasValue ? mealPeriod.StartTime.Value.ToTimeSpan() : DBNull.Value));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@EndTime", mealPeriod.EndTime.HasValue ? mealPeriod.EndTime.Value.ToTimeSpan() : DBNull.Value));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@DisplayOrder", mealPeriod.DisplayOrder));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@IsActive", mealPeriod.IsActive));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@IsDeleted", mealPeriod.IsDeleted ?? false));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@CreatedBy", mealPeriod.CreatedBy.HasValue ? mealPeriod.CreatedBy.Value : DBNull.Value));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@CreatedDate", mealPeriod.CreatedDate == default ? DateTime.Now : mealPeriod.CreatedDate));

                        object result = DataFactory.ExecuteScalar(cmd);

                        if (result == null || result == DBNull.Value)
                            return 0;

                        int createResult = Convert.ToInt32(result);


                        if (createResult > 0)
                        {
                            mealPeriod.Id = createResult;
                        }

                        return createResult;
                    }
                }

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
    

    public bool Update(MealPeriodMaster mealPeriod)
    {
        if (mealPeriod == null)
            throw new ArgumentNullException(nameof(mealPeriod));

        ValidateMealPeriod(mealPeriod);

        try
        {
            using (IDbConnection conn = DataFactory.CreateConnection())
            {
                conn.Open();

                using (IDbCommand nameCheckCmd = DataFactory.CreateCommand(
                    @"SELECT COUNT(1)
                      FROM dbo.MealPeriodMaster
                      WHERE LTRIM(RTRIM(MealPeriodName)) = LTRIM(RTRIM(@MealPeriodName))
                        AND Id <> @Id
                        AND ISNULL(IsDeleted, 0) = 0",
                    conn))
                {
                    nameCheckCmd.Parameters.Add(DataFactory.CreateParameter(
                        "@MealPeriodName", mealPeriod.MealPeriodName.Trim()));
                    nameCheckCmd.Parameters.Add(DataFactory.CreateParameter("@Id", mealPeriod.Id));

                    if (Convert.ToInt32(DataFactory.ExecuteScalar(nameCheckCmd)) > 0)
                        throw new ArgumentException("Meal Period Name already exists.");
                }

                using (IDbCommand orderCheckCmd = DataFactory.CreateCommand(
                    @"SELECT COUNT(1)
                      FROM dbo.MealPeriodMaster
                      WHERE DisplayOrder = @DisplayOrder
                        AND Id <> @Id
                        AND ISNULL(IsDeleted, 0) = 0",
                    conn))
                {
                    orderCheckCmd.Parameters.Add(DataFactory.CreateParameter(
                        "@DisplayOrder", mealPeriod.DisplayOrder));
                    orderCheckCmd.Parameters.Add(DataFactory.CreateParameter("@Id", mealPeriod.Id));

                    if (Convert.ToInt32(DataFactory.ExecuteScalar(orderCheckCmd)) > 0)
                        throw new ArgumentException("Display Order already exists.");
                }

                using (IDbCommand cmd = DataFactory.CreateCommand("[dbo].[SP_UpdateMealPeriodMaster]", conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add(DataFactory.CreateParameter("@Id", mealPeriod.Id));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Code",string.IsNullOrWhiteSpace(mealPeriod.Code) ? DBNull.Value : mealPeriod.Code.Trim()));
                    cmd.Parameters.Add( DataFactory.CreateParameter("@MealPeriodName", mealPeriod.MealPeriodName.Trim()));
                    cmd.Parameters.Add( DataFactory.CreateParameter("@StartTime", mealPeriod.StartTime.HasValue? mealPeriod.StartTime.Value.ToTimeSpan(): DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@EndTime", mealPeriod.EndTime.HasValue? mealPeriod.EndTime.Value.ToTimeSpan(): DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@DisplayOrder",mealPeriod.DisplayOrder));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@IsActive", mealPeriod.IsActive));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@IsDeleted", mealPeriod.IsDeleted ?? false));
                    cmd.Parameters.Add(DataFactory.CreateParameter( "@UpdatedBy", mealPeriod.UpdatedBy.HasValue? mealPeriod.UpdatedBy.Value      : DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@UpdatedDate", DateTime.Now));

                    object result =
                        DataFactory.ExecuteScalar(cmd);

                    if (result == null ||
                        result == DBNull.Value)
                    {
                        throw new Exception(
                            "No result was returned while updating Meal Period.");
                    }

                    int status =
                        Convert.ToInt32(result);

                    switch (status)
                    {
                        case -1:
                            throw new Exception(
                                "Meal Period Name already exists.");

                        case -2:
                            throw new Exception(
                                "Display Order already exists.");

                        case -3:
                            throw new Exception(
                                "Meal Period Name is required.");

                        case -4:
                            throw new Exception(
                                "Display Order must be greater than zero.");

                        case -5:
                            throw new Exception(
                                "End Time must be greater than Start Time.");

                        case 0:
                            throw new Exception(
                                "Meal Period not found.");

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


    private static void ValidateMealPeriod(MealPeriodMaster mealPeriod)
    {
        if (string.IsNullOrWhiteSpace(mealPeriod.MealPeriodName))
            throw new ArgumentException("Meal Period Name is required.");

        if (!mealPeriod.StartTime.HasValue)
            throw new ArgumentException("Start Time is required.");

        if (!mealPeriod.EndTime.HasValue)
            throw new ArgumentException("End Time is required.");

        if (mealPeriod.StartTime.Value >= mealPeriod.EndTime.Value)
            throw new ArgumentException("End Time must be greater than Start Time.");

        if (mealPeriod.DisplayOrder <= 0)
            throw new ArgumentException("Display Order must be greater than zero.");
    }


    // COMMON DATA READER MAPPING

    private List<MealPeriodMaster> List(IDataReader reader)
    {
        var list = new List<MealPeriodMaster>();

        try
        {
            while (reader.Read())
            {
                var mealPeriod = new MealPeriodMaster
                {
                    Id = reader["Id"] != DBNull.Value
                        ? Convert.ToInt32(reader["Id"])
                        : 0,

                    Code = reader["Code"] != DBNull.Value
                        ? Convert.ToString(reader["Code"]) ?? string.Empty
                        : string.Empty,

                    MealPeriodName = reader["MealPeriodName"] != DBNull.Value
                        ? Convert.ToString(reader["MealPeriodName"]) ?? string.Empty
                        : string.Empty,

                    StartTime = reader["StartTime"] != DBNull.Value
                        ? TimeOnly.FromTimeSpan(
                            (TimeSpan)reader["StartTime"])
                        : null,

                    EndTime = reader["EndTime"] != DBNull.Value
                        ? TimeOnly.FromTimeSpan(
                            (TimeSpan)reader["EndTime"])
                        : null,

                    DisplayOrder = reader["DisplayOrder"] != DBNull.Value
                        ? Convert.ToInt32(reader["DisplayOrder"])
                        : 0,

                    IsActive = reader["IsActive"] != DBNull.Value
                        && Convert.ToBoolean(reader["IsActive"]),

                    CreatedBy = reader["CreatedBy"] != DBNull.Value
                        ? Convert.ToInt32(reader["CreatedBy"])
                        : null,

                    CreatedDate = reader["CreatedDate"] != DBNull.Value
                        ? Convert.ToDateTime(reader["CreatedDate"])
                        : DateTime.MinValue,

                    UpdatedBy = reader["UpdatedBy"] != DBNull.Value
                        ? Convert.ToInt32(reader["UpdatedBy"])
                        : null,

                    UpdatedDate = reader["UpdatedDate"] != DBNull.Value
                        ? Convert.ToDateTime(reader["UpdatedDate"])
                        : null,

                    IsDeleted = reader["IsDeleted"] != DBNull.Value
                        ? Convert.ToBoolean(reader["IsDeleted"])
                        : false
                };

                list.Add(mealPeriod);
            }

            return list;
        }
        catch (Exception ex)
        {
            throw new Exception(
                "Meal Period mapping error: " + ex.Message,
                ex);
        }
    }
}

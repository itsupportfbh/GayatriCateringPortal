using GayatriCateringPortal.Data;
using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace GayatriCateringPortal.Repositories;

public class LogisticsRepository : ILogisticsRepository
{
    public List<OrderListItem> GetAll(DateTime? fromDate = null, DateTime? toDate = null)
    {
        List<OrderListItem> list = new List<OrderListItem>();
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        IDataReader? reader = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                conn.Open();
                using (cmd = DataFactory.CreateCommand("GetOrders", conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(DataFactory.CreateParameter("@FromDate", fromDate.HasValue ? (object)fromDate.Value.Date : DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@ToDate", toDate.HasValue ? (object)toDate.Value.Date : DBNull.Value));

                    reader = DataFactory.ExecuteReader(cmd);
                    list = ListOrderItems(reader);
                }
            }

            return list ?? new List<OrderListItem>();
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

    public List<LogisticsDetails> GetDelivered()
    {
        List<LogisticsDetails> list = new List<LogisticsDetails>();
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        IDataReader? reader = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                conn.Open();
                using (cmd = DataFactory.CreateCommand("GetLogisticsDetails", conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                    reader = DataFactory.ExecuteReader(cmd);
                    list = this.ListDelivered(reader);
                }
            }
            return list ?? new List<LogisticsDetails>();
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

    public LogisticsDetails? GetById(int id)
    {
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        IDataReader? reader = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                using (cmd = DataFactory.CreateCommand("SELECT * FROM LogisticsDetails WHERE Id = @Id", conn))
                {
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Id", id));
                    if (conn.State == ConnectionState.Closed) conn.Open();
                    reader = DataFactory.ExecuteReader(cmd);
                    if (reader.Read()) return new LogisticsDetails();
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

    public LogisticsDetails? GetByOrderNumber(string orderNumber)
    {
        if (string.IsNullOrWhiteSpace(orderNumber)) return null;

        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        IDataReader? reader = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                using (cmd = DataFactory.CreateCommand("SELECT * FROM LogisticsDetails WHERE OrderNumber = @OrderNumber AND IsDeleted = 0", conn))
                {
                    cmd.Parameters.Add(DataFactory.CreateParameter("@OrderNumber", orderNumber));
                    if (conn.State == ConnectionState.Closed) conn.Open();
                    reader = DataFactory.ExecuteReader(cmd);
                    if (reader.Read()) return new LogisticsDetails();
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

    public int Create(LogisticsDetails item)
    {
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                conn.Open();
                using (cmd = DataFactory.CreateCommand("SP_CreateLogisticsDetails", conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(DataFactory.CreateParameter("@OrderDate", item.OrderDate));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@OrderNumber", (object?)item.OrderNumber ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Location", (object?)item.Location ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@DriverName", (object?)item.DriverName ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Status", item.Status));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@IsActive", item.IsActive));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@IsDeleted", item.IsDeleted));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@CreatedBy", item.CreatedBy));

                    var result = DataFactory.ExecuteScalar(cmd);
                    if (result != null)
                    {
                        int status = Convert.ToInt32(result);
                        return status;
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

    public int Update(LogisticsDetails item)
    {
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                conn.Open();
                using (cmd = DataFactory.CreateCommand("SP_UpdateLogisticsDetails", conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Id", item.Id));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@DriverName", (object?)item.DriverName ?? DBNull.Value));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@UpdatedBy", item.UpdatedBy));

                    var result = DataFactory.ExecuteScalar(cmd);
                    if (result != null)
                    {
                        int status = Convert.ToInt32(result);
                        return status;
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

    public bool Delete(int id)
    {
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                using (cmd = DataFactory.CreateCommand("UPDATE LogisticsDetails SET IsDeleted = 1 WHERE Id = @Id", conn))
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
                using (cmd = DataFactory.CreateCommand("UPDATE LogisticsDetails SET IsActive = CASE WHEN IsActive = 1 THEN 0 ELSE 1 END WHERE Id = @Id", conn))
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

    #region Private Methods
    private List<OrderListItem> ListOrderItems(IDataReader reader)
    {
        var list = new List<OrderListItem>();
        try
        {
            while (reader.Read())
            {
                var item = new OrderListItem();

                if (reader["Id"] != DBNull.Value)
                    item.Id = Convert.ToInt32(reader["Id"]);
                if (reader["OrderNumber"] != DBNull.Value)
                    item.OrderNumber = Convert.ToString(reader["OrderNumber"]) ?? string.Empty;
                if (reader["CustomerName"] != DBNull.Value)
                    item.CustomerName = Convert.ToString(reader["CustomerName"]) ?? string.Empty;
                if (reader["DeliveryAddress"] != DBNull.Value)
                    item.DeliveryAddress = Convert.ToString(reader["DeliveryAddress"]) ?? string.Empty;
                if (reader["CreatedDate"] != DBNull.Value)
                    item.CreatedDate = Convert.ToDateTime(reader["CreatedDate"]);
                if (reader["PackageName"] != DBNull.Value)
                    item.PackageName = Convert.ToString(reader["PackageName"]) ?? string.Empty;
                if (reader["LocationName"] != DBNull.Value)
                    item.LocationName = Convert.ToString(reader["LocationName"]) ?? string.Empty;
                if (reader["EventDate"] != DBNull.Value)
                    item.EventDate = Convert.ToDateTime(reader["EventDate"]);
                if (reader["MealPeriodName"] != DBNull.Value)
                    item.MealPeriodName = Convert.ToString(reader["MealPeriodName"]) ?? string.Empty;
                if (reader["Pax"] != DBNull.Value)
                    item.Pax = Convert.ToInt32(reader["Pax"]);
                if (reader["OrderStatus"] != DBNull.Value)
                    item.OrderStatus = Convert.ToInt32(reader["OrderStatus"]);
                if (reader["OrderStatusName"] != DBNull.Value)
                    item.OrderStatusName = Convert.ToString(reader["OrderStatusName"]) ?? string.Empty;
                if (reader["TotalAmount"] != DBNull.Value)
                    item.TotalAmount = Convert.ToDecimal(reader["TotalAmount"]);
                if (reader["PaidAmount"] != DBNull.Value)
                    item.PaidAmount = Convert.ToDecimal(reader["PaidAmount"]);
                if (reader["PaymentStatus"] != DBNull.Value)
                    item.PaymentStatus = Convert.ToString(reader["PaymentStatus"]) ?? string.Empty;

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

    #region Private Methods
    private List<LogisticsDetails> ListDelivered(IDataReader reader)
    {
        var listDeli = new List<LogisticsDetails>();
        try
        {
            while (reader.Read())
            {
                var item = new LogisticsDetails();
                if (reader["Id"] != DBNull.Value)
                    item.Id = Convert.ToInt32(reader["Id"])!;
                if (reader["OrderDate"] != DBNull.Value)
                    item.OrderDate = Convert.ToDateTime(reader["OrderDate"]);
                if (reader["OrderNumber"] != DBNull.Value)
                    item.OrderNumber = Convert.ToString(reader["OrderNumber"])!;
                if (reader["Location"] != DBNull.Value)
                    item.Location = Convert.ToString(reader["Location"])!;
                if (reader["DriverName"] != DBNull.Value)
                    item.DriverName = Convert.ToString(reader["DriverName"])!;
                if (reader["Name"] != DBNull.Value)
                    item.Status = Convert.ToString(reader["Name"]);
                if (reader["CreatedDate"] != DBNull.Value)
                    item.CreatedDate = Convert.ToDateTime(reader["CreatedDate"]);

                listDeli.Add(item);
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

        return listDeli;
    }
    #endregion
}


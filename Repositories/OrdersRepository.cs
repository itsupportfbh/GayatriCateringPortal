using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using GayatriCateringPortal.Data;
using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using System.Text.Json;

namespace GayatriCateringPortal.Repositories;

public class OrdersRepository : IOrdersRepository
{
    public List<OrderListItem> GetOrderList(DateTime? fromDate = null, DateTime? toDate = null)
    {
        var items = new List<OrderListItem>();
        using var conn = (SqlConnection)DataFactory.CreateConnection();
        using var cmd = new SqlCommand("dbo.GetOrders", conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.Add("@FromDate", SqlDbType.Date).Value = (object?)fromDate?.Date ?? DBNull.Value;
        cmd.Parameters.Add("@ToDate", SqlDbType.Date).Value = (object?)toDate?.Date ?? DBNull.Value;
        conn.Open();
        using var reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            items.Add(new OrderListItem
            {
                Id = Convert.ToInt32(reader["Id"]),
                OrderNumber = Convert.ToString(reader["OrderNumber"]) ?? string.Empty,
                CustomerName = Convert.ToString(reader["CustomerName"]) ?? string.Empty,
                MobileNo = Convert.ToString(reader["MobileNo"]) ?? string.Empty,
                EmailId = Convert.ToString(reader["EmailId"]) ?? string.Empty,
                PackageName = Convert.ToString(reader["PackageName"]) ?? string.Empty,
                LocationName = Convert.ToString(reader["LocationName"]) ?? string.Empty,
                EventDate = reader["EventDate"] == DBNull.Value ? null : Convert.ToDateTime(reader["EventDate"]),
                MealPeriodName = Convert.ToString(reader["MealPeriodName"]) ?? string.Empty,
                Pax = Convert.ToInt32(reader["Pax"]),
                OrderStatus = Convert.ToInt32(reader["OrderStatus"]),
                OrderStatusName = Convert.ToString(reader["OrderStatusName"]) ?? string.Empty,
                TotalAmount = Convert.ToDecimal(reader["TotalAmount"]),
                PaidAmount = Convert.ToDecimal(reader["PaidAmount"]),
                PaymentStatus = Convert.ToString(reader["PaymentStatus"]) ?? string.Empty
            });
        }
        return items;
    }

    public int UpdateOrderStatus(int orderId, int status)
    {
        try
        {
            using (IDbConnection conn = DataFactory.CreateConnection())
            {
                conn.Open();

                using (IDbCommand cmd = DataFactory.CreateCommand(
                    "[dbo].[SP_UpdateOrderStatus]",
                    conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add(  DataFactory.CreateParameter("@OrderId", orderId));

                    cmd.Parameters.Add( DataFactory.CreateParameter("@Status", status));

                    var rowsAffected = cmd.ExecuteNonQuery();
                    return rowsAffected > 0 ? status : -1;
                }
            }
        }
        catch (SqlException ex)
        {
            throw new Exception("Database error: " + ex.Message, ex);
        }
        catch (Exception ex)
        {
            throw new Exception(
                "Error while updating order status: " + ex.Message,
                ex);
        }
    }
    public List<Orders> GetAll()
    {
        List<Orders> list = new List<Orders>();
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        IDataReader? reader = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                conn.Open();
                using (cmd = DataFactory.CreateCommand("SELECT * FROM Orders ORDER BY Id DESC", conn))
                {
                    reader = DataFactory.ExecuteReader(cmd);
                    list = new List<Orders>();
                    while (reader.Read()) list.Add(MapOrder(reader));
                }
            }
            return list ?? new List<Orders>();
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

    public Orders? GetById(int id)
    {
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        IDataReader? reader = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                using (cmd = DataFactory.CreateCommand("SELECT * FROM Orders WHERE Id = @Id", conn))
                {
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Id", id));
                    if (conn.State == ConnectionState.Closed) conn.Open();
                    reader = DataFactory.ExecuteReader(cmd);
                    if (reader.Read()) return MapOrder(reader);
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

    public int Create(Orders order)
    {
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                using (cmd = DataFactory.CreateCommand("SP_CreateOrder", conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                    // TODO: add specific order parameters
                    conn.Open();
                    var res = DataFactory.ExecuteScalar(cmd);
                    return res != null ? Convert.ToInt32(res) : 0;
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

    public int CreateCompleteOrder(CreateOrderRequest request)
    {
        using var conn = (SqlConnection)DataFactory.CreateConnection();
        conn.Open();
        using var transaction = conn.BeginTransaction();

        try
        {
            var now = DateTime.Now;
            var customer = request.Customer;
            const int systemUserId = 0;
            var createdBy = customer.CreatedBy > 0
                ? customer.CreatedBy
                : request.Order.CreatedBy.GetValueOrDefault() > 0
                    ? request.Order.CreatedBy!.Value
                    : systemUserId;

            using (var cmd = CreateCommand("SP_CreateCustomerMaster"))
            {
                Add(cmd, "@Code", string.IsNullOrWhiteSpace(customer.Code) ? $"CUST-{now:yyyyMMddHHmmssfff}" : customer.Code);
                Add(cmd, "@Name", customer.Name.Trim());
                Add(cmd, "@MobileNo", customer.MobileNo?.Trim());
                Add(cmd, "@EmailId", customer.EmailId?.Trim() ?? string.Empty);
                Add(cmd, "@Age", customer.Age);
                Add(cmd, "@AddressLine1", customer.AddressLine1?.Trim() ?? string.Empty);
                Add(cmd, "@AddressLine2", customer.AddressLine2?.Trim() ?? string.Empty);
                Add(cmd, "@CityId", customer.CityId > 0 ? customer.CityId : null);
                Add(cmd, "@StateId", customer.StateId > 0 ? customer.StateId : null);
                Add(cmd, "@CountryId", customer.CountryId > 0 ? customer.CountryId : null);
                Add(cmd, "@Pincode", customer.Pincode);
                Add(cmd, "@DateOfBirth", customer.DateOfBirth);
                Add(cmd, "@Gender", customer.Gender);
                Add(cmd, "@Remarks", customer.Remarks);
                Add(cmd, "@IsActive", true); 
                Add(cmd, "@CreatedBy", createdBy);
                Add(cmd, "@CreatedDate", now);
                Add(cmd, "@UpdatedBy", null);
                Add(cmd, "@UpdatedDate", null);
                Add(cmd, "@IsDeleted", false);
                customer.Id = ExecuteId(cmd, "customer");
            }

            var order = request.Order;
            order.CustomerId = customer.Id;
            using (var cmd = CreateCommand("SP_CreateOrders"))
            {
                Add(cmd, "@OrderNumber", order.OrderNumber); 
                Add(cmd, "@CustomerId", order.CustomerId);
                Add(cmd, "@PackageId", order.PackageId);
                Add(cmd, "@MealPeriodId", order.MealPeriodId); 
                Add(cmd, "@LocationId", order.LocationId);
                Add(cmd, "@EventDate", order.EventDate);
                Add(cmd, "@DeliveryAddress", order.DeliveryAddress);
                Add(cmd, "@Notes", order.Notes); 
                Add(cmd, "@Pax", order.Pax);
                Add(cmd, "@PackageBaseAmount", order.PackageBaseAmount); 
                Add(cmd, "@AdditionalMenuAmount", order.AdditionalMenuAmount);
                Add(cmd, "@AddOnsAmount", order.AddOnsAmount);
                Add(cmd, "@UtensilsAmount", order.UtensilsAmount);
                Add(cmd, "@SubTotal", order.SubTotal);
                Add(cmd, "@Discount", order.Discount);
                Add(cmd, "@DeliveryFee", order.DeliveryFee);
                Add(cmd, "@TaxAmount", order.TaxAmount);
                Add(cmd, "@TotalAmount", order.TotalAmount);
                Add(cmd, "@TaxPercentage", order.TaxPercentage);
                Add(cmd, "@PaidAmount", order.PaidAmount);
                Add(cmd, "@OrderStatus", order.OrderStatus);
                Add(cmd, "@CreatedDate", now);
                Add(cmd, "@CreatedBy", createdBy);
                Add(cmd, "@UpdatedDate", null);
                Add(cmd, "@UpdatedBy", null);
                order.Id = ExecuteId(cmd, "order");
            }

            foreach (var item in request.PackageDetails)
            {
                using var cmd = CreateCommand("SP_CreateOrderPackageDetails");
                Add(cmd, "@OrderId", order.Id);
                Add(cmd, "@CategoryId", item.CategoryId);
                Add(cmd, "@MenuId", item.MenuId);
                AddAudit(cmd, item.CreatedBy ?? createdBy, now);
                ExecuteRequired(cmd, "package detail");
            }
            foreach (var item in request.ExtraItems)
            {
                using var cmd = CreateCommand("SP_CreateOrderExtraItems");
                Add(cmd, "@OrderId", order.Id); 
                Add(cmd, "@CategoryId", item.CategoryId);
                Add(cmd, "@MenuId", item.MenuId);
                Add(cmd, "@Qty", item.Qty); 
                Add(cmd, "@UnitPrice", item.UnitPrice); 
                Add(cmd, "@TotalAmount", item.TotalAmount);
                AddAudit(cmd, item.CreatedBy ?? createdBy, now);
                ExecuteRequired(cmd, "extra item");
            }
            foreach (var item in request.AddOns)
            {
                using var cmd = CreateCommand("SP_CreateOrderAddOnsDetails");
                Add(cmd, "@OrderId", order.Id);
                Add(cmd, "@AddOnsId", item.AddOnsId); 
                Add(cmd, "@Qty", item.Qty);
                Add(cmd, "@UnitPrice", item.UnitPrice);
                Add(cmd, "@TotalAmount", item.TotalAmount);
                AddAudit(cmd, item.CreatedBy ?? createdBy, now); 
                ExecuteRequired(cmd, "add-on");
            }
            foreach (var item in request.Utensils)
            {
                using var cmd = CreateCommand("SP_CreateOrderUtensilsDetails");
                Add(cmd, "@OrderId", order.Id);
                Add(cmd, "@UtensilsId", item.UtensilsId);
                Add(cmd, "@Qty", item.Qty);
                Add(cmd, "@UnitPrice", item.UnitPrice);
                Add(cmd, "@TotalAmount", item.TotalAmount);
                Add(cmd, "@RefundableDeposit", item.RefundableDeposit);
                AddAudit(cmd, item.CreatedBy ?? createdBy, now);
                ExecuteRequired(cmd, "utensil");
            }

            var details = request.Event;
            using (var cmd = CreateCommand("SP_CreateOrderEventDetails"))
            {
                Add(cmd, "@CustomerId", customer.Id);
                Add(cmd, "@OrderId", order.Id);
                Add(cmd, "@EventDate", details.EventStartDate ?? details.EventDate);
                Add(cmd, "@AddressLine1", details.AddressLine1);
                Add(cmd, "@AddressLine2", details.AddressLine2);
                Add(cmd, "@City", details.City); 
                Add(cmd, "@State", details.State);
                Add(cmd, "@Country", details.Country);
                Add(cmd, "@Notes", details.Notes); 
                Add(cmd, "@MealPeriodId", details.MealPeriodId);
                AddAudit(cmd, details.CreatedBy > 0 ? details.CreatedBy : createdBy, now);
                ExecuteRequired(cmd, "event detail");
            }

            transaction.Commit();
            return order.Id;

            SqlCommand CreateCommand(string name) => new(name, conn, transaction) { CommandType = CommandType.StoredProcedure };
            static void Add(SqlCommand command, string name, object? value) => command.Parameters.AddWithValue(name, value ?? DBNull.Value);
            static int ExecuteId(SqlCommand command, string entity)
            {
                var result = command.ExecuteScalar();
                var id = result == null || result == DBNull.Value ? 0 : Convert.ToInt32(result);
                if (id <= 0) throw new InvalidOperationException($"The {entity} was not created.");
                return id;
            }
            static void ExecuteRequired(SqlCommand command, string entity)
            {
                var result = command.ExecuteScalar();
                if (result != null && result != DBNull.Value && Convert.ToInt32(result) <= 0)
                    throw new InvalidOperationException($"The {entity} was not created.");
            }
            static void AddAudit(SqlCommand command, int? createdBy, DateTime createdDate)
            {
                Add(command, "@IsActive", true); Add(command, "@IsDeleted", false); Add(command, "@CreatedDate", createdDate);
                Add(command, "@CreatedBy", createdBy); Add(command, "@UpdatedDate", null); Add(command, "@UpdatedBy", null);
            }
        }
        catch (Exception ex)
        {
            transaction.Rollback();
            throw new Exception("Unable to submit the complete order: " + ex.Message, ex);
        }
    }

    public bool Update(Orders order)
    {
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                using (cmd = DataFactory.CreateCommand("SP_UpdateOrder", conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Id", order.Id));
                    // TODO: add other order fields as parameters
                    if (conn.State == ConnectionState.Closed) conn.Open();
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
                using (cmd = DataFactory.CreateCommand("UPDATE Orders SET IsDeleted = 1 WHERE Id = @Id", conn))
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
                using (cmd = DataFactory.CreateCommand("UPDATE Orders SET IsActive = CASE WHEN IsActive = 1 THEN 0 ELSE 1 END WHERE Id = @Id", conn))
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

    public int UpdateCompleteOrder(CreateOrderRequest request)
    {
        if (request.Order.Id <= 0 || request.Customer.Id <= 0)
            throw new ArgumentException("Order Id and Customer Id are required for a complete update.");

        try
        {
            using var conn = (SqlConnection)DataFactory.CreateConnection();
            using var cmd = new SqlCommand("SP_UpdateCompleteOrder", conn)
            {
                CommandType = CommandType.StoredProcedure
            };
            cmd.Parameters.Add("@RequestJson", SqlDbType.NVarChar, -1).Value = JsonSerializer.Serialize(request);
            conn.Open();
            var result = cmd.ExecuteScalar();
            var orderId = result == null || result == DBNull.Value ? 0 : Convert.ToInt32(result);
            if (orderId <= 0) throw new InvalidOperationException("The complete order was not updated.");
            return orderId;
        }
        catch (Exception ex)
        {
            throw new Exception("Unable to update the complete order: " + ex.Message, ex);
        }
    }

    private static Orders MapOrder(IDataRecord reader)
    {
        return new Orders
        {
            Id = Convert.ToInt32(reader["Id"]),
            OrderNumber = reader["OrderNumber"] == DBNull.Value ? null : Convert.ToString(reader["OrderNumber"]),
            CustomerId = Convert.ToInt32(reader["CustomerId"]),
            PackageId = reader["PackageId"] == DBNull.Value ? null : Convert.ToInt32(reader["PackageId"]),
            MealPeriodId = reader["MealPeriodId"] == DBNull.Value ? null : Convert.ToInt32(reader["MealPeriodId"]),
            LocationId = reader["LocationId"] == DBNull.Value ? null : Convert.ToInt32(reader["LocationId"]),
            EventDate = reader["EventDate"] == DBNull.Value ? null : Convert.ToDateTime(reader["EventDate"]),
            DeliveryAddress = reader["DeliveryAddress"] == DBNull.Value ? null : Convert.ToString(reader["DeliveryAddress"]),
            Notes = reader["Notes"] == DBNull.Value ? null : Convert.ToString(reader["Notes"]),
            Pax = Convert.ToInt32(reader["Pax"]),
            PackageBaseAmount = reader["PackageBaseAmount"] == DBNull.Value ? null : Convert.ToDecimal(reader["PackageBaseAmount"]),
            AdditionalMenuAmount = reader["AdditionalMenuAmount"] == DBNull.Value ? null : Convert.ToDecimal(reader["AdditionalMenuAmount"]),
            AddOnsAmount = reader["AddOnsAmount"] == DBNull.Value ? null : Convert.ToDecimal(reader["AddOnsAmount"]),
            UtensilsAmount = reader["UtensilsAmount"] == DBNull.Value ? null : Convert.ToDecimal(reader["UtensilsAmount"]),
            SubTotal = Convert.ToDecimal(reader["SubTotal"]),
            Discount = Convert.ToDecimal(reader["Discount"]),
            DeliveryFee = Convert.ToDecimal(reader["DeliveryFee"]),
            TaxAmount = Convert.ToDecimal(reader["TaxAmount"]),
            TotalAmount = Convert.ToDecimal(reader["TotalAmount"]),
            TaxPercentage = reader["TaxPercentage"] == DBNull.Value ? null : Convert.ToDecimal(reader["TaxPercentage"]),
            PaidAmount = Convert.ToDecimal(reader["PaidAmount"]),
            OrderStatus = Convert.ToInt32(reader["OrderStatus"]),
            CreatedDate = Convert.ToDateTime(reader["CreatedDate"]),
            CreatedBy = reader["CreatedBy"] == DBNull.Value ? null : Convert.ToInt32(reader["CreatedBy"]),
            UpdatedDate = reader["UpdatedDate"] == DBNull.Value ? null : Convert.ToDateTime(reader["UpdatedDate"]),
            UpdatedBy = reader["UpdatedBy"] == DBNull.Value ? null : Convert.ToInt32(reader["UpdatedBy"])
        };
    }
}


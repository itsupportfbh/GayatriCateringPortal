using System;
using System.Collections.Generic;
using System.Data;
using System.Text.Json;
using Microsoft.Data.SqlClient;
using GayatriCateringPortal.Data;
using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Repositories;

public class OrdersRepository : IOrdersRepository
{
    public List<OrderListItem> GetOrderList(DateTime? fromDate = null, DateTime? toDate = null)
    {
        List<OrderListItem> list = new List<OrderListItem>();
        IDbConnection conn = null;
        IDbCommand cmd = null;
        IDataReader reader = null;

        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                conn.Open();
                using (cmd = DataFactory.CreateCommand("dbo.GetOrders", conn))
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

    public int UpdateOrderStatus(int OrderId, int Status)
    {
        IDbConnection conn = null;
        IDbCommand cmd = null;

        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                conn.Open();

                using (cmd = DataFactory.CreateCommand("SP_UpdateOrderStatus", conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(DataFactory.CreateParameter("@OrderId", OrderId));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Status", Status));

                    var rowsAffected = DataFactory.ExecuteNonQuery(cmd);
                    return rowsAffected > 0 ? Status : -1;
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

    public int UpdateOrderPaymentStatus(int OrderId, int Status)
    {
        IDbConnection conn = null;
        IDbCommand cmd = null;

        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                conn.Open();

                using (cmd = DataFactory.CreateCommand("SP_UpdateOrderPaymentStatus", conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(DataFactory.CreateParameter("@OrderId", OrderId));
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Status", Status));

                    var rowsAffected = DataFactory.ExecuteNonQuery(cmd);
                    return rowsAffected > 0 ? Status : -1;
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


    public OrderPaymentStatus? GetOrderPaymentStatus(int orderId)
    {
        IDbConnection conn = null;
        IDbCommand cmd = null;
        IDataReader reader = null;

        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                conn.Open();
                using (cmd = DataFactory.CreateCommand("SELECT Id, TotalAmount, PaidAmount, PaymentStatus FROM Orders WHERE Id = @OrderId AND IsDeleted = 0", conn))
                {
                    cmd.Parameters.Add(DataFactory.CreateParameter("@OrderId", orderId));
                    reader = DataFactory.ExecuteReader(cmd);

                    if (!reader.Read())
                        return null;

                    return new OrderPaymentStatus
                    {
                        OrderId = reader["Id"] != DBNull.Value ? Convert.ToInt32(reader["Id"]) : orderId,
                        TotalAmount = reader["TotalAmount"] != DBNull.Value ? Convert.ToDecimal(reader["TotalAmount"]) : 0,
                        PaidAmount = reader["PaidAmount"] != DBNull.Value ? Convert.ToDecimal(reader["PaidAmount"]) : 0,
                        PaymentStatus = reader["PaymentStatus"] != DBNull.Value ? Convert.ToInt32(reader["PaymentStatus"]) : 0
                    };
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

    public bool UpdatePaymentFromWebhook(int orderId, decimal paidAmount)
    {
        IDbConnection conn = null;
        IDbCommand getCmd = null;
        IDbCommand updateCmd = null;
        IDataReader reader = null;

        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                conn.Open();

                decimal totalAmount = 0;
                decimal currentPaid = 0;

                using (getCmd = DataFactory.CreateCommand("SELECT TotalAmount, PaidAmount FROM Orders WHERE Id = @OrderId AND IsDeleted = 0", conn))
                {
                    getCmd.Parameters.Add(DataFactory.CreateParameter("@OrderId", orderId));
                    reader = DataFactory.ExecuteReader(getCmd);

                    if (!reader.Read())
                        return false;

                    totalAmount = reader["TotalAmount"] != DBNull.Value ? Convert.ToDecimal(reader["TotalAmount"]) : 0;
                    currentPaid = reader["PaidAmount"] != DBNull.Value ? Convert.ToDecimal(reader["PaidAmount"]) : 0;
                }

                var normalizedPaidAmount = paidAmount > currentPaid ? paidAmount : currentPaid;
                var paymentStatus = normalizedPaidAmount >= totalAmount && totalAmount > 0
                    ? 2
                    : normalizedPaidAmount > 0 ? 1 : 0;

                using (updateCmd = DataFactory.CreateCommand("UPDATE Orders SET PaidAmount = @PaidAmount, PaymentStatus = @PaymentStatus, UpdatedDate = @UpdatedDate WHERE Id = @OrderId AND IsDeleted = 0", conn))
                {
                    updateCmd.Parameters.Add(DataFactory.CreateParameter("@PaidAmount", normalizedPaidAmount));
                    updateCmd.Parameters.Add(DataFactory.CreateParameter("@PaymentStatus", paymentStatus));
                    updateCmd.Parameters.Add(DataFactory.CreateParameter("@UpdatedDate", DateTime.Now));
                    updateCmd.Parameters.Add(DataFactory.CreateParameter("@OrderId", orderId));

                    return DataFactory.ExecuteNonQuery(updateCmd) > 0;
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

    public int Create(Orders order)
    {
        IDbConnection conn = null;
        IDbCommand cmd = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                using (cmd = DataFactory.CreateCommand("[GetMYOrders]", conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
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
        SqlConnection conn = null;
        SqlTransaction transaction = null;

        try
        {
            conn = (SqlConnection)DataFactory.CreateConnection();
            conn.Open();
            transaction = conn.BeginTransaction();

            var now = DateTime.Now;
            var customer = request.Customer;
            const int systemUserId = 0;
            var createdBy = customer.CreatedBy > 0
                ? customer.CreatedBy
                : request.Order.CreatedBy.GetValueOrDefault() > 0
                    ? request.Order.CreatedBy.Value
                    : systemUserId;

            using (var cmd = CreateTransactionCommand("SP_CreateCustomerMaster", conn, transaction))
            {
                // CustomerMaster.Code has a short database column. Keep generated
                // customer codes within 15 characters: C + yyMMddHHmmssff.
                AddParameter(cmd, "@Code", string.IsNullOrWhiteSpace(customer.Code) ? $"C{now:yyMMddHHmmssff}" : customer.Code.Trim());
                AddParameter(cmd, "@Name", customer.Name.Trim());
                AddParameter(cmd, "@MobileNo", customer.MobileNo?.Trim());
                AddParameter(cmd, "@EmailId", customer.EmailId?.Trim() ?? string.Empty);
                AddParameter(cmd, "@Address", customer.Address?.Trim() ?? string.Empty);
                AddParameter(cmd, "@Pincode", customer.Pincode);
                AddParameter(cmd, "@Remarks", customer.Remarks);
                AddParameter(cmd, "@IsActive", true);
                AddParameter(cmd, "@IsDeleted", false);
                AddParameter(cmd, "@CreatedBy", createdBy);
                AddParameter(cmd, "@CreatedDate", now);
                AddParameter(cmd, "@UpdatedBy", null);
                AddParameter(cmd, "@UpdatedDate", null);
                customer.Id = ExecuteId(cmd, "customer");
            }

            var order = request.Order;
            order.CustomerId = customer.Id;

            using (var cmd = CreateTransactionCommand("SP_CreateOrders", conn, transaction))
            {
                AddParameter(cmd, "@OrderNumber", order.OrderNumber);
                AddParameter(cmd, "@CustomerId", order.CustomerId);
                AddParameter(cmd, "@PackageId", order.PackageId);
                AddParameter(cmd, "@EventId", order.EventId);
                AddParameter(cmd, "@MealPeriodId", order.MealPeriodId);
                AddParameter(cmd, "@LocationId", order.LocationId);
                AddParameter(cmd, "@EventDate", order.EventDate);
                AddParameter(cmd, "@DeliveryAddress", order.DeliveryAddress);
                AddParameter(cmd, "@Notes", order.Notes);
                AddParameter(cmd, "@Pax", order.Pax);
                AddParameter(cmd, "@PackageBaseAmount", order.PackageBaseAmount);
                AddParameter(cmd, "@AdditionalMenuAmount", order.AdditionalMenuAmount);
                AddParameter(cmd, "@AddOnsAmount", order.AddOnsAmount);
                AddParameter(cmd, "@UtensilsAmount", order.UtensilsAmount);
                AddParameter(cmd, "@ServiceCharge", order.ServiceCharge);
                AddParameter(cmd, "@SubTotal", order.SubTotal);
                AddParameter(cmd, "@Discount", order.Discount);
                AddParameter(cmd, "@DeliveryFee", order.DeliveryFee);
                AddParameter(cmd, "@TaxAmount", order.TaxAmount);
                AddParameter(cmd, "@TotalAmount", order.TotalAmount);
                AddParameter(cmd, "@TaxPercentage", order.TaxPercentage);
                AddParameter(cmd, "@PaidAmount", order.PaidAmount);
                AddParameter(cmd, "@PaymentStatus", order.PaymentStatus);
                AddParameter(cmd, "@OrderStatus", order.OrderStatus);
                AddParameter(cmd, "@CreatedDate", now);
                AddParameter(cmd, "@CreatedBy", createdBy);
                AddParameter(cmd, "@UpdatedDate", null);
                AddParameter(cmd, "@UpdatedBy", null);
                order.Id = ExecuteId(cmd, "order");
            }

            foreach (var item in request.PackageDetails)
            {
                using var cmd = CreateTransactionCommand("SP_CreateOrderPackageDetails", conn, transaction);
                AddParameter(cmd, "@OrderId", order.Id);
                AddParameter(cmd, "@CategoryId", item.CategoryId);
                AddParameter(cmd, "@MenuId", item.MenuId);
                AddAudit(cmd, item.CreatedBy ?? createdBy, now);
                ExecuteRequired(cmd, "package detail");
            }

            foreach (var item in request.ExtraItems)
            {
                using var cmd = CreateTransactionCommand("SP_CreateOrderExtraItems", conn, transaction);
                AddParameter(cmd, "@OrderId", order.Id);
                AddParameter(cmd, "@CategoryId", item.CategoryId);
                AddParameter(cmd, "@MenuId", item.MenuId);
                AddParameter(cmd, "@Qty", item.Qty);
                AddParameter(cmd, "@UnitPrice", item.UnitPrice);
                AddParameter(cmd, "@TotalAmount", item.TotalAmount);
                AddAudit(cmd, item.CreatedBy ?? createdBy, now);
                ExecuteRequired(cmd, "extra item");
            }

            foreach (var item in request.AddOns)
            {
                using var cmd = CreateTransactionCommand("SP_CreateOrderAddOnsDetails", conn, transaction);
                AddParameter(cmd, "@OrderId", order.Id);
                AddParameter(cmd, "@AddOnsId", item.AddOnsId);
                AddParameter(cmd, "@Qty", item.Qty);
                AddParameter(cmd, "@UnitPrice", item.UnitPrice);
                AddParameter(cmd, "@TotalAmount", item.TotalAmount);
                AddAudit(cmd, item.CreatedBy ?? createdBy, now);
                ExecuteRequired(cmd, "add-on");
            }

            foreach (var item in request.Utensils)
            {
                using var cmd = CreateTransactionCommand("SP_CreateOrderUtensilsDetails", conn, transaction);
                AddParameter(cmd, "@OrderId", order.Id);
                AddParameter(cmd, "@UtensilsId", item.UtensilsId);
                AddParameter(cmd, "@Qty", item.Qty);
                AddParameter(cmd, "@UnitPrice", item.UnitPrice);
                AddParameter(cmd, "@TotalAmount", item.TotalAmount);
                AddParameter(cmd, "@RefundableDeposit", item.RefundableDeposit);
                AddAudit(cmd, item.CreatedBy ?? createdBy, now);
                ExecuteRequired(cmd, "utensil");
            }

            var details = request.Event;
            using (var cmd = CreateTransactionCommand("SP_CreateOrderEventDetails", conn, transaction))
            {
                AddParameter(cmd, "@CustomerId", customer.Id);
                AddParameter(cmd, "@OrderId", order.Id);
                AddParameter(cmd, "@EventDate", details.EventDate ?? details.EventDate);
                AddParameter(cmd, "@Address", details.Address);
                AddParameter(cmd, "@Notes", details.Notes);
                AddParameter(cmd, "@MealPeriodId", details.MealPeriodId);
                AddAudit(cmd, details.CreatedBy > 0 ? details.CreatedBy : createdBy, now);
                ExecuteRequired(cmd, "event detail");
            }

            transaction.Commit();
            return order.Id;
        }
        catch (SqlException ex)
        {
            if (transaction != null) transaction.Rollback();
            throw new Exception("Unable to submit order: " + ex.Message, ex);
        }
        catch (Exception ex)
        {
            if (transaction != null) transaction.Rollback();
            throw new Exception("Unable to submit order: " + ex.Message, ex);
        }
        finally
        {
            if (conn != null && conn.State != ConnectionState.Closed) conn.Close();
        }
    }

    public bool Update(Orders order)
    {
        IDbConnection conn = null;
        IDbCommand cmd = null;
        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                using (cmd = DataFactory.CreateCommand("SP_UpdateOrder", conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(DataFactory.CreateParameter("@Id", order.Id));
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

    public int UpdateCompleteOrder(CreateOrderRequest request)
    {
        if (request.Order.Id <= 0 || request.Customer.Id <= 0)
            throw new ArgumentException("Order Id and Customer Id are required for a complete update.");

        IDbConnection conn = null;
        IDbCommand cmd = null;

        try
        {
            using (conn = DataFactory.CreateConnection())
            {
                conn.Open();
                using (cmd = DataFactory.CreateCommand("SP_UpdateCompleteOrder", conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                    ((SqlCommand)cmd).Parameters.Add("@RequestJson", SqlDbType.NVarChar, -1).Value = JsonSerializer.Serialize(request);

                    var result = DataFactory.ExecuteScalar(cmd);
                    var orderId = result == null || result == DBNull.Value ? 0 : Convert.ToInt32(result);
                    if (orderId <= 0)
                        throw new InvalidOperationException("The complete order was not updated.");

                    return orderId;
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
                if (reader["MobileNo"] != DBNull.Value)
                    item.MobileNo = Convert.ToString(reader["MobileNo"]) ?? string.Empty;
                if (reader["EmailId"] != DBNull.Value)
                    item.EmailId = Convert.ToString(reader["EmailId"]) ?? string.Empty;
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

    private SqlCommand CreateTransactionCommand(string name, SqlConnection conn, SqlTransaction transaction)
    {
        return new SqlCommand(name, conn, transaction)
        {
            CommandType = CommandType.StoredProcedure
        };
    }

    private void AddParameter(SqlCommand command, string name, object value)
    {
        command.Parameters.AddWithValue(name, value ?? DBNull.Value);
    }

    private int ExecuteId(SqlCommand command, string entity)
    {
        var result = command.ExecuteScalar();
        var id = result == null || result == DBNull.Value ? 0 : Convert.ToInt32(result);
        if (id <= 0)
            throw new InvalidOperationException("The " + entity + " was not created.");

        return id;
    }

    private void ExecuteRequired(SqlCommand command, string entity)
    {
        var result = command.ExecuteScalar();
        if (result != null && result != DBNull.Value && Convert.ToInt32(result) <= 0)
            throw new InvalidOperationException("The " + entity + " was not created.");
    }

    private void AddAudit(SqlCommand command, int? createdBy, DateTime createdDate)
    {
        AddParameter(command, "@IsActive", true);
        AddParameter(command, "@IsDeleted", false);
        AddParameter(command, "@CreatedDate", createdDate);
        AddParameter(command, "@CreatedBy", createdBy);
        AddParameter(command, "@UpdatedDate", null);
        AddParameter(command, "@UpdatedBy", null);
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
            ServiceCharge = reader["ServiceCharge"] == DBNull.Value ? 0 : Convert.ToDecimal(reader["ServiceCharge"]),
            SubTotal = Convert.ToDecimal(reader["SubTotal"]),
            Discount = Convert.ToDecimal(reader["Discount"]),
            DeliveryFee = Convert.ToDecimal(reader["DeliveryFee"]),
            TaxAmount = Convert.ToDecimal(reader["TaxAmount"]),
            TotalAmount = Convert.ToDecimal(reader["TotalAmount"]),
            TaxPercentage = reader["TaxPercentage"] == DBNull.Value ? null : Convert.ToDecimal(reader["TaxPercentage"]),
            PaidAmount = Convert.ToDecimal(reader["PaidAmount"]),
            OrderStatus = Convert.ToInt32(reader["OrderStatus"]),
            PaymentStatus = Convert.ToInt32(reader["PaymentStatus"]),
            CreatedDate = Convert.ToDateTime(reader["CreatedDate"]),
            CreatedBy = reader["CreatedBy"] == DBNull.Value ? null : Convert.ToInt32(reader["CreatedBy"]),
            UpdatedDate = reader["UpdatedDate"] == DBNull.Value ? null : Convert.ToDateTime(reader["UpdatedDate"]),
            UpdatedBy = reader["UpdatedBy"] == DBNull.Value ? null : Convert.ToInt32(reader["UpdatedBy"])
        };
    }
    #endregion
}

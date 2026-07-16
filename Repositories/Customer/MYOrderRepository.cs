using System.Data;
using GayatriCateringPortal.Data;
using GayatriCateringPortal.Interfaces.Customer;
using GayatriCateringPortal.Models;
using Microsoft.Data.SqlClient;

namespace GayatriCateringPortal.Repositories.Customer;

public class MYOrderRepository : IMYOrderRepository
{

    public List<OrderListItem> GetMyOrders(string phoneNo)
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

                using (cmd = DataFactory.CreateCommand("[dbo].[GetMYOrders]", conn))
                {
                    ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add(DataFactory.CreateParameter("@MobileNo", phoneNo));

                    reader = DataFactory.ExecuteReader(cmd);

                    list = this.List(reader);
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
            if (conn != null && conn.State != ConnectionState.Closed)
                conn.Close();
        }
    }
    private List<OrderListItem> List(IDataReader reader)
    {
        List<OrderListItem> list = new List<OrderListItem>();

        while (reader.Read())
        {
            OrderListItem item = new OrderListItem
            {
                Id = reader["Id"] == DBNull.Value ? 0 : Convert.ToInt32(reader["Id"]),
                OrderNumber = reader["OrderNumber"]?.ToString() ?? string.Empty,
                CustomerName = reader["CustomerName"]?.ToString() ?? string.Empty,
                MobileNo = reader["MobileNo"]?.ToString() ?? string.Empty,
                EmailId = reader["EmailId"]?.ToString() ?? string.Empty,
                PackageName = reader["PackageName"]?.ToString() ?? string.Empty,
                LocationName = reader["LocationName"]?.ToString() ?? string.Empty,
                EventDate = reader["EventDate"] == DBNull.Value
                    ? null
                    : Convert.ToDateTime(reader["EventDate"]),
                MealPeriodName = reader["MealPeriodName"]?.ToString() ?? string.Empty,
                Pax = reader["Pax"] == DBNull.Value ? 0 : Convert.ToInt32(reader["Pax"]),
                OrderStatus = reader["OrderStatus"] == DBNull.Value ? 0 : Convert.ToInt32(reader["OrderStatus"]),
                OrderStatusName = reader["OrderStatusName"]?.ToString() ?? string.Empty,
                TotalAmount = reader["TotalAmount"] == DBNull.Value ? 0 : Convert.ToDecimal(reader["TotalAmount"]),
                PaidAmount = reader["PaidAmount"] == DBNull.Value ? 0 : Convert.ToDecimal(reader["PaidAmount"]),
                PaymentStatus = reader["PaymentStatus"]?.ToString() ?? string.Empty
            };

            list.Add(item);
        }

        return list;
    }
}

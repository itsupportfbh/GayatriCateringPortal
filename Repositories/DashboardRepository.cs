using GayatriCateringPortal.Data;
using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.Data.SqlClient;
using System;
using System.Data;

namespace GayatriCateringPortal.Repositories;

public class DashboardRepository : IDashboardRepository
{
    public Dashboard GetDashboard()
    {
        Dashboard dashboard = new Dashboard();

        using (IDbConnection conn = DataFactory.CreateConnection())
        {
            conn.Open();

            using (IDbCommand cmd = DataFactory.CreateCommand("GetDashboardDetails", conn))
            {
                ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;

                using (SqlDataReader reader = (SqlDataReader)DataFactory.ExecuteReader(cmd))
                {
                    // First Result Set - Summary
                    if (reader.Read())
                    {
                        dashboard.Summary.TotalOrders = Convert.ToInt32(reader["TotalOrders"]);
                        dashboard.Summary.ActiveOrders = Convert.ToInt32(reader["ActiveOrders"]);
                        dashboard.Summary.TotalSales = Convert.ToDecimal(reader["TotalSales"]);
                        dashboard.Summary.Outstanding = Convert.ToDecimal(reader["Outstanding"]);
                    }

                    // Second Result Set - Recent Orders
                    if (reader.NextResult())
                    {
                        while (reader.Read())
                        {
                            dashboard.RecentOrders.Add(new DashboardDetails
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                OrderNumber = reader["OrderNumber"].ToString(),
                                CustomerName = reader["CustomerName"].ToString(),
                                MobileNo = reader["MobileNo"].ToString(),
                                EmailId = reader["EmailId"].ToString(),
                                PackageName = reader["PackageName"].ToString(),
                                LocationName = reader["LocationName"].ToString(),
                                EventDate = Convert.ToDateTime(reader["EventDate"]),
                                MealPeriodName = reader["MealPeriodName"].ToString(),
                                Pax = Convert.ToInt32(reader["Pax"]),
                                OrderStatus = Convert.ToInt32(reader["OrderStatus"]),
                                OrderStatusName = reader["OrderStatusName"].ToString(),
                                TotalAmount = Convert.ToDecimal(reader["TotalAmount"]),
                                PaidAmount = Convert.ToDecimal(reader["PaidAmount"]),
                                PaymentStatus = Convert.ToInt32(reader["PaymentStatus"]),
                                PaymentStatusName = reader["PaymentStatusName"].ToString(),
                                DeliveryAddress = reader["DeliveryAddress"].ToString(),
                                CreatedDate = Convert.ToDateTime(reader["CreatedDate"])
                            });
                        }
                    }
                }
            }
        }

        return dashboard;
    }
}

using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using GayatriCateringPortal.Data;
using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Repositories;

public class PackageItemsRepository : IPackageItemsRepository
{
    public List<PackageItems> GetByPackageId(int packageId)
    {
        var list = new List<PackageItems>();
        IDbConnection? conn = null;
        IDbCommand? cmd = null;
        IDataReader? reader = null;

        try
        {
            conn = DataFactory.CreateConnection();
            conn.Open();
            cmd = DataFactory.CreateCommand("SELECT Id, PackageId, CategoryId, Quantity, CreatedBy, CreatedDate, UpdatedBy, UpdatedDate, IsActive, IsDeleted FROM PackageItems WHERE IsDeleted = 0 AND PackageId = @PackageId", conn);
            cmd.Parameters.Add(DataFactory.CreateParameter("@PackageId", packageId));
            reader = DataFactory.ExecuteReader(cmd);

            while (reader.Read())
            {
                list.Add(new PackageItems
                {
                    Id = reader["Id"] != DBNull.Value ? Convert.ToInt32(reader["Id"]) : 0,
                    PackageId = reader["PackageId"] != DBNull.Value ? Convert.ToInt32(reader["PackageId"]) : 0,
                    CategoryId = reader["CategoryId"] != DBNull.Value ? Convert.ToInt32(reader["CategoryId"]) : 0,
                    Quantity = reader["Quantity"] != DBNull.Value ? Convert.ToInt32(reader["Quantity"]) : 0,
                    CreatedBy = reader["CreatedBy"] != DBNull.Value ? Convert.ToInt32(reader["CreatedBy"]) : 0,
                    CreatedDate = reader["CreatedDate"] != DBNull.Value ? Convert.ToDateTime(reader["CreatedDate"]) : DateTime.MinValue,
                    UpdatedBy = reader["UpdatedBy"] != DBNull.Value ? Convert.ToInt32(reader["UpdatedBy"]) : null,
                    UpdatedDate = reader["UpdatedDate"] != DBNull.Value ? Convert.ToDateTime(reader["UpdatedDate"]) : null,
                    IsActive = reader["IsActive"] != DBNull.Value && Convert.ToBoolean(reader["IsActive"]),
                    IsDeleted = reader["IsDeleted"] != DBNull.Value && Convert.ToBoolean(reader["IsDeleted"])
                });
            }

            return list;
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

    public bool CreatePackageItems(List<PackageItems> items)
    {
                IDbConnection? conn = null;
        IDbCommand? cmd = null;

        try
        {
            conn = DataFactory.CreateConnection();
            conn.Open();

            foreach (var item in items)
            {
                cmd = DataFactory.CreateCommand("SP_CreatePackageItems", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(DataFactory.CreateParameter("@PackageId", item.PackageId));
                cmd.Parameters.Add(DataFactory.CreateParameter("@CategoryId", item.CategoryId));
                cmd.Parameters.Add(DataFactory.CreateParameter("@Quantity", item.Quantity));
                cmd.Parameters.Add(DataFactory.CreateParameter("@CreatedBy", item.CreatedBy ));
                cmd.Parameters.Add(DataFactory.CreateParameter("@IsActive", item.IsActive ?? true));
                cmd.Parameters.Add(DataFactory.CreateParameter("@IsDeleted", item.IsDeleted ?? false));
                cmd.Parameters.Add(DataFactory.CreateParameter("@UpdatedBy", item.UpdatedBy));

                DataFactory.ExecuteNonQuery(cmd);
            }

            return true;
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

    public bool DeletePackageItem(int id)
    {
        IDbConnection? conn = null;
        IDbCommand? cmd = null;

        try
        {
            conn = DataFactory.CreateConnection();
            conn.Open();
            cmd = DataFactory.CreateCommand("UPDATE PackageItems SET IsDeleted = 1 WHERE Id = @Id", conn);
            cmd.Parameters.Add(DataFactory.CreateParameter("@Id", id));
            DataFactory.ExecuteNonQuery(cmd);
            return true;
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
}

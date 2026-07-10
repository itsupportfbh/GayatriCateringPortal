using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using GayatriCateringPortal.Data;
using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Repositories
{
    public class FoodMenuCategoryRepository : IFoodMenuCategoryRepository
    {
        public List<FoodMenuCategory> GetAll()
        {
            var list = new List<FoodMenuCategory>();
            IDbConnection? conn = null;
            IDbCommand? cmd = null;
            IDataReader? reader = null;
            try
            {
                using (conn = DataFactory.CreateConnection())
                {
                    conn.Open();
                    using (cmd = DataFactory.CreateCommand("SELECT Id, Code, Name, IsActive, IsDeleted, CreatedBy, CreatedDate, UpdatedBy, UpdatedDate FROM FoodMenuCategory WHERE IsDeleted = 0", conn))
                    {
                        reader = DataFactory.ExecuteReader(cmd);
                        while (reader.Read())
                        {
                            list.Add(new FoodMenuCategory
                            {
                                Id = Convert.ToString(reader["Id"]) ?? string.Empty,
                                Code = Convert.ToString(reader["Code"]) ?? string.Empty,
                                Name = Convert.ToString(reader["Name"]) ?? string.Empty,
                                IsActive = Convert.ToString(reader["IsActive"]) ?? string.Empty,
                                IsDeleted = Convert.ToString(reader["IsDeleted"]) ?? string.Empty,
                                CreatedBy = Convert.ToString(reader["CreatedBy"]) ?? string.Empty,
                                CreatedDate = Convert.ToString(reader["CreatedDate"]) ?? string.Empty,
                                UpdatedBy = reader["UpdatedBy"] != DBNull.Value ? Convert.ToString(reader["UpdatedBy"]) : null,
                                UpdatedDate = reader["UpdatedDate"] != DBNull.Value ? Convert.ToString(reader["UpdatedDate"]) : null
                            });
                        }
                    }
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
                if (conn != null && conn.State != ConnectionState.Closed) conn.Close();
            }
        }

        public FoodMenuCategory? GetById(string id)
        {
            var list = GetAll();
            return list.FirstOrDefault(x => x.Id == id);
        }

        public int Create(FoodMenuCategory item)
        {
            if (item == null) return 0;
            IDbConnection? conn = null;
            IDbCommand? cmd = null;
            try
            {
                conn = DataFactory.CreateConnection();
                conn.Open();
                cmd = DataFactory.CreateCommand("INSERT INTO FoodMenuCategory (Code, Name, IsActive, IsDeleted, CreatedBy, CreatedDate) VALUES (@Code, @Name, @IsActive, @IsDeleted, @CreatedBy, @CreatedDate)", conn);
                cmd.Parameters.Add(DataFactory.CreateParameter("@Code", item.Code ?? string.Empty));
                cmd.Parameters.Add(DataFactory.CreateParameter("@Name", item.Name ?? string.Empty));
                cmd.Parameters.Add(DataFactory.CreateParameter("@IsActive", item.IsActive ?? "1"));
                cmd.Parameters.Add(DataFactory.CreateParameter("@IsDeleted", item.IsDeleted ?? "0"));
                cmd.Parameters.Add(DataFactory.CreateParameter("@CreatedBy", item.CreatedBy ?? "0"));
                cmd.Parameters.Add(DataFactory.CreateParameter("@CreatedDate", DateTime.UtcNow));
                DataFactory.ExecuteNonQuery(cmd);
                return 1;
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

        public bool Update(FoodMenuCategory item)
        {
            if (item == null) return false;
            IDbConnection? conn = null;
            IDbCommand? cmd = null;
            try
            {
                conn = DataFactory.CreateConnection();
                conn.Open();
                cmd = DataFactory.CreateCommand("UPDATE FoodMenuCategory SET Code = @Code, Name = @Name, IsActive = @IsActive, UpdatedBy = @UpdatedBy, UpdatedDate = @UpdatedDate WHERE Id = @Id", conn);
                cmd.Parameters.Add(DataFactory.CreateParameter("@Id", item.Id ?? string.Empty));
                cmd.Parameters.Add(DataFactory.CreateParameter("@Code", item.Code ?? string.Empty));
                cmd.Parameters.Add(DataFactory.CreateParameter("@Name", item.Name ?? string.Empty));
                cmd.Parameters.Add(DataFactory.CreateParameter("@IsActive", item.IsActive ?? "1"));
                cmd.Parameters.Add(DataFactory.CreateParameter("@UpdatedBy", item.UpdatedBy ?? "0"));
                cmd.Parameters.Add(DataFactory.CreateParameter("@UpdatedDate", DateTime.UtcNow));
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
                if (conn != null && conn.State != ConnectionState.Closed) conn.Close();
            }
        }

        public bool Delete(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return false;
            IDbConnection? conn = null;
            IDbCommand? cmd = null;
            try
            {
                conn = DataFactory.CreateConnection();
                conn.Open();
                cmd = DataFactory.CreateCommand("UPDATE FoodMenuCategory SET IsDeleted = 1, UpdatedDate = @UpdatedDate WHERE Id = @Id", conn);
                cmd.Parameters.Add(DataFactory.CreateParameter("@Id", id));
                cmd.Parameters.Add(DataFactory.CreateParameter("@UpdatedDate", DateTime.UtcNow));
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
                if (conn != null && conn.State != ConnectionState.Closed) conn.Close();
            }
        }

        public bool ActiveInActive(string id, bool status)
        {
            if (string.IsNullOrWhiteSpace(id)) return false;
            IDbConnection? conn = null;
            IDbCommand? cmd = null;
            try
            {
                conn = DataFactory.CreateConnection();
                conn.Open();
                cmd = DataFactory.CreateCommand("UPDATE FoodMenuCategory SET IsActive = @IsActive, UpdatedDate = @UpdatedDate WHERE Id = @Id", conn);
                cmd.Parameters.Add(DataFactory.CreateParameter("@Id", id));
                cmd.Parameters.Add(DataFactory.CreateParameter("@IsActive", status ? "1" : "0"));
                cmd.Parameters.Add(DataFactory.CreateParameter("@UpdatedDate", DateTime.UtcNow));
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
                if (conn != null && conn.State != ConnectionState.Closed) conn.Close();
            }
        }
    }
}

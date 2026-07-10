using GayatriCateringPortal.Data;
using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Net.NetworkInformation;

namespace GayatriCateringPortal.Repositories
{
    public class FoodMenuRepository : IFoodMenuRepository
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
                    using (cmd = DataFactory.CreateCommand("GetFoodMenu", conn))
                    {
                        ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                        reader = DataFactory.ExecuteReader(cmd);
                        list = this.List(reader);
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

        public FoodMenu? GetById(int id)
        {
            IDbConnection? conn = null;
            IDbCommand? cmd = null;
            IDataReader? reader = null;
            FoodMenu? item = null;
            try
            {
                using (conn = DataFactory.CreateConnection())
                {
                    if (conn.State == ConnectionState.Closed) conn.Open();
                    using (cmd = DataFactory.CreateCommand("SP_GetFoodMenuById", conn))
                    {
                        ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add(DataFactory.CreateParameter("@Id", id));
                        reader = DataFactory.ExecuteReader(cmd);
                        var list = this.List(reader);
                        if (list != null && list.Count > 0) item = list[0];
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
            return item;
        }

        public int Create(FoodMenu item)
        {
            IDbConnection? conn = null;
            IDbCommand? cmd = null;
            try
            {
                using (conn = DataFactory.CreateConnection())
                {
                    conn.Open();
                    using (cmd = DataFactory.CreateCommand("SP_CreateFoodMenu", conn))
                    {
                        ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add(DataFactory.CreateParameter("@Code", (object?)item.Code ?? DBNull.Value));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@Name", (object?)item.Name ?? DBNull.Value));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@CategoryId", (object?)item.CategoryId  ?? DBNull.Value));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@Price", (object?)item.Price ?? DBNull.Value));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@PreparationTime", (object?)item.PreparationTime ?? DBNull.Value));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@FoodType", (object?)item.FoodType ?? DBNull.Value));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@Servicecharge", (object?)item.Servicecharge ?? DBNull.Value));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@IsActive", item.IsActive));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@IsDeleted", item.IsDeleted));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@CreatedBy", item.CreatedBy));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@CreatedDate", DateTime.TryParse(item.CreatedDate, out var createdDate) ? createdDate : (object?)DBNull.Value));

                        var result = DataFactory.ExecuteScalar(cmd);
                        if (result != null)
                        {
                            item.Id = Convert.ToString(result) ?? item.Id;
                            return Convert.ToInt32(item.Id);
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

        public bool Update(FoodMenu item)
        {
            IDbConnection? conn = null;
            IDbCommand? cmd = null;
            try
            {
                var idValue = int.TryParse(item.Id, out var parsedId) ? parsedId : 0;
                using (conn = DataFactory.CreateConnection())
                {
                    conn.Open();
                    using (cmd = DataFactory.CreateCommand("SP_UpdateFoodMenu", conn))
                    {
                        ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add(DataFactory.CreateParameter("@Id", idValue));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@Code", (object?)item.Code ?? DBNull.Value));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@Name", (object?)item.Name ?? DBNull.Value));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@CategoryId", (object?)item.CategoryId ?? DBNull.Value));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@Price", (object?)item.Price ?? DBNull.Value));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@PreparationTime", (object?)item.PreparationTime ?? DBNull.Value));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@FoodType", (object?)item.FoodType ?? DBNull.Value));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@Servicecharge", (object?)item.Servicecharge ?? DBNull.Value));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@IsActive", item.IsActive));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@IsDeleted", item.IsDeleted));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@UpdatedBy", item.UpdatedBy));                        
                        cmd.Parameters.Add(DataFactory.CreateParameter("@UpdatedDate", DateTime.TryParse(item.UpdatedDate, out var updatedDate) ? updatedDate : (object?)DBNull.Value));

                        var result = DataFactory.ExecuteScalar(cmd);
                        return result != null && Convert.ToInt32(result) > 0;
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
            bool taskStatus = false;
            try
            {
                using (conn = DataFactory.CreateConnection())
                {
                    if (conn.State == ConnectionState.Closed) conn.Open();
                    using (cmd = DataFactory.CreateCommand("DeleteFoodMenuById", conn))
                    {
                        ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add(DataFactory.CreateParameter("@Id", id));
                        var r = DataFactory.ExecuteScalar(cmd);
                        if (r != null && Convert.ToInt32(r) > 0)
                            taskStatus = true;
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
            return taskStatus;
        }

        public bool ActiveInActive(int id, bool status)
        {
            IDbConnection? conn = null;
            IDbCommand? cmd = null;
            try
            {
                using (conn = DataFactory.CreateConnection())
                {
                    if (conn.State == ConnectionState.Closed) conn.Open();
                    using (cmd = DataFactory.CreateCommand("ActiveInActiveFoodMenuById", conn))
                    {
                        ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add(DataFactory.CreateParameter("@Id", id));
                        cmd.Parameters.Add(DataFactory.CreateParameter("@IsActive", status));
                        var r = DataFactory.ExecuteScalar(cmd);
                        return r != null && Convert.ToInt32(r) > 0;
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
        private List<FoodMenu> List(IDataReader reader)
        {
            var list = new List<FoodMenu>();
            try
            {
                while (reader.Read())
                {
                    var item = new FoodMenu();
                    if (reader["Id"] != DBNull.Value)
                        item.Id = Convert.ToString(reader["Id"])!;
                    if (reader["Code"] != DBNull.Value)
                        item.Code = Convert.ToString(reader["Code"])!;
                    if (reader["Name"] != DBNull.Value)
                        item.Name = Convert.ToString(reader["Name"])!;
                    if (reader["CategoryId"] != DBNull.Value)
                        item.CategoryId = Convert.ToString(reader["CategoryId"]);
                    if (reader["Price"] != DBNull.Value)
                        item.Price = Convert.ToString(reader["Price"]);
                    if (reader["PreparationTime"] != DBNull.Value)
                        item.PreparationTime = Convert.ToString(reader["PreparationTime"]);
                    if (reader["FoodType"] != DBNull.Value)
                        item.FoodType = Convert.ToInt32(reader["FoodType"]);
                    if (reader["Servicecharge"] != DBNull.Value)
                        item.Servicecharge = Convert.ToString(reader["Servicecharge"]);
                    if (reader["IsActive"] != DBNull.Value)
                        item.IsActive = Convert.ToBoolean(reader["IsActive"]);
                    if (reader["IsDeleted"] != DBNull.Value)
                        item.IsDeleted = Convert.ToBoolean(reader["IsDeleted"]);
                    if (reader["CreatedBy"] != DBNull.Value)
                        item.CreatedBy = Convert.ToInt32(reader["CreatedBy"]);
                    if (reader["CreatedDate"] != DBNull.Value)
                        item.CreatedDate = Convert.ToString(reader["CreatedDate"]);
                    if (reader["UpdatedBy"] != DBNull.Value)
                        item.UpdatedBy = Convert.ToInt32(reader["UpdatedBy"]);
                    if (reader["UpdatedDate"] != DBNull.Value)
                        item.UpdatedDate = Convert.ToString(reader["UpdatedDate"]);

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
    }
}

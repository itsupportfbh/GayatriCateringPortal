using GayatriCateringPortal.Data;
using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;
using Microsoft.Data.SqlClient;
using System.Data;

namespace GayatriCateringPortal.Repositories
{
    public class AddOnRepository:IAddOnRepository
    {


        public List<AddOnMaster> GetAll()
        {
            List<AddOnMaster> list = new List<AddOnMaster>();
            IDbConnection conn = null;
            IDbCommand cmd = null;
            IDataReader reader = null;

            try
            {
                using (conn = DataFactory.CreateConnection())
                {
                    conn.Open();

                    using (cmd = DataFactory.CreateCommand(
                        "[dbo].[GetAddOnMaster]", conn))
                    {
                        ((SqlCommand)cmd).CommandType =
                            CommandType.StoredProcedure;

                        reader = DataFactory.ExecuteReader(cmd);

                        list = this.List(reader);
                    }
                }

                return list ?? new List<AddOnMaster>();
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
            finally
            {
                if (conn != null &&
                    conn.State != ConnectionState.Closed)
                {
                    conn.Close();
                }
            }
        }




        // COMMON DATA READER MAPPING
        private List<AddOnMaster> List(IDataReader reader)
        {
            var list = new List<AddOnMaster>();

            try
            {
                while (reader.Read())
                {
                    var addOn = new AddOnMaster();

                    if (reader["Id"] != DBNull.Value)
                        addOn.Id =
                            Convert.ToInt32(
                                reader["Id"]);


                    if (reader["Code"] != DBNull.Value)
                        addOn.Code =
                            Convert.ToString(
                                reader["Code"]) ?? string.Empty;


                    if (reader["AddOnName"] != DBNull.Value)
                        addOn.AddOnName =
                            Convert.ToString(
                                reader["AddOnName"]) ?? string.Empty;


                    if (reader["UnitType"] != DBNull.Value)
                        addOn.UnitType =
                            Convert.ToString(
                                reader["UnitType"]) ?? string.Empty;


                    if (reader["Rate"] != DBNull.Value)
                        addOn.Rate =
                            Convert.ToDecimal(
                                reader["Rate"]);


                    if (reader["IsActive"] != DBNull.Value)
                        addOn.IsActive =
                            Convert.ToBoolean(
                                reader["IsActive"]);


                    if (reader["IsDeleted"] != DBNull.Value)
                        addOn.IsDeleted =
                            Convert.ToBoolean(
                                reader["IsDeleted"]);


                    if (reader["CreatedBy"] != DBNull.Value)
                        addOn.CreatedBy =
                            Convert.ToInt32(
                                reader["CreatedBy"]);


                    if (reader["CreatedDate"] != DBNull.Value)
                        addOn.CreatedDate =
                            Convert.ToDateTime(
                                reader["CreatedDate"]);


                    if (reader["UpdatedBy"] != DBNull.Value)
                        addOn.UpdatedBy =
                            Convert.ToInt32(
                                reader["UpdatedBy"]);


                    if (reader["UpdatedDate"] != DBNull.Value)
                        addOn.UpdatedDate =
                            Convert.ToDateTime(
                                reader["UpdatedDate"]);


                    list.Add(addOn);
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
                    "AddOn mapping error: " +
                    ex.Message);
            }

            return list;
        }
    }
}

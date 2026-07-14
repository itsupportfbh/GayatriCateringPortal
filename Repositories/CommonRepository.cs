using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using GayatriCateringPortal.Data;
using GayatriCateringPortal.Interfaces;
using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Repositories
{
    public class CommonRepository : ICommonRepository
    {
        public List<MenuGroup> GetMenuGroups()
        {
            var list = new List<MenuGroup>();
            IDbConnection conn = null;
            IDbCommand cmd = null;
            IDataReader reader = null;

            try
            {
                using (conn = DataFactory.CreateConnection())
                {
                    conn.Open();
                    using (cmd = DataFactory.CreateCommand("SP_GetMenus", conn))
                    {
                        ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
                        reader = DataFactory.ExecuteReader(cmd);

                        // single resultset with group + submenu rows
                        var map = new Dictionary<int, MenuGroup>();
                        while (reader.Read())
                        {
                            int groupId = reader["MenuGroupId"] != DBNull.Value ? Convert.ToInt32(reader["MenuGroupId"]) : 0;
                            if (!map.ContainsKey(groupId))
                            {
                                var g = new MenuGroup
                                {
                                    Id = groupId,
                                    Name = reader["MenuGroupName"] != DBNull.Value ? Convert.ToString(reader["MenuGroupName"]) : null,
                                    MenuIcon = reader["MenuGroupIcon"] != DBNull.Value ? Convert.ToString(reader["MenuGroupIcon"]) : null,
                                    DisplayOrder = reader["MenuGroupOrder"] != DBNull.Value ? Convert.ToInt32(reader["MenuGroupOrder"]) : 0
                                };
                                map[groupId] = g;
                            }

                            // submenu may be null when no children
                            if (reader["MenuId"] != DBNull.Value)
                            {
                                var sm = new SubMenu();
                                sm.Id = Convert.ToString(reader["MenuId"])!;
                                sm.MenuId = reader["ParentMenuId"] != DBNull.Value ? Convert.ToString(reader["ParentMenuId"]) : null;
                                sm.Name = reader["MenuName"] != DBNull.Value ? Convert.ToString(reader["MenuName"]) : "";
                                sm.EntityNo = reader["EntityNo"] != DBNull.Value ? Convert.ToString(reader["EntityNo"]) : null;
                                sm.Route = reader["Route"] != DBNull.Value ? Convert.ToString(reader["Route"]) : "";
                                sm.MenuIcon = reader["MenuIcon"] != DBNull.Value ? Convert.ToString(reader["MenuIcon"]) : "";
                                sm.DisplayOrder = reader["MenuOrder"] != DBNull.Value ? Convert.ToString(reader["MenuOrder"]) : "";
                                sm.Remarks = reader["Remarks"] != DBNull.Value ? Convert.ToString(reader["Remarks"]) : "";
                                map[groupId].Menus.Add(sm);
                            }
                        }

                        list.AddRange(map.Values);
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

        public List<Country> GetCountry()
        {
            var list = new List<Country>();
            IDbConnection conn = null;
            IDbCommand cmd = null;
            IDataReader reader = null;

            try
            {
                using (conn = DataFactory.CreateConnection())
                {
                    conn.Open();
                    using (cmd = DataFactory.CreateCommand("GetCountry", conn))
                    {
                        var sqlCmd = (SqlCommand)cmd;
                        sqlCmd.CommandType = CommandType.StoredProcedure;
                        sqlCmd.CommandTimeout = 60;
                        reader = DataFactory.ExecuteReader(cmd);
                        while (reader.Read())
                        {
                            list.Add(new Country
                            {
                                Id = reader["Id"] != DBNull.Value ? Convert.ToInt32(reader["Id"]) : 0,
                                Name = reader["name"] != DBNull.Value ? Convert.ToString(reader["name"]) : ""
                            });
                        }
                    }
                }

                return list;
            }
            catch (SqlException ex)
            {
                throw new Exception("Database error in GetCountry: " + ex.Message);
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

        public List<State> GetStateByCountryId(int countryId)
        {
            var list = new List<State>();
            IDbConnection conn = null;
            IDbCommand cmd = null;
            IDataReader reader = null;

            try
            {
                using (conn = DataFactory.CreateConnection())
                {
                    conn.Open();
                    using (cmd = DataFactory.CreateCommand("GetStateByCountryId", conn))
                    {
                        var sqlCmd = (SqlCommand)cmd;
                        sqlCmd.CommandType = CommandType.StoredProcedure;
                        sqlCmd.CommandTimeout = 60;
                        cmd.Parameters.Add(DataFactory.CreateParameter("@CountryId", countryId));
                        reader = DataFactory.ExecuteReader(cmd);
                        while (reader.Read())
                        {
                            list.Add(new State
                            {
                                Id = reader["Id"] != DBNull.Value ? Convert.ToInt32(reader["Id"]) : 0,
                                Name = reader["name"] != DBNull.Value ? Convert.ToString(reader["name"]) : "",
                                CountryId = reader["country_id"] != DBNull.Value ? Convert.ToInt32(reader["country_id"]) : 0
                            });
                        }
                    }
                }

                return list;
            }
            catch (SqlException ex)
            {
                throw new Exception("Database error in GetStateByCountryId: " + ex.Message);
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

        public List<City> GetCityByStateId(int stateId)
        {
            var list = new List<City>();
            IDbConnection conn = null;
            IDbCommand cmd = null;
            IDataReader reader = null;

            try
            {
                using (conn = DataFactory.CreateConnection())
                {
                    conn.Open();
                    using (cmd = DataFactory.CreateCommand("GetCityByStateId", conn))
                    {
                        var sqlCmd = (SqlCommand)cmd;
                        sqlCmd.CommandType = CommandType.StoredProcedure;
                        sqlCmd.CommandTimeout = 60;
                        cmd.Parameters.Add(DataFactory.CreateParameter("@StateId", stateId));
                        reader = DataFactory.ExecuteReader(cmd);
                        while (reader.Read())
                        {
                            list.Add(new City
                            {
                                Id = reader["Id"] != DBNull.Value ? Convert.ToInt32(reader["Id"]) : 0,
                                Name = reader["name"] != DBNull.Value ? Convert.ToString(reader["name"]) : "",
                                StateId = reader["state_id"] != DBNull.Value ? Convert.ToInt32(reader["state_id"]) : 0
                            });
                        }
                    }
                }

                return list;
            }
            catch (SqlException ex)
            {
                throw new Exception("Database error in GetCityByStateId: " + ex.Message);
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

        public List<EntityMaster> GetEntityMaster()
        {
            var list = new List<EntityMaster>();
            IDbConnection conn = null;
            IDbCommand cmd = null;
            IDataReader reader = null;

            try
            {
                using (conn = DataFactory.CreateConnection())
                {
                    conn.Open();
                    using (cmd = DataFactory.CreateCommand("GetEntityMaster", conn))
                    {
                        var sqlCmd = (SqlCommand)cmd;
                        sqlCmd.CommandType = CommandType.StoredProcedure;
                        sqlCmd.CommandTimeout = 60;
                        reader = DataFactory.ExecuteReader(cmd);

                        while (reader.Read())
                        {
                            list.Add(new EntityMaster
                            {
                                Id = reader["Id"] != DBNull.Value ? Convert.ToInt32(reader["Id"]) : 0,
                                Name = reader["Name"] != DBNull.Value ? Convert.ToString(reader["Name"]) : null,
                                EntityNo = reader["EntityNo"] != DBNull.Value ? Convert.ToInt32(reader["EntityNo"]) : null,
                                IsDeleted = reader["IsDeleted"] != DBNull.Value ? Convert.ToBoolean(reader["IsDeleted"]) : null,
                                IsActive = reader["IsActive"] != DBNull.Value ? Convert.ToBoolean(reader["IsActive"]) : null,
                                CreatedBy = reader["CreatedBy"] != DBNull.Value ? Convert.ToInt32(reader["CreatedBy"]) : 0,
                                CreatedDate = reader["CreatedDate"] != DBNull.Value ? Convert.ToDateTime(reader["CreatedDate"]) : DateTime.MinValue,
                                UpdatedBy = reader["UpdatedBy"] != DBNull.Value ? Convert.ToInt32(reader["UpdatedBy"]) : null,
                                UpdatedDate = reader["UpdatedDate"] != DBNull.Value ? Convert.ToDateTime(reader["UpdatedDate"]) : null
                            });
                        }
                    }
                }

                return list;
            }
            catch (SqlException ex)
            {
                throw new Exception("Database error in GetEntityMaster: " + ex.Message);
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

        public int CreateRolePermission(List<CreateRolePermissionRequest> requests)
        {
            IDbConnection conn = null;
            IDbCommand cmd = null;

            try
            {
                if (requests == null || requests.Count == 0) return 0;

                int savedCount = 0;
                using (conn = DataFactory.CreateConnection())
                {
                    conn.Open();
                    for (int i = 0; i < requests.Count; i++)
                    {
                        var request = requests[i];
                        using (cmd = DataFactory.CreateCommand("SP_CreateRolePermission", conn))
                        {
                            var sqlCmd = (SqlCommand)cmd;
                            sqlCmd.CommandType = CommandType.StoredProcedure;
                            sqlCmd.CommandTimeout = 60;

                            cmd.Parameters.Add(DataFactory.CreateParameter("@RoleId", request.RoleId));
                            cmd.Parameters.Add(DataFactory.CreateParameter("@EntityNo", request.EntityNo));
                            cmd.Parameters.Add(DataFactory.CreateParameter("@View", request.View));
                            cmd.Parameters.Add(DataFactory.CreateParameter("@Create", request.Create));
                            cmd.Parameters.Add(DataFactory.CreateParameter("@Edit", request.Edit));
                            cmd.Parameters.Add(DataFactory.CreateParameter("@Delete", request.Delete));
                            cmd.Parameters.Add(DataFactory.CreateParameter("@ActiveInActive", request.ActiveInActive));
                            cmd.Parameters.Add(DataFactory.CreateParameter("@Print", request.Print));
                            cmd.Parameters.Add(DataFactory.CreateParameter("@Download", request.Download));
                            cmd.Parameters.Add(DataFactory.CreateParameter("@CreatedDate", request.CreatedDate ?? DateTime.Now));
                            cmd.Parameters.Add(DataFactory.CreateParameter("@CreatedBy", request.CreatedBy));
                            cmd.Parameters.Add(DataFactory.CreateParameter("@UpdatedDate", request.UpdatedDate));
                            cmd.Parameters.Add(DataFactory.CreateParameter("@UpdatedBy", request.UpdatedBy));
                            cmd.Parameters.Add(DataFactory.CreateParameter("@IsActive", request.IsActive));
                            cmd.Parameters.Add(DataFactory.CreateParameter("@IsDeleted", request.IsDeleted));

                            var result = DataFactory.ExecuteScalar(cmd);
                            if (result != null && result != DBNull.Value)
                            {
                                savedCount++;
                            }
                        }
                    }
                }

                return savedCount;
            }
            catch (SqlException ex)
            {
                throw new Exception("Database error in CreateRolePermission: " + ex.Message);
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

        public List<RolePermissionItem> GetRolePermissionsByRoleId(int roleId)
        {
            var list = new List<RolePermissionItem>();
            IDbConnection conn = null;
            IDbCommand cmd = null;
            IDataReader reader = null;

            try
            {
                using (conn = DataFactory.CreateConnection())
                {
                    conn.Open();
                    using (cmd = DataFactory.CreateCommand("GetRolePermissionsByRoleId", conn))
                    {
                        var sqlCmd = (SqlCommand)cmd;
                        sqlCmd.CommandType = CommandType.StoredProcedure;
                        sqlCmd.CommandTimeout = 60;
                        cmd.Parameters.Add(DataFactory.CreateParameter("@RoleId", roleId));

                        reader = DataFactory.ExecuteReader(cmd);
                        while (reader.Read())
                        {
                            list.Add(new RolePermissionItem
                            {
                                RoleId = reader["RoleId"] != DBNull.Value ? Convert.ToInt32(reader["RoleId"]) : 0,
                                EntityNo = reader["EntityNo"] != DBNull.Value ? Convert.ToInt32(reader["EntityNo"]) : 0,
                                View = reader["View"] != DBNull.Value && Convert.ToBoolean(reader["View"]),
                                Create = reader["Create"] != DBNull.Value && Convert.ToBoolean(reader["Create"]),
                                Edit = reader["Edit"] != DBNull.Value && Convert.ToBoolean(reader["Edit"]),
                                Delete = reader["Delete"] != DBNull.Value && Convert.ToBoolean(reader["Delete"]),
                                ActiveInActive = reader["ActiveInActive"] != DBNull.Value && Convert.ToBoolean(reader["ActiveInActive"]),
                                Download = reader["Download"] != DBNull.Value && Convert.ToBoolean(reader["Download"]),
                                Print = reader["Print"] != DBNull.Value && Convert.ToBoolean(reader["Print"])
                            });
                        }
                    }
                }

                return list;
            }
            catch (SqlException ex)
            {
                throw new Exception("Database error in GetRolePermissionsByRoleId: " + ex.Message);
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

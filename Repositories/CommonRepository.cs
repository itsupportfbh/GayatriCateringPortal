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
                        ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
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
                        ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
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
                        ((SqlCommand)cmd).CommandType = CommandType.StoredProcedure;
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

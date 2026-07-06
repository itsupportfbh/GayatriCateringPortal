using Microsoft.Extensions.Configuration;
using System.Data;
using Microsoft.Data.SqlClient;

namespace GayatriCateringPortal.Data;

public static class DataFactory
{
    private static string? _connectionString;

    public static void Init(IConfiguration configuration)
    {
        // prefer named DefaultConnection, fallback to common patterns
        _connectionString = configuration.GetConnectionString("DefaultConnection")
                            ?? configuration["ConnectionStrings:DefaultConnection"]
                            ?? configuration["ConnectionStrings:SQLDBConnection"];
    }

    public static IDbConnection CreateConnection()
    {
        if (string.IsNullOrEmpty(_connectionString))
            throw new InvalidOperationException("DataFactory not initialized. Call DataFactory.Init(configuration) in Program.cs at startup.");

        return new SqlConnection(_connectionString);
    }

    public static IDbCommand CreateCommand(string commandText, IDbConnection connection)
    {
        var cmd = new SqlCommand(commandText, (SqlConnection)connection);
        return cmd;
    }

    public static IDbDataParameter CreateParameter(string name, object? value)
    {
        return new SqlParameter(name, value ?? DBNull.Value);
    }
}

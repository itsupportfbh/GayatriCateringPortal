var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllersWithViews();

// Initialize DataFactory (centralized ADO.NET helpers)
GayatriCateringPortal.Data.DataFactory.Init(builder.Configuration);

// Repositories
builder.Services.AddScoped<GayatriCateringPortal.Interfaces.ICustomerRepository, GayatriCateringPortal.Repositories.CustomerRepository>();
builder.Services.AddScoped<GayatriCateringPortal.Interfaces.ICommsRepository, GayatriCateringPortal.Repositories.CommsRepository>();
builder.Services.AddScoped<GayatriCateringPortal.Interfaces.IFreebiesRepository, GayatriCateringPortal.Repositories.FreebiesRepository>();
builder.Services.AddScoped<GayatriCateringPortal.Interfaces.IFinanceRepository, GayatriCateringPortal.Repositories.FinanceRepository>();
builder.Services.AddScoped<GayatriCateringPortal.Interfaces.IDashboardRepository, GayatriCateringPortal.Repositories.DashboardRepository>();
builder.Services.AddScoped<GayatriCateringPortal.Interfaces.IKitchenRepository, GayatriCateringPortal.Repositories.KitchenRepository>();
builder.Services.AddScoped<GayatriCateringPortal.Interfaces.IInvoicesRepository, GayatriCateringPortal.Repositories.InvoicesRepository>();
builder.Services.AddScoped<GayatriCateringPortal.Interfaces.ILocationsRepository, GayatriCateringPortal.Repositories.LocationRepository>();
builder.Services.AddScoped<GayatriCateringPortal.Interfaces.ILogisticsRepository, GayatriCateringPortal.Repositories.LogisticsRepository>();
builder.Services.AddScoped<GayatriCateringPortal.Interfaces.IQuotationsRepository, GayatriCateringPortal.Repositories.QuotationsRepository>();
builder.Services.AddScoped<GayatriCateringPortal.Interfaces.IPackagesRepository, GayatriCateringPortal.Repositories.PackagesRepository>();
builder.Services.AddScoped<GayatriCateringPortal.Interfaces.IPackageItemsRepository, GayatriCateringPortal.Repositories.PackageItemsRepository>();
builder.Services.AddScoped<GayatriCateringPortal.Interfaces.IMenusRepository, GayatriCateringPortal.Repositories.MenusRepository>();
builder.Services.AddScoped<GayatriCateringPortal.Interfaces.IMealPeriodsRepository, GayatriCateringPortal.Repositories.MealPeriodRepository>();
builder.Services.AddScoped<GayatriCateringPortal.Interfaces.IRolesRepository, GayatriCateringPortal.Repositories.RolesRepository>();
builder.Services.AddScoped<GayatriCateringPortal.Interfaces.IReportsRepository, GayatriCateringPortal.Repositories.ReportsRepository>();
builder.Services.AddScoped<GayatriCateringPortal.Interfaces.IUtensilsRepository, GayatriCateringPortal.Repositories.UtensilsRepository>();
builder.Services.AddScoped<GayatriCateringPortal.Interfaces.ISettingsRepository, GayatriCateringPortal.Repositories.SettingsRepository>();
builder.Services.AddScoped<GayatriCateringPortal.Interfaces.IOrdersRepository, GayatriCateringPortal.Repositories.OrdersRepository>();
builder.Services.AddScoped<GayatriCateringPortal.Interfaces.IFoodMenuRepository, GayatriCateringPortal.Repositories.FoodMenuRepository>();
builder.Services.AddScoped<GayatriCateringPortal.Interfaces.ICommonRepository, GayatriCateringPortal.Repositories.CommonRepository>();
builder.Services.AddScoped<GayatriCateringPortal.Interfaces.IFoodMenuCategoryRepository, GayatriCateringPortal.Repositories.FoodMenuCategoryRepository>();
builder.Services.AddScoped<GayatriCateringPortal.Interfaces.IUsersRepository, GayatriCateringPortal.Repositories.UsersRepository>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthorization();
app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Root}/{action=Index}/{id?}");

// Temporary test endpoint to verify menu loading and DI (remove when verified)
app.MapGet("/testmenus", (GayatriCateringPortal.Interfaces.ICommonRepository common) =>
{
    try
    {
        var items = common.GetMenuGroups();
        return Results.Ok(items);
    }
    catch (System.Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

app.Run();

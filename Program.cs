var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllersWithViews();

// Initialize DataFactory (centralized ADO.NET helpers)
GayatriCateringPortal.Data.DataFactory.Init(builder.Configuration);

// Repositories
builder.Services.AddScoped<GayatriCateringPortal.Interfaces.ICustomerRepository, GayatriCateringPortal.Repositories.CustomerRepository>();

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

app.Run();

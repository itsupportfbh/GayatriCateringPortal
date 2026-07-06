USE [GayatriCateringPortal];
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedures for AddOnMaster
IF OBJECT_ID(N'SP_CreateAddOnMaster', N'P') IS NOT NULL DROP PROCEDURE SP_CreateAddOnMaster;
GO
CREATE PROCEDURE SP_CreateAddOnMaster
(    @Code VARCHAR(20),
    @AddOnName NVARCHAR(500),
    @UnitType VARCHAR(20),
    @Rate DECIMAL(18, 2),
    @IsActive BIT,
    @IsDeleted BIT,
    @CreatedBy INT,
    @CreatedDate DATETIME,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[AddOnMaster] ([Code], [AddOnName], [UnitType], [Rate], [IsActive], [IsDeleted], [CreatedBy], [CreatedDate], [UpdatedBy], [UpdatedDate])
    VALUES (@Code, @AddOnName, @UnitType, @Rate, @IsActive, @IsDeleted, @CreatedBy, COALESCE(@CreatedDate, GETDATE()), @UpdatedBy, @UpdatedDate);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO
IF OBJECT_ID(N'SP_UpdateAddOnMaster', N'P') IS NOT NULL DROP PROCEDURE SP_UpdateAddOnMaster;
GO
CREATE PROCEDURE SP_UpdateAddOnMaster
(    @Id INT,
    @Code VARCHAR(20),
    @AddOnName NVARCHAR(500),
    @UnitType VARCHAR(20),
    @Rate DECIMAL(18, 2),
    @IsActive BIT,
    @IsDeleted BIT,
    @CreatedBy INT,
    @CreatedDate DATETIME,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[AddOnMaster]
    SET     [Code] = @Code,
    [AddOnName] = @AddOnName,
    [UnitType] = @UnitType,
    [Rate] = @Rate,
    [IsActive] = @IsActive,
    [IsDeleted] = @IsDeleted,
    [CreatedBy] = @CreatedBy,
    [CreatedDate] = @CreatedDate,
    [UpdatedBy] = @UpdatedBy,
    [UpdatedDate] = @UpdatedDate
    WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'SP_GetAddOnMasterById', N'P') IS NOT NULL DROP PROCEDURE SP_GetAddOnMasterById;
GO
CREATE PROCEDURE SP_GetAddOnMasterById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[AddOnMaster] WHERE [Id] = @Id;
END
GO
IF OBJECT_ID(N'GetAddOnMaster', N'P') IS NOT NULL DROP PROCEDURE GetAddOnMaster;
GO
CREATE PROCEDURE GetAddOnMaster
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[AddOnMaster] WHERE [IsDeleted] = 0;
END
GO
IF OBJECT_ID(N'DeleteAddOnMasterById', N'P') IS NOT NULL DROP PROCEDURE DeleteAddOnMasterById;
GO
CREATE PROCEDURE DeleteAddOnMasterById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[AddOnMaster] SET [IsDeleted] = 1 WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'ActiveInActiveAddOnMasterById', N'P') IS NOT NULL DROP PROCEDURE ActiveInActiveAddOnMasterById;
GO
CREATE PROCEDURE ActiveInActiveAddOnMasterById
(
    @Id INT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[AddOnMaster] SET [IsActive] = @IsActive WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
-- Procedures for CityMaster
IF OBJECT_ID(N'SP_CreateCityMaster', N'P') IS NOT NULL DROP PROCEDURE SP_CreateCityMaster;
GO
CREATE PROCEDURE SP_CreateCityMaster
(    @id INT,
    @name NVARCHAR(100) = NULL,
    @state_id SMALLINT,
    @country_id TINYINT,
    @latitude FLOAT,
    @longitude FLOAT,
    @timezone NVARCHAR(50) = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[CityMaster] ([id], [name], [state_id], [country_id], [latitude], [longitude], [timezone])
    VALUES (@id, @name, @state_id, @country_id, @latitude, @longitude, @timezone);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO
IF OBJECT_ID(N'SP_UpdateCityMaster', N'P') IS NOT NULL DROP PROCEDURE SP_UpdateCityMaster;
GO
CREATE PROCEDURE SP_UpdateCityMaster
(    @id INT,
    @id INT,
    @name NVARCHAR(100) = NULL,
    @state_id SMALLINT,
    @country_id TINYINT,
    @latitude FLOAT,
    @longitude FLOAT,
    @timezone NVARCHAR(50) = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[CityMaster]
    SET     [id] = @id,
    [name] = @name,
    [state_id] = @state_id,
    [country_id] = @country_id,
    [latitude] = @latitude,
    [longitude] = @longitude,
    [timezone] = @timezone
    WHERE [id] = @id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'SP_GetCityMasterById', N'P') IS NOT NULL DROP PROCEDURE SP_GetCityMasterById;
GO
CREATE PROCEDURE SP_GetCityMasterById
(
    @id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[CityMaster] WHERE [id] = @id;
END
GO
IF OBJECT_ID(N'GetCityMaster', N'P') IS NOT NULL DROP PROCEDURE GetCityMaster;
GO
CREATE PROCEDURE GetCityMaster
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[CityMaster];
END
GO
IF OBJECT_ID(N'DeleteCityMasterById', N'P') IS NOT NULL DROP PROCEDURE DeleteCityMasterById;
GO
CREATE PROCEDURE DeleteCityMasterById
(
    @id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM [dbo].[CityMaster] WHERE [id] = @id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'ActiveInActiveCityMasterById', N'P') IS NOT NULL DROP PROCEDURE ActiveInActiveCityMasterById;
GO
CREATE PROCEDURE ActiveInActiveCityMasterById
(
    @id INT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    RAISERROR('Table [CityMaster] does not contain an IsActive column.', 16, 1);
    RETURN;
END
GO
-- Procedures for CodeTemplate
IF OBJECT_ID(N'SP_CreateCodeTemplate', N'P') IS NOT NULL DROP PROCEDURE SP_CreateCodeTemplate;
GO
CREATE PROCEDURE SP_CreateCodeTemplate
(    @EntityNo INT,
    @Name VARCHAR(50) = NULL,
    @StartValue INT,
    @Prefix VARCHAR(50) = NULL,
    @CurrentValue INT,
    @Suffix VARCHAR(50) = NULL,
    @OrgId INT,
    @BranchId INT,
    @IsMaster BIT = NULL,
    @IsDeleted BIT = NULL,
    @IsActive BIT = NULL,
    @CreatedBy INT,
    @CreatedDate DATETIME,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @NoOfDigit INT,
    @IsDateMonthYearWise BIT = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[CodeTemplate] ([EntityNo], [Name], [StartValue], [Prefix], [CurrentValue], [Suffix], [OrgId], [BranchId], [IsMaster], [IsDeleted], [IsActive], [CreatedBy], [CreatedDate], [UpdatedBy], [UpdatedDate], [NoOfDigit], [IsDateMonthYearWise])
    VALUES (@EntityNo, @Name, @StartValue, @Prefix, @CurrentValue, @Suffix, @OrgId, @BranchId, @IsMaster, @IsDeleted, @IsActive, @CreatedBy, COALESCE(@CreatedDate, GETDATE()), @UpdatedBy, @UpdatedDate, @NoOfDigit, @IsDateMonthYearWise);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO
IF OBJECT_ID(N'SP_UpdateCodeTemplate', N'P') IS NOT NULL DROP PROCEDURE SP_UpdateCodeTemplate;
GO
CREATE PROCEDURE SP_UpdateCodeTemplate
(    @Id INT,
    @EntityNo INT,
    @Name VARCHAR(50) = NULL,
    @StartValue INT,
    @Prefix VARCHAR(50) = NULL,
    @CurrentValue INT,
    @Suffix VARCHAR(50) = NULL,
    @OrgId INT,
    @BranchId INT,
    @IsMaster BIT = NULL,
    @IsDeleted BIT = NULL,
    @IsActive BIT = NULL,
    @CreatedBy INT,
    @CreatedDate DATETIME,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @NoOfDigit INT,
    @IsDateMonthYearWise BIT = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[CodeTemplate]
    SET     [EntityNo] = @EntityNo,
    [Name] = @Name,
    [StartValue] = @StartValue,
    [Prefix] = @Prefix,
    [CurrentValue] = @CurrentValue,
    [Suffix] = @Suffix,
    [OrgId] = @OrgId,
    [BranchId] = @BranchId,
    [IsMaster] = @IsMaster,
    [IsDeleted] = @IsDeleted,
    [IsActive] = @IsActive,
    [CreatedBy] = @CreatedBy,
    [CreatedDate] = @CreatedDate,
    [UpdatedBy] = @UpdatedBy,
    [UpdatedDate] = @UpdatedDate,
    [NoOfDigit] = @NoOfDigit,
    [IsDateMonthYearWise] = @IsDateMonthYearWise
    WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'SP_GetCodeTemplateById', N'P') IS NOT NULL DROP PROCEDURE SP_GetCodeTemplateById;
GO
CREATE PROCEDURE SP_GetCodeTemplateById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[CodeTemplate] WHERE [Id] = @Id;
END
GO
IF OBJECT_ID(N'GetCodeTemplate', N'P') IS NOT NULL DROP PROCEDURE GetCodeTemplate;
GO
CREATE PROCEDURE GetCodeTemplate
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[CodeTemplate] WHERE [IsDeleted] = 0;
END
GO
IF OBJECT_ID(N'DeleteCodeTemplateById', N'P') IS NOT NULL DROP PROCEDURE DeleteCodeTemplateById;
GO
CREATE PROCEDURE DeleteCodeTemplateById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[CodeTemplate] SET [IsDeleted] = 1 WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'ActiveInActiveCodeTemplateById', N'P') IS NOT NULL DROP PROCEDURE ActiveInActiveCodeTemplateById;
GO
CREATE PROCEDURE ActiveInActiveCodeTemplateById
(
    @Id INT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[CodeTemplate] SET [IsActive] = @IsActive WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
-- Procedures for CommunicationLog
IF OBJECT_ID(N'SP_CreateCommunicationLog', N'P') IS NOT NULL DROP PROCEDURE SP_CreateCommunicationLog;
GO
CREATE PROCEDURE SP_CreateCommunicationLog
(    @Code NVARCHAR(50) = NULL,
    @Channel NVARCHAR(50) = NULL,
    @ToEmail NVARCHAR(50) = NULL,
    @Message NVARCHAR(50) = NULL,
    @IsActive BIT = NULL,
    @IsDeleted BIT = NULL,
    @CreatedDate DATETIME = NULL,
    @CreatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @UpdatedBy INT)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[CommunicationLog] ([Code], [Channel], [ToEmail], [Message], [IsActive], [IsDeleted], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy])
    VALUES (@Code, @Channel, @ToEmail, @Message, @IsActive, @IsDeleted, COALESCE(@CreatedDate, GETDATE()), @CreatedBy, @UpdatedDate, @UpdatedBy);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO
IF OBJECT_ID(N'SP_UpdateCommunicationLog', N'P') IS NOT NULL DROP PROCEDURE SP_UpdateCommunicationLog;
GO
CREATE PROCEDURE SP_UpdateCommunicationLog
(    @Id INT,
    @Code NVARCHAR(50) = NULL,
    @Channel NVARCHAR(50) = NULL,
    @ToEmail NVARCHAR(50) = NULL,
    @Message NVARCHAR(50) = NULL,
    @IsActive BIT = NULL,
    @IsDeleted BIT = NULL,
    @CreatedDate DATETIME = NULL,
    @CreatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @UpdatedBy INT)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[CommunicationLog]
    SET     [Code] = @Code,
    [Channel] = @Channel,
    [ToEmail] = @ToEmail,
    [Message] = @Message,
    [IsActive] = @IsActive,
    [IsDeleted] = @IsDeleted,
    [CreatedDate] = @CreatedDate,
    [CreatedBy] = @CreatedBy,
    [UpdatedDate] = @UpdatedDate,
    [UpdatedBy] = @UpdatedBy
    WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'SP_GetCommunicationLogById', N'P') IS NOT NULL DROP PROCEDURE SP_GetCommunicationLogById;
GO
CREATE PROCEDURE SP_GetCommunicationLogById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[CommunicationLog] WHERE [Id] = @Id;
END
GO
IF OBJECT_ID(N'GetCommunicationLog', N'P') IS NOT NULL DROP PROCEDURE GetCommunicationLog;
GO
CREATE PROCEDURE GetCommunicationLog
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[CommunicationLog] WHERE [IsDeleted] = 0;
END
GO
IF OBJECT_ID(N'DeleteCommunicationLogById', N'P') IS NOT NULL DROP PROCEDURE DeleteCommunicationLogById;
GO
CREATE PROCEDURE DeleteCommunicationLogById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[CommunicationLog] SET [IsDeleted] = 1 WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'ActiveInActiveCommunicationLogById', N'P') IS NOT NULL DROP PROCEDURE ActiveInActiveCommunicationLogById;
GO
CREATE PROCEDURE ActiveInActiveCommunicationLogById
(
    @Id INT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[CommunicationLog] SET [IsActive] = @IsActive WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
-- Procedures for CountryMaster
IF OBJECT_ID(N'SP_CreateCountryMaster', N'P') IS NOT NULL DROP PROCEDURE SP_CreateCountryMaster;
GO
CREATE PROCEDURE SP_CreateCountryMaster
(    @id TINYINT,
    @name NVARCHAR(50) = NULL,
    @iso3 NVARCHAR(50) = NULL,
    @iso2 NVARCHAR(50) = NULL,
    @numeric_code SMALLINT,
    @phonecode SMALLINT,
    @capital NVARCHAR(50) = NULL,
    @currency NVARCHAR(50) = NULL,
    @currency_name NVARCHAR(50) = NULL,
    @currency_symbol NVARCHAR(50) = NULL,
    @tld NVARCHAR(50) = NULL,
    @native NVARCHAR(100) = NULL,
    @population INT,
    @gdp INT,
    @region NVARCHAR(50) = NULL,
    @region_id TINYINT,
    @subregion NVARCHAR(50) = NULL,
    @subregion_id TINYINT,
    @nationality NVARCHAR(50) = NULL,
    @area_sq_km INT,
    @latitude FLOAT,
    @longitude FLOAT,
    @emoji NVARCHAR(50) = NULL,
    @wikiDataId MONEY)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[CountryMaster] ([id], [name], [iso3], [iso2], [numeric_code], [phonecode], [capital], [currency], [currency_name], [currency_symbol], [tld], [native], [population], [gdp], [region], [region_id], [subregion], [subregion_id], [nationality], [area_sq_km], [latitude], [longitude], [emoji], [wikiDataId])
    VALUES (@id, @name, @iso3, @iso2, @numeric_code, @phonecode, @capital, @currency, @currency_name, @currency_symbol, @tld, @native, @population, @gdp, @region, @region_id, @subregion, @subregion_id, @nationality, @area_sq_km, @latitude, @longitude, @emoji, @wikiDataId);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO
IF OBJECT_ID(N'SP_UpdateCountryMaster', N'P') IS NOT NULL DROP PROCEDURE SP_UpdateCountryMaster;
GO
CREATE PROCEDURE SP_UpdateCountryMaster
(    @id TINYINT,
    @id TINYINT,
    @name NVARCHAR(50) = NULL,
    @iso3 NVARCHAR(50) = NULL,
    @iso2 NVARCHAR(50) = NULL,
    @numeric_code SMALLINT,
    @phonecode SMALLINT,
    @capital NVARCHAR(50) = NULL,
    @currency NVARCHAR(50) = NULL,
    @currency_name NVARCHAR(50) = NULL,
    @currency_symbol NVARCHAR(50) = NULL,
    @tld NVARCHAR(50) = NULL,
    @native NVARCHAR(100) = NULL,
    @population INT,
    @gdp INT,
    @region NVARCHAR(50) = NULL,
    @region_id TINYINT,
    @subregion NVARCHAR(50) = NULL,
    @subregion_id TINYINT,
    @nationality NVARCHAR(50) = NULL,
    @area_sq_km INT,
    @latitude FLOAT,
    @longitude FLOAT,
    @emoji NVARCHAR(50) = NULL,
    @wikiDataId MONEY)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[CountryMaster]
    SET     [id] = @id,
    [name] = @name,
    [iso3] = @iso3,
    [iso2] = @iso2,
    [numeric_code] = @numeric_code,
    [phonecode] = @phonecode,
    [capital] = @capital,
    [currency] = @currency,
    [currency_name] = @currency_name,
    [currency_symbol] = @currency_symbol,
    [tld] = @tld,
    [native] = @native,
    [population] = @population,
    [gdp] = @gdp,
    [region] = @region,
    [region_id] = @region_id,
    [subregion] = @subregion,
    [subregion_id] = @subregion_id,
    [nationality] = @nationality,
    [area_sq_km] = @area_sq_km,
    [latitude] = @latitude,
    [longitude] = @longitude,
    [emoji] = @emoji,
    [wikiDataId] = @wikiDataId
    WHERE [id] = @id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'SP_GetCountryMasterById', N'P') IS NOT NULL DROP PROCEDURE SP_GetCountryMasterById;
GO
CREATE PROCEDURE SP_GetCountryMasterById
(
    @id TINYINT
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[CountryMaster] WHERE [id] = @id;
END
GO
IF OBJECT_ID(N'GetCountryMaster', N'P') IS NOT NULL DROP PROCEDURE GetCountryMaster;
GO
CREATE PROCEDURE GetCountryMaster
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[CountryMaster];
END
GO
IF OBJECT_ID(N'DeleteCountryMasterById', N'P') IS NOT NULL DROP PROCEDURE DeleteCountryMasterById;
GO
CREATE PROCEDURE DeleteCountryMasterById
(
    @id TINYINT
)
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM [dbo].[CountryMaster] WHERE [id] = @id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'ActiveInActiveCountryMasterById', N'P') IS NOT NULL DROP PROCEDURE ActiveInActiveCountryMasterById;
GO
CREATE PROCEDURE ActiveInActiveCountryMasterById
(
    @id TINYINT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    RAISERROR('Table [CountryMaster] does not contain an IsActive column.', 16, 1);
    RETURN;
END
GO
-- Procedures for CustomerMaster
IF OBJECT_ID(N'SP_CreateCustomerMaster', N'P') IS NOT NULL DROP PROCEDURE SP_CreateCustomerMaster;
GO
CREATE PROCEDURE SP_CreateCustomerMaster
(    @Code NVARCHAR(50),
    @Name NVARCHAR(100),
    @MobileNo NVARCHAR(20),
    @EmailId NVARCHAR(50),
    @CompanyName NVARCHAR(50),
    @AddressLine1 NVARCHAR(200),
    @AddressLine2 NVARCHAR(200),
    @CityId INT,
    @StateId INT,
    @CountryId INT,
    @Pincode NVARCHAR(50),
    @DateOfBirth DATETIME = NULL,
    @Gender INT,
    @Remarks NVARCHAR(500) = NULL,
    @IsActive BIT,
    @CreatedBy INT,
    @CreatedDate DATETIME,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @IsDeleted BIT)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[CustomerMaster] ([Code], [Name], [MobileNo], [EmailId], [CompanyName], [AddressLine1], [AddressLine2], [CityId], [StateId], [CountryId], [Pincode], [DateOfBirth], [Gender], [Remarks], [IsActive], [CreatedBy], [CreatedDate], [UpdatedBy], [UpdatedDate], [IsDeleted])
    VALUES (@Code, @Name, @MobileNo, @EmailId, @CompanyName, @AddressLine1, @AddressLine2, @CityId, @StateId, @CountryId, @Pincode, @DateOfBirth, @Gender, @Remarks, @IsActive, @CreatedBy, COALESCE(@CreatedDate, GETDATE()), @UpdatedBy, @UpdatedDate, @IsDeleted);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO
IF OBJECT_ID(N'SP_UpdateCustomerMaster', N'P') IS NOT NULL DROP PROCEDURE SP_UpdateCustomerMaster;
GO
CREATE PROCEDURE SP_UpdateCustomerMaster
(    @Id INT,
    @Code NVARCHAR(50),
    @Name NVARCHAR(100),
    @MobileNo NVARCHAR(20),
    @EmailId NVARCHAR(50),
    @CompanyName NVARCHAR(50),
    @AddressLine1 NVARCHAR(200),
    @AddressLine2 NVARCHAR(200),
    @CityId INT,
    @StateId INT,
    @CountryId INT,
    @Pincode NVARCHAR(50),
    @DateOfBirth DATETIME = NULL,
    @Gender INT,
    @Remarks NVARCHAR(500) = NULL,
    @IsActive BIT,
    @CreatedBy INT,
    @CreatedDate DATETIME,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @IsDeleted BIT)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[CustomerMaster]
    SET     [Code] = @Code,
    [Name] = @Name,
    [MobileNo] = @MobileNo,
    [EmailId] = @EmailId,
    [CompanyName] = @CompanyName,
    [AddressLine1] = @AddressLine1,
    [AddressLine2] = @AddressLine2,
    [CityId] = @CityId,
    [StateId] = @StateId,
    [CountryId] = @CountryId,
    [Pincode] = @Pincode,
    [DateOfBirth] = @DateOfBirth,
    [Gender] = @Gender,
    [Remarks] = @Remarks,
    [IsActive] = @IsActive,
    [CreatedBy] = @CreatedBy,
    [CreatedDate] = @CreatedDate,
    [UpdatedBy] = @UpdatedBy,
    [UpdatedDate] = @UpdatedDate,
    [IsDeleted] = @IsDeleted
    WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'SP_GetCustomerMasterById', N'P') IS NOT NULL DROP PROCEDURE SP_GetCustomerMasterById;
GO
CREATE PROCEDURE SP_GetCustomerMasterById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[CustomerMaster] WHERE [Id] = @Id;
END
GO
IF OBJECT_ID(N'GetCustomerMaster', N'P') IS NOT NULL DROP PROCEDURE GetCustomerMaster;
GO
CREATE PROCEDURE GetCustomerMaster
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[CustomerMaster] WHERE [IsDeleted] = 0;
END
GO
IF OBJECT_ID(N'DeleteCustomerMasterById', N'P') IS NOT NULL DROP PROCEDURE DeleteCustomerMasterById;
GO
CREATE PROCEDURE DeleteCustomerMasterById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[CustomerMaster] SET [IsDeleted] = 1 WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'ActiveInActiveCustomerMasterById', N'P') IS NOT NULL DROP PROCEDURE ActiveInActiveCustomerMasterById;
GO
CREATE PROCEDURE ActiveInActiveCustomerMasterById
(
    @Id INT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[CustomerMaster] SET [IsActive] = @IsActive WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
-- Procedures for EntityMaster
IF OBJECT_ID(N'SP_CreateEntityMaster', N'P') IS NOT NULL DROP PROCEDURE SP_CreateEntityMaster;
GO
CREATE PROCEDURE SP_CreateEntityMaster
(    @Name VARCHAR(50) = NULL,
    @EntityNo INT,
    @IsMaster BIT = NULL,
    @IsDeleted BIT = NULL,
    @IsActive BIT = NULL,
    @CreatedBy INT,
    @CreatedDate DATETIME,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[EntityMaster] ([Name], [EntityNo], [IsMaster], [IsDeleted], [IsActive], [CreatedBy], [CreatedDate], [UpdatedBy], [UpdatedDate])
    VALUES (@Name, @EntityNo, @IsMaster, @IsDeleted, @IsActive, @CreatedBy, COALESCE(@CreatedDate, GETDATE()), @UpdatedBy, @UpdatedDate);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO
IF OBJECT_ID(N'SP_UpdateEntityMaster', N'P') IS NOT NULL DROP PROCEDURE SP_UpdateEntityMaster;
GO
CREATE PROCEDURE SP_UpdateEntityMaster
(    @Id INT,
    @Name VARCHAR(50) = NULL,
    @EntityNo INT,
    @IsMaster BIT = NULL,
    @IsDeleted BIT = NULL,
    @IsActive BIT = NULL,
    @CreatedBy INT,
    @CreatedDate DATETIME,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[EntityMaster]
    SET     [Name] = @Name,
    [EntityNo] = @EntityNo,
    [IsMaster] = @IsMaster,
    [IsDeleted] = @IsDeleted,
    [IsActive] = @IsActive,
    [CreatedBy] = @CreatedBy,
    [CreatedDate] = @CreatedDate,
    [UpdatedBy] = @UpdatedBy,
    [UpdatedDate] = @UpdatedDate
    WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'SP_GetEntityMasterById', N'P') IS NOT NULL DROP PROCEDURE SP_GetEntityMasterById;
GO
CREATE PROCEDURE SP_GetEntityMasterById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[EntityMaster] WHERE [Id] = @Id;
END
GO
IF OBJECT_ID(N'GetEntityMaster', N'P') IS NOT NULL DROP PROCEDURE GetEntityMaster;
GO
CREATE PROCEDURE GetEntityMaster
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[EntityMaster] WHERE [IsDeleted] = 0;
END
GO
IF OBJECT_ID(N'DeleteEntityMasterById', N'P') IS NOT NULL DROP PROCEDURE DeleteEntityMasterById;
GO
CREATE PROCEDURE DeleteEntityMasterById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[EntityMaster] SET [IsDeleted] = 1 WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'ActiveInActiveEntityMasterById', N'P') IS NOT NULL DROP PROCEDURE ActiveInActiveEntityMasterById;
GO
CREATE PROCEDURE ActiveInActiveEntityMasterById
(
    @Id INT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[EntityMaster] SET [IsActive] = @IsActive WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
-- Procedures for FoodMenu
IF OBJECT_ID(N'SP_CreateFoodMenu', N'P') IS NOT NULL DROP PROCEDURE SP_CreateFoodMenu;
GO
CREATE PROCEDURE SP_CreateFoodMenu
(    @Code VARCHAR(50),
    @Name VARCHAR(100),
    @CategoryId INT,
    @Price DECIMAL(18, 3),
    @PreparationTime INT,
    @FoodType INT,
    @Servicecharge INT,
    @IsActive BIT,
    @IsDeleted BIT,
    @CreatedBy INT,
    @CreatedDate DATETIME,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[FoodMenu] ([Code], [Name], [CategoryId], [Price], [PreparationTime], [FoodType], [Servicecharge], [IsActive], [IsDeleted], [CreatedBy], [CreatedDate], [UpdatedBy], [UpdatedDate])
    VALUES (@Code, @Name, @CategoryId, @Price, @PreparationTime, @FoodType, @Servicecharge, @IsActive, @IsDeleted, @CreatedBy, COALESCE(@CreatedDate, GETDATE()), @UpdatedBy, @UpdatedDate);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO
IF OBJECT_ID(N'SP_UpdateFoodMenu', N'P') IS NOT NULL DROP PROCEDURE SP_UpdateFoodMenu;
GO
CREATE PROCEDURE SP_UpdateFoodMenu
(    @Id INT,
    @Code VARCHAR(50),
    @Name VARCHAR(100),
    @CategoryId INT,
    @Price DECIMAL(18, 3),
    @PreparationTime INT,
    @FoodType INT,
    @Servicecharge INT,
    @IsActive BIT,
    @IsDeleted BIT,
    @CreatedBy INT,
    @CreatedDate DATETIME,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[FoodMenu]
    SET     [Code] = @Code,
    [Name] = @Name,
    [CategoryId] = @CategoryId,
    [Price] = @Price,
    [PreparationTime] = @PreparationTime,
    [FoodType] = @FoodType,
    [Servicecharge] = @Servicecharge,
    [IsActive] = @IsActive,
    [IsDeleted] = @IsDeleted,
    [CreatedBy] = @CreatedBy,
    [CreatedDate] = @CreatedDate,
    [UpdatedBy] = @UpdatedBy,
    [UpdatedDate] = @UpdatedDate
    WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'SP_GetFoodMenuById', N'P') IS NOT NULL DROP PROCEDURE SP_GetFoodMenuById;
GO
CREATE PROCEDURE SP_GetFoodMenuById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[FoodMenu] WHERE [Id] = @Id;
END
GO
IF OBJECT_ID(N'GetFoodMenu', N'P') IS NOT NULL DROP PROCEDURE GetFoodMenu;
GO
CREATE PROCEDURE GetFoodMenu
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[FoodMenu] WHERE [IsDeleted] = 0;
END
GO
IF OBJECT_ID(N'DeleteFoodMenuById', N'P') IS NOT NULL DROP PROCEDURE DeleteFoodMenuById;
GO
CREATE PROCEDURE DeleteFoodMenuById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[FoodMenu] SET [IsDeleted] = 1 WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'ActiveInActiveFoodMenuById', N'P') IS NOT NULL DROP PROCEDURE ActiveInActiveFoodMenuById;
GO
CREATE PROCEDURE ActiveInActiveFoodMenuById
(
    @Id INT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[FoodMenu] SET [IsActive] = @IsActive WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
-- Procedures for FoodMenuCategory
IF OBJECT_ID(N'SP_CreateFoodMenuCategory', N'P') IS NOT NULL DROP PROCEDURE SP_CreateFoodMenuCategory;
GO
CREATE PROCEDURE SP_CreateFoodMenuCategory
(    @Code VARCHAR(50),
    @Name VARCHAR(100),
    @IsActive BIT,
    @IsDeleted BIT,
    @CreatedBy INT,
    @CreatedDate DATETIME,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[FoodMenuCategory] ([Code], [Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedDate], [UpdatedBy], [UpdatedDate])
    VALUES (@Code, @Name, @IsActive, @IsDeleted, @CreatedBy, COALESCE(@CreatedDate, GETDATE()), @UpdatedBy, @UpdatedDate);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO
IF OBJECT_ID(N'SP_UpdateFoodMenuCategory', N'P') IS NOT NULL DROP PROCEDURE SP_UpdateFoodMenuCategory;
GO
CREATE PROCEDURE SP_UpdateFoodMenuCategory
(    @Id INT,
    @Code VARCHAR(50),
    @Name VARCHAR(100),
    @IsActive BIT,
    @IsDeleted BIT,
    @CreatedBy INT,
    @CreatedDate DATETIME,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[FoodMenuCategory]
    SET     [Code] = @Code,
    [Name] = @Name,
    [IsActive] = @IsActive,
    [IsDeleted] = @IsDeleted,
    [CreatedBy] = @CreatedBy,
    [CreatedDate] = @CreatedDate,
    [UpdatedBy] = @UpdatedBy,
    [UpdatedDate] = @UpdatedDate
    WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'SP_GetFoodMenuCategoryById', N'P') IS NOT NULL DROP PROCEDURE SP_GetFoodMenuCategoryById;
GO
CREATE PROCEDURE SP_GetFoodMenuCategoryById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[FoodMenuCategory] WHERE [Id] = @Id;
END
GO
IF OBJECT_ID(N'GetFoodMenuCategory', N'P') IS NOT NULL DROP PROCEDURE GetFoodMenuCategory;
GO
CREATE PROCEDURE GetFoodMenuCategory
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[FoodMenuCategory] WHERE [IsDeleted] = 0;
END
GO
IF OBJECT_ID(N'DeleteFoodMenuCategoryById', N'P') IS NOT NULL DROP PROCEDURE DeleteFoodMenuCategoryById;
GO
CREATE PROCEDURE DeleteFoodMenuCategoryById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[FoodMenuCategory] SET [IsDeleted] = 1 WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'ActiveInActiveFoodMenuCategoryById', N'P') IS NOT NULL DROP PROCEDURE ActiveInActiveFoodMenuCategoryById;
GO
CREATE PROCEDURE ActiveInActiveFoodMenuCategoryById
(
    @Id INT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[FoodMenuCategory] SET [IsActive] = @IsActive WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
-- Procedures for LanguageMaster
IF OBJECT_ID(N'SP_CreateLanguageMaster', N'P') IS NOT NULL DROP PROCEDURE SP_CreateLanguageMaster;
GO
CREATE PROCEDURE SP_CreateLanguageMaster
(    @Code NVARCHAR(20),
    @Name NVARCHAR(100),
    @NativeName NVARCHAR(100) = NULL,
    @IsDefault BIT,
    @IsActive BIT,
    @IsDeleted BIT,
    @CreatedBy INT,
    @CreatedDate DATETIME,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[LanguageMaster] ([Code], [Name], [NativeName], [IsDefault], [IsActive], [IsDeleted], [CreatedBy], [CreatedDate], [UpdatedBy], [UpdatedDate])
    VALUES (@Code, @Name, @NativeName, @IsDefault, @IsActive, @IsDeleted, @CreatedBy, COALESCE(@CreatedDate, GETDATE()), @UpdatedBy, @UpdatedDate);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO
IF OBJECT_ID(N'SP_UpdateLanguageMaster', N'P') IS NOT NULL DROP PROCEDURE SP_UpdateLanguageMaster;
GO
CREATE PROCEDURE SP_UpdateLanguageMaster
(    @Id INT,
    @Code NVARCHAR(20),
    @Name NVARCHAR(100),
    @NativeName NVARCHAR(100) = NULL,
    @IsDefault BIT,
    @IsActive BIT,
    @IsDeleted BIT,
    @CreatedBy INT,
    @CreatedDate DATETIME,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[LanguageMaster]
    SET     [Code] = @Code,
    [Name] = @Name,
    [NativeName] = @NativeName,
    [IsDefault] = @IsDefault,
    [IsActive] = @IsActive,
    [IsDeleted] = @IsDeleted,
    [CreatedBy] = @CreatedBy,
    [CreatedDate] = @CreatedDate,
    [UpdatedBy] = @UpdatedBy,
    [UpdatedDate] = @UpdatedDate
    WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'SP_GetLanguageMasterById', N'P') IS NOT NULL DROP PROCEDURE SP_GetLanguageMasterById;
GO
CREATE PROCEDURE SP_GetLanguageMasterById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[LanguageMaster] WHERE [Id] = @Id;
END
GO
IF OBJECT_ID(N'GetLanguageMaster', N'P') IS NOT NULL DROP PROCEDURE GetLanguageMaster;
GO
CREATE PROCEDURE GetLanguageMaster
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[LanguageMaster] WHERE [IsDeleted] = 0;
END
GO
IF OBJECT_ID(N'DeleteLanguageMasterById', N'P') IS NOT NULL DROP PROCEDURE DeleteLanguageMasterById;
GO
CREATE PROCEDURE DeleteLanguageMasterById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[LanguageMaster] SET [IsDeleted] = 1 WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'ActiveInActiveLanguageMasterById', N'P') IS NOT NULL DROP PROCEDURE ActiveInActiveLanguageMasterById;
GO
CREATE PROCEDURE ActiveInActiveLanguageMasterById
(
    @Id INT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[LanguageMaster] SET [IsActive] = @IsActive WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
-- Procedures for LocationMaster
IF OBJECT_ID(N'SP_CreateLocationMaster', N'P') IS NOT NULL DROP PROCEDURE SP_CreateLocationMaster;
GO
CREATE PROCEDURE SP_CreateLocationMaster
(    @Code VARCHAR(20),
    @LocationName NVARCHAR(100),
    @DeliveryFee DECIMAL(18, 2),
    @MinimumPax INT,
    @LeadTimeDays INT,
    @IsActive BIT,
    @Remarks NVARCHAR(500) = NULL,
    @IsDeleted BIT,
    @CreatedBy INT,
    @CreatedDate DATETIME,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[LocationMaster] ([Code], [LocationName], [DeliveryFee], [MinimumPax], [LeadTimeDays], [IsActive], [Remarks], [IsDeleted], [CreatedBy], [CreatedDate], [UpdatedBy], [UpdatedDate])
    VALUES (@Code, @LocationName, @DeliveryFee, @MinimumPax, @LeadTimeDays, @IsActive, @Remarks, @IsDeleted, @CreatedBy, COALESCE(@CreatedDate, GETDATE()), @UpdatedBy, @UpdatedDate);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO
IF OBJECT_ID(N'SP_UpdateLocationMaster', N'P') IS NOT NULL DROP PROCEDURE SP_UpdateLocationMaster;
GO
CREATE PROCEDURE SP_UpdateLocationMaster
(    @ID INT,
    @Code VARCHAR(20),
    @LocationName NVARCHAR(100),
    @DeliveryFee DECIMAL(18, 2),
    @MinimumPax INT,
    @LeadTimeDays INT,
    @IsActive BIT,
    @Remarks NVARCHAR(500) = NULL,
    @IsDeleted BIT,
    @CreatedBy INT,
    @CreatedDate DATETIME,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[LocationMaster]
    SET     [Code] = @Code,
    [LocationName] = @LocationName,
    [DeliveryFee] = @DeliveryFee,
    [MinimumPax] = @MinimumPax,
    [LeadTimeDays] = @LeadTimeDays,
    [IsActive] = @IsActive,
    [Remarks] = @Remarks,
    [IsDeleted] = @IsDeleted,
    [CreatedBy] = @CreatedBy,
    [CreatedDate] = @CreatedDate,
    [UpdatedBy] = @UpdatedBy,
    [UpdatedDate] = @UpdatedDate
    WHERE [ID] = @ID;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'SP_GetLocationMasterById', N'P') IS NOT NULL DROP PROCEDURE SP_GetLocationMasterById;
GO
CREATE PROCEDURE SP_GetLocationMasterById
(
    @ID INT
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[LocationMaster] WHERE [ID] = @ID;
END
GO
IF OBJECT_ID(N'GetLocationMaster', N'P') IS NOT NULL DROP PROCEDURE GetLocationMaster;
GO
CREATE PROCEDURE GetLocationMaster
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[LocationMaster] WHERE [IsDeleted] = 0;
END
GO
IF OBJECT_ID(N'DeleteLocationMasterById', N'P') IS NOT NULL DROP PROCEDURE DeleteLocationMasterById;
GO
CREATE PROCEDURE DeleteLocationMasterById
(
    @ID INT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[LocationMaster] SET [IsDeleted] = 1 WHERE [ID] = @ID;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'ActiveInActiveLocationMasterById', N'P') IS NOT NULL DROP PROCEDURE ActiveInActiveLocationMasterById;
GO
CREATE PROCEDURE ActiveInActiveLocationMasterById
(
    @ID INT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[LocationMaster] SET [IsActive] = @IsActive WHERE [ID] = @ID;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
-- Procedures for LogisticsDetails
IF OBJECT_ID(N'SP_CreateLogisticsDetails', N'P') IS NOT NULL DROP PROCEDURE SP_CreateLogisticsDetails;
GO
CREATE PROCEDURE SP_CreateLogisticsDetails
(    @OrderDate DATETIME = NULL,
    @OrderNumber NVARCHAR(50) = NULL,
    @Location NVARCHAR(50) = NULL,
    @DriverName NVARCHAR(50) = NULL,
    @Status INT,
    @IsActive BIT = NULL,
    @IsDeleted BIT = NULL,
    @CreatedDate DATETIME = NULL,
    @CreatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @UpdatedBy INT)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[LogisticsDetails] ([OrderDate], [OrderNumber], [Location], [DriverName], [Status], [IsActive], [IsDeleted], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy])
    VALUES (@OrderDate, @OrderNumber, @Location, @DriverName, @Status, @IsActive, @IsDeleted, COALESCE(@CreatedDate, GETDATE()), @CreatedBy, @UpdatedDate, @UpdatedBy);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO
IF OBJECT_ID(N'SP_UpdateLogisticsDetails', N'P') IS NOT NULL DROP PROCEDURE SP_UpdateLogisticsDetails;
GO
CREATE PROCEDURE SP_UpdateLogisticsDetails
(    @Id INT,
    @OrderDate DATETIME = NULL,
    @OrderNumber NVARCHAR(50) = NULL,
    @Location NVARCHAR(50) = NULL,
    @DriverName NVARCHAR(50) = NULL,
    @Status INT,
    @IsActive BIT = NULL,
    @IsDeleted BIT = NULL,
    @CreatedDate DATETIME = NULL,
    @CreatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @UpdatedBy INT)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[LogisticsDetails]
    SET     [OrderDate] = @OrderDate,
    [OrderNumber] = @OrderNumber,
    [Location] = @Location,
    [DriverName] = @DriverName,
    [Status] = @Status,
    [IsActive] = @IsActive,
    [IsDeleted] = @IsDeleted,
    [CreatedDate] = @CreatedDate,
    [CreatedBy] = @CreatedBy,
    [UpdatedDate] = @UpdatedDate,
    [UpdatedBy] = @UpdatedBy
    WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'SP_GetLogisticsDetailsById', N'P') IS NOT NULL DROP PROCEDURE SP_GetLogisticsDetailsById;
GO
CREATE PROCEDURE SP_GetLogisticsDetailsById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[LogisticsDetails] WHERE [Id] = @Id;
END
GO
IF OBJECT_ID(N'GetLogisticsDetails', N'P') IS NOT NULL DROP PROCEDURE GetLogisticsDetails;
GO
CREATE PROCEDURE GetLogisticsDetails
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[LogisticsDetails] WHERE [IsDeleted] = 0;
END
GO
IF OBJECT_ID(N'DeleteLogisticsDetailsById', N'P') IS NOT NULL DROP PROCEDURE DeleteLogisticsDetailsById;
GO
CREATE PROCEDURE DeleteLogisticsDetailsById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[LogisticsDetails] SET [IsDeleted] = 1 WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'ActiveInActiveLogisticsDetailsById', N'P') IS NOT NULL DROP PROCEDURE ActiveInActiveLogisticsDetailsById;
GO
CREATE PROCEDURE ActiveInActiveLogisticsDetailsById
(
    @Id INT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[LogisticsDetails] SET [IsActive] = @IsActive WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
-- Procedures for MealPeriodMaster
IF OBJECT_ID(N'SP_CreateMealPeriodMaster', N'P') IS NOT NULL DROP PROCEDURE SP_CreateMealPeriodMaster;
GO
CREATE PROCEDURE SP_CreateMealPeriodMaster
(    @Code VARCHAR(20),
    @MealPeriodName NVARCHAR(100),
    @StartTime TIME(7),
    @EndTime TIME(7),
    @DisplayOrder INT,
    @IsActive BIT,
    @CreatedBy INT,
    @CreatedDate DATETIME,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @IsDeleted BIT = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[MealPeriodMaster] ([Code], [MealPeriodName], [StartTime], [EndTime], [DisplayOrder], [IsActive], [CreatedBy], [CreatedDate], [UpdatedBy], [UpdatedDate], [IsDeleted])
    VALUES (@Code, @MealPeriodName, @StartTime, @EndTime, @DisplayOrder, @IsActive, @CreatedBy, COALESCE(@CreatedDate, GETDATE()), @UpdatedBy, @UpdatedDate, @IsDeleted);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO
IF OBJECT_ID(N'SP_UpdateMealPeriodMaster', N'P') IS NOT NULL DROP PROCEDURE SP_UpdateMealPeriodMaster;
GO
CREATE PROCEDURE SP_UpdateMealPeriodMaster
(    @Id INT,
    @Code VARCHAR(20),
    @MealPeriodName NVARCHAR(100),
    @StartTime TIME(7),
    @EndTime TIME(7),
    @DisplayOrder INT,
    @IsActive BIT,
    @CreatedBy INT,
    @CreatedDate DATETIME,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @IsDeleted BIT = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[MealPeriodMaster]
    SET     [Code] = @Code,
    [MealPeriodName] = @MealPeriodName,
    [StartTime] = @StartTime,
    [EndTime] = @EndTime,
    [DisplayOrder] = @DisplayOrder,
    [IsActive] = @IsActive,
    [CreatedBy] = @CreatedBy,
    [CreatedDate] = @CreatedDate,
    [UpdatedBy] = @UpdatedBy,
    [UpdatedDate] = @UpdatedDate,
    [IsDeleted] = @IsDeleted
    WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'SP_GetMealPeriodMasterById', N'P') IS NOT NULL DROP PROCEDURE SP_GetMealPeriodMasterById;
GO
CREATE PROCEDURE SP_GetMealPeriodMasterById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[MealPeriodMaster] WHERE [Id] = @Id;
END
GO
IF OBJECT_ID(N'GetMealPeriodMaster', N'P') IS NOT NULL DROP PROCEDURE GetMealPeriodMaster;
GO
CREATE PROCEDURE GetMealPeriodMaster
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[MealPeriodMaster] WHERE [IsDeleted] = 0;
END
GO
IF OBJECT_ID(N'DeleteMealPeriodMasterById', N'P') IS NOT NULL DROP PROCEDURE DeleteMealPeriodMasterById;
GO
CREATE PROCEDURE DeleteMealPeriodMasterById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[MealPeriodMaster] SET [IsDeleted] = 1 WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'ActiveInActiveMealPeriodMasterById', N'P') IS NOT NULL DROP PROCEDURE ActiveInActiveMealPeriodMasterById;
GO
CREATE PROCEDURE ActiveInActiveMealPeriodMasterById
(
    @Id INT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[MealPeriodMaster] SET [IsActive] = @IsActive WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
-- Procedures for Menu
IF OBJECT_ID(N'SP_CreateMenu', N'P') IS NOT NULL DROP PROCEDURE SP_CreateMenu;
GO
CREATE PROCEDURE SP_CreateMenu
(    @Name VARCHAR(50) = NULL,
    @IsActive BIT = NULL,
    @IsDeleted BIT = NULL,
    @CreatedBy INT,
    @CreatedDate DATETIME = NULL,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @DisplayOrder INT,
    @MenuIcon NVARCHAR(50) = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[Menu] ([Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedDate], [UpdatedBy], [UpdatedDate], [DisplayOrder], [MenuIcon])
    VALUES (@Name, @IsActive, @IsDeleted, @CreatedBy, COALESCE(@CreatedDate, GETDATE()), @UpdatedBy, @UpdatedDate, @DisplayOrder, @MenuIcon);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO
IF OBJECT_ID(N'SP_UpdateMenu', N'P') IS NOT NULL DROP PROCEDURE SP_UpdateMenu;
GO
CREATE PROCEDURE SP_UpdateMenu
(    @Id INT,
    @Name VARCHAR(50) = NULL,
    @IsActive BIT = NULL,
    @IsDeleted BIT = NULL,
    @CreatedBy INT,
    @CreatedDate DATETIME = NULL,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @DisplayOrder INT,
    @MenuIcon NVARCHAR(50) = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[Menu]
    SET     [Name] = @Name,
    [IsActive] = @IsActive,
    [IsDeleted] = @IsDeleted,
    [CreatedBy] = @CreatedBy,
    [CreatedDate] = @CreatedDate,
    [UpdatedBy] = @UpdatedBy,
    [UpdatedDate] = @UpdatedDate,
    [DisplayOrder] = @DisplayOrder,
    [MenuIcon] = @MenuIcon
    WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'SP_GetMenuById', N'P') IS NOT NULL DROP PROCEDURE SP_GetMenuById;
GO
CREATE PROCEDURE SP_GetMenuById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[Menu] WHERE [Id] = @Id;
END
GO
IF OBJECT_ID(N'GetMenu', N'P') IS NOT NULL DROP PROCEDURE GetMenu;
GO
CREATE PROCEDURE GetMenu
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[Menu] WHERE [IsDeleted] = 0;
END
GO
IF OBJECT_ID(N'DeleteMenuById', N'P') IS NOT NULL DROP PROCEDURE DeleteMenuById;
GO
CREATE PROCEDURE DeleteMenuById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[Menu] SET [IsDeleted] = 1 WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'ActiveInActiveMenuById', N'P') IS NOT NULL DROP PROCEDURE ActiveInActiveMenuById;
GO
CREATE PROCEDURE ActiveInActiveMenuById
(
    @Id INT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[Menu] SET [IsActive] = @IsActive WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
-- Procedures for OrderAddOnsDetails
IF OBJECT_ID(N'SP_CreateOrderAddOnsDetails', N'P') IS NOT NULL DROP PROCEDURE SP_CreateOrderAddOnsDetails;
GO
CREATE PROCEDURE SP_CreateOrderAddOnsDetails
(    @OrderId INT,
    @AddOnsId INT,
    @Qty INT,
    @UnitPrice DECIMAL(18, 2),
    @TotalAmount DECIMAL(18, 2),
    @IsActive BIT,
    @IsDeleted BIT,
    @CreatedDate DATETIME,
    @CreatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @UpdatedBy INT)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[OrderAddOnsDetails] ([OrderId], [AddOnsId], [Qty], [UnitPrice], [TotalAmount], [IsActive], [IsDeleted], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy])
    VALUES (@OrderId, @AddOnsId, @Qty, @UnitPrice, @TotalAmount, @IsActive, @IsDeleted, COALESCE(@CreatedDate, GETDATE()), @CreatedBy, @UpdatedDate, @UpdatedBy);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO
IF OBJECT_ID(N'SP_UpdateOrderAddOnsDetails', N'P') IS NOT NULL DROP PROCEDURE SP_UpdateOrderAddOnsDetails;
GO
CREATE PROCEDURE SP_UpdateOrderAddOnsDetails
(    @Id INT,
    @OrderId INT,
    @AddOnsId INT,
    @Qty INT,
    @UnitPrice DECIMAL(18, 2),
    @TotalAmount DECIMAL(18, 2),
    @IsActive BIT,
    @IsDeleted BIT,
    @CreatedDate DATETIME,
    @CreatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @UpdatedBy INT)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[OrderAddOnsDetails]
    SET     [OrderId] = @OrderId,
    [AddOnsId] = @AddOnsId,
    [Qty] = @Qty,
    [UnitPrice] = @UnitPrice,
    [TotalAmount] = @TotalAmount,
    [IsActive] = @IsActive,
    [IsDeleted] = @IsDeleted,
    [CreatedDate] = @CreatedDate,
    [CreatedBy] = @CreatedBy,
    [UpdatedDate] = @UpdatedDate,
    [UpdatedBy] = @UpdatedBy
    WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'SP_GetOrderAddOnsDetailsById', N'P') IS NOT NULL DROP PROCEDURE SP_GetOrderAddOnsDetailsById;
GO
CREATE PROCEDURE SP_GetOrderAddOnsDetailsById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[OrderAddOnsDetails] WHERE [Id] = @Id;
END
GO
IF OBJECT_ID(N'GetOrderAddOnsDetails', N'P') IS NOT NULL DROP PROCEDURE GetOrderAddOnsDetails;
GO
CREATE PROCEDURE GetOrderAddOnsDetails
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[OrderAddOnsDetails] WHERE [IsDeleted] = 0;
END
GO
IF OBJECT_ID(N'DeleteOrderAddOnsDetailsById', N'P') IS NOT NULL DROP PROCEDURE DeleteOrderAddOnsDetailsById;
GO
CREATE PROCEDURE DeleteOrderAddOnsDetailsById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[OrderAddOnsDetails] SET [IsDeleted] = 1 WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'ActiveInActiveOrderAddOnsDetailsById', N'P') IS NOT NULL DROP PROCEDURE ActiveInActiveOrderAddOnsDetailsById;
GO
CREATE PROCEDURE ActiveInActiveOrderAddOnsDetailsById
(
    @Id INT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[OrderAddOnsDetails] SET [IsActive] = @IsActive WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
-- Procedures for OrderEventDetails
IF OBJECT_ID(N'SP_CreateOrderEventDetails', N'P') IS NOT NULL DROP PROCEDURE SP_CreateOrderEventDetails;
GO
CREATE PROCEDURE SP_CreateOrderEventDetails
(    @CustomerId INT,
    @OrderId INT,
    @EventStartDate DATETIME = NULL,
    @EventEndDate DATETIME = NULL,
    @AddressLine1 NVARCHAR(100) = NULL,
    @AddressLine2 NVARCHAR(100) = NULL,
    @City INT,
    @State INT,
    @Country INT,
    @Notes NCHAR(500) = NULL,
    @MealPeriodId INT,
    @IsActive BIT,
    @IsDeleted BIT,
    @CreatedBy INT,
    @CreatedDate DATETIME,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[OrderEventDetails] ([CustomerId], [OrderId], [EventStartDate], [EventEndDate], [AddressLine1], [AddressLine2], [City], [State], [Country], [Notes], [MealPeriodId], [IsActive], [IsDeleted], [CreatedBy], [CreatedDate], [UpdatedBy], [UpdatedDate])
    VALUES (@CustomerId, @OrderId, @EventStartDate, @EventEndDate, @AddressLine1, @AddressLine2, @City, @State, @Country, @Notes, @MealPeriodId, @IsActive, @IsDeleted, @CreatedBy, COALESCE(@CreatedDate, GETDATE()), @UpdatedBy, @UpdatedDate);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO
IF OBJECT_ID(N'SP_UpdateOrderEventDetails', N'P') IS NOT NULL DROP PROCEDURE SP_UpdateOrderEventDetails;
GO
CREATE PROCEDURE SP_UpdateOrderEventDetails
(    @Id INT,
    @CustomerId INT,
    @OrderId INT,
    @EventStartDate DATETIME = NULL,
    @EventEndDate DATETIME = NULL,
    @AddressLine1 NVARCHAR(100) = NULL,
    @AddressLine2 NVARCHAR(100) = NULL,
    @City INT,
    @State INT,
    @Country INT,
    @Notes NCHAR(500) = NULL,
    @MealPeriodId INT,
    @IsActive BIT,
    @IsDeleted BIT,
    @CreatedBy INT,
    @CreatedDate DATETIME,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[OrderEventDetails]
    SET     [CustomerId] = @CustomerId,
    [OrderId] = @OrderId,
    [EventStartDate] = @EventStartDate,
    [EventEndDate] = @EventEndDate,
    [AddressLine1] = @AddressLine1,
    [AddressLine2] = @AddressLine2,
    [City] = @City,
    [State] = @State,
    [Country] = @Country,
    [Notes] = @Notes,
    [MealPeriodId] = @MealPeriodId,
    [IsActive] = @IsActive,
    [IsDeleted] = @IsDeleted,
    [CreatedBy] = @CreatedBy,
    [CreatedDate] = @CreatedDate,
    [UpdatedBy] = @UpdatedBy,
    [UpdatedDate] = @UpdatedDate
    WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'SP_GetOrderEventDetailsById', N'P') IS NOT NULL DROP PROCEDURE SP_GetOrderEventDetailsById;
GO
CREATE PROCEDURE SP_GetOrderEventDetailsById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[OrderEventDetails] WHERE [Id] = @Id;
END
GO
IF OBJECT_ID(N'GetOrderEventDetails', N'P') IS NOT NULL DROP PROCEDURE GetOrderEventDetails;
GO
CREATE PROCEDURE GetOrderEventDetails
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[OrderEventDetails] WHERE [IsDeleted] = 0;
END
GO
IF OBJECT_ID(N'DeleteOrderEventDetailsById', N'P') IS NOT NULL DROP PROCEDURE DeleteOrderEventDetailsById;
GO
CREATE PROCEDURE DeleteOrderEventDetailsById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[OrderEventDetails] SET [IsDeleted] = 1 WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'ActiveInActiveOrderEventDetailsById', N'P') IS NOT NULL DROP PROCEDURE ActiveInActiveOrderEventDetailsById;
GO
CREATE PROCEDURE ActiveInActiveOrderEventDetailsById
(
    @Id INT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[OrderEventDetails] SET [IsActive] = @IsActive WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
-- Procedures for OrderExtraItems
IF OBJECT_ID(N'SP_CreateOrderExtraItems', N'P') IS NOT NULL DROP PROCEDURE SP_CreateOrderExtraItems;
GO
CREATE PROCEDURE SP_CreateOrderExtraItems
(    @OrderId INT,
    @CategoryId INT,
    @MenuId INT,
    @Qty INT,
    @UnitPrice DECIMAL(18, 2),
    @TotalAmount DECIMAL(18, 2),
    @IsActive BIT,
    @IsDeleted BIT,
    @CreatedDate DATETIME,
    @CreatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @UpdatedBy INT)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[OrderExtraItems] ([OrderId], [CategoryId], [MenuId], [Qty], [UnitPrice], [TotalAmount], [IsActive], [IsDeleted], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy])
    VALUES (@OrderId, @CategoryId, @MenuId, @Qty, @UnitPrice, @TotalAmount, @IsActive, @IsDeleted, COALESCE(@CreatedDate, GETDATE()), @CreatedBy, @UpdatedDate, @UpdatedBy);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO
IF OBJECT_ID(N'SP_UpdateOrderExtraItems', N'P') IS NOT NULL DROP PROCEDURE SP_UpdateOrderExtraItems;
GO
CREATE PROCEDURE SP_UpdateOrderExtraItems
(    @Id INT,
    @OrderId INT,
    @CategoryId INT,
    @MenuId INT,
    @Qty INT,
    @UnitPrice DECIMAL(18, 2),
    @TotalAmount DECIMAL(18, 2),
    @IsActive BIT,
    @IsDeleted BIT,
    @CreatedDate DATETIME,
    @CreatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @UpdatedBy INT)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[OrderExtraItems]
    SET     [OrderId] = @OrderId,
    [CategoryId] = @CategoryId,
    [MenuId] = @MenuId,
    [Qty] = @Qty,
    [UnitPrice] = @UnitPrice,
    [TotalAmount] = @TotalAmount,
    [IsActive] = @IsActive,
    [IsDeleted] = @IsDeleted,
    [CreatedDate] = @CreatedDate,
    [CreatedBy] = @CreatedBy,
    [UpdatedDate] = @UpdatedDate,
    [UpdatedBy] = @UpdatedBy
    WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'SP_GetOrderExtraItemsById', N'P') IS NOT NULL DROP PROCEDURE SP_GetOrderExtraItemsById;
GO
CREATE PROCEDURE SP_GetOrderExtraItemsById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[OrderExtraItems] WHERE [Id] = @Id;
END
GO
IF OBJECT_ID(N'GetOrderExtraItems', N'P') IS NOT NULL DROP PROCEDURE GetOrderExtraItems;
GO
CREATE PROCEDURE GetOrderExtraItems
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[OrderExtraItems] WHERE [IsDeleted] = 0;
END
GO
IF OBJECT_ID(N'DeleteOrderExtraItemsById', N'P') IS NOT NULL DROP PROCEDURE DeleteOrderExtraItemsById;
GO
CREATE PROCEDURE DeleteOrderExtraItemsById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[OrderExtraItems] SET [IsDeleted] = 1 WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'ActiveInActiveOrderExtraItemsById', N'P') IS NOT NULL DROP PROCEDURE ActiveInActiveOrderExtraItemsById;
GO
CREATE PROCEDURE ActiveInActiveOrderExtraItemsById
(
    @Id INT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[OrderExtraItems] SET [IsActive] = @IsActive WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
-- Procedures for OrderPackageDetails
IF OBJECT_ID(N'SP_CreateOrderPackageDetails', N'P') IS NOT NULL DROP PROCEDURE SP_CreateOrderPackageDetails;
GO
CREATE PROCEDURE SP_CreateOrderPackageDetails
(    @OrderId INT,
    @CategoryId INT,
    @MenuId INT,
    @IsActive BIT,
    @IsDeleted BIT,
    @CreatedDate DATETIME,
    @CreatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @UpdatedBy INT)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[OrderPackageDetails] ([OrderId], [CategoryId], [MenuId], [IsActive], [IsDeleted], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy])
    VALUES (@OrderId, @CategoryId, @MenuId, @IsActive, @IsDeleted, COALESCE(@CreatedDate, GETDATE()), @CreatedBy, @UpdatedDate, @UpdatedBy);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO
IF OBJECT_ID(N'SP_UpdateOrderPackageDetails', N'P') IS NOT NULL DROP PROCEDURE SP_UpdateOrderPackageDetails;
GO
CREATE PROCEDURE SP_UpdateOrderPackageDetails
(    @Id INT,
    @OrderId INT,
    @CategoryId INT,
    @MenuId INT,
    @IsActive BIT,
    @IsDeleted BIT,
    @CreatedDate DATETIME,
    @CreatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @UpdatedBy INT)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[OrderPackageDetails]
    SET     [OrderId] = @OrderId,
    [CategoryId] = @CategoryId,
    [MenuId] = @MenuId,
    [IsActive] = @IsActive,
    [IsDeleted] = @IsDeleted,
    [CreatedDate] = @CreatedDate,
    [CreatedBy] = @CreatedBy,
    [UpdatedDate] = @UpdatedDate,
    [UpdatedBy] = @UpdatedBy
    WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'SP_GetOrderPackageDetailsById', N'P') IS NOT NULL DROP PROCEDURE SP_GetOrderPackageDetailsById;
GO
CREATE PROCEDURE SP_GetOrderPackageDetailsById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[OrderPackageDetails] WHERE [Id] = @Id;
END
GO
IF OBJECT_ID(N'GetOrderPackageDetails', N'P') IS NOT NULL DROP PROCEDURE GetOrderPackageDetails;
GO
CREATE PROCEDURE GetOrderPackageDetails
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[OrderPackageDetails] WHERE [IsDeleted] = 0;
END
GO
IF OBJECT_ID(N'DeleteOrderPackageDetailsById', N'P') IS NOT NULL DROP PROCEDURE DeleteOrderPackageDetailsById;
GO
CREATE PROCEDURE DeleteOrderPackageDetailsById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[OrderPackageDetails] SET [IsDeleted] = 1 WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'ActiveInActiveOrderPackageDetailsById', N'P') IS NOT NULL DROP PROCEDURE ActiveInActiveOrderPackageDetailsById;
GO
CREATE PROCEDURE ActiveInActiveOrderPackageDetailsById
(
    @Id INT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[OrderPackageDetails] SET [IsActive] = @IsActive WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
-- Procedures for Orders
IF OBJECT_ID(N'SP_CreateOrders', N'P') IS NOT NULL DROP PROCEDURE SP_CreateOrders;
GO
CREATE PROCEDURE SP_CreateOrders
(    @OrderNumber NVARCHAR(100) = NULL,
    @CustomerId INT,
    @PackageId INT,
    @MealPeriodId INT,
    @LocationId INT,
    @EventStartDateTime DATETIME = NULL,
    @EventEndDateTime DATETIME = NULL,
    @DeliveryAddress NVARCHAR(500) = NULL,
    @Notes NVARCHAR(MAX) = NULL,
    @Pax INT,
    @PackageBaseAmount DECIMAL(18, 2),
    @AdditionalMenuAmount DECIMAL(18, 2),
    @AddOnsAmount DECIMAL(18, 2),
    @UtensilsAmount DECIMAL(18, 2),
    @SubTotal DECIMAL(18, 2),
    @Discount DECIMAL(18, 2),
    @DeliveryFee DECIMAL(18, 2),
    @TaxAmount DECIMAL(18, 2),
    @TotalAmount DECIMAL(18, 2),
    @TaxPercentage DECIMAL(18, 2),
    @PaidAmount DECIMAL(18, 2),
    @OrderStatus INT,
    @CreatedDate DATETIME2(7),
    @CreatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @UpdatedBy INT)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[Orders] ([OrderNumber], [CustomerId], [PackageId], [MealPeriodId], [LocationId], [EventStartDateTime], [EventEndDateTime], [DeliveryAddress], [Notes], [Pax], [PackageBaseAmount], [AdditionalMenuAmount], [AddOnsAmount], [UtensilsAmount], [SubTotal], [Discount], [DeliveryFee], [TaxAmount], [TotalAmount], [TaxPercentage], [PaidAmount], [OrderStatus], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy])
    VALUES (@OrderNumber, @CustomerId, @PackageId, @MealPeriodId, @LocationId, @EventStartDateTime, @EventEndDateTime, @DeliveryAddress, @Notes, @Pax, @PackageBaseAmount, @AdditionalMenuAmount, @AddOnsAmount, @UtensilsAmount, @SubTotal, @Discount, @DeliveryFee, @TaxAmount, @TotalAmount, @TaxPercentage, @PaidAmount, @OrderStatus, COALESCE(@CreatedDate, GETDATE()), @CreatedBy, @UpdatedDate, @UpdatedBy);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO
IF OBJECT_ID(N'SP_UpdateOrders', N'P') IS NOT NULL DROP PROCEDURE SP_UpdateOrders;
GO
CREATE PROCEDURE SP_UpdateOrders
(    @Id INT,
    @OrderNumber NVARCHAR(100) = NULL,
    @CustomerId INT,
    @PackageId INT,
    @MealPeriodId INT,
    @LocationId INT,
    @EventStartDateTime DATETIME = NULL,
    @EventEndDateTime DATETIME = NULL,
    @DeliveryAddress NVARCHAR(500) = NULL,
    @Notes NVARCHAR(MAX) = NULL,
    @Pax INT,
    @PackageBaseAmount DECIMAL(18, 2),
    @AdditionalMenuAmount DECIMAL(18, 2),
    @AddOnsAmount DECIMAL(18, 2),
    @UtensilsAmount DECIMAL(18, 2),
    @SubTotal DECIMAL(18, 2),
    @Discount DECIMAL(18, 2),
    @DeliveryFee DECIMAL(18, 2),
    @TaxAmount DECIMAL(18, 2),
    @TotalAmount DECIMAL(18, 2),
    @TaxPercentage DECIMAL(18, 2),
    @PaidAmount DECIMAL(18, 2),
    @OrderStatus INT,
    @CreatedDate DATETIME2(7),
    @CreatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @UpdatedBy INT)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[Orders]
    SET     [OrderNumber] = @OrderNumber,
    [CustomerId] = @CustomerId,
    [PackageId] = @PackageId,
    [MealPeriodId] = @MealPeriodId,
    [LocationId] = @LocationId,
    [EventStartDateTime] = @EventStartDateTime,
    [EventEndDateTime] = @EventEndDateTime,
    [DeliveryAddress] = @DeliveryAddress,
    [Notes] = @Notes,
    [Pax] = @Pax,
    [PackageBaseAmount] = @PackageBaseAmount,
    [AdditionalMenuAmount] = @AdditionalMenuAmount,
    [AddOnsAmount] = @AddOnsAmount,
    [UtensilsAmount] = @UtensilsAmount,
    [SubTotal] = @SubTotal,
    [Discount] = @Discount,
    [DeliveryFee] = @DeliveryFee,
    [TaxAmount] = @TaxAmount,
    [TotalAmount] = @TotalAmount,
    [TaxPercentage] = @TaxPercentage,
    [PaidAmount] = @PaidAmount,
    [OrderStatus] = @OrderStatus,
    [CreatedDate] = @CreatedDate,
    [CreatedBy] = @CreatedBy,
    [UpdatedDate] = @UpdatedDate,
    [UpdatedBy] = @UpdatedBy
    WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'SP_GetOrdersById', N'P') IS NOT NULL DROP PROCEDURE SP_GetOrdersById;
GO
CREATE PROCEDURE SP_GetOrdersById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[Orders] WHERE [Id] = @Id;
END
GO
IF OBJECT_ID(N'GetOrders', N'P') IS NOT NULL DROP PROCEDURE GetOrders;
GO
CREATE PROCEDURE GetOrders
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[Orders];
END
GO
IF OBJECT_ID(N'DeleteOrdersById', N'P') IS NOT NULL DROP PROCEDURE DeleteOrdersById;
GO
CREATE PROCEDURE DeleteOrdersById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM [dbo].[Orders] WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'ActiveInActiveOrdersById', N'P') IS NOT NULL DROP PROCEDURE ActiveInActiveOrdersById;
GO
CREATE PROCEDURE ActiveInActiveOrdersById
(
    @Id INT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    RAISERROR('Table [Orders] does not contain an IsActive column.', 16, 1);
    RETURN;
END
GO
-- Procedures for OrderUtensilsDetails
IF OBJECT_ID(N'SP_CreateOrderUtensilsDetails', N'P') IS NOT NULL DROP PROCEDURE SP_CreateOrderUtensilsDetails;
GO
CREATE PROCEDURE SP_CreateOrderUtensilsDetails
(    @OrderId INT,
    @UtensilsId INT,
    @Qty INT,
    @UnitPrice DECIMAL(18, 2),
    @TotalAmount DECIMAL(18, 2),
    @IsActive BIT,
    @IsDeleted BIT,
    @CreatedDate DATETIME,
    @CreatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @UpdatedBy INT)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[OrderUtensilsDetails] ([OrderId], [UtensilsId], [Qty], [UnitPrice], [TotalAmount], [IsActive], [IsDeleted], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy])
    VALUES (@OrderId, @UtensilsId, @Qty, @UnitPrice, @TotalAmount, @IsActive, @IsDeleted, COALESCE(@CreatedDate, GETDATE()), @CreatedBy, @UpdatedDate, @UpdatedBy);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO
IF OBJECT_ID(N'SP_UpdateOrderUtensilsDetails', N'P') IS NOT NULL DROP PROCEDURE SP_UpdateOrderUtensilsDetails;
GO
CREATE PROCEDURE SP_UpdateOrderUtensilsDetails
(    @Id INT,
    @OrderId INT,
    @UtensilsId INT,
    @Qty INT,
    @UnitPrice DECIMAL(18, 2),
    @TotalAmount DECIMAL(18, 2),
    @IsActive BIT,
    @IsDeleted BIT,
    @CreatedDate DATETIME,
    @CreatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @UpdatedBy INT)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[OrderUtensilsDetails]
    SET     [OrderId] = @OrderId,
    [UtensilsId] = @UtensilsId,
    [Qty] = @Qty,
    [UnitPrice] = @UnitPrice,
    [TotalAmount] = @TotalAmount,
    [IsActive] = @IsActive,
    [IsDeleted] = @IsDeleted,
    [CreatedDate] = @CreatedDate,
    [CreatedBy] = @CreatedBy,
    [UpdatedDate] = @UpdatedDate,
    [UpdatedBy] = @UpdatedBy
    WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'SP_GetOrderUtensilsDetailsById', N'P') IS NOT NULL DROP PROCEDURE SP_GetOrderUtensilsDetailsById;
GO
CREATE PROCEDURE SP_GetOrderUtensilsDetailsById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[OrderUtensilsDetails] WHERE [Id] = @Id;
END
GO
IF OBJECT_ID(N'GetOrderUtensilsDetails', N'P') IS NOT NULL DROP PROCEDURE GetOrderUtensilsDetails;
GO
CREATE PROCEDURE GetOrderUtensilsDetails
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[OrderUtensilsDetails] WHERE [IsDeleted] = 0;
END
GO
IF OBJECT_ID(N'DeleteOrderUtensilsDetailsById', N'P') IS NOT NULL DROP PROCEDURE DeleteOrderUtensilsDetailsById;
GO
CREATE PROCEDURE DeleteOrderUtensilsDetailsById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[OrderUtensilsDetails] SET [IsDeleted] = 1 WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'ActiveInActiveOrderUtensilsDetailsById', N'P') IS NOT NULL DROP PROCEDURE ActiveInActiveOrderUtensilsDetailsById;
GO
CREATE PROCEDURE ActiveInActiveOrderUtensilsDetailsById
(
    @Id INT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[OrderUtensilsDetails] SET [IsActive] = @IsActive WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
-- Procedures for Organization
IF OBJECT_ID(N'SP_CreateOrganization', N'P') IS NOT NULL DROP PROCEDURE SP_CreateOrganization;
GO
CREATE PROCEDURE SP_CreateOrganization
(    @Code INT,
    @Name VARCHAR(100),
    @GSTNO NVARCHAR(25),
    @Phone NVARCHAR(20),
    @Email NVARCHAR(100),
    @Website NVARCHAR(100),
    @ContactPerson VARCHAR(100),
    @ContactPhone NVARCHAR(100),
    @ContactEmail NVARCHAR(100),
    @AddressLine1 NVARCHAR(100),
    @AdressLine2 NVARCHAR(100),
    @City INT,
    @State INT,
    @Country INT,
    @IsActive BIT,
    @IsDeleted BIT,
    @CreatedDate DATETIME,
    @CreatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @UpdatedBy INT)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[Organization] ([Code], [Name], [GSTNO], [Phone], [Email], [Website], [ContactPerson], [ContactPhone], [ContactEmail], [AddressLine1], [AdressLine2], [City], [State], [Country], [IsActive], [IsDeleted], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy])
    VALUES (@Code, @Name, @GSTNO, @Phone, @Email, @Website, @ContactPerson, @ContactPhone, @ContactEmail, @AddressLine1, @AdressLine2, @City, @State, @Country, @IsActive, @IsDeleted, COALESCE(@CreatedDate, GETDATE()), @CreatedBy, @UpdatedDate, @UpdatedBy);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO
IF OBJECT_ID(N'SP_UpdateOrganization', N'P') IS NOT NULL DROP PROCEDURE SP_UpdateOrganization;
GO
CREATE PROCEDURE SP_UpdateOrganization
(    @Id INT,
    @Code INT,
    @Name VARCHAR(100),
    @GSTNO NVARCHAR(25),
    @Phone NVARCHAR(20),
    @Email NVARCHAR(100),
    @Website NVARCHAR(100),
    @ContactPerson VARCHAR(100),
    @ContactPhone NVARCHAR(100),
    @ContactEmail NVARCHAR(100),
    @AddressLine1 NVARCHAR(100),
    @AdressLine2 NVARCHAR(100),
    @City INT,
    @State INT,
    @Country INT,
    @IsActive BIT,
    @IsDeleted BIT,
    @CreatedDate DATETIME,
    @CreatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @UpdatedBy INT)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[Organization]
    SET     [Code] = @Code,
    [Name] = @Name,
    [GSTNO] = @GSTNO,
    [Phone] = @Phone,
    [Email] = @Email,
    [Website] = @Website,
    [ContactPerson] = @ContactPerson,
    [ContactPhone] = @ContactPhone,
    [ContactEmail] = @ContactEmail,
    [AddressLine1] = @AddressLine1,
    [AdressLine2] = @AdressLine2,
    [City] = @City,
    [State] = @State,
    [Country] = @Country,
    [IsActive] = @IsActive,
    [IsDeleted] = @IsDeleted,
    [CreatedDate] = @CreatedDate,
    [CreatedBy] = @CreatedBy,
    [UpdatedDate] = @UpdatedDate,
    [UpdatedBy] = @UpdatedBy
    WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'SP_GetOrganizationById', N'P') IS NOT NULL DROP PROCEDURE SP_GetOrganizationById;
GO
CREATE PROCEDURE SP_GetOrganizationById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[Organization] WHERE [Id] = @Id;
END
GO
IF OBJECT_ID(N'GetOrganization', N'P') IS NOT NULL DROP PROCEDURE GetOrganization;
GO
CREATE PROCEDURE GetOrganization
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[Organization] WHERE [IsDeleted] = 0;
END
GO
IF OBJECT_ID(N'DeleteOrganizationById', N'P') IS NOT NULL DROP PROCEDURE DeleteOrganizationById;
GO
CREATE PROCEDURE DeleteOrganizationById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[Organization] SET [IsDeleted] = 1 WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'ActiveInActiveOrganizationById', N'P') IS NOT NULL DROP PROCEDURE ActiveInActiveOrganizationById;
GO
CREATE PROCEDURE ActiveInActiveOrganizationById
(
    @Id INT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[Organization] SET [IsActive] = @IsActive WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
-- Procedures for PackageItems
IF OBJECT_ID(N'SP_CreatePackageItems', N'P') IS NOT NULL DROP PROCEDURE SP_CreatePackageItems;
GO
CREATE PROCEDURE SP_CreatePackageItems
(    @CategoryId INT,
    @Quantity INT,
    @CreatedBy INT,
    @CreatedDate DATETIME,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @IsActive BIT = NULL,
    @IsDeleted BIT = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[PackageItems] ([CategoryId], [Quantity], [CreatedBy], [CreatedDate], [UpdatedBy], [UpdatedDate], [IsActive], [IsDeleted])
    VALUES (@CategoryId, @Quantity, @CreatedBy, COALESCE(@CreatedDate, GETDATE()), @UpdatedBy, @UpdatedDate, @IsActive, @IsDeleted);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO
IF OBJECT_ID(N'SP_UpdatePackageItems', N'P') IS NOT NULL DROP PROCEDURE SP_UpdatePackageItems;
GO
CREATE PROCEDURE SP_UpdatePackageItems
(    @Id INT,
    @CategoryId INT,
    @Quantity INT,
    @CreatedBy INT,
    @CreatedDate DATETIME,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @IsActive BIT = NULL,
    @IsDeleted BIT = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[PackageItems]
    SET     [CategoryId] = @CategoryId,
    [Quantity] = @Quantity,
    [CreatedBy] = @CreatedBy,
    [CreatedDate] = @CreatedDate,
    [UpdatedBy] = @UpdatedBy,
    [UpdatedDate] = @UpdatedDate,
    [IsActive] = @IsActive,
    [IsDeleted] = @IsDeleted
    WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'SP_GetPackageItemsById', N'P') IS NOT NULL DROP PROCEDURE SP_GetPackageItemsById;
GO
CREATE PROCEDURE SP_GetPackageItemsById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[PackageItems] WHERE [Id] = @Id;
END
GO
IF OBJECT_ID(N'GetPackageItems', N'P') IS NOT NULL DROP PROCEDURE GetPackageItems;
GO
CREATE PROCEDURE GetPackageItems
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[PackageItems] WHERE [IsDeleted] = 0;
END
GO
IF OBJECT_ID(N'DeletePackageItemsById', N'P') IS NOT NULL DROP PROCEDURE DeletePackageItemsById;
GO
CREATE PROCEDURE DeletePackageItemsById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[PackageItems] SET [IsDeleted] = 1 WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'ActiveInActivePackageItemsById', N'P') IS NOT NULL DROP PROCEDURE ActiveInActivePackageItemsById;
GO
CREATE PROCEDURE ActiveInActivePackageItemsById
(
    @Id INT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[PackageItems] SET [IsActive] = @IsActive WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
-- Procedures for Packages
IF OBJECT_ID(N'SP_CreatePackages', N'P') IS NOT NULL DROP PROCEDURE SP_CreatePackages;
GO
CREATE PROCEDURE SP_CreatePackages
(    @PackageName NVARCHAR(100),
    @PackageDescription NVARCHAR(MAX) = NULL,
    @PackageType NVARCHAR(50) = NULL,
    @Price DECIMAL(18, 2),
    @MinPersons INT,
    @MaxPersons INT,
    @IsActive BIT,
    @CreatedBy INT,
    @CreatedDate DATETIME,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @IsDeleted BIT = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[Packages] ([PackageName], [PackageDescription], [PackageType], [Price], [MinPersons], [MaxPersons], [IsActive], [CreatedBy], [CreatedDate], [UpdatedBy], [UpdatedDate], [IsDeleted])
    VALUES (@PackageName, @PackageDescription, @PackageType, @Price, @MinPersons, @MaxPersons, @IsActive, @CreatedBy, COALESCE(@CreatedDate, GETDATE()), @UpdatedBy, @UpdatedDate, @IsDeleted);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO
IF OBJECT_ID(N'SP_UpdatePackages', N'P') IS NOT NULL DROP PROCEDURE SP_UpdatePackages;
GO
CREATE PROCEDURE SP_UpdatePackages
(    @Id INT,
    @PackageName NVARCHAR(100),
    @PackageDescription NVARCHAR(MAX) = NULL,
    @PackageType NVARCHAR(50) = NULL,
    @Price DECIMAL(18, 2),
    @MinPersons INT,
    @MaxPersons INT,
    @IsActive BIT,
    @CreatedBy INT,
    @CreatedDate DATETIME,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @IsDeleted BIT = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[Packages]
    SET     [PackageName] = @PackageName,
    [PackageDescription] = @PackageDescription,
    [PackageType] = @PackageType,
    [Price] = @Price,
    [MinPersons] = @MinPersons,
    [MaxPersons] = @MaxPersons,
    [IsActive] = @IsActive,
    [CreatedBy] = @CreatedBy,
    [CreatedDate] = @CreatedDate,
    [UpdatedBy] = @UpdatedBy,
    [UpdatedDate] = @UpdatedDate,
    [IsDeleted] = @IsDeleted
    WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'SP_GetPackagesById', N'P') IS NOT NULL DROP PROCEDURE SP_GetPackagesById;
GO
CREATE PROCEDURE SP_GetPackagesById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[Packages] WHERE [Id] = @Id;
END
GO
IF OBJECT_ID(N'GetPackages', N'P') IS NOT NULL DROP PROCEDURE GetPackages;
GO
CREATE PROCEDURE GetPackages
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[Packages] WHERE [IsDeleted] = 0;
END
GO
IF OBJECT_ID(N'DeletePackagesById', N'P') IS NOT NULL DROP PROCEDURE DeletePackagesById;
GO
CREATE PROCEDURE DeletePackagesById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[Packages] SET [IsDeleted] = 1 WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'ActiveInActivePackagesById', N'P') IS NOT NULL DROP PROCEDURE ActiveInActivePackagesById;
GO
CREATE PROCEDURE ActiveInActivePackagesById
(
    @Id INT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[Packages] SET [IsActive] = @IsActive WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
-- Procedures for PopularFreebieMaster
IF OBJECT_ID(N'SP_CreatePopularFreebieMaster', N'P') IS NOT NULL DROP PROCEDURE SP_CreatePopularFreebieMaster;
GO
CREATE PROCEDURE SP_CreatePopularFreebieMaster
(    @ConfigType VARCHAR(20),
    @ConfigName NVARCHAR(200),
    @PackageId INT,
    @MinPax INT,
    @MaxPax INT,
    @MinOrderAmount DECIMAL(18, 2),
    @FreeQty DECIMAL(18, 2),
    @LocationId INT,
    @DisplayOrder INT,
    @IsActive BIT,
    @ValidFrom DATE,
    @ValidTo DATE,
    @Remarks NVARCHAR(500) = NULL,
    @IsDeleted BIT,
    @CreatedBy INT,
    @CreatedDate DATETIME,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[PopularFreebieMaster] ([ConfigType], [ConfigName], [PackageId], [MinPax], [MaxPax], [MinOrderAmount], [FreeQty], [LocationId], [DisplayOrder], [IsActive], [ValidFrom], [ValidTo], [Remarks], [IsDeleted], [CreatedBy], [CreatedDate], [UpdatedBy], [UpdatedDate])
    VALUES (@ConfigType, @ConfigName, @PackageId, @MinPax, @MaxPax, @MinOrderAmount, @FreeQty, @LocationId, @DisplayOrder, @IsActive, @ValidFrom, @ValidTo, @Remarks, @IsDeleted, @CreatedBy, COALESCE(@CreatedDate, GETDATE()), @UpdatedBy, @UpdatedDate);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO
IF OBJECT_ID(N'SP_UpdatePopularFreebieMaster', N'P') IS NOT NULL DROP PROCEDURE SP_UpdatePopularFreebieMaster;
GO
CREATE PROCEDURE SP_UpdatePopularFreebieMaster
(    @Id INT,
    @ConfigType VARCHAR(20),
    @ConfigName NVARCHAR(200),
    @PackageId INT,
    @MinPax INT,
    @MaxPax INT,
    @MinOrderAmount DECIMAL(18, 2),
    @FreeQty DECIMAL(18, 2),
    @LocationId INT,
    @DisplayOrder INT,
    @IsActive BIT,
    @ValidFrom DATE,
    @ValidTo DATE,
    @Remarks NVARCHAR(500) = NULL,
    @IsDeleted BIT,
    @CreatedBy INT,
    @CreatedDate DATETIME,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[PopularFreebieMaster]
    SET     [ConfigType] = @ConfigType,
    [ConfigName] = @ConfigName,
    [PackageId] = @PackageId,
    [MinPax] = @MinPax,
    [MaxPax] = @MaxPax,
    [MinOrderAmount] = @MinOrderAmount,
    [FreeQty] = @FreeQty,
    [LocationId] = @LocationId,
    [DisplayOrder] = @DisplayOrder,
    [IsActive] = @IsActive,
    [ValidFrom] = @ValidFrom,
    [ValidTo] = @ValidTo,
    [Remarks] = @Remarks,
    [IsDeleted] = @IsDeleted,
    [CreatedBy] = @CreatedBy,
    [CreatedDate] = @CreatedDate,
    [UpdatedBy] = @UpdatedBy,
    [UpdatedDate] = @UpdatedDate
    WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'SP_GetPopularFreebieMasterById', N'P') IS NOT NULL DROP PROCEDURE SP_GetPopularFreebieMasterById;
GO
CREATE PROCEDURE SP_GetPopularFreebieMasterById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[PopularFreebieMaster] WHERE [Id] = @Id;
END
GO
IF OBJECT_ID(N'GetPopularFreebieMaster', N'P') IS NOT NULL DROP PROCEDURE GetPopularFreebieMaster;
GO
CREATE PROCEDURE GetPopularFreebieMaster
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[PopularFreebieMaster] WHERE [IsDeleted] = 0;
END
GO
IF OBJECT_ID(N'DeletePopularFreebieMasterById', N'P') IS NOT NULL DROP PROCEDURE DeletePopularFreebieMasterById;
GO
CREATE PROCEDURE DeletePopularFreebieMasterById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[PopularFreebieMaster] SET [IsDeleted] = 1 WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'ActiveInActivePopularFreebieMasterById', N'P') IS NOT NULL DROP PROCEDURE ActiveInActivePopularFreebieMasterById;
GO
CREATE PROCEDURE ActiveInActivePopularFreebieMasterById
(
    @Id INT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[PopularFreebieMaster] SET [IsActive] = @IsActive WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
-- Procedures for RoleMaster
IF OBJECT_ID(N'SP_CreateRoleMaster', N'P') IS NOT NULL DROP PROCEDURE SP_CreateRoleMaster;
GO
CREATE PROCEDURE SP_CreateRoleMaster
(    @Code NVARCHAR(50),
    @Name NVARCHAR(150),
    @Remarks NVARCHAR(500) = NULL,
    @IsActive BIT,
    @IsDeleted BIT,
    @CreatedBy INT,
    @CreatedDate DATETIME = NULL,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[RoleMaster] ([Code], [Name], [Remarks], [IsActive], [IsDeleted], [CreatedBy], [CreatedDate], [UpdatedBy], [UpdatedDate])
    VALUES (@Code, @Name, @Remarks, @IsActive, @IsDeleted, @CreatedBy, COALESCE(@CreatedDate, GETDATE()), @UpdatedBy, @UpdatedDate);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO
IF OBJECT_ID(N'SP_UpdateRoleMaster', N'P') IS NOT NULL DROP PROCEDURE SP_UpdateRoleMaster;
GO
CREATE PROCEDURE SP_UpdateRoleMaster
(    @Id INT,
    @Code NVARCHAR(50),
    @Name NVARCHAR(150),
    @Remarks NVARCHAR(500) = NULL,
    @IsActive BIT,
    @IsDeleted BIT,
    @CreatedBy INT,
    @CreatedDate DATETIME = NULL,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[RoleMaster]
    SET     [Code] = @Code,
    [Name] = @Name,
    [Remarks] = @Remarks,
    [IsActive] = @IsActive,
    [IsDeleted] = @IsDeleted,
    [CreatedBy] = @CreatedBy,
    [CreatedDate] = @CreatedDate,
    [UpdatedBy] = @UpdatedBy,
    [UpdatedDate] = @UpdatedDate
    WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'SP_GetRoleMasterById', N'P') IS NOT NULL DROP PROCEDURE SP_GetRoleMasterById;
GO
CREATE PROCEDURE SP_GetRoleMasterById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[RoleMaster] WHERE [Id] = @Id;
END
GO
IF OBJECT_ID(N'GetRoleMaster', N'P') IS NOT NULL DROP PROCEDURE GetRoleMaster;
GO
CREATE PROCEDURE GetRoleMaster
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[RoleMaster] WHERE [IsDeleted] = 0;
END
GO
IF OBJECT_ID(N'DeleteRoleMasterById', N'P') IS NOT NULL DROP PROCEDURE DeleteRoleMasterById;
GO
CREATE PROCEDURE DeleteRoleMasterById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[RoleMaster] SET [IsDeleted] = 1 WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'ActiveInActiveRoleMasterById', N'P') IS NOT NULL DROP PROCEDURE ActiveInActiveRoleMasterById;
GO
CREATE PROCEDURE ActiveInActiveRoleMasterById
(
    @Id INT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[RoleMaster] SET [IsActive] = @IsActive WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
-- Procedures for RolePermission
IF OBJECT_ID(N'SP_CreateRolePermission', N'P') IS NOT NULL DROP PROCEDURE SP_CreateRolePermission;
GO
CREATE PROCEDURE SP_CreateRolePermission
(    @RoleId INT,
    @EntityNo INT,
    @View BIT,
    @Create BIT,
    @Edit BIT,
    @Delete BIT,
    @ActiveInActive BIT = NULL,
    @Print BIT = NULL,
    @Download BIT = NULL,
    @CreatedDate DATETIME,
    @CreatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @UpdatedBy INT,
    @IsActive BIT,
    @IsDeleted BIT)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[RolePermission] ([RoleId], [EntityNo], [View], [Create], [Edit], [Delete], [ActiveInActive], [Print], [Download], [CreatedDate], [CreatedBy], [UpdatedDate], [UpdatedBy], [IsActive], [IsDeleted])
    VALUES (@RoleId, @EntityNo, @View, @Create, @Edit, @Delete, @ActiveInActive, @Print, @Download, COALESCE(@CreatedDate, GETDATE()), @CreatedBy, @UpdatedDate, @UpdatedBy, @IsActive, @IsDeleted);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO
IF OBJECT_ID(N'SP_UpdateRolePermission', N'P') IS NOT NULL DROP PROCEDURE SP_UpdateRolePermission;
GO
CREATE PROCEDURE SP_UpdateRolePermission
(    @Id INT,
    @RoleId INT,
    @EntityNo INT,
    @View BIT,
    @Create BIT,
    @Edit BIT,
    @Delete BIT,
    @ActiveInActive BIT = NULL,
    @Print BIT = NULL,
    @Download BIT = NULL,
    @CreatedDate DATETIME,
    @CreatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @UpdatedBy INT,
    @IsActive BIT,
    @IsDeleted BIT)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[RolePermission]
    SET     [RoleId] = @RoleId,
    [EntityNo] = @EntityNo,
    [View] = @View,
    [Create] = @Create,
    [Edit] = @Edit,
    [Delete] = @Delete,
    [ActiveInActive] = @ActiveInActive,
    [Print] = @Print,
    [Download] = @Download,
    [CreatedDate] = @CreatedDate,
    [CreatedBy] = @CreatedBy,
    [UpdatedDate] = @UpdatedDate,
    [UpdatedBy] = @UpdatedBy,
    [IsActive] = @IsActive,
    [IsDeleted] = @IsDeleted
    WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'SP_GetRolePermissionById', N'P') IS NOT NULL DROP PROCEDURE SP_GetRolePermissionById;
GO
CREATE PROCEDURE SP_GetRolePermissionById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[RolePermission] WHERE [Id] = @Id;
END
GO
IF OBJECT_ID(N'GetRolePermission', N'P') IS NOT NULL DROP PROCEDURE GetRolePermission;
GO
CREATE PROCEDURE GetRolePermission
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[RolePermission] WHERE [IsDeleted] = 0;
END
GO
IF OBJECT_ID(N'DeleteRolePermissionById', N'P') IS NOT NULL DROP PROCEDURE DeleteRolePermissionById;
GO
CREATE PROCEDURE DeleteRolePermissionById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[RolePermission] SET [IsDeleted] = 1 WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'ActiveInActiveRolePermissionById', N'P') IS NOT NULL DROP PROCEDURE ActiveInActiveRolePermissionById;
GO
CREATE PROCEDURE ActiveInActiveRolePermissionById
(
    @Id INT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[RolePermission] SET [IsActive] = @IsActive WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
-- Procedures for StateMaster
IF OBJECT_ID(N'SP_CreateStateMaster', N'P') IS NOT NULL DROP PROCEDURE SP_CreateStateMaster;
GO
CREATE PROCEDURE SP_CreateStateMaster
(    @id SMALLINT,
    @name NVARCHAR(50) = NULL,
    @country_id TINYINT,
    @country_code NVARCHAR(50) = NULL,
    @country_name NVARCHAR(50) = NULL,
    @iso2 NVARCHAR(50) = NULL,
    @iso3166_2 NVARCHAR(50) = NULL,
    @fips_code NVARCHAR(50) = NULL,
    @type NVARCHAR(50) = NULL,
    @level INT,
    @parent_id NVARCHAR(10) = NULL,
    @native NVARCHAR(50) = NULL,
    @latitude FLOAT,
    @longitude FLOAT,
    @timezone NVARCHAR(50) = NULL,
    @wikiDataId MONEY,
    @population INT)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[StateMaster] ([id], [name], [country_id], [country_code], [country_name], [iso2], [iso3166_2], [fips_code], [type], [level], [parent_id], [native], [latitude], [longitude], [timezone], [wikiDataId], [population])
    VALUES (@id, @name, @country_id, @country_code, @country_name, @iso2, @iso3166_2, @fips_code, @type, @level, @parent_id, @native, @latitude, @longitude, @timezone, @wikiDataId, @population);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO
IF OBJECT_ID(N'SP_UpdateStateMaster', N'P') IS NOT NULL DROP PROCEDURE SP_UpdateStateMaster;
GO
CREATE PROCEDURE SP_UpdateStateMaster
(    @id SMALLINT,
    @id SMALLINT,
    @name NVARCHAR(50) = NULL,
    @country_id TINYINT,
    @country_code NVARCHAR(50) = NULL,
    @country_name NVARCHAR(50) = NULL,
    @iso2 NVARCHAR(50) = NULL,
    @iso3166_2 NVARCHAR(50) = NULL,
    @fips_code NVARCHAR(50) = NULL,
    @type NVARCHAR(50) = NULL,
    @level INT,
    @parent_id NVARCHAR(10) = NULL,
    @native NVARCHAR(50) = NULL,
    @latitude FLOAT,
    @longitude FLOAT,
    @timezone NVARCHAR(50) = NULL,
    @wikiDataId MONEY,
    @population INT)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[StateMaster]
    SET     [id] = @id,
    [name] = @name,
    [country_id] = @country_id,
    [country_code] = @country_code,
    [country_name] = @country_name,
    [iso2] = @iso2,
    [iso3166_2] = @iso3166_2,
    [fips_code] = @fips_code,
    [type] = @type,
    [level] = @level,
    [parent_id] = @parent_id,
    [native] = @native,
    [latitude] = @latitude,
    [longitude] = @longitude,
    [timezone] = @timezone,
    [wikiDataId] = @wikiDataId,
    [population] = @population
    WHERE [id] = @id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'SP_GetStateMasterById', N'P') IS NOT NULL DROP PROCEDURE SP_GetStateMasterById;
GO
CREATE PROCEDURE SP_GetStateMasterById
(
    @id SMALLINT
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[StateMaster] WHERE [id] = @id;
END
GO
IF OBJECT_ID(N'GetStateMaster', N'P') IS NOT NULL DROP PROCEDURE GetStateMaster;
GO
CREATE PROCEDURE GetStateMaster
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[StateMaster];
END
GO
IF OBJECT_ID(N'DeleteStateMasterById', N'P') IS NOT NULL DROP PROCEDURE DeleteStateMasterById;
GO
CREATE PROCEDURE DeleteStateMasterById
(
    @id SMALLINT
)
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM [dbo].[StateMaster] WHERE [id] = @id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'ActiveInActiveStateMasterById', N'P') IS NOT NULL DROP PROCEDURE ActiveInActiveStateMasterById;
GO
CREATE PROCEDURE ActiveInActiveStateMasterById
(
    @id SMALLINT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    RAISERROR('Table [StateMaster] does not contain an IsActive column.', 16, 1);
    RETURN;
END
GO
-- Procedures for SubMenu
IF OBJECT_ID(N'SP_CreateSubMenu', N'P') IS NOT NULL DROP PROCEDURE SP_CreateSubMenu;
GO
CREATE PROCEDURE SP_CreateSubMenu
(    @MenuId INT,
    @Name VARCHAR(50) = NULL,
    @EntityNo INT,
    @IsActive BIT = NULL,
    @IsDeleted BIT = NULL,
    @CreatedBy INT,
    @CreatedDate DATETIME = NULL,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @DisplayOrder INT,
    @Route VARCHAR(100) = NULL,
    @Remarks VARCHAR(500) = NULL,
    @Menuscope INT,
    @MenuIcon NVARCHAR(50) = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[SubMenu] ([MenuId], [Name], [EntityNo], [IsActive], [IsDeleted], [CreatedBy], [CreatedDate], [UpdatedBy], [UpdatedDate], [DisplayOrder], [Route], [Remarks], [Menuscope], [MenuIcon])
    VALUES (@MenuId, @Name, @EntityNo, @IsActive, @IsDeleted, @CreatedBy, COALESCE(@CreatedDate, GETDATE()), @UpdatedBy, @UpdatedDate, @DisplayOrder, @Route, @Remarks, @Menuscope, @MenuIcon);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO
IF OBJECT_ID(N'SP_UpdateSubMenu', N'P') IS NOT NULL DROP PROCEDURE SP_UpdateSubMenu;
GO
CREATE PROCEDURE SP_UpdateSubMenu
(    @Id INT,
    @MenuId INT,
    @Name VARCHAR(50) = NULL,
    @EntityNo INT,
    @IsActive BIT = NULL,
    @IsDeleted BIT = NULL,
    @CreatedBy INT,
    @CreatedDate DATETIME = NULL,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @DisplayOrder INT,
    @Route VARCHAR(100) = NULL,
    @Remarks VARCHAR(500) = NULL,
    @Menuscope INT,
    @MenuIcon NVARCHAR(50) = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[SubMenu]
    SET     [MenuId] = @MenuId,
    [Name] = @Name,
    [EntityNo] = @EntityNo,
    [IsActive] = @IsActive,
    [IsDeleted] = @IsDeleted,
    [CreatedBy] = @CreatedBy,
    [CreatedDate] = @CreatedDate,
    [UpdatedBy] = @UpdatedBy,
    [UpdatedDate] = @UpdatedDate,
    [DisplayOrder] = @DisplayOrder,
    [Route] = @Route,
    [Remarks] = @Remarks,
    [Menuscope] = @Menuscope,
    [MenuIcon] = @MenuIcon
    WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'SP_GetSubMenuById', N'P') IS NOT NULL DROP PROCEDURE SP_GetSubMenuById;
GO
CREATE PROCEDURE SP_GetSubMenuById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[SubMenu] WHERE [Id] = @Id;
END
GO
IF OBJECT_ID(N'GetSubMenu', N'P') IS NOT NULL DROP PROCEDURE GetSubMenu;
GO
CREATE PROCEDURE GetSubMenu
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[SubMenu] WHERE [IsDeleted] = 0;
END
GO
IF OBJECT_ID(N'DeleteSubMenuById', N'P') IS NOT NULL DROP PROCEDURE DeleteSubMenuById;
GO
CREATE PROCEDURE DeleteSubMenuById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[SubMenu] SET [IsDeleted] = 1 WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'ActiveInActiveSubMenuById', N'P') IS NOT NULL DROP PROCEDURE ActiveInActiveSubMenuById;
GO
CREATE PROCEDURE ActiveInActiveSubMenuById
(
    @Id INT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[SubMenu] SET [IsActive] = @IsActive WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
-- Procedures for UserMaster
IF OBJECT_ID(N'SP_CreateUserMaster', N'P') IS NOT NULL DROP PROCEDURE SP_CreateUserMaster;
GO
CREATE PROCEDURE SP_CreateUserMaster
(    @Code NVARCHAR(50),
    @Name NVARCHAR(150),
    @Remarks NVARCHAR(500) = NULL,
    @IsAdmin BIT,
    @Email NVARCHAR(150),
    @Password NVARCHAR(255),
    @ContactNo VARCHAR(20) = NULL,
    @IsActive BIT,
    @IsDeleted BIT,
    @CreatedBy INT,
    @CreatedDate DATETIME,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @Image VARCHAR(500) = NULL,
    @Gender INT,
    @DOB DATETIME = NULL,
    @Age INT,
    @Address1 NVARCHAR(500) = NULL,
    @Address2 NVARCHAR(500) = NULL,
    @Country INT,
    @State INT,
    @City INT,
    @PostalCode INT,
    @PinNo INT)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[UserMaster] ([Code], [Name], [Remarks], [IsAdmin], [Email], [Password], [ContactNo], [IsActive], [IsDeleted], [CreatedBy], [CreatedDate], [UpdatedBy], [UpdatedDate], [Image], [Gender], [DOB], [Age], [Address1], [Address2], [Country], [State], [City], [PostalCode], [PinNo])
    VALUES (@Code, @Name, @Remarks, @IsAdmin, @Email, @Password, @ContactNo, @IsActive, @IsDeleted, @CreatedBy, COALESCE(@CreatedDate, GETDATE()), @UpdatedBy, @UpdatedDate, @Image, @Gender, @DOB, @Age, @Address1, @Address2, @Country, @State, @City, @PostalCode, @PinNo);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO
IF OBJECT_ID(N'SP_UpdateUserMaster', N'P') IS NOT NULL DROP PROCEDURE SP_UpdateUserMaster;
GO
CREATE PROCEDURE SP_UpdateUserMaster
(    @Id INT,
    @Code NVARCHAR(50),
    @Name NVARCHAR(150),
    @Remarks NVARCHAR(500) = NULL,
    @IsAdmin BIT,
    @Email NVARCHAR(150),
    @Password NVARCHAR(255),
    @ContactNo VARCHAR(20) = NULL,
    @IsActive BIT,
    @IsDeleted BIT,
    @CreatedBy INT,
    @CreatedDate DATETIME,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @Image VARCHAR(500) = NULL,
    @Gender INT,
    @DOB DATETIME = NULL,
    @Age INT,
    @Address1 NVARCHAR(500) = NULL,
    @Address2 NVARCHAR(500) = NULL,
    @Country INT,
    @State INT,
    @City INT,
    @PostalCode INT,
    @PinNo INT)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[UserMaster]
    SET     [Code] = @Code,
    [Name] = @Name,
    [Remarks] = @Remarks,
    [IsAdmin] = @IsAdmin,
    [Email] = @Email,
    [Password] = @Password,
    [ContactNo] = @ContactNo,
    [IsActive] = @IsActive,
    [IsDeleted] = @IsDeleted,
    [CreatedBy] = @CreatedBy,
    [CreatedDate] = @CreatedDate,
    [UpdatedBy] = @UpdatedBy,
    [UpdatedDate] = @UpdatedDate,
    [Image] = @Image,
    [Gender] = @Gender,
    [DOB] = @DOB,
    [Age] = @Age,
    [Address1] = @Address1,
    [Address2] = @Address2,
    [Country] = @Country,
    [State] = @State,
    [City] = @City,
    [PostalCode] = @PostalCode,
    [PinNo] = @PinNo
    WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'SP_GetUserMasterById', N'P') IS NOT NULL DROP PROCEDURE SP_GetUserMasterById;
GO
CREATE PROCEDURE SP_GetUserMasterById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[UserMaster] WHERE [Id] = @Id;
END
GO
IF OBJECT_ID(N'GetUserMaster', N'P') IS NOT NULL DROP PROCEDURE GetUserMaster;
GO
CREATE PROCEDURE GetUserMaster
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[UserMaster] WHERE [IsDeleted] = 0;
END
GO
IF OBJECT_ID(N'DeleteUserMasterById', N'P') IS NOT NULL DROP PROCEDURE DeleteUserMasterById;
GO
CREATE PROCEDURE DeleteUserMasterById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[UserMaster] SET [IsDeleted] = 1 WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'ActiveInActiveUserMasterById', N'P') IS NOT NULL DROP PROCEDURE ActiveInActiveUserMasterById;
GO
CREATE PROCEDURE ActiveInActiveUserMasterById
(
    @Id INT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[UserMaster] SET [IsActive] = @IsActive WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
-- Procedures for UserRoleMapping
IF OBJECT_ID(N'SP_CreateUserRoleMapping', N'P') IS NOT NULL DROP PROCEDURE SP_CreateUserRoleMapping;
GO
CREATE PROCEDURE SP_CreateUserRoleMapping
(    @UserId INT,
    @RoleId INT,
    @IsActive BIT,
    @IsDeleted BIT,
    @CreatedBy INT,
    @CreatedDate DATETIME = NULL,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[UserRoleMapping] ([UserId], [RoleId], [IsActive], [IsDeleted], [CreatedBy], [CreatedDate], [UpdatedBy], [UpdatedDate])
    VALUES (@UserId, @RoleId, @IsActive, @IsDeleted, @CreatedBy, COALESCE(@CreatedDate, GETDATE()), @UpdatedBy, @UpdatedDate);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO
IF OBJECT_ID(N'SP_UpdateUserRoleMapping', N'P') IS NOT NULL DROP PROCEDURE SP_UpdateUserRoleMapping;
GO
CREATE PROCEDURE SP_UpdateUserRoleMapping
(    @Id INT,
    @UserId INT,
    @RoleId INT,
    @IsActive BIT,
    @IsDeleted BIT,
    @CreatedBy INT,
    @CreatedDate DATETIME = NULL,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[UserRoleMapping]
    SET     [UserId] = @UserId,
    [RoleId] = @RoleId,
    [IsActive] = @IsActive,
    [IsDeleted] = @IsDeleted,
    [CreatedBy] = @CreatedBy,
    [CreatedDate] = @CreatedDate,
    [UpdatedBy] = @UpdatedBy,
    [UpdatedDate] = @UpdatedDate
    WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'SP_GetUserRoleMappingById', N'P') IS NOT NULL DROP PROCEDURE SP_GetUserRoleMappingById;
GO
CREATE PROCEDURE SP_GetUserRoleMappingById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[UserRoleMapping] WHERE [Id] = @Id;
END
GO
IF OBJECT_ID(N'GetUserRoleMapping', N'P') IS NOT NULL DROP PROCEDURE GetUserRoleMapping;
GO
CREATE PROCEDURE GetUserRoleMapping
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[UserRoleMapping] WHERE [IsDeleted] = 0;
END
GO
IF OBJECT_ID(N'DeleteUserRoleMappingById', N'P') IS NOT NULL DROP PROCEDURE DeleteUserRoleMappingById;
GO
CREATE PROCEDURE DeleteUserRoleMappingById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[UserRoleMapping] SET [IsDeleted] = 1 WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'ActiveInActiveUserRoleMappingById', N'P') IS NOT NULL DROP PROCEDURE ActiveInActiveUserRoleMappingById;
GO
CREATE PROCEDURE ActiveInActiveUserRoleMappingById
(
    @Id INT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[UserRoleMapping] SET [IsActive] = @IsActive WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
-- Procedures for UtensilMaster
IF OBJECT_ID(N'SP_CreateUtensilMaster', N'P') IS NOT NULL DROP PROCEDURE SP_CreateUtensilMaster;
GO
CREATE PROCEDURE SP_CreateUtensilMaster
(    @UtensilName NVARCHAR(100),
    @UnitType VARCHAR(20),
    @Price DECIMAL(18, 2),
    @DepositAmount DECIMAL(18, 2),
    @IsDeleted BIT,
    @CreatedBy INT,
    @CreatedDate DATETIME,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @IsActive BIT = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[UtensilMaster] ([UtensilName], [UnitType], [Price], [DepositAmount], [IsDeleted], [CreatedBy], [CreatedDate], [UpdatedBy], [UpdatedDate], [IsActive])
    VALUES (@UtensilName, @UnitType, @Price, @DepositAmount, @IsDeleted, @CreatedBy, COALESCE(@CreatedDate, GETDATE()), @UpdatedBy, @UpdatedDate, @IsActive);
    SELECT SCOPE_IDENTITY() AS NewId;
END
GO
IF OBJECT_ID(N'SP_UpdateUtensilMaster', N'P') IS NOT NULL DROP PROCEDURE SP_UpdateUtensilMaster;
GO
CREATE PROCEDURE SP_UpdateUtensilMaster
(    @Id INT,
    @UtensilName NVARCHAR(100),
    @UnitType VARCHAR(20),
    @Price DECIMAL(18, 2),
    @DepositAmount DECIMAL(18, 2),
    @IsDeleted BIT,
    @CreatedBy INT,
    @CreatedDate DATETIME,
    @UpdatedBy INT,
    @UpdatedDate DATETIME = NULL,
    @IsActive BIT = NULL)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[UtensilMaster]
    SET     [UtensilName] = @UtensilName,
    [UnitType] = @UnitType,
    [Price] = @Price,
    [DepositAmount] = @DepositAmount,
    [IsDeleted] = @IsDeleted,
    [CreatedBy] = @CreatedBy,
    [CreatedDate] = @CreatedDate,
    [UpdatedBy] = @UpdatedBy,
    [UpdatedDate] = @UpdatedDate,
    [IsActive] = @IsActive
    WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'SP_GetUtensilMasterById', N'P') IS NOT NULL DROP PROCEDURE SP_GetUtensilMasterById;
GO
CREATE PROCEDURE SP_GetUtensilMasterById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[UtensilMaster] WHERE [Id] = @Id;
END
GO
IF OBJECT_ID(N'GetUtensilMaster', N'P') IS NOT NULL DROP PROCEDURE GetUtensilMaster;
GO
CREATE PROCEDURE GetUtensilMaster
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM [dbo].[UtensilMaster] WHERE [IsDeleted] = 0;
END
GO
IF OBJECT_ID(N'DeleteUtensilMasterById', N'P') IS NOT NULL DROP PROCEDURE DeleteUtensilMasterById;
GO
CREATE PROCEDURE DeleteUtensilMasterById
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[UtensilMaster] SET [IsDeleted] = 1 WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
IF OBJECT_ID(N'ActiveInActiveUtensilMasterById', N'P') IS NOT NULL DROP PROCEDURE ActiveInActiveUtensilMasterById;
GO
CREATE PROCEDURE ActiveInActiveUtensilMasterById
(
    @Id INT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE [dbo].[UtensilMaster] SET [IsActive] = @IsActive WHERE [Id] = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
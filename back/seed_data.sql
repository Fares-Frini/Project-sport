-- SQL Seed Script for ParaPharmaOLTP
-- Run this in SQL Server Management Studio on your ParaPharmaOLTP database

BEGIN TRANSACTION;

-- 1. Seed Categories
IF NOT EXISTS (SELECT 1 FROM [Categories])
BEGIN
    INSERT INTO [Categories] ([Name], [Description])
    VALUES 
    (N'Vélos', N'Vélos de route et de montagne'),
    (N'Accessoires', N'Casques, gants, pompes'),
    (N'Vêtements', N'Maillots, shorts, vestes');
END

-- 2. Seed SubCategories
-- We fetch CategoryIds dynamically
IF NOT EXISTS (SELECT 1 FROM [SubCategories])
BEGIN
    DECLARE @VelosId INT = (SELECT Id FROM [Categories] WHERE [Name] = N'Vélos');
    DECLARE @AccId INT = (SELECT Id FROM [Categories] WHERE [Name] = N'Accessoires');
    DECLARE @VetId INT = (SELECT Id FROM [Categories] WHERE [Name] = N'Vêtements');

    INSERT INTO [SubCategories] ([Name], [Description], [CategoryId])
    VALUES 
    (N'Vélos de Route', N'Vélos légers pour la route', @VelosId),
    (N'VTT', N'Vélos tout terrain', @VelosId),
    (N'Casques', N'Protection pour cyclistes', @AccId),
    (N'Maillots', N'Vêtements techniques', @VetId);
END

-- 3. Seed Products
IF NOT EXISTS (SELECT 1 FROM [Products])
BEGIN
    DECLARE @RoadId INT = (SELECT Id FROM [SubCategories] WHERE [Name] = N'Vélos de Route');
    DECLARE @VttId INT = (SELECT Id FROM [SubCategories] WHERE [Name] = N'VTT');
    DECLARE @HelmetId INT = (SELECT Id FROM [SubCategories] WHERE [Name] = N'Casques');
    DECLARE @JerseyId INT = (SELECT Id FROM [SubCategories] WHERE [Name] = N'Maillots');
    
    DECLARE @CatVelosId INT = (SELECT CategoryId FROM [SubCategories] WHERE Id = @RoadId);
    DECLARE @CatAccId INT = (SELECT CategoryId FROM [SubCategories] WHERE Id = @HelmetId);
    DECLARE @CatVetId INT = (SELECT CategoryId FROM [SubCategories] WHERE Id = @JerseyId);

    INSERT INTO [Products] ([Name], [Description], [Price], [StockQuantity], [CategoryId], [SubCategoryId])
    VALUES 
    (N'Vélo de Course Premium', N'Vélo ultra-léger en carbone', 2500.00, 10, @CatVelosId, @RoadId),
    (N'VTT All-Mountain', N'Suspension intégrale pour terrains difficiles', 1800.00, 15, @CatVelosId, @VttId),
    (N'Casque de Sécurité', N'Protection maximale certifiée CE', 85.00, 50, @CatAccId, @HelmetId),
    (N'Maillots Respirant', N'Tissu technique évacuant la transpiration', 45.00, 100, @CatVetId, @JerseyId);
END

COMMIT;
GO

-- SQL Fix for missing SubCategories table and relationship
-- Run this in SQL Server Management Studio on your ParaPharmaOLTP database

BEGIN TRANSACTION;

-- 1. Create SubCategories table
IF OBJECT_ID(N'[SubCategories]') IS NULL
BEGIN
    CREATE TABLE [SubCategories] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(100) NOT NULL,
        [Description] nvarchar(500) NULL,
        [CategoryId] int NOT NULL,
        CONSTRAINT [PK_SubCategories] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_SubCategories_Categories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [Categories] ([Id]) ON DELETE NO ACTION
    );
END;

-- 2. Add SubCategoryId to Products table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Products]') AND name = N'SubCategoryId')
BEGIN
    ALTER TABLE [Products] ADD [SubCategoryId] int NULL;
END;

-- 3. Add Foreign Key for SubCategoryId if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = N'FK_Products_SubCategories_SubCategoryId')
BEGIN
    ALTER TABLE [Products] ADD CONSTRAINT [FK_Products_SubCategories_SubCategoryId] 
    FOREIGN KEY ([SubCategoryId]) REFERENCES [SubCategories] ([Id]) ON DELETE SET NULL;
END;

-- 4. Create Indexes for better performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_SubCategories_CategoryId' AND object_id = OBJECT_ID(N'[SubCategories]'))
BEGIN
    CREATE INDEX [IX_SubCategories_CategoryId] ON [SubCategories] ([CategoryId]);
END;

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_Products_SubCategoryId' AND object_id = OBJECT_ID(N'[Products]'))
BEGIN
    CREATE INDEX [IX_Products_SubCategoryId] ON [Products] ([SubCategoryId]);
END;

COMMIT;
GO

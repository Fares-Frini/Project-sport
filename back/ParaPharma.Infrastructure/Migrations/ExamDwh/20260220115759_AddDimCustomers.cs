using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ParaPharma.Infrastructure.Migrations.ExamDwh
{
    /// <inheritdoc />
    public partial class AddDimCustomers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DimCreditCards",
                columns: table => new
                {
                    CreditCardID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CardType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CardNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExpMonth = table.Column<byte>(type: "tinyint", nullable: false),
                    ExpYear = table.Column<short>(type: "smallint", nullable: false),
                    ModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DimCreditCards", x => x.CreditCardID);
                });

            migrationBuilder.CreateTable(
                name: "DimCustomers",
                columns: table => new
                {
                    CustomerKey = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DimCustomers", x => x.CustomerKey);
                });

            migrationBuilder.CreateTable(
                name: "DimPersons",
                columns: table => new
                {
                    BusinessEntityID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PersonType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NameStyle = table.Column<bool>(type: "bit", nullable: true),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MiddleName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmailPromotion = table.Column<int>(type: "int", nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DimPersons", x => x.BusinessEntityID);
                });

            migrationBuilder.CreateTable(
                name: "DimProductCategory",
                columns: table => new
                {
                    ProductCategoryID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    rowguid = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DimProductCategory", x => x.ProductCategoryID);
                });

            migrationBuilder.CreateTable(
                name: "DimSalesPerson",
                columns: table => new
                {
                    SalesPersonID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SalesQuota = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Bonus = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    CommissionPct = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    SalesYTD = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    SalesLastYear = table.Column<decimal>(type: "decimal(18,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DimSalesPerson", x => x.SalesPersonID);
                });

            migrationBuilder.CreateTable(
                name: "DimSalesTerritory",
                columns: table => new
                {
                    TerritoryID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CountryRegionCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Group = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SalesYTD = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    SalesLastYear = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    CostYTD = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    CostLastYear = table.Column<decimal>(type: "decimal(18,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DimSalesTerritory", x => x.TerritoryID);
                });

            migrationBuilder.CreateTable(
                name: "DimProductSubCategory",
                columns: table => new
                {
                    ProductSubcategoryID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductCategoryID = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DimProductSubCategory", x => x.ProductSubcategoryID);
                    table.ForeignKey(
                        name: "FK_DimProductSubCategory_DimProductCategory_ProductCategoryID",
                        column: x => x.ProductCategoryID,
                        principalTable: "DimProductCategory",
                        principalColumn: "ProductCategoryID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DimProduct",
                columns: table => new
                {
                    ProductID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProductNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MakeFlag = table.Column<bool>(type: "bit", nullable: true),
                    FinishedGoodsFlag = table.Column<bool>(type: "bit", nullable: true),
                    Color = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SafetyStockLevel = table.Column<short>(type: "smallint", nullable: true),
                    ReorderPoint = table.Column<short>(type: "smallint", nullable: true),
                    StandardCost = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    ListPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Size = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SizeUnitMeasureCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    WeightUnitMeasureCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProductSubcategoryID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DimProduct", x => x.ProductID);
                    table.ForeignKey(
                        name: "FK_DimProduct_DimProductSubCategory_ProductSubcategoryID",
                        column: x => x.ProductSubcategoryID,
                        principalTable: "DimProductSubCategory",
                        principalColumn: "ProductSubcategoryID");
                });

            migrationBuilder.CreateTable(
                name: "FactSale",
                columns: table => new
                {
                    SalesOrderID = table.Column<int>(type: "int", nullable: false),
                    SalesOrderDetailID = table.Column<int>(type: "int", nullable: false),
                    CarrierTrackingNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OrderQty = table.Column<short>(type: "smallint", nullable: false),
                    ProductID = table.Column<int>(type: "int", nullable: false),
                    SpecialOfferID = table.Column<int>(type: "int", nullable: true),
                    UnitPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    UnitPriceDiscount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    LineTotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    RevisionNumber = table.Column<byte>(type: "tinyint", nullable: false),
                    OrderDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TerritoryID = table.Column<int>(type: "int", nullable: true),
                    SalesPersonID = table.Column<int>(type: "int", nullable: true),
                    CreditCardID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FactSale", x => new { x.SalesOrderID, x.SalesOrderDetailID });
                    table.ForeignKey(
                        name: "FK_FactSale_DimCreditCards_CreditCardID",
                        column: x => x.CreditCardID,
                        principalTable: "DimCreditCards",
                        principalColumn: "CreditCardID");
                    table.ForeignKey(
                        name: "FK_FactSale_DimProduct_ProductID",
                        column: x => x.ProductID,
                        principalTable: "DimProduct",
                        principalColumn: "ProductID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FactSale_DimSalesPerson_SalesPersonID",
                        column: x => x.SalesPersonID,
                        principalTable: "DimSalesPerson",
                        principalColumn: "SalesPersonID");
                    table.ForeignKey(
                        name: "FK_FactSale_DimSalesTerritory_TerritoryID",
                        column: x => x.TerritoryID,
                        principalTable: "DimSalesTerritory",
                        principalColumn: "TerritoryID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_DimProduct_ProductSubcategoryID",
                table: "DimProduct",
                column: "ProductSubcategoryID");

            migrationBuilder.CreateIndex(
                name: "IX_DimProductSubCategory_ProductCategoryID",
                table: "DimProductSubCategory",
                column: "ProductCategoryID");

            migrationBuilder.CreateIndex(
                name: "IX_FactSale_CreditCardID",
                table: "FactSale",
                column: "CreditCardID");

            migrationBuilder.CreateIndex(
                name: "IX_FactSale_ProductID",
                table: "FactSale",
                column: "ProductID");

            migrationBuilder.CreateIndex(
                name: "IX_FactSale_SalesPersonID",
                table: "FactSale",
                column: "SalesPersonID");

            migrationBuilder.CreateIndex(
                name: "IX_FactSale_TerritoryID",
                table: "FactSale",
                column: "TerritoryID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DimCustomers");

            migrationBuilder.DropTable(
                name: "DimPersons");

            migrationBuilder.DropTable(
                name: "FactSale");

            migrationBuilder.DropTable(
                name: "DimCreditCards");

            migrationBuilder.DropTable(
                name: "DimProduct");

            migrationBuilder.DropTable(
                name: "DimSalesPerson");

            migrationBuilder.DropTable(
                name: "DimSalesTerritory");

            migrationBuilder.DropTable(
                name: "DimProductSubCategory");

            migrationBuilder.DropTable(
                name: "DimProductCategory");
        }
    }
}

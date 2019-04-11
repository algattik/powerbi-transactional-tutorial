-- Create view listing Products with their image as data URL (for Power BI)

CREATE VIEW SalesLT.ProductCatalog
AS
    select p.*, concat('data:image/jpeg;base64, ',s) as ThumbNailImage
    from SalesLT.Product p
cross apply (select ThumbNailPhoto as '*'
        for xml path('')) T (s)
GO

-- Create sequences to generate new PK values for sales order tables

declare @nextValue int
select @nextValue = max(SalesOrderId)+1
FROM SalesLT.SalesOrderHeader
declare @s nvarchar(4000)
set @s = N'
CREATE SEQUENCE SalesOrderID_seq AS INTEGER  
START WITH ' + cast(@nextValue as nvarchar) + '
INCREMENT BY 1  
NO CYCLE;'
EXEC (@s);

select @nextValue = max(SalesOrderDetailID)+1
FROM SalesLT.SalesOrderDetail
set @s = N'
CREATE SEQUENCE SalesOrderDetailID_seq AS INTEGER  
START WITH ' + cast(@nextValue as nvarchar) + '
INCREMENT BY 1  
NO CYCLE;'
EXEC (@s);

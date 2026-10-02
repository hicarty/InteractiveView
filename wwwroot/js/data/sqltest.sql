-- USE InteractAmplifiers;
Create SCHEMA Demo 
Go

if OBJECT_ID('Demo.Users', 'U') is not NULL
DROP TABLE Demo.Users
GO

insert into Demo.Users
VALUES
('DSL','20'),
('JCM','45')
GO

SELECT * FROM InteractiveAmplifiers;
GO
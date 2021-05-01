/* Task 2*/
/*PROPERTY TABLE*/
INSERT INTO property (PROPERTY_ID, STREET_ADDRESS, SUBURB, STATE, STATUS, TYPE, LIST_PRICE, DATE_CREATED, DATE_EDITED) VALUES (1, "Balmort street", "Southend", "VIC","listed","house",7000,"23/04/2021", "23/04/2021")

INSERT INTO property (STREET_ADDRESS, SUBURB, STATE, STATUS, TYPE, LIST_PRICE, DATE_CREATED, DATE_EDITED) VALUES ("Walmart street", "Newtown", "NSW","under contract","land",8000,"23/04/2021", "23/04/2021")

INSERT INTO property (STREET_ADDRESS, SUBURB, STATE, STATUS, TYPE, LIST_PRICE, DATE_CREATED, DATE_EDITED) VALUES ("Osborne street", "Newtown", "VIC","listed","townhouse",12000,"23/04/2021", "23/04/2021")

INSERT INTO property (STREET_ADDRESS, SUBURB, STATE, STATUS, TYPE, LIST_PRICE, DATE_CREATED, DATE_EDITED) VALUES ("lakeside street", "Oldtown", "SA","under contract","unit",10000,"23/04/2021", "23/04/2021")

INSERT INTO property (STREET_ADDRESS, SUBURB, STATE, STATUS, TYPE, LIST_PRICE, DATE_CREATED, DATE_EDITED) VALUES ("Caldeck street", "Tyson", "NSW","settled","land",3000,"23/04/2021", "23/04/2021")


/*VENDOR TABLE*/
INSERT INTO vendor (NAME, GENDER, AGE) VALUES ("James John", "Male", 32)

INSERT INTO vendor (NAME, GENDER, AGE) VALUES ("Jane Ludrow", "Female", 27)

INSERT INTO vendor (NAME, GENDER, AGE) VALUES ("Cris Rock", "Male", 41)

INSERT INTO vendor (NAME, GENDER, AGE) VALUES ("Zayn Rashid", "Male", 34)

INSERT INTO vendor (NAME, GENDER, AGE) VALUES ("Lela Starr", "Female", 28)


/*AGENT*/
INSERT INTO agent (AGENT_ID, NAME, GENDER, AGE) VALUES (1, "Tommy Lee", "Male", 25)

INSERT INTO agent (NAME, GENDER, AGE) VALUES ("Derek knowles", "Male", 29)

INSERT INTO agent (NAME, GENDER, AGE) VALUES ("Cris Bucker", "Male", 24)

INSERT INTO agent (NAME, GENDER, AGE) VALUES ("Mary Jane", "Female", 28)

INSERT INTO agent (NAME, GENDER, AGE) VALUES ("Gina Kudrow", "Female", 39)


/*PROPERTY_VENDOR*/
INSERT INTO property_vendor (PROPERTY_ID, VENDOR_ID) VALUES (1, 1)

INSERT INTO property_vendor (PROPERTY_ID, VENDOR_ID) VALUES (2, 2)

INSERT INTO property_vendor (PROPERTY_ID, VENDOR_ID) VALUES (3, 3)


/*PURCHASE*/
INSERT INTO purchase (ID, PROPERTY_ID, AGENT_ID, AUCTION, SALE_PRICE, CONTRACT_DATE, SETTLEMENT_DATE) VALUES (1, 1, 1, 0,6000,"2/7/2020", "2/2/2021")

INSERT INTO purchase (ID, PROPERTY_ID, AGENT_ID, AUCTION, SALE_PRICE, CONTRACT_DATE, SETTLEMENT_DATE) VALUES (2, 2, 2, 1,5000,"28/5/2020", "11/11/2020")

INSERT INTO purchase (ID, PROPERTY_ID, AGENT_ID, AUCTION, SALE_PRICE, CONTRACT_DATE, SETTLEMENT_DATE) VALUES (3, 3, 3, 0,117000,"28/5/2020", "11/11/2020")


/* Task 4 */
UPDATE purchase SET AUCTION = 1 WHERE PROPERTY_ID IN (SELECT PROPERTY_ID FROM property WHERE STATE="VIC")

/* Task 8 */
DECLARE @StartDate DATETIME, @EndDate DATETIME    
SET @StartDate = DATEADD(mm, DATEDIFF(mm, 0, getdate()) - 1, 0)    
SET @EndDate = dateadd(dd, -1, DATEADD(mm, 1, @StartDate))


DECLARE @StartDate DATETIME, @EndDate DATETIME    
SET @StartDate = DATEADD(mm, DATEDIFF(mm, 0, getdate()) - 1, 0)    
SET @EndDate = dateadd(dd, -1, DATEADD(mm, 1, @StartDate))
 
/*a*/
SELECT STATE as "State", AVG(*) as "Average sale price" FROM property WHERE (STATUS="under contract") AND  (DATE_CREATED BETWEEN @StartDate AND @EndDate) GROUP BY STATE ORDER BY "Average sale price" DESC

/* b */
SELECT STATE as "State", TYPE as "Type", AVG(*) as "Average sale price" FROM property WHERE (STATUS="under contract") AND  (DATE_CREATED BETWEEN @StartDate AND @EndDate) GROUP BY TYPE ORDER BY "Average sale price" DESC

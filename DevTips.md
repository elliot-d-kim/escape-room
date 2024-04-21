# Handy things to know as a dev

just handy things i'm learning as a dev tbh - elliot

## PostgreSQL

* Generate 1000 rows of toy data with [Mockaroo](mockaroo.com)

### psql

* `sudo -u postgres psql` to login as superuser
* `\i /path/filename.sql` to execute SQL command in a file

### Sequelize and `sequelize-cli`

### SQL

Source: [freeCodeCamp.org YouTube course](https://youtu.be/qw--VYLpxG4?si=J_h2nYpREXhtfOiA)
* Left off at unique constraints ([2:40:55](https://www.youtube.com/watch?v=qw--VYLpxG4&t=9655s))


`SELECT`, `FROM`, `WHERE`, `BETWEEN`, `DATE` format, `AND`, `OR`, `IN`, comparison operators:

```sql
SELECT * FROM my_transactions
WHERE transaction_date BETWEEN DATE `1999-12-24` AND `1999-12-31`
AND (category IN ('Dining', 'Entertainment') OR transaction_value > 50);
```

* Wildcards: `LIKE`
    * `SELECT * FROM my_transactions WHERE merchant LIKE '%delta%'`
    * Specify number of characters: `SELECT * FROM my_transactions WHERE transaction_date LIKE DATE '19__-__-__'`
    * `ILIKE`: not case-sensitive

* `ORDER BY`
    * *Ascending* by default
    * Descending: `ORDER BY my_column DESC`
    * Null values *follow* alphanumeric values: A > Z > null

* Unique values: `SELECT DISTINCT * FROM my_table`

* `GROUP BY`
    * `SELECT category, COUNT(*) FROM my_transactions GROUP BY category`
    * Group transactions by category and retrieve how counts per category

* `GROUP BY HAVING`
    * `SELECT category, SUM(transaction_value) FROM my_transactions GROUP BY category HAVING SUM(transaction_value) >= 50`
    * Group transactions by category, retrieve sums of value per category, *and apply filter*

* Aggregate functions: produces single output from many rows of data
    * `COUNT(*)`, `SUM(*)`, `MAX(*)`, `MIN(*)`, etc.
    * `SELECT MAX(transaction_value) FROM my_transactions`

* Arithmetic operations
    * `SELECT some_number + some_other_number`: returns result
    * `SELECT make, model, price, price * 0.9 FROM car`: calculate 10% discount
    * `SELECT make, model, price, price * 0.9 AS discounted_price FROM car`: add alias for new column

* Comparison operators
    * `<>`: not equal
    * `SELECT something = something_else`: returns `t`(rue) or `f`(alse)

* Fallback values for null: `COALESCE()`
    * `SELECT COALESCE(email, 'Email not provided') FROM user`

* Prevent null division errors: `NULLIF()`
    * Definition
        * if `a` == `b`, `NULLIF(a, b)` = null
        * if `a` != `b`, `NULLIF(a, b)` = `a`
    * Implementation: `SELECT COALESCE(x / NULLIF(y, 0), 0) FROM my_table`
        * Goal: prevent `x / y` causing `division by 0` error when `y = 0`
        * If `y == 0`,
            * `NULLIF(y, 0)` ==
            * `NULLIF(0, 0)` ==
            * null
        * If `NULLIF(y, 0)` == null,
            * `COALESCE(x / NULLIF(y, 0), 0)` == 
            * `COALESCE(x / null, 0)` ==
            * `COALESCE(null, 0)` ==
            * 0 (not `division by 0` error!)

* `LIMIT`, `OFFSET`, and `FETCH`
    * `SELECT * FROM my_table LIMIT 10`: first 10
    * `SELECT * FROM my_table OFFSET 5 LIMIT 10`: first 10 *after skipping 5*
    * `SELECT * FROM my_table OFFSET 5 FETCH FIRST 10 ROWS ONLY`: equivalent, using standard SQL
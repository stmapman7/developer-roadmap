# SQL Injection

SQL Injection is a crucial security topic in PHP. It is a code injection technique where an attacker may slip shady SQL code within a query. This attack can lead to data manipulation or loss and even compromise your database. To prevent this, PHP encourages the use of prepared statements with either the MySQLi or PDO extension. An example of a vulnerable code snippet would be: `$unsafe_variable = $_POST['user_input']; mysqli_query($link, "INSERT INTO `table` (`column`) VALUES ('$unsafe_variable')");`. Stop falling prey to injections by utilizing prepared statement like so: `$stmt = $pdo->prepare('INSERT INTO `table` (`column`) VALUES (?)'); $stmt->execute([$safe_variable]);`.

Visit the following resources to learn more:

- [@official@SQL Injection](https://www.php.net/manual/en/security.database.sql-injection.php)

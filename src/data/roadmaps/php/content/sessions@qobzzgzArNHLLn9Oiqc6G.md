# Sessions

Sessions provide a way to preserve certain data across subsequent accesses. Unlike a cookie, the information is not stored on the user's computer but on the server. This is particularly useful when you want to store information related to a specific user's session on your platform, like user login status or user preferences. When a session is started in PHP, a unique session ID is generated for the user. This ID is then passed and tracked through a cookie in the user's browser. To start a session, you would use the PHP function session_start(). To save a value in a session, you'd use the $_SESSION superglobal array. For example, `$_SESSION['username'] = 'John';` assigns 'John' to the session variable 'username'.

Visit the following resources to learn more:

- [@official@Sessions](https://www.php.net/manual/en/book.session.php)

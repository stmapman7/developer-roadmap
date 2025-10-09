# Cookies

Cookies are a crucial part of state management in PHP. They enable storage of data on the user's browser, which can then be sent back to the server with each subsequent request. This permits persistent data between different pages or visits. To set a cookie in PHP, you can use the `setcookie()` function. For example, `setcookie("user", "John Doe", time() + (86400 * 30), "/");` will set a cookie named "user" with the value "John Doe", that will expire after 30 days. The cookie will be available across the entire website due to the path parameter set as `/`. To retrieve the value of the cookie, you can use the global `$_COOKIE` array: `echo $_COOKIE["user"];`.

Visit the following resources to learn more:

- [@official@Cookies](https://www.php.net/manual/en/features.cookies.php)

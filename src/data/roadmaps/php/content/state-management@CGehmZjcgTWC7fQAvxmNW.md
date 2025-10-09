# State Management

State management in PHP involves keeping track of user activity in the application, as HTTP protocol doesn't store earlier interactions. Typically, these data involve user details such as login info, form input data, etc. A prevalent method of state management in PHP is through sessions and cookies. Sessions work by keeping the state data on the server side and a session identifier on the client side. Note, session's info remains active until the user's session expires. On the other hand, cookies store data on the client side, having an expiry date or until the user deletes them. Here's how to set a cookie in PHP: `setcookie("test_cookie", "test", time() + 3600, '/');`. To access sessions, use the `_SESSION` superglobal array: `$_SESSION["favcolor"] = "green";`.

Visit the following resources to learn more:

- [@official@setcookie](https://php.net/manual/en/function.setcookie.php)

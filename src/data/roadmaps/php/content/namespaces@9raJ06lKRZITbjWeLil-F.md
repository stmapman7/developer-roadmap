# Namespaces

Namespaces in PHP are a way of encapsulating items so that name collisions won't occur. When your code expands, there could be a situation where classes, interfaces, functions, or constants might have the same name, causing confusion or errors. Namespaces come to the rescue by grouping these items. You declare a namespace using the keyword 'namespace' at the top of your PHP file. Every class, function, or variable under this declaration is a part of the namespace until another namespace is declared, or the file ends. It's like creating a new room in your house solely for storing sports equipment. This makes it easier to find your tennis racket, as you won't have to rummage around in a closet full of mixed items. 

Here's a quick example: 

```php
namespace MyNamespace\SubNamespace; 
function displayGreeting() {
     echo 'Hello World!'; 
} 
```

Visit the following resources to learn more:

- [@official@Namespaces](https://www.php.net/manual/en/language.namespaces.php)
# Pest

Pest is an innovative and elegant testing framework for PHP. Think of it as a stylish and streamlined alternative to PHPUnit. Pest makes testing your PHP code a breeze by enabling expressive and flexible test cases. It provides higher-level abstractions to minimize boilerplate code without disrupting the ability to integrate traditional PHPUnit tests. For example, using Pest can make a test case as simple as writing a closure:

```php
it('has homepage', function () {
    $response = get('/');
    $response->assertStatus(200);
});
```

Visit the following resources to learn more:

- [@official@Pest](https://pestphp.com/)
- [@official@Pest Installation](https://pestphp.com/docs/installation)

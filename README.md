# tutorial.js

The best step-by-step feature introduction for your web sites, that's a promise! 

## How to use it

tutorial.js can be added your website in three simple steps: 

1. Include `tutorial.js` and `tutorial.css` (or the minified versions for production) in your page. 
```html
<link href="/path/to/styles/tutorial.min.css" rel="stylesheet" />
<script src="/path/to/tutorial.min.js"></script>
```
2. Create the steps of your tutorial, like this: 
```javascript
var steps = [
    {
        target: ".container .btn-large:first-child",
        html: "Hi, this is the very first step"
    }, {
        // another step
    }
];
```
3. Initialize the tutorial with these steps and call `start` method. 
```javascript
tutorial(steps).start();
```

**tutorial.js** itself does not require any configuration options, but you can customize each step to fulfill your needs. Find out more in the How it works section. 

For the full documentation and examples please visit [this site](https://xxxmatko.github.io/tutorial.js/).
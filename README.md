### 1. Difference between `getElementById`, `getElementsByClassName`, and `querySelector` / `querySelectorAll`

- **getElementById("id")** → finds **one single element** with that exact ID.
- **getElementsByClassName("class")** → finds **all elements** with that class. It gives you something like a list (HTMLCollection).
- **querySelector("selector")** → finds the **first element** that matches a CSS selector (like `.class`, `#id`, `div p`).
- **querySelectorAll("selector")** → finds **all elements** that match a CSS selector. It gives you a NodeList (kinda like an array).

---

### 2. How do you create and insert a new element into the DOM?

```js
let newDiv = document.createElement("div"); // create element
newDiv.textContent = "Hello World"; // add some text
document.body.appendChild(newDiv); // insert into page
```

You can also use `insertBefore` or `prepend` depending on where you want it.

---

### 3. What is Event Bubbling and how does it work?

Event bubbling means when you click on a child element, the event **starts from that element** and then goes **up through its parent elements** until it reaches the top (`document`).
Example: clicking a button inside a div will trigger the button’s event first, then the div’s, then body, etc.

---

### 4. What is Event Delegation in JavaScript? Why is it useful?

Event delegation is when we **don’t put event listeners on every child element**. Instead, we put **one listener on the parent**, and then check which child was clicked using `event.target`.
It’s useful because it **saves memory**, and it works even if new child elements are added later.

---

### 5. Difference between `preventDefault()` and `stopPropagation()`

- **preventDefault()** → stops the **default action** of an element. (example: stop a form from submitting).
- **stopPropagation()** → stops the event from **bubbling up** to parent elements.

They are often used together but they do different things.

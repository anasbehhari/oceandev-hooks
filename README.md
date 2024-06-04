# oceandev-hooks

A collection of custom React hooks.

## Installation

```sh
npm install oceandev-hooks
```
# Example of Usage

## `useScrollPosition`:

Here's an example of how to use the `useScrollPosition` hook in a React component.

```jsx
import React, { useRef } from 'react';
import { useScrollPosition } from 'oceandev-hooks';

function ScrollableComponent() {
  // Use the custom hook
  const [scrollPosition, scrollContainerRef, scrollTo, isAtBottom] = useScrollPosition();

  const handleScrollToTop = () => {
    scrollTo({ direction: 'top' });
  };

  const handleScrollToBottom = () => {
    scrollTo({ direction: 'bottom' });
  };

  return (
    <div ref={scrollContainerRef} style={{ height: '300px', overflowY: 'auto' }}>
      {/* Render your scrollable content here */}
      <div style={{ height: '1000px' }}>Scrollable Content</div>

      {/* Display scroll position */}
      <p>Scroll Position: {scrollPosition.y}</p>

      {/* Buttons to scroll to top and bottom */}
      <button onClick={handleScrollToTop}>Scroll to Top</button>
      <button onClick={handleScrollToBottom}>Scroll to Bottom</button>

      {/* Display if at bottom */}
      <p>{isAtBottom ? 'At Bottom' : 'Not at Bottom'}</p>
    </div>
  );
}

export default ScrollableComponent;
```
## `useClickOutside`:

Here's an example of how to use the `useClickOutside` hook in a React component.

```jsx
import React from 'react';
import useClickOutside from './useClickOutside';

function Dropdown() {
  // Use the custom hook
  const [isOpen, toggleOpen, elementRef, buttonRef] = useClickOutside(() => {
    console.log('Clicked outside!');
  });

  return (
    <div>
      <button ref={buttonRef} onClick={toggleOpen}>
        Toggle Dropdown
      </button>
      {isOpen && (
        <div ref={elementRef} style={{ border: '1px solid black', padding: '10px' }}>
          Dropdown Content
        </div>
      )}
    </div>
  );
}

export default Dropdown;
```
## `useCookie`
Here's an example of how to use the `useCookie` hook in a React component.

```jsx
import React, { useState } from 'react';
import useCookie from './useCookie';

function CookieComponent() {
  // Use the custom hook
  const [setCookie, getCookie, getCookies, deleteCookie] = useCookie('myCookie');

  const [inputValue, setInputValue] = useState('');

  const handleSave = () => {
    setCookie(inputValue);
  };

  const handleLoad = () => {
    const storedValue = getCookie();
    alert('Stored value: ' + storedValue);
  };

  const handleShowAll = () => {
    const allCookies = getCookies();
    console.log('All cookies:', allCookies);
  };

  const handleDelete = () => {
    deleteCookie();
    alert('Cookie deleted');
  };

  return (
    <div>
      <h1>useCookie Hook Example</h1>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleSave}>Save to Cookie</button>
      <button onClick={handleLoad}>Load from Cookie</button>
      <button onClick={handleShowAll}>Show all Cookies</button>
      <button onClick={handleDelete}>Delete Cookie</button>
    </div>
  );
}

export default CookieComponent;
```
## `useLocalStorage`

Here's an example of how to use the `useLocalStorage` hook in a React component.

```jsx
import React, { useState } from 'react';
import useLocalStorage from './useLocalStorage';

function LocalStorageComponent() {
  // Use the custom hook
  const [setItem, getItem, getItems, deleteItem] = useLocalStorage('myKey');

  const [inputValue, setInputValue] = useState('');

  const handleSave = () => {
    setItem(inputValue);
  };

  const handleLoad = () => {
    const storedValue = getItem();
    alert('Stored value: ' + storedValue);
  };

  const handleShowAll = () => {
    const allItems = getItems();
    console.log('All localStorage items:', allItems);
  };

  const handleDelete = () => {
    deleteItem();
    alert('Item deleted');
  };

  return (
    <div>
      <h1>useLocalStorage Hook Example</h1>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleSave}>Save to localStorage</button>
      <button onClick={handleLoad}>Load from localStorage</button>
      <button onClick={handleShowAll}>Show all localStorage items</button>
      <button onClick={handleDelete}>Delete Item from localStorage</button>
    </div>
  );
}

export default LocalStorageComponent;

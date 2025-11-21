/* Security & Anti-Inspect
   Protected by @simplykashu
*/

// 1. Block Right Click
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// 2. Block Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        return false;
    }

    // Ctrl+Shift+I (Inspect)
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73)) {
        e.preventDefault();
        return false;
    }

    // Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j' || e.keyCode === 74)) {
        e.preventDefault();
        return false;
    }

    // Ctrl+Shift+C (Element Selector)
    if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c' || e.keyCode === 67)) {
        e.preventDefault();
        return false;
    }

    // Ctrl+U (View Source)
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.keyCode === 85)) {
        e.preventDefault();
        return false;
    }
});

// 3. Console Clear/Warning loop
// This clears the console if they manage to open it and prints a warning
setInterval(() => {
    console.clear();
    console.log('%c STOP ', 'color: red; font-size: 100px; font-weight: bold; text-shadow: 2px 2px black;');
    console.log('%c looking at my code? - simplykashu', 'color: white; font-size: 20px;');
}, 2000);

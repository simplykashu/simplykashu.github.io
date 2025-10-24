// This code runs after the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    
    // Find all the tab buttons
    const tabs = document.querySelectorAll('.tab-btn');
    
    // Find all the content sections
    const tabContents = document.querySelectorAll('.tab-content');

    // Loop over each tab button and add a click listener
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            
            // Get the 'data-tab' value (e.g., "bio", "gaming")
            const targetId = tab.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);

            // --- Deactivate all tabs and hide all content ---
            
            // Remove 'active' state from all buttons
            tabs.forEach(t => {
                // CHANGE: Removed Tailwind 'active' classes
                t.classList.remove('text-zinc-50', 'border-b-zinc-50');
                // CHANGE: Added Tailwind 'inactive' classes
                t.classList.add('text-zinc-400', 'border-b-transparent');
                // CHANGE: Update ARIA for accessibility
                t.setAttribute('aria-selected', 'false');
            });
            
            // Hide all content sections
            tabContents.forEach(c => {
                // CHANGE: Use Tailwind's 'hidden' class
                c.classList.add('hidden');
            });

            // --- Activate the clicked tab and show its content ---
            
            // Add 'active' state to the button that was clicked
            // CHANGE: Use Tailwind 'active' classes
            tab.classList.remove('text-zinc-400', 'border-b-transparent');
            tab.classList.add('text-zinc-50', 'border-b-zinc-50');
            // CHANGE: Update ARIA for accessibility
            tab.setAttribute('aria-selected', 'true');
            
            // Show the content section that matches the target
            if (targetContent) {
                // CHANGE: Use Tailwind's 'hidden' class
                targetContent.classList.remove('hidden');
            }
        });
    });
});

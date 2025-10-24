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
            const target = tab.getAttribute('data-tab');

            // --- Deactivate all tabs and hide all content ---
            
            // Remove 'active' class from all buttons
            tabs.forEach(t => t.classList.remove('active'));
            
            // Hide all content sections
            tabContents.forEach(c => {
                c.style.display = 'none';
            });

            // --- Activate the clicked tab and show its content ---
            
            // Add 'active' class to the button that was clicked
            tab.classList.add('active');
            
            // Show the content section that matches the target
            document.getElementById(target).style.display = 'block';
        });
    });
});

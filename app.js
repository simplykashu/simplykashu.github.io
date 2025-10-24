// This code runs after the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    
    // Find all the tab buttons
    const tabs = document.querySelectorAll('.tab-btn');
    
    // Find all the content sections
    const tabContents = document.querySelectorAll('.tab-content');

    // Find all the social buttons that should trigger a tab (e.g., the 'wip' tab)
    const tabTriggers = document.querySelectorAll('[data-tab-trigger]');


    /**
     * Resets all tabs to inactive state and hides all content.
     */
    const deactivateAllTabs = () => {
        // Remove 'active' state from all buttons
        tabs.forEach(t => {
            // Set to inactive state (text-zinc-400, border-transparent)
            t.classList.remove('text-zinc-50', 'border-b-zinc-50');
            t.classList.add('text-zinc-400', 'border-b-transparent');
            t.setAttribute('aria-selected', 'false');
        });
        
        // Hide all content sections using Tailwind's 'hidden' class
        tabContents.forEach(c => {
            c.classList.add('hidden');
        });
    }

    /**
     * Activates a specific tab and shows its content.
     * @param {string} targetId - The data-tab ID of the tab to activate.
     */
    const activateTab = (targetId) => {
        const targetButton = document.querySelector(`.tab-btn[data-tab="${targetId}"]`);
        const targetContent = document.getElementById(targetId);

        if (targetButton && targetContent) {
            // Activate the button
            targetButton.classList.remove('text-zinc-400', 'border-b-transparent');
            targetButton.classList.add('text-zinc-50', 'border-b-zinc-50');
            targetButton.setAttribute('aria-selected', 'true');
            
            // Show the content
            targetContent.classList.remove('hidden');
        }
    }


    // 1. Setup click listeners for the main tab buttons
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            deactivateAllTabs();
            activateTab(target);
        });
    });

    // 2. Setup click listeners for social links that trigger a tab
    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const target = trigger.getAttribute('data-tab-trigger');
            
            // This is a special case: we show the target content (e.g., 'wip')
            // but we don't activate the 'wip' button unless it's explicitly clicked.
            // This prevents the hidden 'wip' button from popping up in the nav.
            deactivateAllTabs(); 
            
            // Activate only the content section for 'wip'
            const targetContent = document.getElementById(target);
            if (targetContent) {
                targetContent.classList.remove('hidden');
            }
        });
    });
});

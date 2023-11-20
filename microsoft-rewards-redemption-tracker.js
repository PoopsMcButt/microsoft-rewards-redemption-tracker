// ==UserScript==
// @name         microsoft rewards redemption tracker
// @namespace    pmcb
// @version      0.1
// @description  easily track which microsoft rewards codes you've redeemed
// @author       your son
// @match        https://rewards.bing.com/redeem/orderhistory*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    // Function to toggle the checkbox and store data
    function toggleCheckbox(checkbox, orderId, row) {
        // Check if the order has been used
        const isUsed = GM_getValue(orderId, false);

        // Toggle the checkbox
        checkbox.checked = !isUsed;

        // Update the stored data
        GM_setValue(orderId, !isUsed);

        // Log when the checkbox is checked and when it's saving the state
        console.log(`Checkbox for Order ${orderId} is checked: ${checkbox.checked}`);
        console.log(`Saving state for Order ${orderId}: ${!isUsed}`);

        // Update the row background color based on checkbox state
        updateRowColor(row, checkbox.checked);
    }

    // Function to update the row background color based on checkbox state
    function updateRowColor(row, isChecked) {
        const isEvenRow = Array.from(row.parentNode.children).indexOf(row) % 2 === 0;

        if (isChecked) {
            row.style.backgroundColor = isEvenRow ? 'rgba(255, 0, 0, 0.1)' : 'rgba(255, 0, 0, 0.05)'; // Faint red color
        } else {
            row.style.backgroundColor = isEvenRow ? '' : 'rgba(128, 128, 128, 0.05)'; // Original alternating colors
        }
    }

    // Function to add the script to each row
    function processRows() {
        console.log('[CODE TRACKER] processing rows..');

        const rows = document.querySelectorAll('#orderHistory tbody tr');

        rows.forEach(row => {
            const orderIdElement = row.querySelector('div.text-caption.spacer-12-top');
            if (orderIdElement) {
                const orderId = orderIdElement.textContent.trim().replace('Order No. ', '');

                // Create a new td element for the checkbox
                const checkboxCell = document.createElement('td');

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';

                checkbox.addEventListener('click', function() {
                    toggleCheckbox(checkbox, orderId, row);
                });

                // Set the initial state of the checkbox based on stored value
                const isUsed = GM_getValue(orderId, false);
                checkbox.checked = isUsed;

                // Update the row background color based on stored value
                updateRowColor(row, checkbox.checked);

                // Append the checkbox to the new td element
                checkboxCell.appendChild(checkbox);

                // Append the new td element to the end of the row
                row.appendChild(checkboxCell);
            }
        });
    }

    // Run the script when the entire page has loaded
    window.onload = processRows;
})();

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Buy Ticket Page scripts
    if (document.body.classList.contains('buy-page')) {
        initBuyTicketPage();
    }
});

// Initialize Buy Ticket Page
function initBuyTicketPage() {
    // Remove click handlers to allow default anchor navigation
    const routeButtons = document.querySelectorAll('.route-button');
    
    routeButtons.forEach(button => {
        button.replaceWith(button.cloneNode(true));
    });
}
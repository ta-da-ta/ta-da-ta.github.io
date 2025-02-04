document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.opacity = '0.7';
    });

    card.addEventListener('mouseleave', () => {
        card.style.opacity = '1';
    });
});

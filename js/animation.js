const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(!entry.isIntersecting) return;

        entry.target.classList.add('show');
    });
});

const hiddenElements = document.querySelectorAll('.animated-hidden');
hiddenElements.forEach(element => {
    observer.observe(element);
});

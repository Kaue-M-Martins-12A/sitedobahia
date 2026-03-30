document.addEventListener('DOMContentLoaded', () => {

    // Elements
    const openSidebarBtn = document.getElementById('openSidebar');
    const closeSidebarBtn = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const navLinks = document.querySelectorAll('.nav-links a');
    const screens = document.querySelectorAll('.screen');

    // Toggle Sidebar
    function toggleSidebar() {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    }

    openSidebarBtn.addEventListener('click', toggleSidebar);
    closeSidebarBtn.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);

    // Navigation Logic
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Get target screen
            const targetId = this.getAttribute('data-target');

            // Find current active string
            const currentActive = document.querySelector('.screen.active');

            // If it's already the target screen, do nothing
            if (currentActive && currentActive.id === targetId) return;

            // Update active styling on nav
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Function to swap screens
            const activateNewScreen = () => {
                screens.forEach(screen => {
                    screen.classList.remove('active', 'fading-out');

                    // If it's the target, activate it and reset its SVG animations
                    if (screen.id === targetId) {
                        screen.classList.add('active');

                        // Simple hack to re-trigger CSS animations on SVG elements when screen becomes active
                        const svgs = screen.querySelectorAll('.svg-anim');
                        svgs.forEach(svg => {
                            svg.style.animation = 'none';
                            svg.offsetHeight; /* trigger reflow */
                            svg.style.animation = null;
                        });

                        // Scroll to top of main content
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    }
                });
            };

            // Trigger fade out if there is an active screen, then switch
            if (currentActive) {
                currentActive.classList.add('fading-out');
                setTimeout(activateNewScreen, 300); // 300ms matches the CSS animation
            } else {
                activateNewScreen();
            }

            // On mobile/narrow screens, close the sidebar after clicking a link
            if (window.innerWidth <= 1024) {
                toggleSidebar();
            }
        });
    });

    // Custom helper for CTA buttons inside screens to act like nav links
    window.navigateTo = function (targetId) {
        const link = document.querySelector(`.nav-links a[data-target="${targetId}"]`);
        if (link) {
            link.click();
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeBtn = document.getElementById('themeBtn');
    const body = document.body;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeBtn.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        const icon = themeBtn.querySelector('i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    // Print Functionality
    const printBtn = document.getElementById('printBtn');
    printBtn.addEventListener('click', () => {
        window.print();
    });
    
    // Download PDF (placeholder - would need a PDF library in real implementation)
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.addEventListener('click', () => {
        alert('PDF download feature would be implemented with a PDF library like jsPDF or Puppeteer');
    });
    
    // Photo Upload Functionality
    const profileImage = document.getElementById('profileImage');
    const photoInput = document.getElementById('photoInput');
    const profilePhoto = document.querySelector('.profile-photo');
    
    profilePhoto.addEventListener('click', () => {
        photoInput.click();
    });
    
    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profileImage.src = e.target.result;
                // Save to localStorage for persistence
                localStorage.setItem('profileImage', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Load saved profile image
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
        profileImage.src = savedImage;
    }
    
    // Animate skill bars
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.getAttribute('data-width');
                    bar.style.setProperty('--target-width', width);
                    bar.style.width = width;
                    bar.classList.add('animate');
                }
            });
        }, { threshold: 0.5 });
        
        skillBars.forEach(bar => observer.observe(bar));
    }
    
    // Contact item click to copy
    document.querySelectorAll('.contact-item').forEach(item => {
        item.addEventListener('click', function() {
            const text = this.querySelector('span').textContent;
            navigator.clipboard.writeText(text).then(() => {
                // Show feedback
                const originalText = this.querySelector('span').textContent;
                this.querySelector('span').textContent = 'Copied!';
                this.style.background = 'rgba(255, 255, 255, 0.2)';
                
                setTimeout(() => {
                    this.querySelector('span').textContent = originalText;
                    this.style.background = '';
                }, 1500);
            }).catch(err => {
                console.log('Could not copy text: ', err);
            });
        });
    });
    
    // Smooth scrolling for internal navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + P for print
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            printBtn.click();
        }
        
        // Ctrl/Cmd + D for dark mode
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            themeBtn.click();
        }
        
        // Ctrl/Cmd + U for photo upload
        if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
            e.preventDefault();
            photoInput.click();
        }
    });
    
    // Initialize animations
    animateSkillBars();
    
    // Add stagger animation to cards
    const cards = document.querySelectorAll('.experience-item, .project-card, .cert-item');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Parallax effect for sidebar (subtle)
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });
    
    // Auto-save form data (if you add editable fields)
    function autoSave() {
        const editableElements = document.querySelectorAll('[contenteditable="true"]');
        editableElements.forEach(element => {
            element.addEventListener('blur', function() {
                const key = this.getAttribute('data-save-key');
                if (key) {
                    localStorage.setItem(key, this.textContent);
                }
            });
            
            // Load saved content
            const key = element.getAttribute('data-save-key');
            if (key) {
                const savedContent = localStorage.getItem(key);
                if (savedContent) {
                    element.textContent = savedContent;
                }
            }
        });
    }
    
    // Initialize auto-save
    autoSave();
    
    // Print optimization
    window.addEventListener('beforeprint', () => {
        // Ensure all animations are complete before printing
        document.querySelectorAll('.skill-progress').forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
        });
    });
});
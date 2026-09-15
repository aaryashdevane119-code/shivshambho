/* ==========================================================================
   Shivshambho Collection - Interactive Website Scripts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenuWrapper = document.getElementById('nav-menu-wrapper');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuBtn && navMenuWrapper) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenuWrapper.classList.toggle('active');
            const isOpen = navMenuWrapper.classList.contains('active');
            mobileMenuBtn.setAttribute('aria-expanded', isOpen);
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenuWrapper.classList.contains('active')) {
                    navMenuWrapper.classList.remove('active');
                }
            });
        });
    }

    // 2. Navbar elevation on scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Collection Category Filtering
    const tabButtons = document.querySelectorAll('.collection-tabs .tab-btn');
    const productCards = document.querySelectorAll('.product-grid .product-card');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterCategory = btn.getAttribute('data-category');

            productCards.forEach(card => {
                const cardCategories = card.getAttribute('data-category') || '';
                if (filterCategory === 'all' || cardCategories.includes(filterCategory)) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeIn 0.35s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 4. Coupon Code Copy with Toast
    const copyBtn = document.getElementById('btn-copy-code');
    const couponCode = document.getElementById('coupon-code');
    const toast = document.getElementById('toast');

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    if (copyBtn && couponCode) {
        copyBtn.addEventListener('click', async () => {
            const code = couponCode.textContent.trim();
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(code);
                } else {
                    // Fallback
                    const textarea = document.createElement('textarea');
                    textarea.value = code;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                }
                showToast(`🎉 Coupon code "${code}" copied to clipboard!`);
            } catch (err) {
                showToast(`Code: ${code}`);
            }
        });
    }

    // 5. "Write a Review" Modal & Rating Selector
    const openReviewModalBtn = document.getElementById('open-review-modal-btn');
    const closeReviewModalBtn = document.getElementById('close-review-modal-btn');
    const reviewModal = document.getElementById('review-modal');
    const reviewForm = document.getElementById('review-form');
    const starChoices = document.querySelectorAll('.star-choice');
    const selectedRatingInput = document.getElementById('selected-rating');
    const reviewsGrid = document.getElementById('reviews-grid');

    // Open/Close Modal
    if (openReviewModalBtn && reviewModal) {
        openReviewModalBtn.addEventListener('click', () => {
            reviewModal.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    }

    function closeModal() {
        if (reviewModal) {
            reviewModal.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

    if (closeReviewModalBtn) {
        closeReviewModalBtn.addEventListener('click', closeModal);
    }

    if (reviewModal) {
        reviewModal.addEventListener('click', (e) => {
            if (e.target === reviewModal) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && reviewModal && reviewModal.classList.contains('open')) {
            closeModal();
        }
    });

    // Star Selection Logic
    if (starChoices.length > 0) {
        starChoices.forEach(star => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.getAttribute('data-rating'), 10);
                selectedRatingInput.value = rating;
                updateStarDisplay(rating);
            });
        });

        function updateStarDisplay(rating) {
            starChoices.forEach(star => {
                const starVal = parseInt(star.getAttribute('data-rating'), 10);
                if (starVal <= rating) {
                    star.classList.add('active');
                } else {
                    star.classList.remove('active');
                }
            });
        }
    }

    // Helper: Create Review Card Element
    function createReviewCard(review) {
        const card = document.createElement('div');
        card.className = 'review-card';

        // Extract initials
        const nameParts = review.name.trim().split(' ');
        const initials = nameParts.length > 1 
            ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
            : nameParts[0].slice(0, 2).toUpperCase();

        const starsStr = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

        card.innerHTML = `
            <div class="review-card-header">
                <div class="avatar-circle">${initials}</div>
                <div class="reviewer-meta">
                    <h4>${escapeHTML(review.name)}</h4>
                    <span class="reviewer-location">📍 ${escapeHTML(review.city)}</span>
                </div>
                <span class="verified-badge">✓ Verified Buyer</span>
            </div>
            <div class="review-stars">${starsStr}</div>
            <h5 class="review-headline">"${escapeHTML(review.title)}"</h5>
            <p class="review-body">${escapeHTML(review.comments)}</p>
            <div class="review-date">Reviewed on ${escapeHTML(review.date)}</div>
        `;
        return card;
    }

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Load custom reviews from localStorage
    function loadStoredReviews() {
        try {
            const stored = localStorage.getItem('shivshambho_reviews');
            if (stored && reviewsGrid) {
                const reviews = JSON.parse(stored);
                reviews.forEach(review => {
                    const card = createReviewCard(review);
                    reviewsGrid.prepend(card);
                });
            }
        } catch (e) {
            console.error('Failed to load reviews from localStorage', e);
        }
    }
    loadStoredReviews();

    // Review Form Submit
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('reviewer-name').value.trim();
            const city = document.getElementById('reviewer-city').value.trim();
            const rating = parseInt(selectedRatingInput.value, 10) || 5;
            const title = document.getElementById('review-title').value.trim();
            const comments = document.getElementById('review-comments').value.trim();

            const dateStr = new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
            });

            const newReview = { name, city, rating, title, comments, date: dateStr };

            // Prepend new review to grid
            if (reviewsGrid) {
                const reviewEl = createReviewCard(newReview);
                reviewsGrid.prepend(reviewEl);
                reviewEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            // Save to localStorage
            try {
                const stored = JSON.parse(localStorage.getItem('shivshambho_reviews') || '[]');
                stored.unshift(newReview);
                localStorage.setItem('shivshambho_reviews', JSON.stringify(stored));
            } catch (err) {
                console.warn('Storage error', err);
            }

            // Reset & Close
            reviewForm.reset();
            selectedRatingInput.value = 5;
            if (starChoices.length) {
                starChoices.forEach(s => s.classList.add('active'));
            }
            closeModal();
            showToast('✨ Thank you! Your review has been posted.');
        });
    }

    // 6. Active nav link on scroll spy
    const sections = document.querySelectorAll('header[id], section[id]');
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

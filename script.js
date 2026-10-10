
const photos = [
    {
        title: "Mountain Lake",
        category: "Nature",
        description: "A quiet moment between mountains and sky.",
        location: "Swiss Alps",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=90",
        thumb: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=750&q=85"
    },
    {
        title: "City at Golden Hour",
        category: "Cities",
        description: "The skyline glows as day gives way to night.",
        location: "Dubai, UAE",
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=90",
        thumb: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=750&q=85"
    },
    {
        title: "King of the Wild",
        category: "Animals",
        description: "A calm gaze from the heart of the wild.",
        location: "Wildlife",
        image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1400&q=90",
        thumb: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=750&q=85"
    },
    {
        title: "City Lights",
        category: "Cities",
        description: "Reflections and lights after sunset.",
        location: "Night scenes",
        image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1400&q=90",
        thumb: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=750&q=85"
    },
    {
        title: "Into the Woods",
        category: "Nature",
        description: "Sunlight finds its way through the forest.",
        location: "Forest trail",
        image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1400&q=90",
        thumb: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=750&q=85"
    },
    {
        title: "A Flash of Blue",
        category: "Animals",
        description: "A burst of color in a green world.",
        location: "Birdlife",
        image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=1400&q=90",
        thumb: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=750&q=85"
    },
    {
        title: "Creative Workspace",
        category: "Technology",
        description: "Tools, ideas, and a little room to create.",
        location: "Desk setup",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=90",
        thumb: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=750&q=85"
    },
    {
        title: "The Long Way Up",
        category: "People",
        description: "Sometimes the journey is the destination.",
        location: "Mountain escape",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=90",
        thumb: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=750&q=85"
    }
];

// Select HTML elements
const grid = document.getElementById("galleryGrid");
const searchInput = document.getElementById("searchInput");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const lightbox = document.getElementById("lightbox");

// Store current gallery state
let activeCategory = "All";
let visiblePhotos = [...photos];
let currentIndex = 0;

const favorites = new Set();


// DISPLAY GALLERY
function renderGallery() {

    const query = searchInput.value.trim().toLowerCase();

    // Filter by category and search text
    visiblePhotos = photos.filter(photo => {

        const matchesCategory =
            activeCategory === "All" ||
            photo.category === activeCategory;

        const matchesSearch = [
            photo.title,
            photo.category,
            photo.description,
            photo.location
        ].some(value => value.toLowerCase().includes(query));

        return matchesCategory && matchesSearch;
    });

    // Create image cards
    grid.innerHTML = visiblePhotos.map((photo, index) => `
        <article class="photo-card"
            tabindex="0"
            role="button"
            aria-label="Open ${photo.title}"
            data-index="${index}"
            style="animation-delay:${Math.min(index * 45, 300)}ms">

            <img src="${photo.thumb}"
                alt="${photo.title}"
                loading="lazy">

            <div class="photo-info">

                <div>
                    <h3>${photo.title}</h3>
                    <p>${photo.location}</p>
                </div>

                <div class="category-pill">
                    ${photo.category}
                </div>

                <span class="open-icon" aria-hidden="true">
                    ↗
                </span>

            </div>
        </article>
    `).join("");

    // Update result count
    resultCount.textContent =
        `${String(visiblePhotos.length).padStart(2, "0")} photo${visiblePhotos.length === 1 ? "" : "s"}`;

    // Show empty message when no photos match
    emptyState.hidden = visiblePhotos.length !== 0;
    grid.hidden = visiblePhotos.length === 0;
}


// OPEN LIGHTBOX
function openLightbox(index) {

    if (!visiblePhotos.length) return;

    currentIndex =
        (index + visiblePhotos.length) % visiblePhotos.length;

    updateLightbox();

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.classList.add("no-scroll");

    document.getElementById("closeLightbox").focus();
}


// UPDATE LIGHTBOX CONTENT
function updateLightbox() {

    const photo = visiblePhotos[currentIndex];

    if (!photo) return;

    const img = document.getElementById("lightboxImage");

    img.style.opacity = "0.25";
    img.src = photo.image;
    img.alt = photo.title;

    img.onload = () => {
        img.style.opacity = "1";
    };

    document.getElementById("lightboxCategory").textContent =
        photo.category;

    document.getElementById("lightboxCounter").textContent =
        `${String(currentIndex + 1).padStart(2, "0")} / ${String(visiblePhotos.length).padStart(2, "0")}`;

    document.getElementById("lightboxTitle").textContent =
        photo.title;

    document.getElementById("lightboxDescription").textContent =
        photo.description;

    // Update favorite button
    const favoriteBtn = document.getElementById("favoriteBtn");

    favoriteBtn.classList.toggle(
        "liked",
        favorites.has(photo.title)
    );

    favoriteBtn.textContent =
        favorites.has(photo.title) ? "♥" : "♡";
}


// CLOSE LIGHTBOX
function closeLightbox() {

    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");

    document.body.classList.remove("no-scroll");
}


// NEXT / PREVIOUS IMAGE
function moveLightbox(direction) {

    if (!visiblePhotos.length) return;

    currentIndex =
        (currentIndex + direction + visiblePhotos.length)
        % visiblePhotos.length;

    updateLightbox();
}


// CATEGORY FILTERS
document.getElementById("filters").addEventListener("click", event => {

    const button = event.target.closest(".filter-btn");

    if (!button) return;

    activeCategory = button.dataset.category;

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.toggle("active", btn === button);
    });

    renderGallery();
});


// LIVE SEARCH
searchInput.addEventListener("input", renderGallery);


// OPEN IMAGE BY CLICKING A CARD
grid.addEventListener("click", event => {

    const card = event.target.closest(".photo-card");

    if (card) {
        openLightbox(Number(card.dataset.index));
    }
});


// OPEN IMAGE USING KEYBOARD
grid.addEventListener("keydown", event => {

    const card = event.target.closest(".photo-card");

    if (
        card &&
        (event.key === "Enter" || event.key === " ")
    ) {
        event.preventDefault();
        openLightbox(Number(card.dataset.index));
    }
});


// LIGHTBOX BUTTONS
document.getElementById("prevBtn").addEventListener("click", () => {
    moveLightbox(-1);
});

document.getElementById("nextBtn").addEventListener("click", () => {
    moveLightbox(1);
});

document.getElementById("closeLightbox").addEventListener("click", closeLightbox);

document.getElementById("backdrop").addEventListener("click", closeLightbox);


// CLEAR SEARCH AND FILTERS
document.getElementById("resetSearch").addEventListener("click", () => {

    searchInput.value = "";
    activeCategory = "All";

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.toggle(
            "active",
            btn.dataset.category === "All"
        );
    });

    renderGallery();
});


// FAVORITE BUTTON
document.getElementById("favoriteBtn").addEventListener("click", () => {

    const title = visiblePhotos[currentIndex]?.title;

    if (!title) return;

    if (favorites.has(title)) {
        favorites.delete(title);
    } else {
        favorites.add(title);
    }

    updateLightbox();
});


// OPEN FULL-SIZE IMAGE IN A NEW TAB
document.getElementById("downloadBtn").addEventListener("click", () => {

    const photo = visiblePhotos[currentIndex];

    if (photo) {
        window.open(
            photo.image,
            "_blank",
            "noopener,noreferrer"
        );
    }
});


// DARK / LIGHT THEME
document.getElementById("themeToggle").addEventListener("click", () => {

    document.body.classList.toggle("light");

    const isLight =
        document.body.classList.contains("light");

    const button = document.getElementById("themeToggle");

    button.textContent = isLight ? "☾" : "☼";

    button.setAttribute(
        "aria-label",
        isLight ? "Switch to dark theme" : "Switch to light theme"
    );
});


// KEYBOARD NAVIGATION
document.addEventListener("keydown", event => {

    if (!lightbox.classList.contains("open")) return;

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowLeft") {
        moveLightbox(-1);
    }

    if (event.key === "ArrowRight") {
        moveLightbox(1);
    }
});


// CURRENT YEAR IN FOOTER
document.getElementById("year").textContent =
    new Date().getFullYear();


// INITIALIZE WEBSITE
renderGallery();

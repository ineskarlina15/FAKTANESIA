// ==================== IMAGES SLIDER INTERAKTIF ====================
const images = document.querySelectorAll('.image-show img');
const prevBtn = document.getElementById('prev-slide');
const nextBtn = document.getElementById('next-slide');
const dotsContainer = document.getElementById('slider-dots');
const sliderElement = document.getElementById('image-slider');
let current = 0;
let slideInterval = null;

// Fungsi memperbarui titik indikator aktif
function updateDots(index) {
    if (!dotsContainer) return;
    const allDots = dotsContainer.querySelectorAll('.slider-dot');
    allDots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Fungsi menampilkan gambar berdasarkan index
function showSlide(index) {
    images.forEach((img, i) => {
        img.classList.remove('active');
        if (i === index) {
            img.classList.add('active');
        }
    });
    updateDots(index);
}

// Fungsi pindah ke gambar berikutnya
function nextSlide() {
    current = (current + 1) % images.length;
    showSlide(current);
}

// Fungsi pindah ke gambar sebelumnya
function prevSlide() {
    current = (current - 1 + images.length) % images.length;
    showSlide(current);
}

// Fungsi memulai perputaran otomatis slide
function startAutoSlide() {
    if (images.length > 1 && !slideInterval) {
        slideInterval = setInterval(nextSlide, 5000);
    }
}

// Fungsi menghentikan perputaran otomatis slide saat di-hover
function stopAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
}

// Menginisialisasi tombol dan indikator slider jika gambar tersedia
if (images.length > 0) {
    // Membuat titik indikator slide secara dinamis
    if (dotsContainer) {
        images.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = 'slider-dot';
            if (i === current) {
                dot.classList.add('active');
            }
            // Event klik pada titik indikator
            dot.addEventListener('click', () => {
                current = i;
                showSlide(current);
            });
            dotsContainer.appendChild(dot);
        });
    }

    // Menampilkan slide awal
    showSlide(current);

    // Menjalankan perputaran otomatis
    startAutoSlide();

    // Event tombol panah navigasi slider
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
        });
    }

    // Jeda otomatis saat kursor berada di atas slider
    if (sliderElement) {
        sliderElement.addEventListener('mouseenter', stopAutoSlide);
        sliderElement.addEventListener('mouseleave', startAutoSlide);
    }
}


// ==================== FUNGSI BANTU DOM ====================
// Fungsi membersihkan child elemen tanpa innerHTML
function clearChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}


// ==================== HAMBURGER ====================
const menuIcon = document.getElementById('menu-icon');
const navList = document.getElementById('nav-list');
// Memastikan elemen tersedia
if (menuIcon && navList) {
    menuIcon.addEventListener('click', () => {
        navList.classList.toggle('show');
    });
}


// ==================== SUMBER API ====================
const rssCategories = [
    "rss",
    "news/rss",
    "syariah/rss/",
    "opini/rss",
    "market/rss/",
    "lifestyle/rss"
];

// Menyimpan data sementara selama 15 menit
const cacheDuration = 15 * 60 * 1000;

// Menyimpan permintaan API yang sedang berjalan
const pendingRequests = new Map();


// Fungsi mengambil data RSS
function fetchRSS(category) {
    const rssUrl = "https://www.cnbcindonesia.com/" + category;
    const cacheKey = "faktanesia:" + rssUrl;

    let cached = null;

    // Memeriksa data yang tersimpan
    try {
        cached = JSON.parse(localStorage.getItem(cacheKey));

        if (
            cached &&
            Array.isArray(cached.posts) &&
            Date.now() - cached.timestamp < cacheDuration
        ) {
            return Promise.resolve(cached.posts);
        }

    } catch (error) {
        console.warn("Cache tidak dapat dibaca:", error);
    }

    // Menghindari permintaan API yang sama secara bersamaan
    if (pendingRequests.has(rssUrl)) {
        return pendingRequests.get(rssUrl);
    }

    const apiUrl =
        "https://api.rss2json.com/v1/api.json?rss_url=" +
        encodeURIComponent(rssUrl);

    const request = fetch(apiUrl)
        .then(response => {

            if (!response.ok) {
                throw new Error("API gagal diakses: " + response.status);
            }

            return response.json();
        })
        .then(data => {

            if (data.status !== "ok" || !Array.isArray(data.items)) {
                throw new Error(data.message || "Data tidak tersedia");
            }

            // Menyimpan data ke localStorage
            try {
                localStorage.setItem(
                    cacheKey,
                    JSON.stringify({
                        timestamp: Date.now(),
                        posts: data.items
                    })
                );
            } catch (error) {
                console.warn("Cache tidak dapat disimpan:", error);
            }

            return data.items;
        })
        .catch(error => {

            console.error("Gagal mengambil RSS:", category, error);

            // Menggunakan data lama jika API sedang gagal
            if (cached && Array.isArray(cached.posts)) {
                return cached.posts;
            }

            throw error;
        })
        .finally(() => {
            pendingRequests.delete(rssUrl);
        });

    pendingRequests.set(rssUrl, request);

    return request;
}


// ==================== FUNGSI GAMBAR ====================

function getThumbnail(post) {

    const thumbnail = post.thumbnail || post.enclosure?.link;

    return thumbnail
        ? thumbnail.replace("http://", "https://")
        : "https://placehold.co/300x200?text=No+Image";
}


// Fungsi memformat tanggal publikasi berita
function formatTanggal(post) {
    const tanggal = new Date(
        (post.pubDate || "").replace(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})$/, "$1T$2Z")
    );
    return !isNaN(tanggal.getTime())
        ? tanggal.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric"
        })
        : "Hari ini";
}


// ==================== FUNGSI CARD BERITA ====================

function createNewsCard(post, className, kategoriLabel) {

    // Membuat card berita
    const card = document.createElement("div");
    card.className = className;

    // Membuat gambar
    const img = document.createElement("img");
    img.src = getThumbnail(post);
    img.alt = post.title || "Gambar Berita";

    img.onerror = function () {
        this.onerror = null;
        this.src = "https://placehold.co/300x200?text=No+Image";
    };

    // Membuat badge kategori berita
    const badge = document.createElement("span");
    badge.className = "badge-kategori";
    badge.textContent = kategoriLabel || "Faktanesia";

    // Membuat tanggal publikasi
    const pubDate = document.createElement("small");
    pubDate.className = "tanggal-berita";
    pubDate.textContent = formatTanggal(post);

    // Membuat judul
    const title = document.createElement("h3");
    title.textContent = post.title;

    // Membuat link
    const link = document.createElement("a");
    link.href = post.link;
    link.textContent = "Baca Selengkapnya →";
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    // Memasukkan elemen ke dalam card secara terstruktur
    card.appendChild(img);
    card.appendChild(badge);
    card.appendChild(pubDate);
    card.appendChild(title);
    card.appendChild(link);

    return card;
}


// ==================== BERITA TERBARU ====================

const terbaruWrapper = document.querySelector(".berita-new-wrapper");

// Fetch hanya berjalan jika elemen berita terbaru tersedia
if (terbaruWrapper) {

    fetchRSS("rss")
        .then(posts => {

            clearChildren(terbaruWrapper);

            // Menampilkan maksimal 7 berita terbaru
            for (let i = 0; i < Math.min(7, posts.length); i++) {

                const card = createNewsCard(
                    posts[i],
                    "berita-card",
                    "TERBARU"
                );

                terbaruWrapper.appendChild(card);
            }

            if (posts.length === 0) {
                terbaruWrapper.textContent = "Belum ada berita terbaru.";
            }
        })
        .catch(error => {

            console.error("Gagal mengambil berita terbaru:", error);

            terbaruWrapper.textContent =
                "Berita sementara tidak dapat dimuat.";
        });
}


// ==================== SEMUA BERITA ====================
const beritaAll = document.querySelector(".semua-berita");

// Fetch hanya berjalan jika elemen semua berita tersedia
if (beritaAll) {

    Promise.allSettled(
        rssCategories.map(category => fetchRSS(category))
    )
        .then(results => {

            // Mengambil data yang berhasil dimuat
            const semuaPosts = results
                .filter(result => result.status === "fulfilled")
                .flatMap(result => result.value);

            // Memeriksa apakah semua sumber gagal
            if (results.every(result => result.status === "rejected")) {
                throw new Error("Semua sumber berita gagal dimuat");
            }

            // Mengambil 7 berita terbaru
            const beritaTerbaru = results[0].status === "fulfilled"
                ? results[0].value.slice(0, 7)
                : [];

            // Menyimpan link berita terbaru
            const linkTerbaru = new Set(
                beritaTerbaru.map(post => post.link)
            );

            // Menghapus berita duplikat
            const posts = [
                ...new Map(
                    semuaPosts.map(post => [post.link, post])
                ).values()
            ].filter(post => !linkTerbaru.has(post.link));

            // Mengurutkan berita berdasarkan tanggal
            posts.sort((a, b) =>
                new Date(b.pubDate) - new Date(a.pubDate)
            );

            clearChildren(beritaAll);

            // Menampilkan maksimal 36 berita tambahan
            for (let i = 0; i < Math.min(36, posts.length); i++) {

                const card = createNewsCard(
                    posts[i],
                    "berita-all-card",
                    "FAKTANESIA"
                );

                beritaAll.appendChild(card);
            }

            if (posts.length === 0) {
                beritaAll.textContent = "Belum ada berita tambahan.";
            }

            console.log("Jumlah semua berita:", posts.length);
        })
        .catch(error => {

            console.error("Gagal mengambil semua berita:", error);

            beritaAll.textContent = "Berita gagal dimuat.";
        });
}


// ==================== SEARCH ====================
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const resultContainer = document.getElementById('search-results');
const modal = document.getElementById('search-modal');
const closeBtn = document.getElementById('close-modal');
const resultCount = document.getElementById('result-count');


// Fungsi pencarian berita
async function searchNews() {

    const keyword = searchInput.value.trim().toLowerCase();

    if (!keyword) {
        alert("Masukkan kata kunci pencarian.");
        return;
    }

    // Membersihkan hasil sebelumnya
    clearChildren(resultContainer);

    resultCount.textContent = "Sedang mencari berita...";
    modal.style.display = 'block';

    // Mencegah pencarian berulang saat proses berlangsung
    searchBtn.disabled = true;

    try {

        // Mengambil berita dari seluruh kategori
        const responses = await Promise.allSettled(
            rssCategories.map(category => fetchRSS(category))
        );

        const semuaPosts = responses
            .filter(result => result.status === "fulfilled")
            .flatMap(result => result.value);

        // Memeriksa apakah semua sumber gagal
        if (responses.every(result => result.status === "rejected")) {
            throw new Error("Semua sumber pencarian gagal");
        }

        // Menghapus berita yang duplikat
        const uniquePosts = [
            ...new Map(
                semuaPosts.map(post => [post.link, post])
            ).values()
        ];

        // Mencari berita berdasarkan judul
        const results = uniquePosts.filter(post =>
            (post.title || "").toLowerCase().includes(keyword)
        );

        const sumberGagal = responses.filter(
            result => result.status === "rejected"
        ).length;

        const catatan = sumberGagal > 0
            ? " (Sebagian sumber tidak tersedia)"
            : "";

        // Menampilkan jumlah hasil pencarian
        resultCount.textContent =
            `Ditemukan ${results.length} hasil untuk: "${keyword}"${catatan}`;

        // Jika tidak ditemukan berita
        if (results.length === 0) {

            const p = document.createElement('p');

            p.textContent =
                `Tidak ditemukan hasil untuk: "${keyword}".`;

            resultContainer.appendChild(p);

            return;
        }

        // Menampilkan hasil pencarian
        results.forEach(post => {

            const itemss = document.createElement('div');
            itemss.className = 'search-item';

            // Membuat judul berita
            const titless = document.createElement('h4');
            titless.textContent = post.title;

            // Membuat link berita
            const linkss = document.createElement('a');
            linkss.href = post.link;
            linkss.target = '_blank';
            linkss.rel = 'noopener noreferrer';
            linkss.textContent = 'Baca selengkapnya';

            // Membuat paragraf
            const paragraph = document.createElement('p');
            paragraph.appendChild(linkss);

            // Membuat garis pemisah
            const hr = document.createElement('hr');

            // Memasukkan elemen
            itemss.appendChild(titless);
            itemss.appendChild(paragraph);
            itemss.appendChild(hr);

            resultContainer.appendChild(itemss);
        });

    } catch (error) {

        console.error("Pencarian gagal:", error);

        resultCount.textContent =
            "Pencarian berita gagal dimuat.";

    } finally {

        searchBtn.disabled = false;
    }
}


// Memastikan seluruh elemen pencarian tersedia
if (
    searchInput &&
    searchBtn &&
    resultContainer &&
    modal &&
    closeBtn &&
    resultCount
) {

    // Pencarian melalui tombol Cari
    searchBtn.addEventListener('click', searchNews);

    // Pencarian melalui tombol Enter
    searchInput.addEventListener('keydown', event => {

        if (event.key === 'Enter' && !searchBtn.disabled) {
            event.preventDefault();
            searchNews();
        }
    });

    // Menutup modal melalui tombol X
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Menutup modal ketika klik di luar
    window.addEventListener('click', event => {

        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}
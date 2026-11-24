// ==================== BERITA SYARIAH ============================
// Fungsi membersihkan child elemen tanpa innerHTML
function clearChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

// Mengambil elemen HTML
const bsyariah = document.getElementById("syariah-container");
const terbaruSyariah = document.querySelector(".syariah-all");

// Memastikan elemen Syariah tersedia
if (bsyariah || terbaruSyariah) {
    // Menggunakan fungsi fetchRSS dari script.js
    fetchRSS("syariah/rss/")
        .then(posts => {
            console.log("Data Syariah:", posts);
            console.log("Jumlah berita Syariah:", posts.length);

            // ==================== SYARIAH UTAMA ====================
            if (bsyariah && posts.length > 0) {
                // Mengambil berita pertama
                const post = posts[0];
                // Membersihkan isi sebelumnya tanpa innerHTML
                clearChildren(bsyariah);
                // Membuat gambar berita
                const img = document.createElement("img");
                img.src = getThumbnail(post);
                img.alt = "Berita Syariah";

                // Gambar cadangan jika gagal dimuat
                img.onerror = function () {
                    this.onerror = null;
                    this.src = "https://placehold.co/300x200?text=No+Image";
                };

                // Membuat judul berita
                const title = document.createElement("h3");
                title.textContent = post.title;
                // Membuat deskripsi berita
                const desc = document.createElement("p");
                const parser = new DOMParser();
                const description = parser.parseFromString(
                    post.description || "",
                    "text/html"
                );

                desc.textContent = description.body.textContent;

                // Membuat link berita
                const link = document.createElement("a");
                link.href = post.link;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.textContent = "Baca selengkapnya";

                // Menampilkan berita utama
                bsyariah.appendChild(img);
                bsyariah.appendChild(title);
                bsyariah.appendChild(desc);
                bsyariah.appendChild(link);

            } else if (bsyariah) {
                bsyariah.textContent = "Belum ada berita Syariah.";
            }


            // ==================== SEMUA BERITA SYARIAH ====================
            if (terbaruSyariah) {
                clearChildren(terbaruSyariah);
                // Menampilkan berita mulai dari index 1
                for (let i = 1; i < Math.min(50, posts.length); i++) {
                    const post = posts[i];
                    // Membuat card berita
                    const syariahSemua = document.createElement("div");
                    syariahSemua.className = "isi-syariah";
                    // Membuat gambar berita
                    const img = document.createElement("img");
                    img.src = getThumbnail(post);
                    img.alt = post.title;
                    // Gambar cadangan jika gagal dimuat
                    img.onerror = function () {
                        this.onerror = null;
                        this.src = "https://placehold.co/300x200?text=No+Image";
                    };
                    // Membuat judul berita
                    const title = document.createElement("h3");
                    title.textContent = post.title;
                    // Membuat tanggal publikasi
                    const pubDate = document.createElement("small");
                    const tanggal = new Date(
                        (post.pubDate || "").replace(
                            /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})$/,
                            "$1T$2Z"
                        )
                    );

                    pubDate.textContent = !isNaN(tanggal.getTime())
                        ? tanggal.toLocaleString("id-ID", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZone: "Asia/Jakarta"
                        })
                        : "Tanggal tidak tersedia";

                    // Membuat link berita
                    const link = document.createElement("a");
                    link.href = post.link;
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";
                    link.textContent = "Baca selengkapnya";

                    // Memasukkan elemen ke dalam card
                    syariahSemua.appendChild(img);
                    syariahSemua.appendChild(pubDate);
                    syariahSemua.appendChild(title);
                    syariahSemua.appendChild(link);

                    // Menampilkan card berita
                    terbaruSyariah.appendChild(syariahSemua);
                }

                // Jika tidak ada berita tambahan
                if (posts.length <= 1) {
                    terbaruSyariah.textContent =
                        "Belum ada berita Syariah tambahan.";
                }
            }

        })
        .catch(error => {

            console.error("Gagal mengambil berita Syariah:", error);
            const pesan = error.message.includes("429")
                ? "Server berita sedang membatasi permintaan. Silakan coba lagi nanti."
                : "Berita Syariah gagal dimuat.";

            if (bsyariah) {
                bsyariah.textContent = pesan;
            }
            if (terbaruSyariah) {
                terbaruSyariah.textContent = pesan;
            }
        });
}
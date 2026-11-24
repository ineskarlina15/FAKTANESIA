// ==================== BERITA MARKET ============================
// Fungsi membersihkan child elemen tanpa innerHTML
function clearChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

// Mengambil elemen HTML untuk menampilkan berita
const terbaruMarket = document.querySelector(".market-all");

// Memastikan elemen Market tersedia
if (terbaruMarket) {
    // Menggunakan fungsi fetchRSS dari script.js
    fetchRSS("market/rss/")
        .then(posts => {

            console.log("Data Market:", posts);
            console.log("Jumlah berita Market:", posts.length);

            // Membersihkan isi berita sebelumnya tanpa innerHTML
            clearChildren(terbaruMarket);

            // Menampilkan maksimal 60 berita sesuai data yang tersedia
            for (let i = 0; i < Math.min(60, posts.length); i++) {

                // Mengambil berita berdasarkan index
                const post = posts[i];

                // Membuat card berita Market
                const marketSemua = document.createElement("div");
                marketSemua.className = "isi-market";

                // Membuat gambar berita
                const img = document.createElement("img");
                img.src = getThumbnail(post);
                img.alt = post.title || "Gambar Market";

                // Gambar cadangan jika gagal dimuat
                img.onerror = function () {
                    this.onerror = null;
                    this.src = "https://placehold.co/300x200?text=No+Image";
                };

                // Membuat judul berita
                const title = document.createElement("h3");
                title.textContent = post.title;

                // Membuat tanggal publikasi berita
                const pubDate = document.createElement("small");

                const tanggal = new Date(
                    (post.pubDate || "").replace(
                        /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})$/,
                        "$1T$2Z"
                    )
                );

                // Mengubah tanggal ke format Indonesia
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

                // Membuat link menuju berita asli
                const link = document.createElement("a");
                link.href = post.link;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.textContent = "Baca selengkapnya";

                // Memasukkan semua elemen ke dalam card
                marketSemua.appendChild(img);
                marketSemua.appendChild(pubDate);
                marketSemua.appendChild(title);
                marketSemua.appendChild(link);

                // Menampilkan card berita ke halaman
                terbaruMarket.appendChild(marketSemua);
            }

            // Jika tidak ada berita yang tersedia
            if (posts.length === 0) {
                terbaruMarket.textContent =
                    "Belum ada berita Market.";
            }

        })
        .catch(error => {

            // Menampilkan pesan error di Console
            console.error("Gagal mengambil berita Market:", error);

            // Menampilkan pesan sesuai jenis error
            const pesan = error.message.includes("429")
                ? "Server berita sedang membatasi permintaan. Silakan coba lagi nanti."
                : "Berita Market gagal dimuat.";

            terbaruMarket.textContent = pesan;
        });
}

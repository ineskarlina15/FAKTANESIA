// ==================== BERITA LIFESTYLE ============================
// Fungsi membersihkan child elemen tanpa innerHTML
function clearChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

// Mengambil elemen HTML untuk menampilkan berita
const terbaruLifestyle = document.querySelector(".lifestyle-all");

// Memastikan elemen Lifestyle tersedia
if (terbaruLifestyle) {

    // Menggunakan fungsi fetchRSS dari script.js
    fetchRSS("lifestyle/rss")
        .then(posts => {

            console.log("Data Lifestyle:", posts);
            console.log("Jumlah berita Lifestyle:", posts.length);

            // Membersihkan isi berita sebelumnya tanpa innerHTML
            clearChildren(terbaruLifestyle);

            // Menampilkan maksimal 70 berita sesuai data yang tersedia
            for (let i = 0; i < Math.min(70, posts.length); i++) {

                // Mengambil berita berdasarkan index
                const post = posts[i];

                // Membuat card berita Lifestyle
                const lifestyleSemua = document.createElement("div");
                lifestyleSemua.className = "isi-lifestyle";

                // Membuat gambar berita
                const img = document.createElement("img");
                img.src = getThumbnail(post);
                img.alt = post.title || "Gambar Lifestyle";

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
                lifestyleSemua.appendChild(img);
                lifestyleSemua.appendChild(pubDate);
                lifestyleSemua.appendChild(title);
                lifestyleSemua.appendChild(link);

                // Menampilkan card berita ke halaman
                terbaruLifestyle.appendChild(lifestyleSemua);
            }

            // Jika tidak ada berita yang tersedia
            if (posts.length === 0) {
                terbaruLifestyle.textContent =
                    "Belum ada berita Lifestyle.";
            }

        })
        .catch(error => {

            // Menampilkan pesan error di Console
            console.error("Gagal mengambil berita Lifestyle:", error);

            // Menampilkan pesan sesuai jenis error
            const pesan = error.message.includes("429")
                ? "Server berita sedang membatasi permintaan. Silakan coba lagi nanti."
                : "Berita Lifestyle gagal dimuat.";

            terbaruLifestyle.textContent = pesan;
        });
}

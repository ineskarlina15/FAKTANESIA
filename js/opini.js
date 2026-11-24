// ==================== BERITA OPINI ============================
// Fungsi membersihkan child elemen tanpa innerHTML
function clearChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

// Mengambil elemen HTML
const opini = document.querySelector(".opini");
const artOpini = document.querySelector(".artikel-opini");
const opiniFo = document.querySelector(".opini-info");


// Fungsi membuat tanggal publikasi berita
function tanggalOpini(post) {

    const tanggal = new Date(
        (post.pubDate || "").replace(
            /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})$/,
            "$1T$2Z"
        )
    );

    return !isNaN(tanggal.getTime())
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
}


// Fungsi membuat gambar berita Opini
function gambarOpini(post) {

    const img = document.createElement("img");

    img.src = getThumbnail(post);
    img.alt = post.title || "Gambar Opini";

    // Gambar cadangan jika gagal dimuat
    img.onerror = function () {
        this.onerror = null;
        this.src = "https://placehold.co/300x200?text=No+Image";
    };

    return img;
}


// Memastikan elemen halaman Opini tersedia
if (opini || artOpini || opiniFo) {

    // Menggunakan fungsi fetchRSS dari script.js
    fetchRSS("opini/rss")
        .then(posts => {

            console.log("Data Opini:", posts);
            console.log("Jumlah berita Opini:", posts.length);

            // Membagi berita sesuai jumlah yang tersedia
            const batasUtama = Math.min(
                12,
                Math.ceil(posts.length * 0.4)
            );

            const batasArtikel = Math.min(
                posts.length,
                batasUtama + Math.min(
                    9,
                    Math.floor(posts.length * 0.4)
                )
            );


            // ==================== OPINI UTAMA ====================

            if (opini) {

                clearChildren(opini);

                for (let i = 0; i < batasUtama; i++) {

                    const post = posts[i];

                    // Membuat card Opini
                    const cardOpini = document.createElement("div");
                    cardOpini.className = "opini-sebagian";

                    // Membuat gambar berita
                    const img = gambarOpini(post);

                    // Membuat judul berita
                    const title = document.createElement("h3");
                    title.textContent = post.title;

                    // Membuat tanggal publikasi
                    const pubDate = document.createElement("small");
                    pubDate.textContent = tanggalOpini(post);

                    // Membuat link berita
                    const link = document.createElement("a");
                    link.href = post.link;
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";
                    link.textContent = "Baca selengkapnya";

                    // Memasukkan elemen ke dalam card
                    cardOpini.appendChild(img);
                    cardOpini.appendChild(pubDate);
                    cardOpini.appendChild(title);
                    cardOpini.appendChild(link);

                    // Menampilkan card ke halaman
                    opini.appendChild(cardOpini);
                }

                if (batasUtama === 0) {
                    opini.textContent = "Belum ada berita Opini.";
                }
            }


            // ==================== ARTIKEL OPINI ====================

            if (artOpini) {

                clearChildren(artOpini);

                for (
                    let g = batasUtama;
                    g < batasArtikel;
                    g++
                ) {

                    const post = posts[g];

                    // Membuat card artikel semantik HTML5
                    const artikels = document.createElement("article");
                    artikels.className = "kaya-artikel";

                    // Membuat gambar artikel
                    const image = gambarOpini(post);

                    // Membuat kontainer artikel
                    const konten = document.createElement("div");
                    konten.className = "konten-artikel";

                    // Membuat deskripsi artikel
                    const desc = document.createElement("p");

                    const parser = new DOMParser();

                    const description = parser.parseFromString(
                        post.description || post.title || "",
                        "text/html"
                    );

                    desc.textContent = description.body.textContent;

                    // Membuat link artikel
                    const links = document.createElement("a");
                    links.href = post.link;
                    links.target = "_blank";
                    links.rel = "noopener noreferrer";
                    links.textContent = "Selengkapnya...";

                    // Mempertahankan struktur card artikel
                    artikels.appendChild(desc);
                    artikels.appendChild(links);
                    artikels.appendChild(image);
                    artikels.appendChild(konten);

                    // Menampilkan artikel ke halaman
                    artOpini.appendChild(artikels);
                }

                if (batasArtikel === batasUtama) {
                    artOpini.textContent =
                        "Belum ada artikel Opini tambahan.";
                }
            }


            // ==================== INFO OPINI ====================

            if (opiniFo) {

                clearChildren(opiniFo);

                for (
                    let i = batasArtikel;
                    i < Math.min(batasArtikel + 4, posts.length);
                    i++
                ) {

                    const post = posts[i];

                    // Membuat card Info Opini
                    const cardOpini = document.createElement("div");
                    cardOpini.className = "opini-sisa";

                    // Membuat gambar berita
                    const img = gambarOpini(post);

                    // Membuat judul berita
                    const title = document.createElement("h3");
                    title.textContent = post.title;

                    // Membuat tanggal publikasi
                    const pubDate = document.createElement("small");
                    pubDate.textContent = tanggalOpini(post);

                    // Membuat link berita
                    const link = document.createElement("a");
                    link.href = post.link;
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";
                    link.textContent = "Baca selengkapnya";

                    // Memasukkan elemen ke dalam card
                    cardOpini.appendChild(img);
                    cardOpini.appendChild(pubDate);
                    cardOpini.appendChild(title);
                    cardOpini.appendChild(link);

                    // Menampilkan card ke halaman
                    opiniFo.appendChild(cardOpini);
                }

                if (posts.length <= batasArtikel) {
                    opiniFo.textContent =
                        "Belum ada Info Opini tambahan.";
                }
            }

        })
        .catch(error => {

            console.error("Gagal mengambil berita Opini:", error);

            const pesan = error.message.includes("429")
                ? "Server berita sedang membatasi permintaan. Silakan coba lagi nanti."
                : "Berita Opini gagal dimuat.";

            if (opini) {
                opini.textContent = pesan;
            }

            if (artOpini) {
                artOpini.textContent = pesan;
            }

            if (opiniFo) {
                opiniFo.textContent = pesan;
            }
        });
}

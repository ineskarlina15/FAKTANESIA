// ==================== FORMULIR SARAN & KRITIK ====================
// Mengambil elemen formulir berdasarkan ID (kebab-case)
const formSaran = document.getElementById("form-saran");

// Memastikan elemen form tersedia di halaman
if (formSaran) {

    // Menambahkan event handler 'submit' pada formulir
    formSaran.addEventListener("submit", function (event) {

        // Mencegah pengiriman default formulir agar tidak langsung me-reload halaman
        event.preventDefault();

        // Mengambil nilai input dari formulir
        const inputNama = document.getElementById("name").value.trim();
        const inputEmail = document.getElementById("email").value.trim();
        const inputKategori = document.getElementById("kategori").value;
        const radioJenis = formSaran.querySelector('input[name="jenis"]:checked');
        const inputJenis = radioJenis ? radioJenis.value : "masukan";
        const inputPesan = document.getElementById("pesan").value.trim();

        // Validasi input untuk memastikan seluruh data terisi
        if (!inputNama || !inputEmail || !inputKategori || !inputPesan) {
            alert("Harap lengkapi semua kolom formulir sebelum mengirim!");
            return;
        }

        // Menghapus notifikasi lama jika sebelumnya sudah ada
        const notifLama = document.querySelector(".notif-sukses");
        if (notifLama && notifLama.parentNode) {
            notifLama.parentNode.removeChild(notifLama);
        }

        // Membuat elemen kontainer notifikasi sukses menggunakan createElement
        const notifBox = document.createElement("div");
        notifBox.className = "notif-sukses";

        // Membuat elemen teks tebal untuk nama pengirim
        const judulNotif = document.createElement("strong");
        judulNotif.textContent = "Terima kasih, " + inputNama + "! ";

        // Membuat elemen teks pesan konfirmasi
        const teksNotif = document.createElement("span");
        teksNotif.textContent = "Pesan " + inputJenis + " Anda mengenai kategori " + inputKategori + " berhasil dikirimkan ke redaksi Faktanesia.";

        // Menggabungkan elemen ke dalam kotak notifikasi dengan appendChild
        notifBox.appendChild(judulNotif);
        notifBox.appendChild(teksNotif);

        // Memasang notifikasi tepat di atas formulir
        formSaran.parentNode.insertBefore(notifBox, formSaran);

        // Mengosongkan kembali seluruh input formulir setelah terkirim
        formSaran.reset();

        // Mengarahkan tampilan ke kotak notifikasi dengan animasi halus
        notifBox.scrollIntoView({ behavior: "smooth", block: "center" });
    });
}

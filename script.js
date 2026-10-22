/**
 * Script bukutabungan anda
 * Bebas Error, Clean Code, & Interaktif
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // Set Tahun Footer secara Dinamis
  document.getElementById('year').textContent = new Date().getFullYear();

  const form = document.getElementById('savingsForm');
  
  // Event Listener saat form di-submit atau diklik
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    processCalculation();
  });

  // Otomatis menghitung secara real-time saat ada perubahan input
  const inputs = document.querySelectorAll('#savingsForm input, #savingsForm select');
  inputs.forEach(input => {
    input.addEventListener('input', processCalculation);
  });

  // Jalankan perhitungan awal secara otomatis
  processCalculation();
});

/**
 * Fungsi Utama Proses Perhitungan
 */
function processCalculation() {
  // 1. Ambil Nilai Input Form
  const targetName = document.getElementById('targetName').value.trim() || 'Target';
  const targetAmount = parseFloat(document.getElementById('targetAmount').value) || 0;
  const initialBalance = parseFloat(document.getElementById('initialBalance').value) || 0;
  const depositAmount = parseFloat(document.getElementById('depositAmount').value) || 0;
  const frequency = document.getElementById('frequency').value;
  const extraDeposit = parseFloat(document.getElementById('extraDeposit').value) || 0;

  // Validasi Input Sederhana
  if (targetAmount <= 0 || depositAmount <= 0) {
    return;
  }

  // 2. Logika Hitung Tabungan
  const remainingAmount = Math.max(0, targetAmount - initialBalance);
  const periodsNeeded = Math.ceil(remainingAmount / depositAmount);
  
  // Hitung Jumlah Hari
  const daysPerPeriod = getDaysPerPeriod(frequency);
  const totalDaysNeeded = Math.ceil(periodsNeeded * daysPerPeriod);

  /**
 * Fungsi Logika Kalkulasi Tabungan Harian
 * @param {number} targetDana - Target total uang yang ingin dikumpulkan
 * @param {number} tabunganAwal - Modal awal atau uang yang sudah ditabung saat ini
 * @param {number} setoranHarian - Nominal uang yang ditabung setiap hari
 * @returns {object} Hasil perhitungan (jumlah hari, sisa kekurangan, dan status)
 */
function hitungTabunganHarian(targetDana, tabunganAwal, setoranHarian) {
  // 1. Validasi Input Dasar
  if (targetDana <= 0 || setoranHarian <= 0) {
    return { error: "Target dana dan setoran harian harus lebih besar dari 0!" };
  }

  // 2. Hitung Sisa Kekurangan Dana
  const sisaKekurangan = Math.max(0, targetDana - tabunganAwal);

  // Jika tabungan awal sudah melebihi atau sama dengan target
  if (sisaKekurangan === 0) {
    return {
      pesan: "Selamat! Target tabunganmu sudah tercapai! 🎉",
      totalHari: 0,
      sisaKekurangan: 0
    };
  }

  // 3. Hitung Jumlah Hari yang Dibutuhkan
  // Menggunakan Math.ceil untuk membulatkan ke atas (karena hari tidak bisa pecahan)
  const totalHariDibutuhkan = Math.ceil(sisaKekurangan / setoranHarian);

  // 4. Hitung Tanggal Perkiraan Tercapai secara Real-time
  const tanggalSekarang = new Date();
  const tanggalTercapai = new Date();
  tanggalTercapai.setDate(tanggalSekarang.getDate() + totalHariDibutuhkan);

  // 5. Kembalikan Hasil dalam Bentuk Objek Data yang Rapi
  return {
    targetDana: targetDana,
    tabunganAwal: tabunganAwal,
    setoranHarian: setoranHarian,
    sisaKekurangan: sisaKekurangan,
    totalHariDibutuhkan: totalHariDibutuhkan,
    perkiraanTanggalSelesai: tanggalTercapai.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  };
}

// ==========================================
// CONTOH PENGGUNAAN (TESTING):
// ==========================================
const targetImpian = 1500000; // Contoh: Beli sesuatu seharga Rp 1.500.000
const modalAwal = 300000;    // Sudah punya tabungan Rp 300.000
const menabungPerHari = 20000; // Niat menabung Rp 20.000 per hari

const hasilSimulasi = hitungTabunganHarian(targetImpian, modalAwal, menabungPerHari);

console.log("--- HASIL SIMULASI TABUNGAN HARIAN ---");
console.log(`Sisa yang harus dikumpulkan: Rp ${hasilSimulasi.sisaKekurangan.toLocaleString('id-ID')}`);
console.log(`Waktu yang dibutuhkan: ${hasilSimulasi.totalHariDibutuhkan} hari`);
console.log(`Target akan tercapai pada: ${hasilSimulasi.perkiraanTanggalSelesai}`);
  
  // Estimasi Tanggal Tercapai
  const targetDate = addDays(new Date(), totalDaysNeeded);

  /**
 * Fungsi untuk Menghitung Estimasi Tanggal Tercapai Target Tabungan
 * @param {number} targetDana - Target total uang yang ingin dikumpulkan
 * @param {number} tabunganAwal - Modal atau tabungan awal saat ini
 * @param {number} setoran - Nominal uang yang disetor per periode
 * @param {string} frekuensi - 'daily' (harian), 'weekly' (mingguan), atau 'monthly' (bulanan)
 * @returns {object} Hasil perhitungan sisa, jumlah periode, dan tanggal tercapai
 */
function hitungEstimasiTanggalTercapai(targetDana, tabunganAwal, setoran, frekuensi) {
  // 1. Validasi Input Dasar
  if (targetDana <= 0 || setoran <= 0) {
    return { error: "Target dana dan setoran harus lebih besar dari 0!" };
  }

  // 2. Hitung Sisa Kekurangan Dana
  const sisaKekurangan = Math.max(0, targetDana - tabunganAwal);

  // Jika target sudah tercapai
  if (sisaKekurangan === 0) {
    return {
      pesan: "Target tabungan sudah tercapai! 🎉",
      totalPeriode: 0,
      totalHari: 0,
      tanggalTercapai: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };
  }

  // 3. Hitung Jumlah Periode yang Dibutuhkan
  const totalPeriode = Math.ceil(sisaKekurangan / setoran);

  // 4. Konversi Periode ke Satuan Hari
  let hariPerPeriode = 1;
  if (frekuensi === 'weekly') {
    hariPerPeriode = 7;
  } else if (frekuensi === 'monthly') {
    hariPerPeriode = 30.4375; // Rata-rata hari dalam sebulan
  }

  const totalHariDibutuhkan = Math.ceil(totalPeriode * hariPerPeriode);

  // 5. Hitung Estimasi Tanggal Tercapai secara Real-time
  const tanggalSekarang = new Date();
  const tanggalTercapai = new Date();
  tanggalTercapai.setDate(tanggalSekarang.getDate() + totalHariDibutuhkan);

  // 6. Kembalikan Hasil Format Data
  return {
    sisaKekurangan: sisaKekurangan,
    totalPeriode: totalPeriode,
    satuanFrekuensi: frekuensi,
    totalHariDibutuhkan: totalHariDibutuhkan,
    tanggalTercapai: tanggalTercapai.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  };
}

// ==========================================
// CONTOH PENGGUNAAN (TESTING):
// ==========================================
const targetDanaImpian = 3000000; // Rp 3.000.000
const modalAwal = 500000;         // Rp 500.000
const setoranRutin = 25000;       // Rp 25.000
const pilihanFrekuensi = 'daily'; // 'daily', 'weekly', atau 'monthly'

const hasil = hitungEstimasiTanggalTercapai(targetDanaImpian, modalAwal, setoranRutin, pilihanFrekuensi);

console.log("--- HASIL ESTIMASI TANGGAL TERCAPAI ---");
console.log(`Sisa Dana: Rp ${hasil.sisaKekurangan.toLocaleString('id-ID')}`);
console.log(`Durasi: ${hasil.totalPeriode} ${hasil.satuanFrekuensi} (${hasil.totalHariDibutuhkan} hari)`);
console.log(`Perkiraan Tanggal Selesai: ${hasil.tanggalTercapai}`);

  // Persentase Progres Tabungan
  const progressPercent = Math.min(100, Math.round((initialBalance / targetAmount) * 100));

  // 3. Update Tampilan UI (Dom Manipulation)
  document.getElementById('progressLabel').textContent = `Progres (${targetName})`;
  document.getElementById('progressPercent').textContent = `${progressPercent}%`;
  document.getElementById('progressBarFill').style.width = `${progressPercent}%`;

  document.getElementById('resTargetAmount').textContent = formatRupiah(targetAmount);
  document.getElementById('resTimeNeeded').textContent = `${periodsNeeded} ${getFrequencyText(frequency)}`;
  document.getElementById('resTargetDate').textContent = formatDateID(targetDate);

  /**
 * Script Kalkulator Tabungan Siswa dengan Fitur Analisis AI
 * Standar Kode: ES6+, Clean Code, & Event-Driven
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Inisialisasi Tahun di Footer & Header AI
  document.getElementById('year').textContent = new Date().getFullYear();
  
  const headerSubText = document.querySelector('.header-text p');
  if (headerSubText) {
    headerSubText.textContent = "🤖 AI Assistant: Analisis & Wujudkan target finansialmu secara cerdas.";
  }

  const form = document.getElementById('savingsForm');
  
  // 2. Event Listener saat Form di-Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    processAICalculation();
  });

  // 3. Kalkulasi Otomatis secara Real-Time saat Input Berubah
  const inputs = document.querySelectorAll('#savingsForm input, #savingsForm select');
  inputs.forEach(input => {
    input.addEventListener('input', processAICalculation);
  });

  // 4. Jalankan Kalkulasi Pertama Kali
  processAICalculation();
});

/**
 * Fungsi Utama: Logika Kalkulasi & Generator Analisis AI
 */
function processAICalculation() {
  // --- A. Ambil Data Input ---
  const targetName = document.getElementById('targetName').value.trim() || 'Target Impian';
  const targetAmount = parseFloat(document.getElementById('targetAmount').value) || 0;
  const initialBalance = parseFloat(document.getElementById('initialBalance').value) || 0;
  const depositAmount = parseFloat(document.getElementById('depositAmount').value) || 0;
  const frequency = document.getElementById('frequency').value;
  const extraDeposit = parseFloat(document.getElementById('extraDeposit').value) || 0;

  // Validasi Input Dasar
  if (targetAmount <= 0 || depositAmount <= 0) {
    return;
  }

  // --- B. Hitung Logika Tabungan ---
  const remainingAmount = Math.max(0, targetAmount - initialBalance);
  const periodsNeeded = Math.ceil(remainingAmount / depositAmount);
  
  const daysPerPeriod = getDaysPerPeriod(frequency);
  const totalDaysNeeded = Math.ceil(periodsNeeded * daysPerPeriod);
  const targetDate = addDays(new Date(), totalDaysNeeded);

  const progressPercent = Math.min(100, Math.round((initialBalance / targetAmount) * 100));

  // --- C. Update Tampilan Hasil UI ---
  document.getElementById('progressLabel').textContent = `Progres (${targetName})`;
  document.getElementById('progressPercent').textContent = `${progressPercent}%`;
  document.getElementById('progressBarFill').style.width = `${progressPercent}%`;

  document.getElementById('resTargetAmount').textContent = formatRupiah(targetAmount);
  document.getElementById('resTimeNeeded').textContent = `${periodsNeeded} ${getFrequencyText(frequency)}`;
  document.getElementById('resTargetDate').textContent = formatDateID(targetDate);

  // --- D. Logika Simulasi & Generator Rekomendasi AI ---
  const extraResultBox = document.getElementById('extraResultBox');
  const extraResultText = document.getElementById('extraResultText');

  if (extraResultBox && extraResultText) {
    extraResultBox.classList.remove('hidden');

    // Menganalisis Kecepatan Menabung & Ekstra Hemat
    const aiInsight = generateAIInsight(targetName, totalDaysNeeded, extraDeposit, depositAmount, frequency);
    
    // Tampilkan Teks Analisis AI
    extraResultText.innerHTML = aiInsight;
  }
}

/**
 * Fungsi AI Intelligence: Menghasilkan Rekomendasi & Analisis Cerdas
 */
function generateAIInsight(targetName, totalDays, extra, deposit, freq) {
  let scoreBadge = "🟢 Bagus";
  let speedNote = "";

  // Penilaian berbasis waktu
  if (totalDays <= 30) {
    scoreBadge = "⚡ Sangat Cepat";
    speedNote = "Target ini sangat dekat! Pertahankan konsistensi kamu.";
  } else if (totalDays <= 180) {
    scoreBadge = "🎯 Terencana Sempurna";
    speedNote = "Rencana menabung kamu berada di ritme yang sangat ideal.";
  } else {
    scoreBadge = "⏳ Jangka Panjang";
    speedNote = "Butuh waktu lumayan lama. Coba tambah setoran harian/mingguan agar lebih cepat.";
  }

  let text = `
    <div style="margin-bottom: 6px; font-weight: 700; color: #38bdf8;">
      🤖 <strong>AI Analysis Score:</strong> <span style="background: rgba(56, 189, 248, 0.2); padding: 2px 8px; border-radius: 6px;">${scoreBadge}</span>
    </div>
    <p style="margin-bottom: 6px;">${speedNote}</p>
  `;

  // Analisis Hemat Jajan Tambahan
  if (extra > 0) {
    const totalDepositWithExtra = deposit + extra;
    const daysPerPeriod = getDaysPerPeriod(freq);
    const remainingAmount = Math.max(0, parseFloat(document.getElementById('targetAmount').value) - (parseFloat(document.getElementById('initialBalance').value) || 0));
    
    const newPeriodsNeeded = Math.ceil(remainingAmount / totalDepositWithExtra);
    const newTotalDays = Math.ceil(newPeriodsNeeded * daysPerPeriod);
    const savedDays = totalDays - newTotalDays;

    if (savedDays > 0) {
      text += `
        <div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,0.2); color: #34d399;">
          💡 <strong>Tips AI:</strong> Hemat jajan tambahan <strong>${formatRupiah(extra)}</strong> per ${getFrequencyText(freq, true)} 
          memangkas waktu hingga <strong>${formatDuration(savedDays)} LEBIH CEPAT!</strong>
        </div>
      `;
    }
  }

  return text;
}

/* ==========================================
   FUNGSI HELPER (UTILITY FUNCTIONS)
   ========================================== */

/** Format angka ke Rupiah */
function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    maximumFractionDigits: 0 
  }).format(amount);
}

/** Konversi frekuensi ke jumlah hari */
function getDaysPerPeriod(freq) {
  switch (freq) {
    case 'daily': return 1;
    case 'weekly': return 7;
    case 'monthly': return 30.43;
    default: return 1;
  }
}

/** Format teks frekuensi */
function getFrequencyText(freq, isSingular = false) {
  switch (freq) {
    case 'daily': return isSingular ? 'hari' : 'Hari';
    case 'weekly': return isSingular ? 'minggu' : 'Minggu';
    case 'monthly': return isSingular ? 'bulan' : 'Bulan';
    default: return '';
  }
}

/** Menambah hari ke objek Date */
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/** Format tanggal Bahasa Indonesia */
function formatDateID(date) {
  return new Intl.DateTimeFormat('id-ID', {

  // 4. Hitung Simulasi Ekstra Hemat
  const extraResultBox = document.getElementById('extraResultBox');
  const extraResultText = document.getElementById('extraResultText');

  if (extraDeposit > 0 && remainingAmount > 0) {
    const newDeposit = depositAmount + extraDeposit;
    const newPeriodsNeeded = Math.ceil(remainingAmount / newDeposit);
    const newTotalDays = Math.ceil(newPeriodsNeeded * daysPerPeriod);
    const savedDays = totalDaysNeeded - newTotalDays;

    if (savedDays > 0) {
      extraResultBox.classList.remove('hidden');
      extraResultText.innerHTML = `
        💡 <strong>Efek Hemat Jajan:</strong> Dengan menambah <strong>${formatRupiah(extraDeposit)}</strong> per ${getFrequencyText(frequency, true)}, 
        targetmu akan tercapai <strong>${formatDuration(savedDays)} LEBIH CEPAT!</strong> (Total waktu hanya ${newPeriodsNeeded} ${getFrequencyText(frequency)}).
      `;
    } else {
      extraResultBox.classList.add('hidden');
    }
  } else {
    extraResultBox.classList.add('hidden');
  }
}

/* ==========================================
   FUNGSI HELPER (UTILITIES)
   ========================================== */

/** Format angka ke Rupiah */
function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    maximumFractionDigits: 0 
  }).format(amount);
}

/** Konversi frekuensi ke jumlah hari */
function getDaysPerPeriod(freq) {
  switch (freq) {
    case 'daily': return 1;
    case 'weekly': return 7;
    case 'monthly': return 30.43;
    default: return 1;
  }
}

/** Teks frekuensi */
function getFrequencyText(freq, isSingular = false) {
  switch (freq) {
    case 'daily': return isSingular ? 'hari' : 'Hari';
    case 'weekly': return isSingular ? 'minggu' : 'Minggu';
    case 'monthly': return isSingular ? 'bulan' : 'Bulan';
    default: return '';
  }
}

/** Menambah hari ke tanggal */
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/** Format tanggal Bahasa Indonesia */
function formatDateID(date) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

/** Format durasi waktu */
function formatDuration(totalDays) {
  if (totalDays < 30) {
    return `${totalDays} Hari`;
  }
  const months = Math.floor(totalDays / 30.43);
  const remainingDays = Math.round(totalDays % 30.43);
  
  if (remainingDays === 0) return `${months} Bulan`;
  return `${months} Bulan ${remainingDays} Hari`;
}

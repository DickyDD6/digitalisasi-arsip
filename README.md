<h1 align="center">Digital Arsip FT UNPAS</h1>

<p align="center">
  <img src="apps/dashboard/public/img/logo-ft.png" alt="Digital Arsip FT UNPAS Logo" width="96" height="96">
</p>

<p align="center">
  <strong>Sistem Informasi Pengelolaan & Digitalisasi Arsip Dokumen Nilai dan Transkrip Mahasiswa Fakultas Teknik Universitas Pasundan.</strong>
</p>

<p align="center">
  <a href="https://github.com/aldiipratama/digital-arsip-agy">Repository</a>
  ·
  <a href="https://github.com/aldiipratama/digital-arsip-agy/issues">Report a bug</a>
  ·
  <a href="https://github.com/aldiipratama/digital-arsip-agy/issues">Request a feature</a>
</p>

<div align="center">

![CI](https://img.shields.io/github/actions/workflow/status/Fakultas-Teknik-Universitas-Pasundan/digitalisasi-arsip/ci.yml?style=flat-square)
![stars](https://img.shields.io/github/stars/Fakultas-Teknik-Universitas-Pasundan/digitalisasi-arsip?style=flat-square)
![fork](https://img.shields.io/github/forks/Fakultas-Teknik-Universitas-Pasundan/digitalisasi-arsip?style=flat-square)
![license](https://img.shields.io/github/license/Fakultas-Teknik-Universitas-Pasundan/digitalisasi-arsip?style=flat-square)

</div>

---

> [!IMPORTANT]
> **Catatan Pengembang:** Proyek ini saat ini masih dalam **tahap pengembangan aktif** (*under active development*). Fitur, skema API, dan dokumentasi dapat berubah sewaktu-waktu seiring berlangsungnya proses pengembangan.

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Built With](#built-with)
- [License](#license)
- [Contributors](#contributors)

---

## About

**Digital Arsip FT UNPAS** adalah platform manajemen pengarsipan digital berbasis web yang dirancang khusus untuk memodernisasi pengelolaan dokumen nilai, transkrip akademik, dan ijazah mahasiswa Fakultas Teknik Universitas Pasundan (angkatan 2000-2010).

Sistem ini membantu memecahkan masalah degradasi arsip fisik kertas, mempercepat pencarian arsip yang dulunya memakan waktu lama, serta menyediakan alur verifikasi dokumen berjenjang berbasis peran (*Role-Based Access Control*) yang transparan dan terukur.

---

## Features

- 🏗️ **Feature-Based Monorepo Architecture**: Pengorganisasian kode bersih terpisah antara Frontend (`apps/dashboard`) dan Backend (`apps/api`) dikelola via Turborepo & pnpm workspace.
- 🔐 **Multi-Role Access Control (RBAC)**: Alur kerja disesuaikan untuk 4 peran pengguna:
  - **Manager Arsip**: Dashboard analitik global, manajemen akun pengguna, log aktivitas, dan laporan statistik.
  - **Quality Control (QC)**: Antrean verifikasi dokumen, persetujuan (*approve*), dan penolakan (*reject*) arsip.
  - **Tim Uploader**: Pengunggahan file PDF arsip, pengisian metadata (Prodi, Matkul, NPM), dan lini masa riwayat upload.
  - **Staff Biro Akademik Pasundan (SBAP)**: Pencarian arsip terverifikasi, pengunduhan file, dan persiapan cetak transkrip.
- 🔍 **Advanced Live Search & Command Palette**: Pencarian arsip cepat berdasarkan nama dokumen, NPM, atau mata kuliah dengan shortcut `Cmd+K` / `Ctrl+K`.
- 📑 **Direct PDF Viewer & Secure Download**: Pratinjau dokumen PDF langsung di browser tanpa berpindah halaman dan pengunduhan aman via blob streaming.
- 📊 **Monitoring & Audit Logs**: Tracking kronologis aktivitas pengguna serta grafik distribusi dokumen berbasis Recharts.

---

## Built With

<p align="center">
  <a href="https://nextjs.org/">
    <img src="https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js" />
  </a>
  <a href="https://react.dev/">
    <img src="https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=000000" alt="React" />
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  </a>
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  </a>
  <a href="https://tanstack.com/query/latest">
    <img src="https://img.shields.io/badge/TanStack_Query_v5-FF4154?style=flat-square&logo=reactquery&logoColor=white" alt="TanStack Query" />
  </a>
  <a href="https://laravel.com/">
    <img src="https://img.shields.io/badge/Laravel-FF2D20?style=flat-square&logo=laravel&logoColor=white" alt="Laravel" />
  </a>
  <a href="https://www.mysql.com/">
    <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white" alt="MySQL" />
  </a>
  <a href="https://pnpm.io/">
    <img src="https://img.shields.io/badge/pnpm-F69220?style=flat-square&logo=pnpm&logoColor=white" alt="pnpm" />
  </a>
  <a href="https://turbo.build/">
    <img src="https://img.shields.io/badge/Turborepo-EF4444?style=flat-square&logo=turborepo&logoColor=white" alt="Turborepo" />
  </a>
</p>

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

## Contributors

<div align="center">

| | CONTRIBUTORS | |
| :---: | :---: | :---: |
| [![@FTUnpas](https://github.com/Fakultas-Teknik-Universitas-Pasundan.png?size=150)](https://github.com/Fakultas-Teknik-Universitas-Pasundan) | [![@aldiipratama](https://github.com/aldiipratama.png?size=150)](https://github.com/aldiipratama) | [![@dickydd66](https://github.com/DickyDD6.png?size=150)](https://github.com/DickyDD6) |

</div>

---

Project Link: [https://github.com/Fakultas-Teknik-Universitas-Pasundan/digitalisasi-arsip](https://github.com/Fakultas-Teknik-Universitas-Pasundan/digitalisasi-arsip)

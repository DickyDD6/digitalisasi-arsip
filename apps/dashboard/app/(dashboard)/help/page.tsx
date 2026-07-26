import {
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/shared/components/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/accordion";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader } from "@repo/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@repo/ui/input-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import {
  Book,
  ExternalLink,
  FileSearchCorner,
  FileText,
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
  Search,
  Shield,
} from "lucide-react";

const faqItems = [
  {
    id: "item-1",
    question: "Bagaimana cara mengakses sistem pengarsipan digital?",
    answer:
      "Anda dapat mengakses sistem pengarsipan digital dengan masuk ke portal resmi dan menggunakan kredensial yang telah diberikan.",
    category: "Umum",
  },
  {
    id: "item-2",
    question: "Apa saja fitur utama dari sistem pengarsipan digital?",
    answer:
      "Sistem pengarsipan digital menyediakan fitur pencarian, kategori, laporan, dan manajemen dokumen.",
    category: "Umum",
  },
  {
    id: "item-3",
    question: "Bagaimana cara mencari dokumen di sistem?",
    answer:
      "Gunakan fitur pencarian di halaman utama, masukkan kata kunci dokumen yang Anda cari, dan sistem akan menampilkan hasil yang relevan.",
    category: "Umum",
  },
  {
    id: "item-4",
    question: "Berapa ukuran maksimal file yang dapat diunggah?",
    answer: "Ukuran maksimal file yang dapat diunggah adalah 50MB per dokumen.",
    category: "Umum",
  },
  {
    id: "item-5",
    question: "Apa format file yang didukung oleh sistem?",
    answer: "Sistem mendukung format PDF, DOC, DOCX, XLS, XLSX, dan JPG.",
    category: "Umum",
  },
  {
    id: "item-6",
    question: "Bagaimana cara mengorganisir dokumen dalam kategori?",
    answer:
      "Anda dapat membuat dan mengelola kategori baru melalui menu pengaturan arsip.",
    category: "Arsip",
  },
  {
    id: "item-7",
    question: "Apakah dokumen dapat di-backup?",
    answer:
      "Ya, sistem menyediakan fitur backup otomatis setiap hari untuk menjaga keamanan data Anda.",
    category: "Arsip",
  },
  {
    id: "item-8",
    question: "Bagaimana cara menghapus dokumen lama?",
    answer:
      "Pilih dokumen yang ingin dihapus, kemudian gunakan opsi hapus permanen dari menu aksi.",
    category: "Arsip",
  },
  {
    id: "item-9",
    question: "Bagaimana cara mengekspor data arsip?",
    answer:
      "Gunakan fitur ekspor pada menu laporan untuk mengunduh data dalam format CSV atau Excel.",
    category: "Arsip",
  },
  {
    id: "item-10",
    question: "Apakah sistem mendukung kolaborasi antar pengguna?",
    answer:
      "Ya, Anda dapat berbagi akses dokumen dengan pengguna lain melalui fitur sharing.",
    category: "Arsip",
  },
  {
    id: "item-11",
    question: "Bagaimana cara mengganti password akun saya?",
    answer:
      "Masuk ke pengaturan profil, pilih opsi ubah password, dan ikuti instruksi yang diberikan.",
    category: "Pengguna",
  },
  {
    id: "item-12",
    question: "Apa yang harus dilakukan jika lupa password?",
    answer:
      "Klik tombol 'Lupa Password' di halaman login dan ikuti proses pemulihan melalui email Anda.",
    category: "Pengguna",
  },
  {
    id: "item-13",
    question: "Bisakah saya mengubah informasi profil saya?",
    answer:
      "Ya, Anda dapat mengubah nama, email, dan foto profil di halaman pengaturan pengguna.",
    category: "Pengguna",
  },
  {
    id: "item-14",
    question: "Bagaimana cara melihat riwayat aktivitas pengguna?",
    answer:
      "Admin dapat melihat riwayat aktivitas di menu laporan pengguna dengan filter tanggal.",
    category: "Pengguna",
  },
  {
    id: "item-15",
    question: "Apakah saya bisa mengelola multiple user accounts?",
    answer:
      "Ya, admin dapat membuat dan mengelola akun pengguna melalui menu manajemen pengguna.",
    category: "Pengguna",
  },
  {
    id: "item-16",
    question: "Bagaimana cara membuat laporan arsip?",
    answer:
      "Masuk ke menu laporan, pilih jenis laporan yang diinginkan, dan atur parameter pencarian Anda.",
    category: "Laporan",
  },
  {
    id: "item-17",
    question: "Format apa saja yang tersedia untuk mengekspor laporan?",
    answer: "Laporan dapat diekspor dalam format PDF, Excel, dan CSV.",
    category: "Laporan",
  },
  {
    id: "item-18",
    question: "Bisakah saya menjadwalkan laporan otomatis?",
    answer:
      "Ya, sistem memungkinkan Anda menjadwalkan laporan otomatis yang dikirim melalui email.",
    category: "Laporan",
  },
  {
    id: "item-19",
    question: "Bagaimana cara melihat statistik penggunaan sistem?",
    answer:
      "Dashboard statistik dapat diakses di menu laporan dengan berbagai metrik performa.",
    category: "Laporan",
  },
  {
    id: "item-20",
    question: "Apakah laporan dapat di-customize sesuai kebutuhan?",
    answer:
      "Ya, Anda dapat memilih kolom, filter, dan format untuk membuat laporan custom.",
    category: "Laporan",
  },
  {
    id: "item-21",
    question: "Bagaimana sistem melindungi data arsip saya?",
    answer:
      "Sistem menggunakan enkripsi SSL/TLS dan kontrol akses berbasis peran untuk melindungi data.",
    category: "Keamanan",
  },
  {
    id: "item-22",
    question: "Apakah ada audit trail untuk semua aktivitas?",
    answer:
      "Ya, semua aktivitas dicatat dalam audit log untuk transparansi dan keamanan.",
    category: "Keamanan",
  },
  {
    id: "item-23",
    question: "Bagaimana cara mengaktifkan autentikasi dua faktor?",
    answer:
      "Masuk ke pengaturan keamanan dan aktifkan opsi autentikasi dua faktor dengan aplikasi authenticator.",
    category: "Keamanan",
  },
  {
    id: "item-24",
    question: "Apakah data saya dienkripsi saat penyimpanan?",
    answer:
      "Ya, semua data dienkripsi menggunakan standar enkripsi industri saat disimpan di server.",
    category: "Keamanan",
  },
  {
    id: "item-25",
    question: "Apa kebijakan privasi sistem pengarsipan digital?",
    answer:
      "Data pengguna dijaga kerahasiaan dan tidak dibagikan kepada pihak ketiga tanpa persetujuan.",
    category: "Keamanan",
  },
];

export default function HelpPage() {
  return (
    <>
      <PageHeader>
        <PageTitle>Pusat Bantuan</PageTitle>
        <PageDescription>
          Temukan panduan, FAQ, dan dukungan untuk menggunakan sistem
          pengarsipan digital.
        </PageDescription>
      </PageHeader>

      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput placeholder="Cari pertanyaan atau topik bantuan..." />
      </InputGroup>

      <div className="flex gap-4">
        <Tabs defaultValue="Semua" className="w-full" orientation="vertical">
          <div className="flex flex-col gap-4 max-w-80">
            <Card className="gap-0">
              <CardHeader>
                <p className="font-medium">Kategori</p>
              </CardHeader>
              <CardContent>
                <TabsList className="w-full">
                  <TabsTrigger value="Semua">
                    <HelpCircle className="size-4" />
                    Semua
                  </TabsTrigger>
                  <TabsTrigger value="Umum">
                    <Book className="size-4" />
                    Umum
                  </TabsTrigger>
                  <TabsTrigger value="Arsip">
                    <FileText className="size-4" />
                    Arsip
                  </TabsTrigger>
                  <TabsTrigger value="Pengguna">
                    <MessageCircle className="size-4" />
                    Pengguna
                  </TabsTrigger>
                  <TabsTrigger value="Laporan">
                    <FileSearchCorner className="size-4" />
                    Laporan
                  </TabsTrigger>
                  <TabsTrigger value="Keamanan">
                    <Shield className="size-4" />
                    Keamanan
                  </TabsTrigger>
                </TabsList>
              </CardContent>
            </Card>

            <Card className="gap-0">
              <CardHeader>
                <p className="font-medium">Panduan Cepat</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-start h-full"
                    >
                      <div className="p-2 bg-blue-100 rounded-md">
                        <Book className="size-4 text-blue-600" />
                      </div>
                      <div className="grid text-wrap">
                        <p className="font-medium text-sm">
                          Panduan Lengkap Sistem
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          Pelajari semua fitur dan cara menggunakan sistem
                          pengarsipan digital.
                        </p>
                      </div>
                      <ExternalLink className="size-4 text-muted-foreground ml-auto" />
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-start h-full"
                    >
                      <div className="p-2 bg-green-100 rounded-md">
                        <FileText className="size-4 text-green-600" />
                      </div>
                      <div className="grid text-wrap">
                        <p className="font-medium text-sm">
                          Cara Mengarsipkan Dokumen
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          Langkah-langkah untuk mengarsipkan dokumen dengan
                          benar.
                        </p>
                      </div>
                      <ExternalLink className="size-4 text-muted-foreground ml-auto" />
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-start h-full"
                    >
                      <div className="p-2 bg-yellow-100 rounded-md">
                        <Shield className="size-4 text-yellow-600" />
                      </div>
                      <div className="grid text-wrap">
                        <p className="font-medium text-sm">
                          Cara Mengelola Akses Pengguna
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          Panduan tentang cara mengelola dan mengatur akses
                          pengguna dalam sistem.
                        </p>
                      </div>
                      <ExternalLink className="size-4 text-muted-foreground ml-auto" />
                    </Button>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="w-full max-h-140">
            <CardHeader>
              <p className="font-medium">
                Pertanyaan yang sering Diajukan (FAQ)
              </p>
              <p className="text-xs text-muted-foreground">
                11 pertanyaan ditentukan
              </p>
            </CardHeader>
            <CardContent className="w-full min-h-0 overflow-auto">
              <Accordion className="w-full" defaultValue={["item-1"]}>
                {[
                  "Semua",
                  "Umum",
                  "Arsip",
                  "Pengguna",
                  "Laporan",
                  "Keamanan",
                ].map((category) => (
                  <TabsContent value={category} key={category} className="mt-0">
                    {faqItems
                      .filter(
                        (item) =>
                          category === "Semua" || item.category === category,
                      )
                      .map((item) => (
                        <AccordionItem
                          value={`${category}-${item.id}`}
                          key={item.id}
                        >
                          <AccordionTrigger>{item.question}</AccordionTrigger>
                          <AccordionContent>
                            <p>{item.answer}</p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                  </TabsContent>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </Tabs>
      </div>

      <Card className="bg-primary">
        <CardContent>
          <p className="text-primary-foreground font-medium text-lg">
            Butuh Bantuan Lebih Lanjut?
          </p>
          <p className="text-primary-foreground font-light text-sm">
            Tim support kami siap membantu Anda. Hubungi Kami melalui:
          </p>
          <div className="flex gap-4 items-center mt-4">
            <Button
              variant="secondary"
              className="flex h-full items-center gap-2"
            >
              <div className="bg-neutral-50/50 rounded-md p-2">
                <Mail className="size-4" />
              </div>
              <div className="grid text-start">
                <p>Email</p>
                <p className="text-primary-foreground font-light">
                  support@company.com
                </p>
              </div>
            </Button>
            <Button
              variant="secondary"
              className="flex h-full items-center gap-2"
            >
              <div className="bg-neutral-50/50 rounded-md p-2">
                <Phone className="size-4" />
              </div>
              <div className="grid text-start">
                <p>Telepon</p>
                <p className="text-primary-foreground font-light">
                  +62 812-3456-7890
                </p>
              </div>
            </Button>
          </div>

          <p className="text-primary-foreground font-light mt-4">
            Jam Operasional: Senin - Jumat, 08:00 - 17:00 WIB
          </p>
        </CardContent>
      </Card>
    </>
  );
}

export type Merchandise = {
  id: number;
  nama: string;
  harga: number;
  link_foto_merchandise: string;
  deskripsi_merchandise: string;
  kategori: string;
  warna: string;
  deskripsi_pendek: string;
  createdAt: Date;
  updatedAt: Date;
};

export type MerchandiseDto = {
  nama: string;
  harga: string;
  deskripsi_merchandise: string;
  foto_merch?: File;
  link_foto_merchandise: string;
  kategori: string;
  warna: string;
  deskripsi_pendek: string;
};

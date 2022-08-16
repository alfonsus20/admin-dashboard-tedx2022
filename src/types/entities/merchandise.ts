export type Merchandise = {
  id: number;
  nama: string;
  harga: number;
  link_foto_merchandise: string;
  deskripsi_merchandise: string;
  createdAt: Date;
  updatedAt: Date;
};

export type MerchandiseDto = {
  nama: string;
  harga: number;
  deskripsi_merchandise: string;
  foto_merch?: File;
};

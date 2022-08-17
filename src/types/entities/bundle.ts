export type Bundle = {
  id: number;
  nama: string;
  harga: number;
  link_foto_bundle: string;
  deskripsi_bundle: string;
  isi_bundle: string;
  createdAt: Date;
  updatedAt: Date;
};

export type BundleDto = {
  nama: string;
  harga: string;
  deskripsi_bundle: string;
  foto_bundle?: File;
  link_foto_bundle: string;
  isi_bundle: string[];
};

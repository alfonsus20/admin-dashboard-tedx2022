export type Sponsor = {
  id: number;
  nama: string;
  link_foto_sponsor: string;
  kategori_sponsor: string;
  createdAt: Date;
  updatedAt: Date;
};

export type SponsorDto = {
  nama: string;
  kategori_sponsor: string;
  link_foto_sponsor: string;
  foto_sponsor?: File;
};

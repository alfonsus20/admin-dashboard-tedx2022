export type Visitor = {
  id: string;
  external_id: string;
  email: string;
  nomorTelp: string;
  nama: string;
  asalInstansi: string;
  namaInstansi: string;
  qr_code: string;
  is_scanned: boolean;
  createdAt: Date;
  updatedAt: Date;
  transactionExternalId: null;
  transaction : {
    jenis_tiket: string;
  };
};

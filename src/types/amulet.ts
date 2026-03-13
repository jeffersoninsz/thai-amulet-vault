export interface Amulet {
  id: string;
  nameZh: string;
  nameEn: string;
  nameTh: string;

  descZh: string;
  descEn: string;
  descTh: string;

  materialZh: string;
  materialEn: string;

  monkOrTemple: string;
  year: string;

  imageUrl: string;
  price: number;
  stock: number;
  moq?: number;
  wholesalePrice?: number | null;
  isB2bOnly?: boolean;
  comments?: any[];

  createdAt?: string;
  updatedAt?: string;
}

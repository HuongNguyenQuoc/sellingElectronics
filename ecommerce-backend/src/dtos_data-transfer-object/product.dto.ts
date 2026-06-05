export class CreateProductDto {
  name!: string;
  description!: string;
  price!: number;
  category!: string;
  brand!: string;
  stock!: number;
  images?: string[];
  specs?: Record<string, string>;
}

export class UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  brand?: string;
  stock?: string;
  images?: string[];
  specs?: Record<string, string>;
  /*
  Record<K, V> the syntax: Record<KeyType, ValueType>. Ex: Record<string, string>
  Ex: {
        color: "Black",
        storage: "256GB",
        screen: "6.7 inch"
      }
  
  -> {
        [key: string]: string
      }
  */
}

export class ProductResponseDto { //DTO helps control the data is to be return from client
  _id!: string;
  name!: string;
  description!: string;
  price!: number;
  category!: string;
  brand!: string;
  stock!: number;
  images!: string[];
  specs!: Record<string, string>;
  createAt!: Date;
  updateAt!: Date;
}
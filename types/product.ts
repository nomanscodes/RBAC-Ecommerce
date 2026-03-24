import { Optional } from "sequelize";

export interface ProductAttributes {
  id: number;
  name: string;
  price: number;
  image?: string;
  categoryId: number;
  createdAt?: Date;
}

// Optional fields for creation (id is auto-generated)
export interface ProductCreationAttributes
  extends Optional<ProductAttributes, "id"> {}

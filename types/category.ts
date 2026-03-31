import { Optional } from "sequelize";

export interface CategoryAttributes {
  id: number;
  name: string;
  description?: string;
  createdAt?: Date;
}

// Optional fields for creation (id is auto-generated)
export interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, "id"> {}

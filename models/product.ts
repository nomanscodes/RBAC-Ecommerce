import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import { ProductAttributes, ProductCreationAttributes } from "../types/product";

class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: number;
  public name!: string;
  public price!: number;
  public image?: string;
  public categoryId!: number | null;
  public readonly createdAt!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "category_id",
      references: {
        model: "categories",
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "products",
    modelName: "Product",
    timestamps: true,
    updatedAt: false,
    underscored: true,
  },
);

export default Product;

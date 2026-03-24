import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import { RoleAttributes, RoleCreationAttributes } from "../types/role";

class Role
  extends Model<RoleAttributes, RoleCreationAttributes>
  implements RoleAttributes
{
  public id!: number;
  public name!: string;
  public slug!: string;
  public description?: string;
  public readonly createdAt!: Date;
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "roles",
    modelName: "Role",
    timestamps: true,
    updatedAt: false,
    underscored: true,
  },
);

export default Role;

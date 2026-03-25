import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import {
  PermissionAttributes,
  PermissionCreationAttributes,
} from "../types/role";

class Permission
  extends Model<PermissionAttributes, PermissionCreationAttributes>
  implements PermissionAttributes
{
  public id!: number;
  public name!: string;
  public slug!: string;
  public module!: string;
  public action!: string;
  public readonly createdAt!: Date;
}

Permission.init(
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
    module: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "permissions",
    modelName: "Permission",
    timestamps: true,
    updatedAt: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["module", "action"],
        name: "unique_module_action",
      },
    ],
  },
);

export default Permission;

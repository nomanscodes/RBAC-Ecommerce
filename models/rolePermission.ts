import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import {
  RolePermissionAttributes,
  RolePermissionCreationAttributes,
} from "../types/role";

class RolePermission
  extends Model<RolePermissionAttributes, RolePermissionCreationAttributes>
  implements RolePermissionAttributes
{
  public id!: number;
  public roleId!: number;
  public permissionId!: number;
  public readonly createdAt!: Date;
}

RolePermission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "role_id",
      references: {
        model: "roles",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    permissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "permission_id",
      references: {
        model: "permissions",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    sequelize,
    tableName: "role_permissions",
    modelName: "RolePermission",
    timestamps: true,
    updatedAt: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["role_id", "permission_id"],
        name: "unique_role_permission",
      },
    ],
  },
);

export default RolePermission;

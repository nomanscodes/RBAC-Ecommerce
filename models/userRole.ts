import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import { UserRoleAttributes, UserRoleCreationAttributes } from "../types/role";

class UserRole
  extends Model<UserRoleAttributes, UserRoleCreationAttributes>
  implements UserRoleAttributes
{
  public id!: number;
  public userId!: number;
  public roleId!: number;
  public readonly createdAt!: Date;
}

UserRole.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
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
  },
  {
    sequelize,
    tableName: "user_roles",
    modelName: "UserRole",
    timestamps: true,
    updatedAt: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "role_id"],
        name: "unique_user_role",
      },
    ],
  },
);

export default UserRole;

import {IUserResponse} from "./iuser-response";
import {PermissionModel} from "./permission-model";

export class UserModel implements IUserResponse {
  id: number;
  eMail: string;
  permissions: PermissionModel[] = [];

  static parse(data: IUserResponse): UserModel {
    let user = new UserModel();

    user.eMail = data.eMail;
    user.id = data.id;

    return user;
  }
}

import { Users } from 'src/features/users/entities/users';
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { UsersRegistrationData } from 'src/features/users/entities/users-registration-data';

type CreateUserDTO = {
  newUser: Users;
  newUserRegistrationData: UsersRegistrationData;
};

@Injectable()
export class UsersRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Users) protected userRepo: Repository<Users>,
    @InjectRepository(UsersRegistrationData)
    protected userRegDataRepo: Repository<UsersRegistrationData>,
  ) {}

  async createUser({ newUser, newUserRegistrationData }: CreateUserDTO) {
    debugger;
    const { id, email, login, createdAt } = newUser;
    await this.userRepo.insert(newUser);
    await this.userRegDataRepo.insert(newUserRegistrationData);
    return { id, email, login, createdAt };
  }

  async confirmUserByUserId(userId: string) {
    debugger;
    const regData = await this.userRegDataRepo
      .createQueryBuilder('urd')
      .innerJoinAndSelect('urd.user', 'u') // указываем связь через отношение user
      .where('u.id = :userId', {
        userId,
      })
      // указываем конкретные поля, которые нужно выбрать
      .select([
        'urd.id',
        'urd.confirmationCode',
        'urd.expirationDate',
        'urd.isConfirmed',
        'u.id',
        'u.email',
        'u.login',
        'u.createdAt',
        'u.password',
      ])
      .getOne();
    debugger;
    if (regData) {
      regData.isConfirmed = true;
      await this.userRegDataRepo.save(regData);
      debugger;
      return true;
    } else {
      return false;
    }
  }

  async updateUserPassword(userId: string, passwordHash: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (user) {
      user.password = passwordHash;
      await this.userRepo.save(user);
      return true;
    } else {
      return false;
    }
  }

  async updateConfirmationCode(userId: string, confirmationCode: string) {
    debugger;
    const regData = await this.userRegDataRepo.findOne({
      where: {
        user: { id: userId },
      },
    } as FindOneOptions<UsersRegistrationData>);
    if (regData) {
      regData.confirmationCode = confirmationCode;
      await this.userRegDataRepo.save(regData);
      debugger;
      return true;
    } else {
      return false;
    }
  }

  async removeUserById(id: string) {
    const result = await this.userRepo
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();
    return result!.affected! > 0;
  }

  async clearData() {
    await this.dataSource.query(`TRUNCATE TABLE public."Users" CASCADE;`, []);
    await this.dataSource.query(
      `TRUNCATE TABLE public."UsersRegistrationData";`,
      [],
    );
  }
}

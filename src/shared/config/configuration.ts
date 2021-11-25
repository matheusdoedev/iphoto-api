import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { User } from 'src/modules/users/entities/user.entity';

interface IConfiguration {
  database: TypeOrmModuleOptions;
}

export default (): IConfiguration => ({
  database: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [User],
  },
});

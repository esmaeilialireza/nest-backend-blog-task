import { Sequelize } from 'sequelize-typescript';
import { databaseConfig } from './config';

// Entities
import { User } from 'modules/users/entity';
import { BlogPost } from 'modules/blog/entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case 'development':
          config = databaseConfig.development;
          break;

        default:
          config = databaseConfig.development;
      }
      const sequelize = new Sequelize(config);
      sequelize.addModels([User, BlogPost]);
      await sequelize.sync();
      return sequelize;
    },
  },
];

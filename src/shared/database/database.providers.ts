import { Sequelize } from 'sequelize-typescript';
import { databaseConfig } from './config';

// Entities
import { User } from '@app/modules/users/entity';
import { BlogPost, BlogPostComment } from '@app/modules/blog/entity';

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
      const sequelize = new Sequelize({ ...config, logging: false });
      sequelize.addModels([User, BlogPost, BlogPostComment]);
      await sequelize.sync();
      return sequelize;
    },
  },
];

import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';

import { AppModule } from '../src/app.module';

describe('BlogPostController (e2e)', () => {
  let app;
  let moduleFixture: TestingModule;
  let accessToken: string;
  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        AppModule,
        JwtModule.register({ secret: 'myJwtSecretIsTheBestSecretYes' }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'aza1', password: '1234' });

    accessToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a new post', async () => {
    const createBlogPostDto = {
      title: `Post title ${new Date()}`,
      description: 'This is a test post description',
      article: 'This is a test post article',
      tags: ['test tag'],
    };

    const response = await request(app.getHttpServer())
      .post('/blog')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(createBlogPostDto);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.article).toBe('This is a test post article');
    expect(response.body.description).toBe('This is a test post description');
    expect(response.body.tags).toEqual(['test tag']);
    expect(response.body.title).toBe(`Post title ${new Date()}`);
  });

  it('/GET blog posts', async () => {
    const response = await request(app.getHttpServer()).get('/blog');
    expect(response.status).toBe(200);
    expect(response.body.results).toBeDefined();
    expect(response.body.count).toBeDefined();
  });
});

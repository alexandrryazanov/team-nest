import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
// import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';

// import * as cookieParser from 'cookie-parser';

const jwtService = new JwtService();

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  let accessToken: string;
  // let refreshToken: string;
  let userId: number;

  const email = 'test_1@email.com';
  const password = 'password';

  it('/users/register (POST) should register a user', async () => {
    const response = await request(httpServer)
      .post('/users/register')
      .send({
        email: email,
        password: password,
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    userId = Number(response.body.id);
    console.log('userId = ', userId);
  });

  it('/users/login (POST) should log in a user', async () => {
    const response = await request(httpServer)
      .post('/users/login')
      .send({
        email: email,
        password: password,
      })
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
    accessToken = response.body.accessToken;

    console.log('accessToken = ', accessToken);

    const cookies = response.headers['set-cookie'];
    expect(cookies).toBeDefined();
  });

  it('/users/:id (GET) should get user', async () => {
    const userId = jwtService.decode(accessToken).sub;

    const response = await request(httpServer)
      .get(`/users/${userId}`)
      .expect(200);

    expect(response.body).toBeDefined();
  });

  it('/users/logout (POST) should logout user', async () => {
    const response = await request(httpServer)
      .post(`/users/logout`)
      .expect(201);

    expect(response.body).toBeDefined();
  });



  it('/users/:id (DELETE) should delete a user (authorized)', async () => {
    const userId = jwtService.decode(accessToken).sub;

    const response = await request(httpServer)
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toBeDefined();
  });
});

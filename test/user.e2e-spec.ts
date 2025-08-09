import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';

import * as cookieParser from 'cookie-parser';
import { timeout } from 'rxjs';

const jwtService = new JwtService();

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    httpServer = app.getHttpServer();

    timeout(100000);
  });

  afterAll(async () => {
    await app.close();
  });

  let accessToken: string;
  let cookies: string;
  let userId: number;

  const email = 'test_2@email.com';
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

    cookies = response.headers['set-cookie'][0];
    expect(cookies).toBeDefined();
  });

  it('/users/refresh (POST) should refresh access token for a user', async () => {
    const response = await request(httpServer)
      .post('/users/refresh')
      .set('Cookie', `${cookies}`)
      // TODO: waht status should be here?
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
    accessToken = response.body.accessToken;

    cookies = response.headers['set-cookie'][0];
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
      // TODO: waht status should be here?
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

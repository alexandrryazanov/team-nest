import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

import * as cookieParser from 'cookie-parser';
import { timeout } from 'rxjs';

interface User {
  email: string;
  password: string;
  accessToken: string;
  cookies: string;
  id: number;
  isAdmin: boolean;
}

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

  let nonAdminUser: User = {
    email: 'test_non_admin3@email.com',
    password: 'password',
    accessToken: '',
    cookies: '',
    id: 0,
    isAdmin: false,
  };
  let adminUser: User = {
    email: 'test_admin2@email.com',
    password: 'password',
    accessToken: '',
    cookies: '',
    id: 0,
    isAdmin: true,
  };

  it('/users/register (POST) should register a user', async () => {
    nonAdminUser = await registerUser(nonAdminUser, httpServer);
  });

  it('/users/login (POST) should log in a user', async () => {
    nonAdminUser = await loginUser(nonAdminUser, httpServer);
  });

  it('/users/refresh (POST) should refresh access token for a user', async () => {
    nonAdminUser = await refreshToken(nonAdminUser, httpServer);
  });

  it('/users/:id (GET) should get user', async () => {
    const response = await request(httpServer)
      .get(`/users/${nonAdminUser.id}`)
      .expect(200);

    expect(response.body).toBeDefined();
  });

  it('/users/ (GET) non-admin user should have 403 on get all users', async () => {
    const response = await request(httpServer)
      .get(`/users/`)
      .set('Authorization', `Bearer ${nonAdminUser.accessToken}`)
      .expect(403);

    expect(response.body).toBeDefined();
  });

  it('/users/logout (POST) should logout user', async () => {
    const response = await request(httpServer)
      .post(`/users/logout`)
      .expect(201);

    expect(response.body).toBeDefined();
  });

  it('/users/:id (DELETE) should delete a user (authorized)', async () => {
    await deleteUser(nonAdminUser, httpServer);
  });

  it('/users/register (POST) should register a user as admin', async () => {
    adminUser = await registerUser(adminUser, httpServer);
  });

  it('/users/login (POST) should log in a user as admin', async () => {
    adminUser = await loginUser(adminUser, httpServer);
  });

  it('/users/:id (GET) admin user should a user', async () => {
    const response = await request(httpServer)
      .get(`/users/${adminUser.id}`)
      .set('Authorization', `Bearer ${adminUser.accessToken}`)
      .expect(200);

    expect(response.body).toBeDefined();
  });

  it('/users/ (GET) admin user should have all users', async () => {
    const response = await request(httpServer)
      .get(`/users/`)
      .set('Authorization', `Bearer ${adminUser.accessToken}`)
      .expect(200);

    expect(response.body).toBeDefined();
  });

  it('/users/:id (DELETE) should delete an admin user (authorized)', async () => {
    await deleteUser(adminUser, httpServer);
  });

  async function registerUser(user: User, httpServer: any): Promise<User> {
    const response = await request(httpServer)
      .post('/users/register')
      .send({
        email: user.email,
        password: user.password,
        isAdmin: user.isAdmin,
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    user.id = response.body.id;
    return user;
  }

  async function loginUser(user: User, httpServer: any): Promise<User> {
    const response = await request(httpServer)
      .post('/users/login')
      .send({
        email: user.email,
        password: user.password,
      })
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
    user.accessToken = response.body.accessToken;

    user.cookies = response.headers['set-cookie'][0];
    expect(user.cookies).toBeDefined();

    return user;
  }

  async function refreshToken(user: User, httpServer: any): Promise<User> {
    const response = await request(httpServer)
      .post('/users/refresh')
      .set('Cookie', `${user.cookies}`)
      // TODO: what status should be here?
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
    user.accessToken = response.body.accessToken;

    user.cookies = response.headers['set-cookie'][0];
    expect(user.cookies).toBeDefined();

    return user;
  }

  async function deleteUser(user: User, httpServer: any) {
    const response = await request(httpServer)
      .delete(`/users/${user.id}`)
      .set('Authorization', `Bearer ${user.accessToken}`)
      .expect(200);

    expect(response.body).toBeDefined();
  }
});

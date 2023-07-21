import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { useContainer } from 'class-validator';

import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    await app.init();
  });

  it('handles a signup request', async () => {
    const email = 'how2@nice.com';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'verynice' })
      .expect(201);
    const { id, email: responseEmail } = res.body;
    expect(id).toBeDefined();
    expect(responseEmail).toEqual(email);
  });

  it('handles a signup request', async () => {
    const email = 'how2@nice.com';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'verynice' })
      .expect(201);
    const { id, email: responseEmail } = res.body;
    expect(id).toBeDefined();
    expect(responseEmail).toEqual(email);
  });
});

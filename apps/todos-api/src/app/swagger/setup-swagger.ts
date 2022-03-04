import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export interface SwaggerSetupOpts {
  document: DocumentBuilder;
  swaggerServer?: string;
}

export function setupSwagger(
  app: INestApplication,
  { document: documentBuilder, swaggerServer }: SwaggerSetupOpts,
) {
  documentBuilder.addOAuth2({
    type: 'oauth2',
    flows: {
      implicit: {
        authorizationUrl:
          'https://login.microsoftonline.com/8394d86a-a24c-4d2c-ad99-57a3d0bb7d89/oauth2/authorize',
        scopes: {
          user_impersonation: 'Access Swagger WebApi',
          description: 'Authorize against Azure AD',
        },
      },
    },
  });

  if (swaggerServer) {
    documentBuilder.addServer(swaggerServer);
  }

  const document = SwaggerModule.createDocument(app, documentBuilder.build(), {
    operationIdFactory: (_controllerKey, methodKey) => methodKey,
  });

  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      requestInterceptor: req => {
        req.headers['x-api-client'] = 'local-swagger';
        req.headers['x-api-client-version'] = '1.0.0';
        return req;
      },
    },
  });
}

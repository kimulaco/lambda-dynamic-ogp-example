import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import * as nodejsfunction from 'aws-cdk-lib/aws-lambda-nodejs';

interface ApiStackProps extends cdk.StackProps {
  stage: string;
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    // Lambda関数の作成
    const pingFunction = new nodejsfunction.NodejsFunction(this, 'PingFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, '../../src/index.ts'),
      handler: 'ping',
      bundling: {
        minify: true,
        sourceMap: true,
      },
      environment: {
        STAGE: props.stage,
      },
    });

    // API Gatewayの作成
    const api = new apigateway.RestApi(this, 'DynamicOgpApi', {
      restApiName: `Dynamic OGP API (${props.stage})`,
      description: `Dynamic OGP API - ${props.stage} environment`,
      deployOptions: {
        stageName: props.stage,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // エンドポイントの作成
    const ping = api.root.addResource('ping');
    ping.addMethod('GET', new apigateway.LambdaIntegration(pingFunction));

    // 出力の設定
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL',
    });
  }
} 
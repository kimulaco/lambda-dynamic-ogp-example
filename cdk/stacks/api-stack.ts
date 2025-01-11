import path from 'path'
import * as cdk from 'aws-cdk-lib'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as nodejsfunction from 'aws-cdk-lib/aws-lambda-nodejs'
import { Construct } from 'constructs'
import { COMMON_BUNDLING_OPTIONS, SATORI_BUNDLING_OPTIONS, FUNCTION_BASE_PROPS } from '../config/api'

const getRootPath = (apiPath: string): string => {
  return path.join(__dirname, '../../src', apiPath)
}

interface ApiStackProps extends cdk.StackProps {
  stage: string
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props)

    // Lambda関数の作成
    const healthFunction = new nodejsfunction.NodejsFunction(this, 'HealthFunction', {
      ...FUNCTION_BASE_PROPS,
      entry: getRootPath('api/health/index.ts'),
      bundling: COMMON_BUNDLING_OPTIONS,
      environment: {
        STAGE: props.stage,
      },
    })

    const ogpMessageFunction = new nodejsfunction.NodejsFunction(this, 'OgpMessageFunction', {
      ...FUNCTION_BASE_PROPS,
      entry: getRootPath('api/ogp/message/index.tsx'),
      bundling: SATORI_BUNDLING_OPTIONS,
      memorySize: 512,
      timeout: cdk.Duration.seconds(10),
      environment: {
        STAGE: props.stage,
      },
    })

    // API Gatewayの作成
    const restApi = new apigateway.RestApi(this, 'DynamicOgpApi', {
      restApiName: `Dynamic OGP API (${props.stage})`,
      description: `Dynamic OGP API - ${props.stage} environment`,
      deployOptions: {
        stageName: props.stage,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
      binaryMediaTypes: ['*/*'],
    })

    // エンドポイントの作成
    const api = restApi.root.addResource('api')
    const health = api.addResource('health')
    health.addMethod('GET', new apigateway.LambdaIntegration(healthFunction))

    const ogp = api.addResource('ogp')
    const message = ogp.addResource('message')
    message.addMethod(
      'GET',
      new apigateway.LambdaIntegration(ogpMessageFunction, {
        contentHandling: apigateway.ContentHandling.CONVERT_TO_BINARY,
      }),
    )

    // 出力の設定
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: restApi.url,
      description: 'API Gateway URL',
    })
  }
}

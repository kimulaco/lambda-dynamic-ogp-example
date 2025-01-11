import path from 'path'
import { fileURLToPath } from 'url'
import * as cdk from 'aws-cdk-lib'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as nodejsfunction from 'aws-cdk-lib/aws-lambda-nodejs'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import { Construct } from 'constructs'
import { COMMON_BUNDLING_OPTIONS, SATORI_BUNDLING_OPTIONS, FUNCTION_BASE_PROPS } from '../config/api'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const getRootPath = (filePath: string): string => {
  return path.join(__dirname, '../../src', filePath)
}

interface ApiStackProps extends cdk.StackProps {
  stage: string
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props)

    const healthFunction = new nodejsfunction.NodejsFunction(this, 'ApiHealthFunction', {
      ...FUNCTION_BASE_PROPS,
      entry: getRootPath('api/health/index.ts'),
      bundling: COMMON_BUNDLING_OPTIONS,
      environment: {
        STAGE: props.stage,
      },
    })

    const ogpMessageFunction = new nodejsfunction.NodejsFunction(this, 'OgpMessageFunction', {
      ...FUNCTION_BASE_PROPS,
      entry: getRootPath('ogp/message/index.tsx'),
      bundling: SATORI_BUNDLING_OPTIONS,
      memorySize: 512,
      timeout: cdk.Duration.seconds(10),
      environment: {
        STAGE: props.stage,
      },
    })

    const ogpGachaFunction = new nodejsfunction.NodejsFunction(this, 'OgpGachaFunction', {
      ...FUNCTION_BASE_PROPS,
      entry: getRootPath('ogp/gacha/index.tsx'),
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

    // APIエンドポイントの作成
    const api = restApi.root.addResource('api')
    const health = api.addResource('health')
    health.addMethod('GET', new apigateway.LambdaIntegration(healthFunction))

    // OGPエンドポイントの作成
    const ogp = restApi.root.addResource('ogp')
    const message = ogp.addResource('message')
    message.addMethod(
      'GET',
      new apigateway.LambdaIntegration(ogpMessageFunction, {
        contentHandling: apigateway.ContentHandling.CONVERT_TO_BINARY,
      }),
    )
    const gacha = ogp.addResource('gacha')
    gacha.addMethod(
      'GET',
      new apigateway.LambdaIntegration(ogpGachaFunction, {
        contentHandling: apigateway.ContentHandling.CONVERT_TO_BINARY,
      }),
    )

    // CloudFrontディストリビューションの作成
    const distribution = new cloudfront.Distribution(this, 'OgpDistribution', {
      defaultBehavior: {
        origin: new origins.RestApiOrigin(restApi),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
        cachePolicy: new cloudfront.CachePolicy(this, 'OgpCachePolicy', {
          defaultTtl: cdk.Duration.hours(24),
          maxTtl: cdk.Duration.days(7),
          minTtl: cdk.Duration.minutes(5),
          queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
          enableAcceptEncodingBrotli: true,
          enableAcceptEncodingGzip: true,
        }),
      },
      comment: `OGP Distribution for ${props.stage}`,
    })

    // CloudFrontのURLを出力
    new cdk.CfnOutput(this, 'DistributionUrl', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'CloudFront Distribution URL',
    })

    // 出力の設定
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: restApi.url,
      description: 'API Gateway URL',
    })
  }
}

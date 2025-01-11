import * as cdk from 'aws-cdk-lib';
import { ApiStack } from './stacks/api-stack';

const app = new cdk.App();
const stage = app.node.tryGetContext('stage') || 'dev';

new ApiStack(app, `DynamicOgpApiStack-${stage}`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'ap-northeast-1',
  },
  stage,
});

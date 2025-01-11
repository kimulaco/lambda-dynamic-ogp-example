import path from 'path'
import { Runtime } from 'aws-cdk-lib/aws-lambda'
import type { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs'

export const RUNTIME = Runtime.NODEJS_20_X

export const COMMON_BUNDLING_OPTIONS = {
  minify: true,
  sourceMap: true,
  alias: {
    '@': path.resolve(__dirname, '../../src'),
  },
}

export const SATORI_BUNDLING_OPTIONS = {
  ...COMMON_BUNDLING_OPTIONS,
  loader: {
    '.woff': 'binary',
    '.woff2': 'binary',
  },
  nodeModules: ['sharp'],
  forceDockerBundling: true,
  jsx: 'automatic',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
}

export const FUNCTION_BASE_PROPS: NodejsFunctionProps = {
  runtime: RUNTIME,
  handler: 'index',
}

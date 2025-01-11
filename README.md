# Lambda Dynamic OGP Example

動的なOGP画像を生成するAWS Lambda関数のサンプルプロジェクトです。

## 技術スタック

- AWS
  - CDK
  - Lambda
  - API Gateway
  - CloudWatch
- Node.js 20.x
- TypeScript
- esbuild
- satori (JSXをSVGに変換)
- sharp (SVGをPNGに変換)

## 必要要件

- Node.js 20.x
- AWS CLI
- AWS CDK CLI
- Docker (Lambda関数のビルドで使用)

## セットアップ

1. 依存パッケージのインストール

```bash
npm install
```

2. AWSクレデンシャルの設定

```bash
aws configure
```

3. CDKブートストラップ

```bash
npm run bootstrap
```

## デプロイ

### 開発環境

```bash
npm run deploy:dev
```

### 本番環境

```bash
npm run deploy:prod
```

## ローカル開発

### CDKスタックの確認

```bash
npm run synth
```

### Lint

```bash
npm run lint

npm run lint:fix
```

## エンドポイント

### API

#### GET /api/health

- ヘルスチェック
- レスポンス:
  - Content-Type: application/json
  - Body: `{ "status": "ok" }`

### OGP

#### GET /ogp/message

- OGP画像生成
- クエリパラメータ:
  - `message`: 表示するテキスト（必須）
- レスポンス:
  - Content-Type: image/png

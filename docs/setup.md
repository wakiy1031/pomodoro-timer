# Focus Forge 開発環境セットアップガイド

## 目次

1. [技術スタック](#技術スタック)
2. [プロジェクト構成](#プロジェクト構成)
3. [開発環境のセットアップ](#開発環境のセットアップ)
4. [トラブルシューティング](#トラブルシューティング)
5. [開発のベストプラクティス](#開発のベストプラクティス)

## 技術スタック

### バックエンド

- Ruby: 3.2.2
- Ruby on Rails: 8.0.1（API モード）
- PostgreSQL: 14
- Redis: 7
- Sidekiq: バックグラウンドジョブ処理

### フロントエンド

- Next.js（App Router）
- TypeScript: ^5.0.0
- Node.js: ^20.0.0
- TailwindCSS
- Zustand（状態管理）
- Jest + React Testing Library

### インフラストラクチャ

- Docker & Docker Compose
- AWS（ECS Fargate, RDS, ElastiCache, S3, CloudFront）
- GitHub Actions（CI/CD）

## プロジェクト構成

本プロジェクトはモノレポ（単一リポジトリ）で管理されており、以下のような構成となっています：

```
pomodoro-timer/
├── .github/
│   └── workflows/          # GitHub Actions設定
│       ├── frontend.yml    # フロントエンド用CI/CD
│       └── backend.yml     # バックエンド用CI/CD
├── frontend/               # Next.jsアプリケーション
└── backend/               # Rails APIアプリケーション
```

### モノレポ構成のメリット

1. **コードの一元管理**

   - フロントエンド・バックエンドの変更履歴を一箇所で管理
   - 依存関係の管理が容易
   - デプロイの同期が取りやすい

2. **開発効率の向上**

   - プロジェクト全体を一度にクローン可能
   - 横断的な変更が容易
   - チーム間の連携がスムーズ

3. **CI/CD の柔軟な制御**
   - フロントエンド・バックエンドで個別のワークフローを実行可能
   - 変更があった部分のみビルド・テストを実行

## 開発環境のセットアップ

### 前提条件

- Docker
- Docker Compose
- Git

### 1. プロジェクトのセットアップ

#### Dockerfile の作成

`backend/Dockerfile.dev`を作成:

```dockerfile
ARG RUBY_VERSION=3.2.2
FROM docker.io/library/ruby:$RUBY_VERSION-slim

# 必要なパッケージをインストール
RUN apt-get update -qq && apt-get install -y \
  build-essential \
  libpq-dev \
  postgresql-client

# アプリケーションディレクトリを作成
WORKDIR /app

# Gemfile と Gemfile.lock をコピーし、依存関係をインストール
COPY Gemfile /app/Gemfile
COPY Gemfile.lock /app/Gemfile.lock
RUN bundle install

# アプリケーションの全ファイルをコンテナ内にコピー
COPY . /app

# サーバー起動
CMD ["rails", "server", "-b", "0.0.0.0"]
```

#### Docker Compose の設定

`backend/docker-compose.yml`を作成:

```yaml
version: "3"

services:
  web:
    build: .
    command: bash -c "rm -f tmp/pids/server.pid && bundle exec rails s -p 3000 -b '0.0.0.0'"
    volumes:
      - .:/rails
      - ruby-bundle-cache:/bundle
    ports:
      - "3000:3000"
    environment:
      RAILS_ENV: development
      DATABASE_HOST: db
      DATABASE_USERNAME: postgres
      DATABASE_PASSWORD: postgres
    depends_on:
      - db
      - redis

  db:
    image: postgres:14
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  sidekiq:
    build: .
    command: bundle exec sidekiq
    volumes:
      - .:/rails
      - ruby-bundle-cache:/bundle
    environment:
      RAILS_ENV: development
      DATABASE_HOST: db
      DATABASE_USERNAME: postgres
      DATABASE_PASSWORD: postgres
    depends_on:
      - db
      - redis

volumes:
  postgres_data:
  ruby-bundle-cache:
    external: true
```

### 2. データベース設定

`backend/config/database.yml`を設定:

```yaml
default: &default
  adapter: postgresql
  encoding: unicode
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  host: <%= ENV.fetch("DATABASE_HOST") { "db" } %>
  username: <%= ENV.fetch("DATABASE_USERNAME") { "postgres" } %>
  password: <%= ENV.fetch("DATABASE_PASSWORD") { "postgres" } %>

development:
  <<: *default
  database: focus_forge_development

test:
  <<: *default
  database: focus_forge_test

production:
  primary: &primary_production
    <<: *default
    database: app_production
    username: app
    password: <%= ENV["APP_DATABASE_PASSWORD"] %>
  cache:
    <<: *primary_production
    database: app_production_cache
    migrations_paths: db/cache_migrate
  queue:
    <<: *primary_production
    database: app_production_queue
    migrations_paths: db/queue_migrate
  cable:
    <<: *primary_production
    database: app_production_cable
    migrations_paths: db/cable_migrate
```

### 3. Gemfile の設定

`backend/Gemfile`の主要な依存関係:

```ruby
source "https://rubygems.org"

gem "rails", "~> 8.0.1"
gem "pg", "~> 1.1"
gem "puma", ">= 5.0"
gem "tzinfo-data", platforms: %i[ windows jruby ]
gem "bootsnap", require: false
gem "solid_cache"
gem "solid_queue"
gem "solid_cable"
gem "kamal", require: false
gem "thruster", require: false

group :development, :test do
  gem "debug", platforms: %i[ mri windows ], require: "debug/prelude"
  gem "brakeman", require: false
  gem "rubocop-rails-omakase", require: false
end
```

### 4. アプリケーションの起動

```bash
# Dockerイメージのビルド
docker compose build

# コンテナの起動
docker compose up -d

# データベースの作成とマイグレーション
docker compose exec web rails db:create db:migrate
```

## トラブルシューティング

### 1. ポートの競合が発生した場合

```bash
# 使用中のポートを確認
docker ps

# 競合しているコンテナを停止
docker stop [CONTAINER_ID]
```

### 2. データベース接続エラーの場合

```bash
# データベースの状態確認
docker compose exec db pg_isready

# データベースの再作成
docker compose exec web rails db:drop db:create db:migrate
```

### 3. コンテナの状態確認

```bash
# ログの確認
docker compose logs

# コンテナの状態確認
docker compose ps
```

## 開発のベストプラクティス

### 1. Git ブランチ戦略

- `main`: プロダクション用
- `develop`: 開発用ベースブランチ
- `feature/*`: 機能開発用
- `fix/*`: バグ修正用

### 2. コミットメッセージ規約

```
feat: 新機能
fix: バグ修正
docs: ドキュメント
style: コードスタイル
refactor: リファクタリング
test: テストコード
chore: ビルド・補助ツール
```

### 3. コードレビュー

- PR の作成前にローカルでテストを実行
- CI の完了を確認
- コードの品質とベストプラクティスの遵守を確認
- セキュリティの考慮

### 4. 環境変数の管理

- 機密情報は`.env`ファイルで管理
- 本番環境の機密情報は適切に暗号化
- 環境変数のサンプルは`.env.example`として提供

### 5. ドキュメント

- README の定期的な更新
- API ドキュメントの維持
- 設定変更の記録

## 次のステップ

1. フロントエンド環境のセットアップ
2. CI/CD パイプラインの構築
3. 本番環境のデプロイ設定
4. モニタリングとロギングの設定

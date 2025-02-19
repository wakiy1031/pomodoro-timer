FROM ruby:3.2.2

# 必要なパッケージのインストール
RUN apt-get update -qq && \
    apt-get install -y build-essential libpq-dev nodejs npm && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# アプリケーションディレクトリの作成
WORKDIR /app

# GemfileとGemfile.lockをコピー
COPY Gemfile* ./

# Bundlerのインストールと実行
RUN gem install bundler
RUN bundle install

# アプリケーションのコピー
COPY . .

# Railsサーバーの起動
CMD ["rails", "server", "-b", "0.0.0.0"] 
-- Stripe関連のカラムをusersテーブルに追加
-- このスクリプトをSupabase SQL Editorで実行してください

-- カラムを追加（既に存在する場合はスキップ）
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255);

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) 
CHECK (subscription_status IS NULL OR subscription_status IN ('trialing', 'active', 'canceled', 'past_due', 'unpaid', 'incomplete'));

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE;

-- インデックスを追加
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);

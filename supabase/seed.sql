-- Create Test Users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'userA@test.com', crypt('password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}'),
  ('22222222-2222-2222-2222-222222222222', 'userB@test.com', crypt('password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}')
ON CONFLICT (id) DO NOTHING;

-- Insert Posts for User A
INSERT INTO posts (user_id, platform, caption, media_type, posted_at, likes, comments, shares, engagement_rate)
VALUES
('11111111-1111-1111-1111-111111111111', 'instagram', 'User A Launch Day 🚀', 'image', NOW() - INTERVAL '2 days', 120, 10, 5, 5.5),
('11111111-1111-1111-1111-111111111111', 'tiktok', 'User A Viral Video', 'video', NOW() - INTERVAL '5 days', 5000, 200, 100, 12.0);

-- Insert Posts for User B (User A should NEVER see these)
INSERT INTO posts (user_id, platform, caption, media_type, posted_at, likes, comments, shares, engagement_rate)
VALUES
('22222222-2222-2222-2222-222222222222', 'instagram', 'User B Private Life', 'image', NOW() - INTERVAL '1 day', 50, 2, 1, 2.1);

-- Insert Daily Metrics for User A (30 days)
INSERT INTO daily_metrics (user_id, date, engagement, reach)
SELECT 
  '11111111-1111-1111-1111-111111111111',
  CURRENT_DATE - (i || ' days')::interval,
  floor(random() * 500 + 100)::int,
  floor(random() * 5000 + 1000)::int
FROM generate_series(0, 30) i;
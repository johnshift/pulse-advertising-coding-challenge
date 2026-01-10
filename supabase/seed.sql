-- ===================== Helper Functions =====================

CREATE OR REPLACE FUNCTION random_between(min_val INT, max_val INT)
RETURNS INT AS $$
BEGIN
  RETURN floor(random() * (max_val - min_val + 1) + min_val)::INT;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION random_platform()
RETURNS TEXT AS $$
DECLARE
  platforms TEXT[] := ARRAY['instagram', 'tiktok'];
BEGIN
  RETURN platforms[1 + floor(random() * array_length(platforms, 1))::INT];
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION random_media_type()
RETURNS TEXT AS $$
DECLARE
  media_types TEXT[] := ARRAY['image', 'video', 'carousel'];
BEGIN
  RETURN media_types[1 + floor(random() * array_length(media_types, 1))::INT];
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION random_lorem(quantity_ INT)
RETURNS TEXT AS $$
DECLARE
  words_ TEXT[];
  return_value_ TEXT := '';
  ind_ INT;
BEGIN
  words_ := ARRAY[
    'lorem', 'ipsum', 'dolor', 'amet', 'consectetur', 'adipiscing', 'elit',
    'accumsan', 'aenean', 'aliquam', 'aliquet', 'ante', 'aptent', 'arcu',
    'auctor', 'augue', 'bibendum', 'blandit', 'class', 'commodo', 'condimentum',
    'congue', 'consequat', 'conubia', 'convallis', 'cras', 'cubilia', 'curabitur',
    'curae', 'cursus', 'dapibus', 'diam', 'dictum', 'dictumst', 'dignissim',
    'donec', 'duis', 'egestas', 'eget', 'eleifend', 'elementum', 'enim', 'erat',
    'eros', 'etiam', 'euismod', 'facilisi', 'facilisis', 'fames', 'faucibus',
    'felis', 'fermentum', 'feugiat', 'fringilla', 'fusce', 'gravida', 'habitant',
    'habitasse', 'hendrerit', 'himenaeos', 'iaculis', 'imperdiet', 'inceptos',
    'integer', 'interdum', 'justo', 'lacinia', 'lacus', 'laoreet', 'lectus',
    'libero', 'ligula', 'litora', 'lobortis', 'luctus', 'maecenas', 'magna',
    'magnis', 'malesuada', 'massa', 'mattis', 'mauris', 'metus', 'molestie',
    'mollis', 'montes', 'morbi', 'nascetur', 'natoque', 'neque', 'netus', 'nibh',
    'nisi', 'nisl', 'nostra', 'nulla', 'nullam', 'nunc', 'odio', 'orci', 'ornare',
    'parturient', 'pellentesque', 'penatibus', 'pharetra', 'phasellus', 'placerat',
    'platea', 'porta', 'porttitor', 'posuere', 'potenti', 'praesent', 'pretium',
    'primis', 'proin', 'pulvinar', 'purus', 'quam', 'quis', 'quisque', 'rhoncus',
    'ridiculus', 'risus', 'rutrum', 'sagittis', 'sapien', 'scelerisque', 'semper',
    'senectus', 'sociis', 'sociosqu', 'sodales', 'sollicitudin', 'suscipit',
    'suspendisse', 'taciti', 'tellus', 'tempor', 'tempus', 'tincidunt', 'torquent',
    'tortor', 'tristique', 'turpis', 'ullamcorper', 'ultrices', 'ultricies', 'urna',
    'varius', 'vehicula', 'velit', 'venenatis', 'vestibulum', 'vitae', 'vivamus',
    'viverra', 'volutpat', 'vulputate'
  ];
  FOR ind_ IN 1..quantity_ LOOP
    ind_ := (random() * (array_upper(words_, 1) - 1))::INT + 1;
    IF return_value_ = '' THEN
      return_value_ := words_[ind_];
    ELSE
      return_value_ := return_value_ || ' ' || words_[ind_];
    END IF;
  END LOOP;
  RETURN UPPER(LEFT(return_value_, 1)) || SUBSTRING(return_value_ FROM 2);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION random_thumbnail(
  p_media_type TEXT,
  p_carousel_min INT,
  p_carousel_max INT,
  p_seed_max INT
)
RETURNS TEXT AS $$
DECLARE
  num_images INT;
  result TEXT := '';
  i INT;
BEGIN
  IF p_media_type IN ('image', 'video') THEN
    RETURN format('https://picsum.photos/seed/img%s/800/800', floor(random() * p_seed_max + 1)::INT);
  ELSE
    num_images := floor(random() * (p_carousel_max - p_carousel_min + 1) + p_carousel_min)::INT;
    FOR i IN 1..num_images LOOP
      IF result = '' THEN
        result := format('https://picsum.photos/seed/img%s/800/800', floor(random() * p_seed_max + 1)::INT);
      ELSE
        result := result || ',' || format('https://picsum.photos/seed/img%s/800/800', floor(random() * p_seed_max + 1)::INT);
      END IF;
    END LOOP;
    RETURN result;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ===================== Seed Data =====================

DO $$
DECLARE
  -- Configuration constants
  c_num_users CONSTANT INT := 2;
  c_num_days CONSTANT INT := 60;
  c_posts_per_day_min CONSTANT INT := 3;
  c_posts_per_day_max CONSTANT INT := 5;

  -- Caption word count range (varying lengths)
  c_caption_words_min CONSTANT INT := 3;
  c_caption_words_max CONSTANT INT := 12;

  -- Thumbnail image seed max (for picsum.photos/seed/img{N}/800/800)
  c_image_seed_max CONSTANT INT := 8;

  -- Carousel image count range
  c_carousel_min CONSTANT INT := 2;
  c_carousel_max CONSTANT INT := 5;

  -- Engagement metric ranges
  c_likes_min CONSTANT INT := 50;
  c_likes_max CONSTANT INT := 2000;
  c_comments_min CONSTANT INT := 5;
  c_comments_max CONSTANT INT := 200;
  c_shares_min CONSTANT INT := 2;
  c_shares_max CONSTANT INT := 100;
  c_saves_min CONSTANT INT := 5;
  c_saves_max CONSTANT INT := 150;
  c_reach_min CONSTANT INT := 500;
  c_reach_max CONSTANT INT := 15000;

  -- Loop variables
  i INT;
  current_id UUID;
  current_email TEXT;
  _now TIMESTAMP;
BEGIN
  FOR i IN 1..c_num_users LOOP
    current_id := gen_random_uuid();
    current_email := CONCAT('demo', i::TEXT, '@example.com');
    _now := current_timestamp;

    -- Insert auth.users
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      created_at,
      updated_at,
      phone,
      phone_confirmed_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000'::UUID,
      current_id,
      'authenticated',
      'authenticated',
      current_email,
      crypt('password123', gen_salt('bf')),
      current_timestamp,
      current_timestamp,
      '{"provider":"email","providers":["email"]}',
      '{}'::JSONB,
      FALSE,
      _now,
      _now,
      NULL,
      NULL,
      '',
      '',
      '',
      ''
    )
    ON CONFLICT (id) DO NOTHING;

    -- Insert auth.identities
    INSERT INTO auth.identities (
      id,
      provider_id,
      user_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    )
    VALUES (
      current_id,
      current_id::TEXT,
      current_id,
      format('{"sub":"%s"}', current_id)::JSONB,
      'email',
      current_timestamp,
      current_timestamp,
      current_timestamp
    )
    ON CONFLICT (provider_id, provider) DO NOTHING;

    -- Generate posts for each day
    INSERT INTO posts (
      user_id,
      platform,
      caption,
      media_type,
      thumbnail_url,
      posted_at,
      likes,
      comments,
      shares,
      saves,
      reach,
      impressions,
      engagement_rate
    )
    SELECT
      current_id,
      random_platform(),
      random_lorem(random_between(c_caption_words_min, c_caption_words_max)),
      sub.media_type,
      random_thumbnail(sub.media_type, c_carousel_min, c_carousel_max, c_image_seed_max),
      (current_date - (day_offset || ' days')::INTERVAL) + (post_num || ' hours')::INTERVAL,
      random_between(c_likes_min, c_likes_max),
      random_between(c_comments_min, c_comments_max),
      random_between(c_shares_min, c_shares_max),
      random_between(c_saves_min, c_saves_max),
      random_between(c_reach_min, c_reach_max),
      random_between(c_reach_min, c_reach_max) * (1.2 + random() * 0.6)::INT,
      0
    FROM
      generate_series(0, c_num_days - 1) AS day_offset,
      generate_series(1, random_between(c_posts_per_day_min, c_posts_per_day_max)) AS post_num,
      LATERAL (SELECT random_media_type() AS media_type) AS sub;

    -- Update engagement_rate based on actual values
    UPDATE posts
    SET engagement_rate = ROUND(((likes + comments + shares + saves)::DECIMAL / NULLIF(reach, 0)) * 100, 2)
    WHERE user_id = current_id AND engagement_rate = 0;

    -- Calculate daily_metrics from posts
    INSERT INTO daily_metrics (user_id, date, engagement, reach)
    SELECT
      user_id,
      posted_at::DATE,
      SUM(likes + comments + shares + saves)::INT,
      SUM(reach)::INT
    FROM posts
    WHERE user_id = current_id
    GROUP BY user_id, posted_at::DATE
    ON CONFLICT (user_id, date) DO NOTHING;

  END LOOP;
END $$;

-- ===================== Cleanup =====================

DROP FUNCTION IF EXISTS random_between(INT, INT);
DROP FUNCTION IF EXISTS random_platform();
DROP FUNCTION IF EXISTS random_media_type();
DROP FUNCTION IF EXISTS random_lorem(INT);
DROP FUNCTION IF EXISTS random_thumbnail(TEXT, INT, INT, INT);

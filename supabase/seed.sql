do $$
declare
	i int;
	num_users int = 2;
	current_id uuid;
	current_email text;
	current_username text;
	current_bio text;
	current_avatar text;
	current_firstname text;
	current_lastname text;
	_now timestamp;
begin
	for i in 1..num_users loop
		current_id := (select gen_random_uuid());
		current_email := (CONCAT('demo', i::text, '@example.com'));
		current_username := (CONCAT('demo', i::text));
		current_avatar :=(CONCAT('https://avatars.dicebear.com/api/identicon/', current_id, '.svg'));
		current_firstname := (CONCAT('firstname', i::text));
		current_lastname := (CONCAT('lastname', i::text));
		_now := current_timestamp;

		-- insert demo_user to auth.users
		insert into auth.users (
			instance_id,
			id,
			aud,"role",email,
			encrypted_password,
			email_confirmed_at, last_sign_in_at,
			raw_app_meta_data, 
			raw_user_meta_data,
			is_super_admin,
			created_at, updated_at,
			phone, phone_confirmed_at, 
			confirmation_token, email_change, email_change_token_new, recovery_token
		) 
		values (
			'00000000-0000-0000-0000-000000000000'::uuid,
			current_id,
			'authenticated','authenticated', current_email,    
			crypt('password123', gen_salt('bf')),
			current_timestamp, current_timestamp,
			'{"provider":"email","providers":["email"]}',
			'{}'::jsonb,
			false,
			_now, _now,
			null,null,
			'','','',''
		)
		on conflict (id) do nothing;

		insert into auth.identities (id,provider_id,user_id,identity_data,provider,last_sign_in_at,created_at,updated_at) 
		values
			(
				current_id,
				current_id::text,
				current_id,
				format('{"sub":"%s"}', current_id)::jsonb,
				'email',current_timestamp,current_timestamp,current_timestamp)
		on conflict (provider_id, provider) do nothing;

		-- insert posts
		insert into posts (
			user_id,
			platform,
			caption,
			media_type,
			posted_at,
			likes,
			comments,
			shares,
			saves,
			reach,
			impressions,
			engagement_rate
		)
		values
			(
				current_id,
				'instagram',
				format('Demo %s Instagram Post 🚀', i),
				'image',
				now() - interval '2 days',
				120 * i,
				10 * i,
				5 * i,
				8 * i,
				1000 * i,
				1500 * i,
				5.5
			),
			(
				current_id,
				'tiktok',
				format('Demo %s TikTok Video 🎬', i),
				'video',
				now() - interval '5 days',
				5000 * i,
				200 * i,
				100 * i,
				150 * i,
				10000 * i,
				15000 * i,
				12.0
			);

		-- insert daily metrics (30 days)
		insert into daily_metrics (
			user_id,
			date,
			engagement,
			reach
		)
		select
			current_id,
			current_date - (d || ' days')::interval,
			floor(random() * 500 + 100)::int * i,
			floor(random() * 5000 + 1000)::int * i
		from generate_series(0, 29) d
		on conflict (user_id, date) do nothing;

	end loop;
end $$;
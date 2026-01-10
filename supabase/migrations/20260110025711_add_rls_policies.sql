-- Enable RLS Policies
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;

-- POSTS POLICIES
CREATE POLICY "Users can view own posts" 
ON posts FOR SELECT 
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own posts" 
ON posts FOR INSERT 
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own posts" 
ON posts FOR UPDATE 
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own posts" 
ON posts FOR DELETE 
USING ((select auth.uid()) = user_id);

-- METRICS POLICIES
CREATE POLICY "Users can view own metrics" 
ON daily_metrics FOR SELECT 
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own metrics" 
ON daily_metrics FOR INSERT 
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own metrics" 
ON daily_metrics FOR UPDATE 
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own metrics" 
ON daily_metrics FOR DELETE 
USING ((select auth.uid()) = user_id);

-- RLS Performance Recommendations (on select auth.uid() instead of auth.uid = user_id)
-- https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select
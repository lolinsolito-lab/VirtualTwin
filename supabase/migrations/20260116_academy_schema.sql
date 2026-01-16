-- Academy Manager Database Schema
-- Manage courses, modules, and content per subscription tier

-- ============================================
-- 1. COURSES TABLE (Main course/program)
-- ============================================
CREATE TABLE IF NOT EXISTS academy_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    
    -- Tier access control
    min_tier TEXT NOT NULL DEFAULT 'solopreneur' 
        CHECK (min_tier IN ('solopreneur', 'entrepreneur', 'conquistatore', 'imperatore')),
    
    -- Status
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    
    -- Ordering
    display_order INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 2. MODULES TABLE (Sections within a course)
-- ============================================
CREATE TABLE IF NOT EXISTS academy_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES academy_courses(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    description TEXT,
    
    -- Content type
    content_type TEXT NOT NULL DEFAULT 'video'
        CHECK (content_type IN ('video', 'pdf', 'audio', 'text', 'quiz', 'assignment')),
    
    -- Content URLs
    content_url TEXT, -- Video URL, PDF link, etc.
    thumbnail_url TEXT,
    duration_minutes INTEGER, -- For videos/audio
    
    -- Access control (can override course min_tier)
    min_tier TEXT CHECK (min_tier IN ('solopreneur', 'entrepreneur', 'conquistatore', 'imperatore')),
    
    -- Status
    is_published BOOLEAN DEFAULT false,
    is_preview BOOLEAN DEFAULT false, -- Allow preview without subscription
    
    -- Ordering
    display_order INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 3. USER PROGRESS TRACKING
-- ============================================
CREATE TABLE IF NOT EXISTS academy_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES academy_modules(id) ON DELETE CASCADE,
    
    -- Progress status
    status TEXT NOT NULL DEFAULT 'not_started'
        CHECK (status IN ('not_started', 'in_progress', 'completed')),
    
    progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
    
    -- Timestamps
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    last_accessed_at TIMESTAMPTZ DEFAULT now(),
    
    -- Unique constraint: one progress record per user per module
    UNIQUE(user_id, module_id)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_academy_modules_course ON academy_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_academy_progress_user ON academy_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_academy_progress_module ON academy_progress(module_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Courses: Public read for published, admin write
ALTER TABLE academy_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "academy_courses_public_read" ON academy_courses
    FOR SELECT USING (is_published = true);

CREATE POLICY "academy_courses_admin_all" ON academy_courses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND (profiles.is_super_admin = true OR profiles.role = 'admin')
        )
    );

-- Modules: Public read for published, admin write
ALTER TABLE academy_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "academy_modules_public_read" ON academy_modules
    FOR SELECT USING (is_published = true);

CREATE POLICY "academy_modules_admin_all" ON academy_modules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND (profiles.is_super_admin = true OR profiles.role = 'admin')
        )
    );

-- Progress: Users can read/write their own progress
ALTER TABLE academy_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "academy_progress_own" ON academy_progress
    FOR ALL USING (user_id = auth.uid());

-- ============================================
-- SEED DATA: Sample courses per tier
-- ============================================
INSERT INTO academy_courses (title, description, min_tier, is_published, display_order) VALUES
    ('Fondamenti VirtualTwin', 'Impara le basi per configurare e ottimizzare il tuo clone digitale.', 'solopreneur', true, 1),
    ('Strategie Avanzate', 'Tecniche avanzate per massimizzare le conversazioni e le conversioni.', 'entrepreneur', true, 2),
    ('Automazione Totale', 'Automatizza completamente il tuo business con workflow intelligenti.', 'conquistatore', true, 3),
    ('Masterclass Imperatore', 'Accesso esclusivo alle strategie utilizzate dai top performer.', 'imperatore', true, 4)
ON CONFLICT DO NOTHING;

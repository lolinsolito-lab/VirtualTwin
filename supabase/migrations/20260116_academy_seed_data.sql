-- SEED DATA: Migrate existing mock videoModules to database
-- This populates academy_courses and academy_modules with all existing content
-- Run AFTER the main schema and curioso tier migrations

-- First, clear existing sample courses (keep fresh)
DELETE FROM academy_courses WHERE title IN (
    'Fondamenti VirtualTwin', 
    'Strategie Avanzate', 
    'Automazione Totale', 
    'Masterclass Imperatore',
    'Benvenuto in VirtualTwin'
);

-- =====================================================
-- COURSE 1: Fondamenta dell'Impero (curioso - free tier)
-- =====================================================
INSERT INTO academy_courses (id, title, description, min_tier, is_published, is_featured, display_order)
VALUES (
    'c1000000-0000-0000-0000-000000000001',
    'Fondamenta dell''Impero',
    'I primi passi per comprendere la potenza dei datori di lavoro digitali.',
    'curioso',
    true,
    true,
    1
);

INSERT INTO academy_modules (course_id, title, description, content_type, duration_minutes, is_published, is_preview, display_order) VALUES
('c1000000-0000-0000-0000-000000000001', 'La Genesi del Clone AI', 'Scopri come nasce un clone digitale e perché è diverso da un semplice bot.', 'video', 12, true, true, 1),
('c1000000-0000-0000-0000-000000000001', 'Mentalità Sovereign', 'La mentalità del fondatore che non scambia tempo per denaro.', 'video', 8, true, true, 2);

-- =====================================================
-- COURSE 2: Esecuzione Strategica (solopreneur)
-- =====================================================
INSERT INTO academy_courses (id, title, description, min_tier, is_published, is_featured, display_order)
VALUES (
    'c1000000-0000-0000-0000-000000000002',
    'Esecuzione Strategica',
    'Trasforma le conversazioni in conversioni automatiche.',
    'solopreneur',
    true,
    false,
    2
);

INSERT INTO academy_modules (course_id, title, description, content_type, duration_minutes, is_published, display_order) VALUES
('c1000000-0000-0000-0000-000000000002', 'Architettura delle Vendite', 'Come strutturare il tuo funnel di vendita via chat.', 'video', 15, true, 1),
('c1000000-0000-0000-0000-000000000002', 'Gestione Obiezioni via Chat', 'Tecniche per superare ogni resistenza del prospect.', 'video', 14, true, 2);

-- =====================================================
-- COURSE 3: Ottimizzazione Imperiale (solopreneur)
-- =====================================================
INSERT INTO academy_courses (id, title, description, min_tier, is_published, is_featured, display_order)
VALUES (
    'c1000000-0000-0000-0000-000000000003',
    'Ottimizzazione Imperiale',
    'Affina i tuoi sistemi AI per velocità e precisione chirurgica.',
    'solopreneur',
    true,
    false,
    3
);

INSERT INTO academy_modules (course_id, title, description, content_type, duration_minutes, is_published, display_order) VALUES
('c1000000-0000-0000-0000-000000000003', 'Fine-Tuning delle FAQ d''Elite', 'Ottimizza le risposte del tuo clone per massima precisione.', 'video', 11, true, 1),
('c1000000-0000-0000-0000-000000000003', 'Analisi dei Pattern di Conversione', 'Identifica e replica i pattern che convertono di più.', 'video', 13, true, 2);

-- =====================================================
-- COURSE 4: Dominio del Mercato (entrepreneur)
-- =====================================================
INSERT INTO academy_courses (id, title, description, min_tier, is_published, is_featured, display_order)
VALUES (
    'c1000000-0000-0000-0000-000000000004',
    'Dominio del Mercato',
    'Tecniche avanzate di outreach e posizionamento elite.',
    'entrepreneur',
    true,
    true,
    4
);

INSERT INTO academy_modules (course_id, title, description, content_type, duration_minutes, is_published, display_order) VALUES
('c1000000-0000-0000-0000-000000000004', 'Outreach Magnetico su LinkedIn', 'Strategie per connetterti con lead ad alto valore.', 'video', 18, true, 1),
('c1000000-0000-0000-0000-000000000004', 'Scaling: Da 1 a 100 Cloni', 'Come scalare il tuo impero di cloni digitali.', 'video', 20, true, 2);

-- =====================================================
-- COURSE 5: Protocollo Genesis (entrepreneur - wave exclusive)
-- =====================================================
INSERT INTO academy_courses (id, title, description, min_tier, is_published, is_featured, display_order)
VALUES (
    'c1000000-0000-0000-0000-000000000005',
    'Protocollo Genesis (Esclusivo)',
    'Segreti riservati ai primi 20 fondatori che hanno dato vita all''impero.',
    'entrepreneur',
    true,
    true,
    5
);

INSERT INTO academy_modules (course_id, title, description, content_type, duration_minutes, is_published, display_order) VALUES
('c1000000-0000-0000-0000-000000000005', 'Il Vantaggio del Primo Sovrano', 'I vantaggi esclusivi dei Genesis Founders.', 'video', 22, true, 1),
('c1000000-0000-0000-0000-000000000005', 'Architettura Founder Genesis', 'La struttura mentale dei fondatori di successo.', 'video', 18, true, 2);

-- =====================================================
-- COURSE 6: Protocollo Pioneer (entrepreneur - wave exclusive)
-- =====================================================
INSERT INTO academy_courses (id, title, description, min_tier, is_published, is_featured, display_order)
VALUES (
    'c1000000-0000-0000-0000-000000000006',
    'Protocollo Pioneer (Scale-Up)',
    'Strategie di espansione per chi ha cavalcato la seconda ondata.',
    'entrepreneur',
    true,
    false,
    6
);

INSERT INTO academy_modules (course_id, title, description, content_type, duration_minutes, is_published, display_order) VALUES
('c1000000-0000-0000-0000-000000000006', 'Scaling Pioneer: Da 10k a 50k', 'Come passare da 10k a 50k MRR con i cloni.', 'video', 25, true, 1);

-- =====================================================
-- COURSE 7: Espansione Dominante (conquistatore)
-- =====================================================
INSERT INTO academy_courses (id, title, description, min_tier, is_published, is_featured, display_order)
VALUES (
    'c1000000-0000-0000-0000-000000000007',
    'Espansione Dominante',
    'Gestisci team, deleghe e API per una scalata senza limiti.',
    'conquistatore',
    true,
    true,
    7
);

INSERT INTO academy_modules (course_id, title, description, content_type, duration_minutes, is_published, display_order) VALUES
('c1000000-0000-0000-0000-000000000007', 'Delega Strategica alle Macchine', 'Come delegare task complessi ai tuoi sistemi AI.', 'video', 19, true, 1),
('c1000000-0000-0000-0000-000000000007', 'Integrazioni API: Il Cervello Centralizzato', 'Collega tutti i tuoi sistemi per automazione totale.', 'video', 22, true, 2);

-- =====================================================
-- COURSE 8: Maestria Assoluta (imperatore)
-- =====================================================
INSERT INTO academy_courses (id, title, description, min_tier, is_published, is_featured, display_order)
VALUES (
    'c1000000-0000-0000-0000-000000000008',
    'Maestria Assoluta',
    'Il protocollo finale per il dominio totale del tuo settore.',
    'imperatore',
    true,
    true,
    8
);

INSERT INTO academy_modules (course_id, title, description, content_type, duration_minutes, is_published, display_order) VALUES
('c1000000-0000-0000-0000-000000000008', 'Protocollo Sovrano: Mastery', 'Il protocollo definitivo per dominare il tuo settore.', 'video', 25, true, 1);

-- =====================================================
-- VERIFICATION: Count what we inserted
-- =====================================================
-- SELECT 'Courses inserted: ' || COUNT(*) FROM academy_courses;
-- SELECT 'Modules inserted: ' || COUNT(*) FROM academy_modules;

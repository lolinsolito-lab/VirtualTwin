import { supabaseAdmin } from './supabase';

export interface AuthResult {
    user: any | null;
    profile: any | null;
    error?: string;
    statusCode: number;
}

/**
 * Authenticates a request using the Authorization Bearer token.
 * Returns the Supabase user and profile if valid.
 */
export async function authenticateRequest(req: Request): Promise<AuthResult> {
    try {
        const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return { 
                user: null, 
                profile: null, 
                error: 'Autenticazione richiesta. Token mancante.', 
                statusCode: 401 
            };
        }

        const token = authHeader.replace('Bearer ', '').trim();
        if (!token) {
            return { 
                user: null, 
                profile: null, 
                error: 'Autenticazione richiesta. Token vuoto.', 
                statusCode: 401 
            };
        }

        // Verify the token with Supabase Auth
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user) {
            return { 
                user: null, 
                profile: null, 
                error: 'Sessione non valida o scaduta. Effettua nuovamente il login.', 
                statusCode: 401 
            };
        }

        // Fetch user profile from database
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            return { 
                user, 
                profile: null, 
                error: 'Profilo utente non trovato o inattivo.', 
                statusCode: 403 
            };
        }

        return { user, profile, statusCode: 200 };
    } catch (err: any) {
        console.error('[Auth Utility] Unexpected error:', err);
        return { 
            user: null, 
            profile: null, 
            error: 'Errore interno del server durante l\'autenticazione.', 
            statusCode: 500 
        };
    }
}

/**
 * Authenticates a request and verifies the caller has admin or superadmin privileges.
 */
export async function authenticateAdminRequest(req: Request): Promise<AuthResult> {
    const auth = await authenticateRequest(req);
    if (auth.error) {
        return auth;
    }

    const isAdmin = auth.profile.is_super_admin || auth.profile.role === 'admin';
    if (!isAdmin) {
        return {
            user: auth.user,
            profile: auth.profile,
            error: 'Accesso negato. Sono richiesti i privilegi di amministratore.',
            statusCode: 403
        };
    }

    return auth;
}

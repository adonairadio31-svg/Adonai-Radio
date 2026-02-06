import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://crbzhmwdeqhqzrgurcve.supabase.co';
const supabaseKey = 'sb_publishable_8_E3ipN-svWCnrBevilRbw_kifEmugN';

export const supabase = createClient(supabaseUrl, supabaseKey);

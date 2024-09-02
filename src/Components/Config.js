import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from '@supabase/supabase-js';
import {HfInference} from '@huggingface/inference'
const apiKey_g = import.meta.env.VITE_GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey_g);
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
// console.log(supabaseUrl,supabaseKey);
const supabase = createClient(supabaseUrl, supabaseKey);
// console.log(supabase);
const hf_token= import.meta.env.VITE_HF_TOKEN;
const hf= new HfInference (hf_token);

export { genAI,supabase,hf};
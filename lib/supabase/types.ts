export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      analyses: {
        Row: {
          id: string;
          type: "virality" | "slop" | "hook" | "compose" | "feed" | "dna" | "strategy";
          input_text: string;
          result: Json;
          overall_score: number | null;
          verdict: string | null;
          created_at: string;
          session_id: string | null;
        };
        Insert: {
          id?: string;
          type: "virality" | "slop" | "hook" | "compose" | "feed" | "dna" | "strategy";
          input_text: string;
          result: Json;
          overall_score?: number | null;
          verdict?: string | null;
          created_at?: string;
          session_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["analyses"]["Insert"]>;
      };
      drafts: {
        Row: {
          id: string;
          content: string;
          label: string | null;
          virality_score: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          content: string;
          label?: string | null;
          virality_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["drafts"]["Insert"]>;
      };
      creator_profiles: {
        Row: {
          id: string;
          name: string;
          sample_posts: string;
          dna: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          sample_posts: string;
          dna: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["creator_profiles"]["Insert"]>;
      };
      strategies: {
        Row: {
          id: string;
          context: string;
          plan: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          context: string;
          plan: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["strategies"]["Insert"]>;
      };
    };
  };
}

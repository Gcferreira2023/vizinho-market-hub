export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ad_images: {
        Row: {
          ad_id: string | null
          id: string
          image_url: string
          position: number | null
        }
        Insert: {
          ad_id?: string | null
          id?: string
          image_url: string
          position?: number | null
        }
        Update: {
          ad_id?: string | null
          id?: string
          image_url?: string
          position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_images_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
        ]
      }
      ads: {
        Row: {
          availability: string | null
          category: string
          condominium_id: string | null
          created_at: string | null
          delivery: boolean | null
          delivery_fee: number | null
          description: string
          id: string
          payment_methods: string | null
          price: number
          price_upon_request: boolean | null
          status: string | null
          title: string
          type: string | null
          updated_at: string | null
          user_id: string | null
          view_count: number | null
        }
        Insert: {
          availability?: string | null
          category: string
          condominium_id?: string | null
          created_at?: string | null
          delivery?: boolean | null
          delivery_fee?: number | null
          description: string
          id?: string
          payment_methods?: string | null
          price: number
          price_upon_request?: boolean | null
          status?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
        }
        Update: {
          availability?: string | null
          category?: string
          condominium_id?: string | null
          created_at?: string | null
          delivery?: boolean | null
          delivery_fee?: number | null
          description?: string
          id?: string
          payment_methods?: string | null
          price?: number
          price_upon_request?: boolean | null
          status?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ads_condominium_id_fkey"
            columns: ["condominium_id"]
            isOneToOne: false
            referencedRelation: "condominiums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          description: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      cities: {
        Row: {
          created_at: string
          id: string
          name: string
          state_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          state_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          state_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cities_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      condominiums: {
        Row: {
          address: string | null
          approved: boolean
          city_id: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          address?: string | null
          approved?: boolean
          city_id: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          address?: string | null
          approved?: boolean
          city_id?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "condominiums_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          ad_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          ad_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          ad_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          read: boolean | null
          receiver_id: string | null
          sender_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ratings: {
        Row: {
          ad_id: string | null
          comment: string | null
          created_at: string | null
          id: string
          rated_user_id: string | null
          rating: number
          reviewer_id: string | null
        }
        Insert: {
          ad_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          rated_user_id?: string | null
          rating: number
          reviewer_id?: string | null
        }
        Update: {
          ad_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          rated_user_id?: string | null
          rating?: number
          reviewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ratings_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          rated_user_id: string | null
          rating: number | null
          reviewer_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rated_user_id?: string | null
          rating?: number | null
          reviewer_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rated_user_id?: string | null
          rating?: number | null
          reviewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_rated_user_id_fkey"
            columns: ["rated_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      states: {
        Row: {
          created_at: string
          id: string
          name: string
          uf: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          uf: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          uf?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          apartment: string | null
          block: string | null
          condominium_id: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          password_hash: string
          phone: string | null
          profile_picture: string | null
        }
        Insert: {
          apartment?: string | null
          block?: string | null
          condominium_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          password_hash: string
          phone?: string | null
          profile_picture?: string | null
        }
        Update: {
          apartment?: string | null
          block?: string | null
          condominium_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          password_hash?: string
          phone?: string | null
          profile_picture?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_condominium_id_fkey"
            columns: ["condominium_id"]
            isOneToOne: false
            referencedRelation: "condominiums"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_ad_view: {
        Args: { ad_id: string }
        Returns: number
      }
      suggest_condominium: {
        Args: { p_city_id: string; p_name: string; p_address?: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

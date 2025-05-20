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
      candidates: {
        Row: {
          address: string | null
          birth_date: string
          city: string | null
          cpf: string
          curriculum_url: string | null
          debt_clearance_certificate_url: string | null
          disability_description: string | null
          document_url: string | null
          email: string | null
          form_id: string
          full_name: string
          gender: string
          graduation_certificate_url: string | null
          has_disability: boolean | null
          high_school_certificate_url: string | null
          id: string
          marital_status: string | null
          neighborhood: string | null
          phone: string
          phone_secondary: string | null
          position_name: string
          professional_card_url: string | null
          submission_date: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          birth_date: string
          city?: string | null
          cpf: string
          curriculum_url?: string | null
          debt_clearance_certificate_url?: string | null
          disability_description?: string | null
          document_url?: string | null
          email?: string | null
          form_id: string
          full_name: string
          gender: string
          graduation_certificate_url?: string | null
          has_disability?: boolean | null
          high_school_certificate_url?: string | null
          id?: string
          marital_status?: string | null
          neighborhood?: string | null
          phone: string
          phone_secondary?: string | null
          position_name: string
          professional_card_url?: string | null
          submission_date?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string
          city?: string | null
          cpf?: string
          curriculum_url?: string | null
          debt_clearance_certificate_url?: string | null
          disability_description?: string | null
          document_url?: string | null
          email?: string | null
          form_id?: string
          full_name?: string
          gender?: string
          graduation_certificate_url?: string | null
          has_disability?: boolean | null
          high_school_certificate_url?: string | null
          id?: string
          marital_status?: string | null
          neighborhood?: string | null
          phone?: string
          phone_secondary?: string | null
          position_name?: string
          professional_card_url?: string | null
          submission_date?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidates_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
        ]
      }
      colaboradores: {
        Row: {
          active: boolean | null
          activities: string | null
          birth_date: string | null
          brief_description: string | null
          cargo: string | null
          created_at: string | null
          data_admissao: string
          date_dismissal: string | null
          departamento: string | null
          education: string | null
          email: string | null
          escalao: string | null
          ethnicity: string | null
          foto: string | null
          gender: string | null
          grupo_cargo: string | null
          hierarquia: string | null
          id: number
          id_number: string | null
          minimum_wage: number | null
          nivel: string | null
          nivel_lideranca: string | null
          nome: string
          reason_dismissal: string | null
          registration: string | null
          senior: string | null
          senior_id: number | null
          senior_name: string | null
          status: string | null
          type_contract: string | null
          unidade: string | null
          updated_at: string | null
          vinculo_externos: Json | null
          work_shift: string | null
        }
        Insert: {
          active?: boolean | null
          activities?: string | null
          birth_date?: string | null
          brief_description?: string | null
          cargo?: string | null
          created_at?: string | null
          data_admissao: string
          date_dismissal?: string | null
          departamento?: string | null
          education?: string | null
          email?: string | null
          escalao?: string | null
          ethnicity?: string | null
          foto?: string | null
          gender?: string | null
          grupo_cargo?: string | null
          hierarquia?: string | null
          id?: number
          id_number?: string | null
          minimum_wage?: number | null
          nivel?: string | null
          nivel_lideranca?: string | null
          nome: string
          reason_dismissal?: string | null
          registration?: string | null
          senior?: string | null
          senior_id?: number | null
          senior_name?: string | null
          status?: string | null
          type_contract?: string | null
          unidade?: string | null
          updated_at?: string | null
          vinculo_externos?: Json | null
          work_shift?: string | null
        }
        Update: {
          active?: boolean | null
          activities?: string | null
          birth_date?: string | null
          brief_description?: string | null
          cargo?: string | null
          created_at?: string | null
          data_admissao?: string
          date_dismissal?: string | null
          departamento?: string | null
          education?: string | null
          email?: string | null
          escalao?: string | null
          ethnicity?: string | null
          foto?: string | null
          gender?: string | null
          grupo_cargo?: string | null
          hierarquia?: string | null
          id?: number
          id_number?: string | null
          minimum_wage?: number | null
          nivel?: string | null
          nivel_lideranca?: string | null
          nome?: string
          reason_dismissal?: string | null
          registration?: string | null
          senior?: string | null
          senior_id?: number | null
          senior_name?: string | null
          status?: string | null
          type_contract?: string | null
          unidade?: string | null
          updated_at?: string | null
          vinculo_externos?: Json | null
          work_shift?: string | null
        }
        Relationships: []
      }
      compras_clientes: {
        Row: {
          data_criacao: string | null
          id: number
          municipio: string
          nome: string
        }
        Insert: {
          data_criacao?: string | null
          id?: number
          municipio: string
          nome: string
        }
        Update: {
          data_criacao?: string | null
          id?: number
          municipio?: string
          nome?: string
        }
        Relationships: []
      }
      compras_grupos_itens: {
        Row: {
          data_criacao: string | null
          id: number
          nome: string
        }
        Insert: {
          data_criacao?: string | null
          id?: number
          nome: string
        }
        Update: {
          data_criacao?: string | null
          id?: number
          nome?: string
        }
        Relationships: []
      }
      compras_historico_status: {
        Row: {
          data_criacao: string
          id: number
          solicitacao_id: number
          status: string
          usuario_id: number
        }
        Insert: {
          data_criacao?: string
          id?: number
          solicitacao_id: number
          status: string
          usuario_id: number
        }
        Update: {
          data_criacao?: string
          id?: number
          solicitacao_id?: number
          status?: string
          usuario_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "compras_historico_status_solicitacao_id_fkey"
            columns: ["solicitacao_id"]
            isOneToOne: false
            referencedRelation: "compras_solicitacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_historico_status_solicitacao_id_fkey"
            columns: ["solicitacao_id"]
            isOneToOne: false
            referencedRelation: "vw_solicitacoes_detalhadas"
            referencedColumns: ["id_solicitacao"]
          },
          {
            foreignKeyName: "compras_historico_status_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "compras_usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      compras_itens: {
        Row: {
          data_criacao: string | null
          grupo_id: number | null
          id: number
          nome: string
          unidade_medida_id: number | null
          valor_medio: number | null
        }
        Insert: {
          data_criacao?: string | null
          grupo_id?: number | null
          id?: number
          nome: string
          unidade_medida_id?: number | null
          valor_medio?: number | null
        }
        Update: {
          data_criacao?: string | null
          grupo_id?: number | null
          id?: number
          nome?: string
          unidade_medida_id?: number | null
          valor_medio?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "compras_itens_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "compras_grupos_itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_itens_unidade_medida_id_fkey"
            columns: ["unidade_medida_id"]
            isOneToOne: false
            referencedRelation: "compras_unidades_medida"
            referencedColumns: ["id"]
          },
        ]
      }
      compras_itens_solicitacao: {
        Row: {
          data_criacao: string | null
          id: number
          item_id: number
          quantidade: number
          solicitacao_id: number
        }
        Insert: {
          data_criacao?: string | null
          id?: number
          item_id: number
          quantidade: number
          solicitacao_id: number
        }
        Update: {
          data_criacao?: string | null
          id?: number
          item_id?: number
          quantidade?: number
          solicitacao_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "compras_itens_solicitacao_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "compras_itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_itens_solicitacao_solicitacao_id_fkey"
            columns: ["solicitacao_id"]
            isOneToOne: false
            referencedRelation: "compras_solicitacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_itens_solicitacao_solicitacao_id_fkey"
            columns: ["solicitacao_id"]
            isOneToOne: false
            referencedRelation: "vw_solicitacoes_detalhadas"
            referencedColumns: ["id_solicitacao"]
          },
        ]
      }
      compras_rubricas: {
        Row: {
          cliente_id: number
          data_criacao: string | null
          id: number
          nome: string
          valor_mensal: number
        }
        Insert: {
          cliente_id: number
          data_criacao?: string | null
          id?: number
          nome: string
          valor_mensal: number
        }
        Update: {
          cliente_id?: number
          data_criacao?: string | null
          id?: number
          nome?: string
          valor_mensal?: number
        }
        Relationships: [
          {
            foreignKeyName: "compras_rubricas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "compras_clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      compras_solicitacoes: {
        Row: {
          cliente_id: number
          data_criacao: string | null
          id: number
          justificativa: string
          justificativa_rejeicao: string | null
          prioridade: string
          rubrica_id: number
          status: string
          tipo_solicitacao: string
          unidade_id: number
          usuario_id: number
        }
        Insert: {
          cliente_id: number
          data_criacao?: string | null
          id?: number
          justificativa: string
          justificativa_rejeicao?: string | null
          prioridade: string
          rubrica_id: number
          status?: string
          tipo_solicitacao: string
          unidade_id: number
          usuario_id: number
        }
        Update: {
          cliente_id?: number
          data_criacao?: string | null
          id?: number
          justificativa?: string
          justificativa_rejeicao?: string | null
          prioridade?: string
          rubrica_id?: number
          status?: string
          tipo_solicitacao?: string
          unidade_id?: number
          usuario_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "compras_solicitacoes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "compras_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_solicitacoes_rubrica_id_fkey"
            columns: ["rubrica_id"]
            isOneToOne: false
            referencedRelation: "compras_rubricas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_solicitacoes_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "compras_unidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_solicitacoes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "compras_usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      compras_unidades: {
        Row: {
          cliente_id: number
          data_criacao: string | null
          id: number
          nome: string
        }
        Insert: {
          cliente_id: number
          data_criacao?: string | null
          id?: number
          nome: string
        }
        Update: {
          cliente_id?: number
          data_criacao?: string | null
          id?: number
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "compras_unidades_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "compras_clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      compras_unidades_medida: {
        Row: {
          data_criacao: string | null
          id: number
          nome: string
          sigla: string
        }
        Insert: {
          data_criacao?: string | null
          id?: number
          nome: string
          sigla: string
        }
        Update: {
          data_criacao?: string | null
          id?: number
          nome?: string
          sigla?: string
        }
        Relationships: []
      }
      compras_usuarios: {
        Row: {
          auth_user_id: string | null
          data_criacao: string | null
          email: string
          id: number
          nome: string
          precisa_redefinir_senha: boolean | null
          senha: string
          setor: string
          sobrenome: string
          status: string
          tipo_permissao: string
          ultimo_login: string | null
          whatsapp: string
        }
        Insert: {
          auth_user_id?: string | null
          data_criacao?: string | null
          email: string
          id?: number
          nome: string
          precisa_redefinir_senha?: boolean | null
          senha: string
          setor: string
          sobrenome: string
          status?: string
          tipo_permissao: string
          ultimo_login?: string | null
          whatsapp: string
        }
        Update: {
          auth_user_id?: string | null
          data_criacao?: string | null
          email?: string
          id?: number
          nome?: string
          precisa_redefinir_senha?: boolean | null
          senha?: string
          setor?: string
          sobrenome?: string
          status?: string
          tipo_permissao?: string
          ultimo_login?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
      connections: {
        Row: {
          created_at: string | null
          id: string
          source_id: string
          target_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          source_id: string
          target_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          source_id?: string
          target_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "connections_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "objectives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "objectives"
            referencedColumns: ["id"]
          },
        ]
      }
      form_positions: {
        Row: {
          created_at: string | null
          form_id: string
          id: string
          position_id: string
        }
        Insert: {
          created_at?: string | null
          form_id: string
          id?: string
          position_id: string
        }
        Update: {
          created_at?: string | null
          form_id?: string
          id?: string
          position_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_positions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_positions_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
        ]
      }
      forms: {
        Row: {
          created_at: string | null
          id: string
          logo_url: string
          name: string
          submissions: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          logo_url: string
          name: string
          submissions?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          logo_url?: string
          name?: string
          submissions?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      indicators: {
        Row: {
          created_at: string | null
          current: number
          id: string
          name: string
          objective_id: string
          target: number
          unit: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current?: number
          id?: string
          name: string
          objective_id: string
          target: number
          unit?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current?: number
          id?: string
          name?: string
          objective_id?: string
          target?: number
          unit?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "indicators_objective_id_fkey"
            columns: ["objective_id"]
            isOneToOne: false
            referencedRelation: "objectives"
            referencedColumns: ["id"]
          },
        ]
      }
      objectives: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          perspective_id: string
          position_x: number | null
          position_y: number | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          perspective_id: string
          position_x?: number | null
          position_y?: number | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          perspective_id?: string
          position_x?: number | null
          position_y?: number | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objectives_perspective_id_fkey"
            columns: ["perspective_id"]
            isOneToOne: false
            referencedRelation: "perspectives"
            referencedColumns: ["id"]
          },
        ]
      }
      perspectives: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          position: number
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          position: number
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          position?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      positions: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          objective_id: string
          progress: number
          responsible: string | null
          start_date: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          objective_id: string
          progress?: number
          responsible?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          objective_id?: string
          progress?: number
          responsible?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_objective_id_fkey"
            columns: ["objective_id"]
            isOneToOne: false
            referencedRelation: "objectives"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          project_id: string
          responsible: string | null
          start_date: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          project_id: string
          responsible?: string | null
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          project_id?: string
          responsible?: string | null
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          id: string
          last_login: string | null
          password: string
          username: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_login?: string | null
          password: string
          username: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_login?: string | null
          password?: string
          username?: string
        }
        Relationships: []
      }
      vision: {
        Row: {
          content: string
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      vw_solicitacoes_detalhadas: {
        Row: {
          data_solicitacao: string | null
          id_solicitacao: number | null
          justificativa_rejeicao: string | null
          nome_cliente: string | null
          nome_rubrica: string | null
          nome_unidade: string | null
          nome_usuario: string | null
          status: string | null
          whatsapp_usuario: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      migrate_existing_users_to_auth: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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

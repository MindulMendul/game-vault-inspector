
export type ComponentStatus = '상' | '중' | '하';

export interface Game {
  id: string;
  name: string;
  inspected_at: string;
  inspected_by: string;
  has_manual: boolean;
  component_status: ComponentStatus;
  needs_reorder: boolean;
  missing_components: string;
  created_at?: string;
}

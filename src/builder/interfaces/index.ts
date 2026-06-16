export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export interface ResponsiveProp<T> {
  desktop: T;
  tablet?: T;
  mobile?: T;
}

export interface BuilderNode {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: BuilderNode[];
  parentId?: string; // Optional reference to parent container (for widgets inside sections)
}

export interface TemplateSchema {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'published';
  version: string;
  updatedAt: string;
  sections: BuilderNode[];
}

export interface ComponentFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'color' | 'select' | 'number' | 'boolean' | 'spacing' | 'typography' | 'icon';
  defaultValue: any;
  options?: { label: string; value: string }[]; // For select dropdowns
  responsive?: boolean; // Can be defined per device mode
}

export interface ComponentRegistryEntry {
  type: string;
  name: string;
  category: 'layout' | 'content' | 'data' | 'navigation';
  icon: string;
  fields: ComponentFieldConfig[];
  defaultProps: Record<string, any>;
}

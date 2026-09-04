export type CompatibilityMode = 'BACKWARD' | 'FORWARD' | 'FULL' | 'NONE';

export type FieldType =
  | 'string'
  | 'integer'
  | 'number'
  | 'boolean'
  | 'array'
  | 'object';

export interface SchemaField {
  name: string;
  type: FieldType;
  required: boolean;
  defaultValue?: unknown;
  description?: string;
}

export interface SchemaDefinition {
  version: number;
  namespace: string;
  name: string;
  type: 'record';
  fields: SchemaField[];
}

export interface BreakingChange {
  field: string;
  type:
    | 'FIELD_DELETED'
    | 'TYPE_MUTATED'
    | 'REQUIRED_FIELD_ADDED_WITHOUT_DEFAULT'
    | 'FIELD_DESCRIPTION_MODIFIED'
    | 'SAFE_OPTIONAL_ADDED';
  severity: 'CRITICAL' | 'WARNING' | 'COMPATIBLE';
  message: string;
  v1Detail?: string;
  v2Detail?: string;
}

export interface SchemaValidationResult {
  isCompatible: boolean;
  mode: CompatibilityMode;
  breakingChanges: BreakingChange[];
  criticalCount: number;
  summary: string;
}

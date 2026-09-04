import {
  BreakingChange,
  CompatibilityMode,
  SchemaDefinition,
  SchemaValidationResult,
} from '../types/schema';

export function validateSchemaCompatibility(
  v1: SchemaDefinition,
  v2: SchemaDefinition,
  mode: CompatibilityMode
): SchemaValidationResult {
  if (mode === 'NONE') {
    return {
      isCompatible: true,
      mode,
      breakingChanges: [],
      criticalCount: 0,
      summary: 'Compatibility checks disabled (NONE mode). All changes permitted.',
    };
  }

  const v1FieldMap = new Map(v1.fields.map((f) => [f.name, f]));
  const v2FieldMap = new Map(v2.fields.map((f) => [f.name, f]));
  const breakingChanges: BreakingChange[] = [];

  // Check 1: Deleted fields (Present in v1, missing in v2)
  for (const [name, v1Field] of v1FieldMap.entries()) {
    const v2Field = v2FieldMap.get(name);
    if (!v2Field) {
      if (mode === 'BACKWARD' || mode === 'FULL') {
        breakingChanges.push({
          field: name,
          type: 'FIELD_DELETED',
          severity: v1Field.required ? 'CRITICAL' : 'WARNING',
          message: `Field '${name}' was deleted in Schema v2. ${
            v1Field.required
              ? 'Breaking change: Consumers expecting required field will fail deserialization.'
              : 'Optional field deletion: May impact downstream projections.'
          }`,
          v1Detail: `type: ${v1Field.type}, required: ${v1Field.required}`,
          v2Detail: 'DELETED',
        });
      }
    } else {
      // Check 2: Type mutations
      if (v1Field.type !== v2Field.type) {
        breakingChanges.push({
          field: name,
          type: 'TYPE_MUTATED',
          severity: 'CRITICAL',
          message: `Type mutation on field '${name}': Changed from '${v1Field.type}' to '${v2Field.type}'. Incompatible serialization wire format.`,
          v1Detail: `type: ${v1Field.type}`,
          v2Detail: `type: ${v2Field.type}`,
        });
      }
    }
  }

  // Check 3: Added fields in v2 (Missing in v1)
  for (const [name, v2Field] of v2FieldMap.entries()) {
    const v1Field = v1FieldMap.get(name);
    if (!v1Field) {
      // If added field is required and lacks default value, backward compatibility breaks!
      if (v2Field.required && v2Field.defaultValue === undefined) {
        breakingChanges.push({
          field: name,
          type: 'REQUIRED_FIELD_ADDED_WITHOUT_DEFAULT',
          severity: 'CRITICAL',
          message: `Required field '${name}' added in v2 without a default value. Old data read by v2 will fail validation.`,
          v1Detail: 'NOT PRESENT',
          v2Detail: `type: ${v2Field.type}, required: true, default: none`,
        });
      } else {
        breakingChanges.push({
          field: name,
          type: 'SAFE_OPTIONAL_ADDED',
          severity: 'COMPATIBLE',
          message: `Field '${name}' added as safe optional with default '${
            v2Field.defaultValue !== undefined ? JSON.stringify(v2Field.defaultValue) : 'null'
          }'.`,
          v1Detail: 'NOT PRESENT',
          v2Detail: `type: ${v2Field.type}, required: false`,
        });
      }
    }
  }

  const criticalCount = breakingChanges.filter((b) => b.severity === 'CRITICAL').length;
  const isCompatible = criticalCount === 0;

  let summary = '';
  if (isCompatible) {
    summary = `Schema v2 is 100% ${mode}-compatible with Schema v1. Safe to register and deploy.`;
  } else {
    summary = `Rejected: ${criticalCount} critical breaking change(s) violate ${mode} compatibility rules!`;
  }

  return {
    isCompatible,
    mode,
    breakingChanges,
    criticalCount,
    summary,
  };
}

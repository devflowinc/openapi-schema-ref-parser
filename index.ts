import refRes from "@json-schema-tools/reference-resolver";

const expandRefs = async (
  schema: any,
  maxEvalsPerObj: number = 100,
  logging: boolean = true
) => {
  const recExpandRefs = async (obj: any, visited = new Map()): Promise<any> => {
    // Handle null/undefined
    if (!obj) return obj;

    // Handle circular references
    if (visited.has(obj) && visited.get(obj) > maxEvalsPerObj) return obj;
    visited.set(obj, (visited.get(obj) || 0) + 1);

    // Handle arrays
    if (Array.isArray(obj)) {
      let expandedArray = obj.map(async (item) => {
        return await recExpandRefs(item, visited);
      });
      return await Promise.all(expandedArray);
    }

    // Handle objects
    if (typeof obj === "object") {
      let expanded: any = {};

      for (const [key, value] of Object.entries(obj)) {
        if (key === "$ref" && typeof value === "string") {
          // Resolve the reference and recursively expand any nested refs
          let resolved = value;
          try {
            resolved = await refRes.resolve(value, schema);
          } catch (e) {
            if (logging) {
              console.error(
                `Failed to resolve reference: ${value}`,
                key,
                value
              );
            }
          }

          if (typeof resolved === "object") {
            expanded = await recExpandRefs(resolved, visited);
          } else {
            expanded[key] = resolved;
          }
        } else if (typeof value === "object") {
          expanded[key] = await recExpandRefs(value, visited);
        } else {
          // Copy primitive values as-is
          expanded[key] = value;
        }
      }

      return expanded;
    }

    // Return primitive values as-is
    return obj;
  };

  const components = schema.components || schema.components;
  let schemaOnly = schema;
  if (components) {
    schemaOnly = { ...schema };
    delete schemaOnly.components;
  }

  return await recExpandRefs(schemaOnly);
};

export default expandRefs;

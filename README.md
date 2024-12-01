# OpenAPI Schema Reference Parser

Recursively parse OpenAPI specifications such that all `"$ref": "#/foo"` entries are replaced with what the reference in the spec resolves to.

Our goal is to make it easier to load an OpenAPI schema into a search index or tool calling repository for RAG-style LLM usecases. This is a very simple package which wraps [@json-schema-tools/reference-resolver](https://github.com/json-schema-tools/reference-resolver). You may want to consider copying the `index.ts` function intead of installing this entire package.

Phil Sturgeon published [Only You Can Bring Modern OpenAPI Bundling to JavaScript](https://philsturgeon.com/bundling-openapi-with-javascript/) in October of 2022, and this is us tip-toe'ing into doing that. We tried using the canonical [json-schema-ref-parser](https://github.com/APIDevTools/json-schema-ref-parser?ref=philsturgeon.com), but it's `continueOnError` feature is deeply broken and was not simple to fix.

## Install

`npm install openapi-schema-ref-parser`

## Usage Example

```js
import expandRefs from "openapi-schema-ref-parser";

async function expandOpenapiSpec() {
  const specResponse = await fetch(
    "https://api.trieve.ai/api-docs/openapi.json"
  );
  const specText = await specResponse.text();
  const openapiSpec = JSON.parse(specText);

  // Expand all $ref pointers within the OpenAPI document
  const expandedSpec = await expandRefs(openapiSpec);

  // Process each route in the specification
  for (const path in expandedSpec.paths) {
    for (const method in expandedSpec.paths[path]) {
      const methodPath = `${method.toUpperCase()} ${path}`;
      const route = { [methodPath]: expandedSpec.paths[path][method] };

      // Instead of logging, you might want to:
      // - Add to a search/RAG system like trieve.ai
      // - Update a tool repository
      console.log(JSON.stringify(route, null, 2));
    }
  }
}

expandOpenapiSpec();
```

## Context

OpenAPI specs have gotten more valuable in the past couple years of LLMs being around since LLMs are able to intelligently do things once they know about every route available in a given API. However, they can be hard to process into a search index or tool calling repository because they leverage a `$ref` system.

OpenAPI specifications tend to re-use types across many `path`'s and `method`'s. To simplify their defitions, the final `JSON` or `YAML` files contain several field values like `{"schema": { "$ref": "#/components/schemas/ErrorResponseBody" }}` where the actual value lies at `openapiSpec.components.schemas.ErrorResponseBody`.

- [x] parses all $ref values to their specifications
- [x] handles circular dependencies

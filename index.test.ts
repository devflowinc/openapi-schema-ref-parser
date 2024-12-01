import expandRefs from ".";
import fs from "node:fs";
import refRes from "@json-schema-tools/reference-resolver";

test("reference-resolver dep", async () => {
  const openapiSpecResp = await fetch(
    "https://api.trieve.ai/api-docs/openapi.json"
  );
  const openapiSpec = await openapiSpecResp.text();
  const openapiSpecObj = JSON.parse(openapiSpec);

  const correctObj = openapiSpecObj.components.schemas.CTRDataRequestBody;
  const resolved = await refRes.resolve(
    "#/components/schemas/CTRDataRequestBody",
    openapiSpecObj
  );

  expect(resolved).toEqual(correctObj);
});

test("expandRefs", async () => {
  const openapiSpecResp = await fetch(
    "https://api.trieve.ai/api-docs/openapi.json"
  );
  const openapiSpec = await openapiSpecResp.text();
  fs.writeFileSync("original.json", openapiSpec);
  const openapiSpecObj = JSON.parse(openapiSpec);
  const expandedSpec = await expandRefs(openapiSpecObj, 1000);
  expect(JSON.stringify(expandedSpec).includes("$ref")).toBe(false);

  for (const path in expandedSpec.paths) {
    for (const method in expandedSpec.paths[path]) {
      const methodPath = `${method.toUpperCase()} ${path}`;
      const route: Record<string, any> = {};
      route[methodPath] = expandedSpec.paths[path][method];
      console.log(JSON.stringify(route, null, 2));
    }
  }
});

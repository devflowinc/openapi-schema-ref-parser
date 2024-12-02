import expandRefs from ".";
import refRes from "@json-schema-tools/reference-resolver";

test("reference-resolver on trieve CTRDataRequestBody", async () => {
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

test("reference-resolver on vapi Server", async () => {
  const openapiSpecResp = await fetch("https://api.vapi.ai/api-json");
  const openapiSpec = await openapiSpecResp.text();
  const openapiSpecObj = JSON.parse(openapiSpec);

  const correctObj = openapiSpecObj.components.schemas.Server;
  const resolved = await refRes.resolve(
    "#/components/schemas/Server",
    openapiSpecObj
  );

  expect(resolved).toEqual(correctObj);
});

test("expandRefs on trieve spec", async () => {
  const openapiSpecResp = await fetch(
    "https://api.trieve.ai/api-docs/openapi.json"
  );
  const openapiSpec = await openapiSpecResp.text();
  const openapiSpecObj = JSON.parse(openapiSpec);
  const expandedSpec = await expandRefs(openapiSpecObj, 1000);
  expect(JSON.stringify(expandedSpec).includes("$ref")).toBe(false);
});

test("expandRefs on vapi spec", async () => {
  const openapiSpecResp = await fetch("https://api.vapi.ai/api-json");
  const openapiSpec = await openapiSpecResp.text();
  const openapiSpecObj = JSON.parse(openapiSpec);
  const expandedSpec = await expandRefs(openapiSpecObj, 5, true);
  expect(JSON.stringify(expandedSpec).length).toBeGreaterThan(
    JSON.stringify(openapiSpecObj).length
  );
});

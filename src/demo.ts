import { buildT003Fixture } from "./fixture.ts";

const store = buildT003Fixture();
const packet = store.compileContext({
  taskId: "demo-pov",
  storyId: "story-loop",
  branchId: "main",
  baseRevision: 0,
  audience: "character",
  povEntityId: "gu-chen",
  narrativeCursor: 12,
  query: "KEY",
  tokenBudget: 600,
});

console.log(JSON.stringify(packet, null, 2));
store.close();

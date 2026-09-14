import type { StoryRecordInput } from "./types.ts";
import { NovelStore } from "./store.ts";

const author = [{ sourceType: "author" as const, sourceRef: "fixture:t003", actor: "test-author" }];

export function buildT003Fixture(): NovelStore {
  const store = new NovelStore();
  store.createStory({ projectId: "project-1", storyId: "story-loop", storyName: "循环旅店", branchId: "main" });
  store.createBranch("story-loop", "alternate", "林晚独自调查线");
  store.createStory({ projectId: "project-1", storyId: "story-space", storyName: "星海回声", branchId: "main" });

  const records: StoryRecordInput[] = [
    {
      id: "loop-rule", projectId: "project-1", storyId: "story-loop", branchId: "main",
      kind: "Rule", role: "constraint", visibility: "public",
      content: "LOOP_RULE：午夜后旅店重置，顾沉保留记忆。", provenance: author,
    },
    {
      id: "world-truth", projectId: "project-1", storyId: "story-loop", branchId: "main",
      kind: "State", role: "canon", visibility: "author",
      content: "KEY_TRUTH：林晚没有背叛顾沉。", provenance: author,
    },
    {
      id: "gu-belief", projectId: "project-1", storyId: "story-loop", branchId: "main",
      kind: "Knowledge", role: "belief", visibility: "character", knowerId: "gu-chen", narrativeFrom: 10,
      content: "KEY_BELIEF：顾沉误以为林晚偷走了钥匙并背叛他。", provenance: author,
      payload: { epistemicState: "misinformed" },
    },
    {
      id: "lin-knowledge", projectId: "project-1", storyId: "story-loop", branchId: "main",
      kind: "Knowledge", role: "belief", visibility: "character", knowerId: "lin-wan", narrativeFrom: 10,
      content: "KEY_KNOWLEDGE：林晚知道钥匙其实被旅店经理拿走。", provenance: author,
    },
    {
      id: "manager-secret", projectId: "project-1", storyId: "story-loop", branchId: "main",
      kind: "AuthorIntent", role: "canon", visibility: "author", sensitivity: "author_secret",
      content: "KEY_SECRET：真正操纵者是旅店经理。", provenance: author,
    },
    {
      id: "reader-clue", projectId: "project-1", storyId: "story-loop", branchId: "main",
      kind: "Knowledge", role: "manuscript", visibility: "reader", narrativeFrom: 8,
      content: "KEY_CLUE：读者已经看到经理袖口沾着铜锈。", provenance: author,
    },
    {
      id: "future-reveal", projectId: "project-1", storyId: "story-loop", branchId: "main",
      kind: "Knowledge", role: "manuscript", visibility: "reader", narrativeFrom: 20,
      content: "KEY_FUTURE：第二十场才揭示经理拿走钥匙。", provenance: author,
    },
    {
      id: "old-summary", projectId: "project-1", storyId: "story-loop", branchId: "main",
      kind: "Summary", role: "summary", visibility: "author", derived: true,
      content: "KEY_SUMMARY：旧摘要认为林晚仍被怀疑。", provenance: author,
    },
    {
      id: "space-gu", projectId: "project-1", storyId: "story-space", branchId: "main",
      kind: "Entity", role: "canon", visibility: "public",
      content: "KEY_SPACE：同名顾沉是星舰领航员，与旅店世界无关。", provenance: author,
    },
  ];
  for (const record of records) store.seedAcceptedRecord(record);
  store.seedAcceptedRecord({
    id: "alternate-key", projectId: "project-1", storyId: "story-loop", branchId: "alternate",
    kind: "State", role: "canon", visibility: "author",
    content: "KEY_ALTERNATE：在备选分支中钥匙从未丢失。", provenance: author,
  });
  store.addDependency("old-summary", "gu-belief");
  return store;
}

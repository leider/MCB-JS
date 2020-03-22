import "jest";
import { mount } from "@vue/test-utils";
// @ts-ignore
import McbMarkdown from "../src/widgets/McbMarkdown.vue";

describe("McbMarkdown.vue", () => {
  test("isEmpty recognizes emptiness", () => {
    const markdown = mount(McbMarkdown, { attachToDocument: true }).vm as McbMarkdown;

    expect(markdown.isEmpty()).toBe(true);
    expect(markdown.isEmpty(null)).toBe(true);
    expect(markdown.isEmpty("")).toBe(true);
    expect(markdown.isEmpty(" ")).toBe(true);
    expect(markdown.isEmpty("    ")).toBe(true);
    expect(markdown.isEmpty("\t")).toBe(true);
    expect(markdown.isEmpty("\n")).toBe(true);
    expect(markdown.isEmpty("Peterchens Mondfahrt")).toBe(false);
  });

  test("isUrl recognizes urls", () => {
    const markdown = mount(McbMarkdown, { attachToDocument: true }).vm as McbMarkdown;

    expect(markdown.isUrl()).toBe(false);
    expect(markdown.isUrl("")).toBe(false);
    expect(markdown.isUrl("http://")).toBe(false);
    expect(markdown.isUrl("http://peter")).toBe(true);
    expect(markdown.isUrl("https://a.b.c")).toBe(true);
  });
});

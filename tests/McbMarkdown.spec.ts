/**
 * @jest-environment jsdom
 */

import "jest";
import { mount } from "@vue/test-utils";

import McbMarkdown from "../src/widgets/McbMarkdown.vue";

describe("McbMarkdown.vue", () => {
  let markdown: McbMarkdown;

  beforeEach(() => {
    const div = document.createElement("div");
    div.id = "root";
    document.body.appendChild(div);
    markdown = mount(McbMarkdown, { attachTo: "#root" }).vm as McbMarkdown;
  });

  afterEach(() => {
    markdown.destroy();
  });

  test("isEmpty recognizes emptiness", () => {
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
    expect(markdown.isUrl()).toBe(false);
    expect(markdown.isUrl("")).toBe(false);
    expect(markdown.isUrl("http://")).toBe(false);
    expect(markdown.isUrl("http://peter")).toBe(true);
    expect(markdown.isUrl("https://a.b.c")).toBe(true);
  });
});

<template lang="pug">
  .v-md-container(:class="[css, { 'v-md-auto-resize': height === 'auto', 'v-md-fullscreen': fullScreen }]")
    .v-md-toolbar(v-if="toolbars.length > 0")
      .btn-group.mr-3(role="group" v-for="group in toolbars")
        button( type="button", :title="i.title", :class="'btn btn-' + theme", v-on:click="command(i.cmd)", :disabled="preview && !i.ready", v-for="i in group")
          i(:class="[i.ico]")
    .v-md-wrapper(v-on:click="editor.focus()")
      textarea.v-md-editor(:style="styles", :id="id", :placeholder="placeholder", rows="10")
      .v-md-preview(v-if="preview", v-html="html")
</template>

<script lang="ts">
import CodeMirror, { EditorFromTextArea } from "codemirror";
import "codemirror/addon/display/fullscreen.js";
import "codemirror/mode/markdown/markdown.js";
import "codemirror/addon/display/placeholder.js";

import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Marked from "marked";

interface EditorConfiguration {
  fullScreen?: boolean;
}

@Component
export default class McbMarkdown extends Vue {
  @Prop({
    type: String,
    default: () =>
      `v-md-editor-${Math.random()
        .toString(16)
        .substr(2, 9)}`
  })
  readonly id?: string;
  @Prop(String) css?: string;
  @Prop({ type: [String], default: "100%" }) readonly width?: string;
  @Prop({ type: [String], default: "300px" }) readonly height?: string;
  @Prop({
    type: String,
    default: "redo undo | bold italic strikethrough heading | image link | numlist bullist code quote | preview fullscreen"
  })
  readonly toolbar?: string;
  @Prop({ type: String, default: "" }) readonly placeholder?: string;
  @Prop(Object) readonly extend?: object;
  @Prop({
    type: Object,
    default: function() {
      return {
        undo: { cmd: "undo", ico: "fas far fa-undo", title: "Undo", hotkey: "Ctrl-Z" },
        redo: { cmd: "redo", ico: "fas far fa-redo", title: "Redo", hotkey: "Ctrl-Y" },
        bullist: { cmd: "bullist", ico: "fas far fa-list-ul", title: "Liste" },
        numlist: { cmd: "numlist", ico: "fas far fa-list-ol", title: "Aufzählung" },
        bold: { title: "Fett", ico: "fas far fa-bold", cmd: "bold", hotkey: "Ctrl-B" },
        italic: { title: "Kursiv", ico: "fas far fa-italic", cmd: "italic", hotkey: "Ctrl-I" },
        strikethrough: { cmd: "strikethrough", ico: "fas far fa-strikethrough", title: "durchgestrichen" },
        heading: { title: "Überschrift", ico: "fas far fa-heading", cmd: "heading", hotkey: "Ctrl-H" },
        code: { title: "Code", ico: "fas far fa-code", cmd: "code", hotkey: "Ctrl-X" },
        quote: { title: "Zitat", ico: "fas far fa-quote-left", cmd: "quote", hotkey: "Ctrl-Q" },
        link: { title: "Link", ico: "fas far fa-link", cmd: "link", hotkey: "Ctrl-K" },
        image: { title: "Bild", ico: "fas far fa-image", cmd: "image", hotkey: "Ctrl-P" },
        fullscreen: { cmd: "fullscreen", ico: "fas far fa-expand", title: "Vollbild", hotkey: "F11", ready: true },
        preview: { cmd: "preview", ico: "fas far fa-eye", title: "Vorschau", hotkey: "Ctrl-P", ready: true }
      };
    }
  })
  readonly buttons?: object;
  @Prop({ type: String, default: "outline-secondary" }) readonly theme?: string;
  @Prop({ type: String, default: "", required: false }) readonly value?: string;
  @Prop({
    type: Object,
    default: () => {
      return { lineWrapping: true };
    }
  })
  readonly options?: object;
  private editor?: EditorFromTextArea;
  private preview = false;
  private fullScreen = false;
  private html = "";
  private toolbars: object[][] = [];
  private __rendered = false;

  get styles() {
    return {
      width: !/^\d+$/.test(this.width || "") ? this.width : `${this.width}px`,
      height: !/^\d+$/.test(this.height || "") ? this.height : `${this.height}px`
    };
  }

  @Watch("value")
  valueChanged(val: string) {
    if (val != this.editor!.getValue()) {
      this.editor!.setValue(val);
    }
  }

  isEmpty(s?: string | null) {
    return s === null || s === undefined ? true : /^[\s\xa0]*$/.test(s);
  }

  isUrl(s: string | null) {
    return this.isEmpty(s) ? false : s!.match(/((http(s)?):\/\/[\w\.\/\-=?#]+)/gi);
  }

  format() {
    let a = arguments[0];
    for (let i = 1; i <= arguments.length; i++) {
      a = a.replace(/%[a-z]/, arguments[i]);
    }
    return a; // Make chainable
  }

  _toggleBlock(type: string, start: string, end?: string) {
    end = this.isEmpty(end) ? start : end;
    const ed = this.editor!;
    const startPoint = ed.getCursor("start");
    const endPoint = ed.getCursor("end");
    let text;
    const stat = this.state();

    if (stat[type]) {
      text = ed.getLine(startPoint.line);
      start = text.slice(0, startPoint.ch);
      end = text.slice(startPoint.ch);
      if (type === "bold") {
        start = start.replace(/(\*\*|__)(?![\s\S]*(\*\*|__))/, "");
        end = end.replace(/(\*\*|__)/, "");
      } else if (type === "italic") {
        start = start.replace(/(\*|_)(?![\s\S]*(\*|_))/, "");
        end = end.replace(/(\*|_)/, "");
      } else if (type === "strikethrough") {
        start = start.replace(/(\*\*|~~)(?![\s\S]*(\*\*|~~))/, "");
        end = end.replace(/(\*\*|~~)/, "");
      }
      ed.replaceRange(
        start + end,
        {
          line: startPoint.line,
          ch: 0
        },
        {
          line: startPoint.line,
          ch: 99999999999999
        }
      );

      if (type === "bold" || type === "strikethrough") {
        startPoint.ch -= 2;
        if (startPoint !== endPoint) {
          endPoint.ch -= 2;
        }
      } else if (type == "italic") {
        startPoint.ch -= 1;
        if (startPoint !== endPoint) {
          endPoint.ch -= 1;
        }
      }
    } else {
      text = ed.getSelection();
      if (type === "bold") {
        text = text.split("**").join("");
        text = text.split("__").join("");
      } else if (type === "italic") {
        text = text.split("*").join("");
        text = text.split("_").join("");
      } else if (type === "strikethrough") {
        text = text.split("~~").join("");
      }
      ed.replaceSelection(start + text + end);

      startPoint.ch += start.length;
      endPoint.ch = startPoint.ch + text.length;
    }

    // ed.setSelection(startPoint, endPoint);
  }

  _toggleLine(name: string) {
    const ed = this.editor!;
    const stat = this.state();
    const startPoint = ed.getCursor("start");
    const endPoint = ed.getCursor("end");
    const repl: { [key: string]: RegExp } = {
      quote: /^(\s*)\>\s+/,
      bullist: /^(\s*)(\*|\-|\+)\s+/,
      numlist: /^(\s*)\d+\.\s+/
    };
    const map: { [key: string]: string } = {
      quote: "> ",
      bullist: "* ",
      numlist: "1. "
    };
    for (let i = startPoint.line; i <= endPoint.line; i++) {
      (function(i) {
        let text = ed.getLine(i);
        if (stat[name]) {
          text = text.replace(repl[name], "$1");
        } else {
          text = map[name] + text;
        }
        ed.replaceRange(
          text,
          {
            line: i,
            ch: 0
          },
          {
            line: i,
            ch: 99999999999999
          }
        );
      })(i);
    }
  }

  state(pos?: CodeMirror.Position) {
    pos = pos || this.editor!.getCursor("start");
    const stat = this.editor!.getTokenAt(pos);
    if (!stat.type) return {};

    const types = stat.type.split(" ");

    // console.log(types);

    let ret: any = {},
      data,
      text;
    for (let i = 0; i < types.length; i++) {
      data = types[i];
      if (data === "strong") {
        ret.bold = true;
      } else if (data === "variable-2") {
        text = this.editor!.getLine(pos.line);
        if (/^\s*\d+\.\s/.test(text)) {
          ret["numlist"] = true;
        } else {
          ret["bullist"] = true;
        }
      } else if (data === "atom") {
        ret.quote = true;
      } else if (data === "em") {
        ret.italic = true;
      } else if (data === "quote") {
        ret.quote = true;
      } else if (data === "strikethrough") {
        ret.strikethrough = true;
      } else if (data === "comment") {
        ret.code = true;
      } else if (data === "link" || data === "url") {
        ret.link = true;
      } else if (data === "image") {
        ret.image = true;
      } else if (data.match(/^header(\-[1-6])?$/)) {
        ret[data.replace("header", "heading")] = true;
      }
    }
    return ret;
  }

  _replaceSelection(active: boolean, startEnd: string[], val?: any) {
    const ed = this.editor!;

    let text;
    let start = startEnd[0];
    let end = startEnd[1];
    const startPoint = ed.getCursor("start");
    const endPoint = ed.getCursor("end");
    if (val) {
      Object.keys(val).forEach(key => {
        start = start.replace("#" + key + "#", val[key]);
        end = end.replace("#" + key + "#", val[key]);
      });
    }

    if (active) {
      text = ed.getLine(startPoint.line);
      start = text.slice(0, startPoint.ch);
      end = text.slice(startPoint.ch);
      ed.replaceRange(start + end, { line: startPoint.line, ch: 0 });
    } else {
      ed.replaceSelection(start + end);
      startPoint.ch += start.length;
      if (startPoint !== endPoint) {
        endPoint.ch += start.length;
      }
    }
    //ed.setSelection(startPoint, endPoint);
  }

  drawImage(obj: any) {
    this._replaceSelection(this.state().image, ["![#title#](", '#url# "#title#")'], obj);
  }

  drawLink(obj: any) {
    this._replaceSelection(this.state().link, ["[#title#]", '(#url# "#title#")'], obj);
  }

  command(key: string) {
    const ed = this.editor!;
    const text = ed.getSelection();

    this.$root.$emit("mcb-markdown:" + key, this);

    switch (key) {
      case "undo":
        ed.undo();
        break;

      case "redo":
        ed.redo();
        break;

      case "bold":
        this._toggleBlock("bold", "**");
        break;

      case "italic":
        this._toggleBlock("italic", "*");
        break;

      case "strikethrough":
        this._toggleBlock("strikethrough", "~~");
        break;

      case "code":
        this._toggleBlock("code", "```");
        break;

      case "heading":
        ed.replaceSelection("\n### " + text);
        break;

      case "image":
        const url: string | null = prompt("URL für das Bild eingeben", "https://");
        if (this.isUrl(url)) {
          const title = !this.isEmpty(text) ? text : "Bildertitel";
          this.drawImage({ title: title, url: url });
        }
        break;

      case "link":
        const linkurl: string | null = prompt("URL für den Link eingeben", "https://");
        if (this.isUrl(linkurl)) {
          const linktitle = !this.isEmpty(text) ? text : linkurl;
          this.drawLink({ title: linktitle, url: linkurl });
        }
        break;

      case "quote":
        this._toggleLine("quote");
        break;

      case "numlist":
        this._toggleLine("numlist");
        break;

      case "bullist":
        this._toggleLine("bullist");
        break;

      case "preview":
        this.html = Marked(ed.getValue(), { breaks: true });
        this.preview = !this.preview;

        break;

      case "fullscreen":
        this.fullScreen = !this.fullScreen;
        ed.setOption("fullScreen", !ed.getOption("fullScreen"));
        break;
    }
  }

  build() {
    if (this.__rendered) return;
    const buttons: any = Object.assign({}, this.buttons, this.extend);
    const shortcuts: any = {};

    this.toolbar!.split("|").forEach(t => {
      const group: object[] = [];
      t.toLowerCase()
        .split(/(\s)/)
        .forEach(b => {
          if (!this.isEmpty(b)) {
            const btn = buttons[b];
            if (!this.isEmpty(btn.hotkey)) {
              shortcuts[btn.hotkey] = () => this.command(btn.cmd);
            }
            group.push(btn);
          }
        });

      if (group.length > 0) this.toolbars.push(group);
    });

    const o = Object.assign({ mode: "markdown", extraKeys: shortcuts }, this.options);

    const ed = (this.editor = CodeMirror.fromTextArea(document.getElementById(this.id!) as HTMLTextAreaElement, o));
    ed.setValue(this.value!);
    ed.setSize(this.width, this.height);
    ed.on("change", ed => {
      this.$emit("input", ed.getValue());
    });

    this.__rendered = true;
  }

  mounted() {
    this.build();
  }

  destroy() {
    this.editor!.toTextArea();
  }
}
</script>

<style></style>

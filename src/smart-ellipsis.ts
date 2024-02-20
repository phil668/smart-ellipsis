import { LitElement, css, html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

@customElement("smart-ellipsis")
export class SmartEllipsis extends LitElement {
  @property({ type: String, reflect: true })
  text: string = "";

  @property({ type: Number })
  visibleLine: number = 1;

  @property({ type: String })
  ellipsisText: string = "...";

  @query("#lit-ellipsis-wrap")
  wrapRef!: HTMLDivElement;

  @query(".vue-ellipsis-js-content")
  textRef!: HTMLSpanElement;

  @query(".vue-ellipsis-js-ellipsis")
  ellipsisRef!: HTMLSpanElement;

  @state()
  truncating: boolean = false;

  firstUpdated() {
    this.reflow();
  }

  private reflow() {
    if (
      !this.wrapRef ||
      !this.textRef ||
      !this.ellipsisRef ||
      this.truncating
    ) {
      return;
    }
    console.log("this.ellipsisRef", this.ellipsisRef);
  }

  render() {
    return html`
      <div ref="aref" class="vue-ellipsis-js" id="lit-ellipsis-wrap">
        <span ref="textRef" class="vue-ellipsis-js-content"></span>
        <span
          ref="ellipsisRef"
          class="vue-ellipsis-js-ellipsis"
          onClick="handleEllipsisClick"
        >
          <slot name="ellipsisNode"></slot>
        </span>
      </div>
    `;
  }

  // private _onClick() {
  //   this.count++
  // }

  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    .logo {
      height: 6em;
      padding: 1.5em;
      will-change: filter;
      transition: filter 300ms;
    }
    .logo:hover {
      filter: drop-shadow(0 0 2em #646cffaa);
    }
    .logo.lit:hover {
      filter: drop-shadow(0 0 2em #325cffaa);
    }

    .card {
      padding: 2em;
    }

    .read-the-docs {
      color: #888;
    }

    ::slotted(h1) {
      font-size: 3.2em;
      line-height: 1.1;
    }

    a {
      font-weight: 500;
      color: #646cff;
      text-decoration: inherit;
    }
    a:hover {
      color: #535bf2;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
    }
    button:hover {
      border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    @media (prefers-color-scheme: light) {
      a:hover {
        color: #747bff;
      }
      button {
        background-color: #f9f9f9;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "smart-ellipsis": SmartEllipsis;
  }
}

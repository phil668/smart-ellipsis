import { LitElement, PropertyValueMap, css, html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import {
  binarySearch,
  getLineHeight,
  registerWordBreak,
  setWordBreak,
} from "./utils/compute";
import { getElementHeight } from "./utils/dom";
import { isString } from "./utils/is";

@customElement("smart-ellipsis")
export class SmartEllipsis extends LitElement {
  @property({ type: String, reflect: true })
  text: string = "";

  @property({ type: Number })
  visibleLine: number = 1;

  @property({ type: String })
  ellipsisText: string = "...";

  @query(".lit-ellipsis-wrap")
  wrapRef!: HTMLDivElement;

  @query(".lit-ellipsis-content")
  textRef!: HTMLSpanElement;

  @query(".lit-ellipsis-text")
  ellipsisRef!: HTMLSpanElement;

  @state()
  truncating: boolean = false;

  @state()
  observer: ResizeObserver | null = null;

  private isBrowser =
    typeof window !== "undefined" && typeof document !== "undefined";

  private isSupportResizeObserver =
    this.isBrowser && typeof ResizeObserver !== "undefined";

  firstUpdated() {
    this.reflow();
    if (this.isSupportResizeObserver) {
      this.observer = new ResizeObserver(this.reflow);
      this.observer.observe(this.wrapRef);
    } else {
      window.addEventListener("resize", this.reflow);
    }
  }

  protected update(
    changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (
      changedProperties.has("text") ||
      changedProperties.has("visibleLine") ||
      changedProperties.has("ellipsisText")
    ) {
      this.reflow();
    }
    super.update(changedProperties);
  }

  private reflow = () => {
    if (
      !this.wrapRef ||
      !this.textRef ||
      !this.ellipsisRef ||
      this.truncating
    ) {
      return;
    }
    console.log("this.ellipsisRef", this.ellipsisRef);
    this.ellipsisRef.style.display = "none";
    this.textRef.innerText = this.text;
    this.ellipsisRef.innerText = this.ellipsisText;
    const lineHeight = getLineHeight(this.wrapRef);
    console.log("lineHeight", lineHeight);
    const wordBreak = registerWordBreak(this.textRef);
    const visbleMaxHeight = lineHeight * this.visibleLine;
    const maxHeight = visbleMaxHeight;
    const height = getElementHeight(this.wrapRef);
    if (height <= Math.max(maxHeight, visbleMaxHeight)) {
      if (isString(wordBreak)) {
        setWordBreak(this.textRef, wordBreak);
      }
      return;
    }
    this.truncating = true;
    this.ellipsisRef.style.display = "inline";
    this.trucateText(this.wrapRef, this.textRef, visbleMaxHeight);
    if (isString(wordBreak)) {
      setWordBreak(this.textRef, wordBreak);
    }
    this.truncating = false;
  };

  private trucateText(
    conatienr: HTMLElement,
    textContainer: HTMLElement,
    max: number
  ) {
    const text = textContainer.textContent || "";
    let currentText = "";
    binarySearch(
      0,
      text.length,
      (l, _r, m) => {
        const temp = text.slice(l, m);
        textContainer.innerText = currentText + temp;
        const height = getElementHeight(conatienr);
        const isExceededMax = height > max;
        if (!isExceededMax) {
          currentText += temp;
        }
        return isExceededMax;
      },
      (l, _r, m) => l === m
    );
    textContainer.innerText = currentText;
  }

  render() {
    return html`
      <div class="lit-ellipsis-wrap">
        <span class="lit-ellipsis-content"></span>
        <span class="lit-ellipsis-text" onClick="handleEllipsisClick">
          <!-- <slot name="ellipsisNode"></slot> -->
        </span>
      </div>
    `;
  }

  static styles = css`
    :host {
    }
    .lit-ellipsis-content {
      word-wrap: break-word;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "smart-ellipsis": SmartEllipsis;
  }
}

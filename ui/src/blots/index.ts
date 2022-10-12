import Quill from "quill";

const Inline = Quill.import("blots/inline");

export class CustomBlot extends Inline {
  static blotName = "error";
  static tagName = "U";
}

export class IgnoreBlot extends Inline {
  static blotName = "ignore";
  static className = "ignore";
}

//src/features/fields/components/field-renderer-select.ts
import { TextField } from "./renderers/text-field";
import { PasswordField } from "./renderers/password-field";
import { EmailField } from "./renderers/email-field";
import { UrlField } from "./renderers/url-field";
import { NotesField } from "./renderers/notes-field";
import { HeadingField } from "./renderers/heading-field";
import type { FieldValues } from "../schemas/field.schema";

export function rendererFor(type: FieldValues["type"]): typeof TextField {
  switch (type) {
    case "password":
      return PasswordField;
    case "email":
      return EmailField;
    case "url":
      return UrlField;
    case "notes":
      return NotesField;
    case "heading":
      return HeadingField;
    default:
      return TextField;
  }
}

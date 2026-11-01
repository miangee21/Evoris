//src/features/fields/constants/field-types.ts
import {
  TypeIcon,
  KeyIcon,
  GlobeIcon,
  MailIcon,
  AlignLeftIcon,
  HeadingIcon,
} from "lucide-react";

export type FieldTypeKey =
  | "text"
  | "password"
  | "url"
  | "email"
  | "notes"
  | "heading";

export interface FieldTypeDefinition {
  readonly key: FieldTypeKey;
  readonly label: string;
  readonly icon: typeof TypeIcon;
  readonly supportsMask: boolean;
  readonly defaultMasked: boolean;
}

export const FIELD_TYPES: readonly FieldTypeDefinition[] = [
  {
    key: "password",
    label: "Password",
    icon: KeyIcon,
    supportsMask: true,
    defaultMasked: true, // Edge Case: Password should always be masked by default
  },
  {
    key: "text",
    label: "Text",
    icon: TypeIcon,
    supportsMask: true,
    defaultMasked: false,
  },
  {
    key: "email",
    label: "Email",
    icon: MailIcon,
    supportsMask: false, // Email masking doesn't make sense usually
    defaultMasked: false,
  },
  {
    key: "url",
    label: "Website",
    icon: GlobeIcon,
    supportsMask: false,
    defaultMasked: false,
  },
  {
    key: "notes",
    label: "Notes",
    icon: AlignLeftIcon,
    supportsMask: true,
    defaultMasked: false,
  },
  {
    key: "heading",
    label: "Heading",
    icon: HeadingIcon,
    supportsMask: false,
    defaultMasked: false,
  },
];

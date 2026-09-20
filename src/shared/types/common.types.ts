//src/shared/types/common.types.ts
import type { ReactNode } from "react";

export interface ChildrenProps {
  readonly children: ReactNode;
}

export interface ClassNameProps {
  readonly className?: string;
}

export interface BaseComponentProps extends ChildrenProps, ClassNameProps {}

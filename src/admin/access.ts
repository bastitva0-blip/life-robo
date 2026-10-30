import { createContext, useContext } from "react";
import type { AdminMe, AdminSection } from "@shared/types";

/** The signed-in role. Set by AdminApp once /api/admin/me answers. */
export const AccessContext = createContext<AdminMe | null>(null);

export function useAccess() {
  const me = useContext(AccessContext);
  return {
    me,
    can: (section: AdminSection | "developer") =>
      !!me && (me.developer || (section !== "developer" && me.permissions.includes(section))),
  };
}

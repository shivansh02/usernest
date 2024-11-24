import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// interface Organisation {
//     id: string;
//     name: string;
//     role: string;
//   }

export interface Organisation {
  role: string;
  organisation: {
    id: string;
    name: string;
    inviteCode: string | null;
    desc: string;
  };
}

interface Perm {
  name: string;
  desc: string;
  id: string;
}

interface DashboardState {
  organisationId: string | null;
  organisationName: string | null;
  fetchedOrgs: Organisation[];
  perms: Perm[];
  permsOrg: string | null;
  setOrganisationId: (organisationId: string) => void;
  setOrganisationName: (organisationId: string) => void;
  setFetchedOrgs: (organisation: Organisation[]) => void;
  setPerms: (perms: Perm[]) => void;
  setPermsOrg: (permsOrg: string) => void;
}

const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      organisationId: null,
      organisationName: null,
      fetchedOrgs: [],
      perms: [],
      permsOrg: null,
      setOrganisationId: (organisationId: string) => set({ organisationId }),
      setOrganisationName: (organisationName: string) =>
        set({ organisationName }),
      setFetchedOrgs: (organisations: Organisation[]) =>
        set({ fetchedOrgs: organisations }),
      setPerms: (perms: Perm[]) => set({ perms }),
      setPermsOrg: (permsOrg: string) => set({ permsOrg }),
    }),
    {
      name: "dashboard-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        organisationId: state.organisationId,
        organisationName: state.organisationName,
      }),
    }
  )
);

export default useDashboardStore;

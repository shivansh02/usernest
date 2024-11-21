import { create } from 'zustand'


interface Organisation {
    id: string;
    name: string;
    role: string;
  }  

  interface Perm {
    name: string;
    desc: string;
    id: string;
  }

interface DashboardState {
    organisationId: string | null;
    organisationName: string | null
    fetchedOrgs: Organisation[]
    perms: Perm[]
    permsOrg: string | null
    setOrganisationId: (organisationId: string) => void;
    setOrganisationName: (organisationId: string) => void;
    setFetchedOrgs: (organisation: Organisation[]) => void;
    setPerms: (perms: Perm[]) => void;
    setPermsOrg: (permsOrg: string) => void;
}



const useDashboardStore = create<DashboardState>((set) => ({
    organisationId: null,
    organisationName: null,
    fetchedOrgs: [],
    perms: [],
    permsOrg: null,
    setPerms: (perms: Perm[]) => set((state) => ({ perms: perms })),
    setOrganisationId: (organisationId: string) => set((state) => ({ organisationId: organisationId })),
    setOrganisationName: (organisationName: string) => set((state) => ({ organisationName: organisationName })),
    setFetchedOrgs: (organisation: Organisation[]) => set((state) => ({ fetchedOrgs: organisation })),
    setPermsOrg: (permsOrg: string) => set((state) => ({ permsOrg: permsOrg})),
}))


export default useDashboardStore;
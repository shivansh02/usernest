import { create } from 'zustand'

interface DashboardState {
    organisationId: string | null;
    organisationName: string | null
    setOrganisationId: (organisationId: string) => void;
    setOrganisationName: (organisationId: string) => void;
}


const useDashboardStore = create<DashboardState>((set) => ({
    organisationId: null,
    organisationName: null,
    setOrganisationId: (organisationId: string) => set((state) => ({ organisationId: organisationId })),
    setOrganisationName: (organisationName: string) => set((state) => ({ organisationName: organisationName })),
}))


export default useDashboardStore;
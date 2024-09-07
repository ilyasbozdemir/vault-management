import { create } from "zustand";

const useServiceStore = create((set) => ({
  selectedService: "",
  setSelectedService: (service) =>
    set({ selectedService: service, serviceDetail: [] }),

  webDesignDetail: {
    siteType:'',
    
  },
  setWebDesignDetail: (detail) => set({ webDesignDetail: detail }),

  projectDesc: "",
  setProjectDesc: (desc) => set({ projectDesc: desc }),

  contactInfo: {
    name: "",
    surname: "",
    companyName: "",
    emailAddress: "",
    telephoneNumber: "",
  },
  setContactInfo: (contactInfo) => set({ contactInfo: contactInfo }),
}));

export default useServiceStore;

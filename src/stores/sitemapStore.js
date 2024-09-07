import {create} from 'zustand';

const useStore = create((set) => ({
  sitemapIndex: '',
  setSitemapIndex: (index) => set({ sitemapIndex: index }),
}));

export default useStore;

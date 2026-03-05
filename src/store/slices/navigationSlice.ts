import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

interface Breadcrumb {
  label: string;
  path: string;
}

interface NavigationState {
  expandedMenus: string[];
  activeRoute: string;
  breadcrumbs: Breadcrumb[];
}

const initialState: NavigationState = {
  expandedMenus: [],
  activeRoute: '/',
  breadcrumbs: [],
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    toggleMenu: (state, action: PayloadAction<string>) => {
      const menuId = action.payload;
      const index = state.expandedMenus.indexOf(menuId);
      
      if (index > -1) {
        state.expandedMenus.splice(index, 1);
      } else {
        state.expandedMenus.push(menuId);
      }
    },
    setActiveRoute: (state, action: PayloadAction<string>) => {
      state.activeRoute = action.payload;
    },
    updateBreadcrumbs: (state, action: PayloadAction<Breadcrumb[]>) => {
      state.breadcrumbs = action.payload;
    },
    expandMenu: (state, action: PayloadAction<string>) => {
      const menuId = action.payload;
      if (!state.expandedMenus.includes(menuId)) {
        state.expandedMenus.push(menuId);
      }
    },
    collapseMenu: (state, action: PayloadAction<string>) => {
      const menuId = action.payload;
      state.expandedMenus = state.expandedMenus.filter(id => id !== menuId);
    },
    resetNavigation: (state) => {
      state.expandedMenus = [];
      state.activeRoute = '/';
      state.breadcrumbs = [];
    },
  },
});

export const {
  toggleMenu,
  setActiveRoute,
  updateBreadcrumbs,
  expandMenu,
  collapseMenu,
  resetNavigation,
} = navigationSlice.actions;

// Selectors
export const selectExpandedMenus = (state: RootState) => state.navigation.expandedMenus;
export const selectActiveRoute = (state: RootState) => state.navigation.activeRoute;
export const selectBreadcrumbs = (state: RootState) => state.navigation.breadcrumbs;
export const selectIsMenuExpanded = (menuId: string) => (state: RootState) =>
  state.navigation.expandedMenus.includes(menuId);

export default navigationSlice.reducer;

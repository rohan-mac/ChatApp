/**
 * CENTRALIZED Z-INDEX SCALE
 * Ensures no layering conflicts across the entire application
 * Reference: https://tailwindcss.com/docs/z-index
 *
 * Layer Strategy:
 * - Base app: 0-10
 * - Interactive elements: 20-30
 * - Dropdowns/menus: 40-50
 * - Modals/overlays: 60-70
 *
 * Usage:
 * className={`z-[${Z_INDEX.dropdown}]`}  OR
 * style={{ zIndex: Z_INDEX.dropdown }}
 */

export const Z_INDEX = {
  // Base layers
  base: 0,
  content: 10,
  sticky: 20,

  // Dropdowns, popovers, tooltips
  dropdown: 40,
  popover: 40,
  tooltip: 40,
  contextMenu: 40,

  // Navigation
  mobileNav: 50,
  sidebarOverlay: 45,
  header: 30,

  // Modals and overlays
  overlay: 60,
  modal: 70,
  toast: 80,
  notification: 80,

  // Top level (use sparingly)
  maximum: 9999,
};

export default Z_INDEX;

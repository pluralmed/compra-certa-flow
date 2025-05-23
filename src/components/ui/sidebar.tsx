// Este arquivo agora exporta todos os componentes do sidebar/ de forma modular
// Isso mantém a compatibilidade com os imports existentes, mas com uma estrutura de código mais limpa

export {
  // Context and Provider
  useSidebar,
  SidebarProvider,

  // Base components
  Sidebar,
  SidebarTrigger,
  SidebarRail,
  SidebarInset,

  // Content components
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarSeparator,

  // Menu components
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./sidebar/index";
